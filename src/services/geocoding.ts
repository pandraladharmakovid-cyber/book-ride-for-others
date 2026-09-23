import {
  decode,
  isFull,
  isShort,
  recoverNearest,
} from '@erikmichelson/open-location-code-ts';

export type GeocodedLocation = {
  latitude: number;
  longitude: number;
  address: string;
};

const LOCATIONIQ_API_KEY =
  process.env.EXPO_PUBLIC_LOCATIONIQ_API_KEY?.trim();

const LOCATIONIQ_BASE_URL =
  'https://us1.locationiq.com/v1';

const REQUEST_TIMEOUT_MS = 10_000;

function isValidCoordinate(
  latitude: number,
  longitude: number,
): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

async function fetchWithTimeout(
  url: string,
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await fetch(url, {
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function extractCoordinates(
  input: string,
): { latitude: number; longitude: number } | null {
  const directMatch = input.match(
    /(?:^|[?&/@=:\s])(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)(?:$|[&/\s])/,
  );

  if (directMatch) {
    const latitude = Number(directMatch[1]);
    const longitude = Number(directMatch[2]);

    if (isValidCoordinate(latitude, longitude)) {
      return {
        latitude,
        longitude,
      };
    }
  }

  const atMatch = input.match(
    /@(-?\d{1,3}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/,
  );

  if (atMatch) {
    const latitude = Number(atMatch[1]);
    const longitude = Number(atMatch[2]);

    if (isValidCoordinate(latitude, longitude)) {
      return {
        latitude,
        longitude,
      };
    }
  }

  const queryMatch = input.match(
    /[?&]q=(-?\d{1,3}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/,
  );

  if (queryMatch) {
    const latitude = Number(queryMatch[1]);
    const longitude = Number(queryMatch[2]);

    if (isValidCoordinate(latitude, longitude)) {
      return {
        latitude,
        longitude,
      };
    }
  }

  return null;
}

function extractPlusCode(
  input: string,
): string | null {
  const match = input.match(
    /\b([23456789CFGHJMPQRVWX]{2,8}\+[23456789CFGHJMPQRVWX]{2,7})\b/i,
  );

  return match ? match[1].toUpperCase() : null;
}

function getTextWithoutPlusCode(
  input: string,
  plusCode: string,
): string {
  return input
    .replace(plusCode, '')
    .replace(/[,]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function locationIqSearch(
  query: string,
): Promise<GeocodedLocation> {
  if (!LOCATIONIQ_API_KEY) {
    throw new Error(
      'LocationIQ API key is not configured.',
    );
  }

  const params = new URLSearchParams({
    key: LOCATIONIQ_API_KEY,
    q: query,
    format: 'json',
    limit: '1',
    addressdetails: '1',
  });

  const url =
    `${LOCATIONIQ_BASE_URL}/search.php?${params.toString()}`;

  let response: Response;

  try {
    response = await fetchWithTimeout(url);
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === 'AbortError'
    ) {
      throw new Error(
        'Location search timed out. Check your internet connection and try again.',
      );
    }

    throw new Error(
      'Unable to connect to the location service. Please try again.',
    );
  }

  if (!response.ok) {
    let message =
      `LocationIQ geocoding failed (${response.status}).`;

    try {
      const errorData = await response.json();

      if (
        typeof errorData?.error === 'string' &&
        errorData.error.trim()
      ) {
        message = errorData.error.trim();
      }
    } catch {
      // Keep the default message.
    }

    throw new Error(message);
  }

  const data = (await response.json()) as Array<{
    lat?: string;
    lon?: string;
    display_name?: string;
  }>;

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(
      `No location found for "${query}".`,
    );
  }

  const result = data[0];

  const latitude = Number(result.lat);
  const longitude = Number(result.lon);

  if (!isValidCoordinate(latitude, longitude)) {
    throw new Error(
      'LocationIQ returned invalid coordinates.',
    );
  }

  return {
    latitude,
    longitude,
    address:
      typeof result.display_name === 'string' &&
      result.display_name.trim()
        ? result.display_name.trim()
        : query,
  };
}

async function reverseGeocodeCoordinates(
  latitude: number,
  longitude: number,
): Promise<GeocodedLocation> {
  if (!isValidCoordinate(latitude, longitude)) {
    throw new Error(
      'Invalid latitude or longitude.',
    );
  }

  if (!LOCATIONIQ_API_KEY) {
    return {
      latitude,
      longitude,
      address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    };
  }

  const params = new URLSearchParams({
    key: LOCATIONIQ_API_KEY,
    lat: String(latitude),
    lon: String(longitude),
    format: 'json',
  });

  const url =
    `${LOCATIONIQ_BASE_URL}/reverse.php?${params.toString()}`;

  try {
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      return {
        latitude,
        longitude,
        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      };
    }

    const data = (await response.json()) as {
      display_name?: string;
    };

    return {
      latitude,
      longitude,
      address:
        typeof data.display_name === 'string' &&
        data.display_name.trim()
          ? data.display_name.trim()
          : `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    };
  } catch {
    return {
      latitude,
      longitude,
      address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    };
  }
}

async function resolvePlusCode(
  input: string,
  plusCode: string,
): Promise<GeocodedLocation> {
  if (isFull(plusCode)) {
    const area = decode(plusCode);

    return reverseGeocodeCoordinates(
      area.latitudeCenter,
      area.longitudeCenter,
    );
  }

  if (!isShort(plusCode)) {
    throw new Error(
      'The Plus Code is not valid.',
    );
  }

  const referenceText = getTextWithoutPlusCode(
    input,
    plusCode,
  );

  if (!referenceText) {
    throw new Error(
      'A short Plus Code needs a nearby city, area, or address.',
    );
  }

  const reference = await locationIqSearch(
    referenceText,
  );

  const fullCode = recoverNearest(
    plusCode,
    reference.latitude,
    reference.longitude,
  );

  const area = decode(fullCode);

  return reverseGeocodeCoordinates(
    area.latitudeCenter,
    area.longitudeCenter,
  );
}

export async function geocodeAddress(
  address: string,
): Promise<GeocodedLocation> {
  const trimmedAddress = address.trim();

  if (!trimmedAddress) {
    throw new Error(
      'Please enter a location.',
    );
  }

  if (!LOCATIONIQ_API_KEY) {
    throw new Error(
      'LocationIQ API key is not configured.',
    );
  }

  // 1. Coordinates / Google Maps URLs.
  const coordinates =
    extractCoordinates(trimmedAddress);

  if (coordinates) {
    return reverseGeocodeCoordinates(
      coordinates.latitude,
      coordinates.longitude,
    );
  }

  // 2. Plus Code.
  const plusCode =
    extractPlusCode(trimmedAddress);

  if (plusCode) {
    return resolvePlusCode(
      trimmedAddress,
      plusCode,
    );
  }

  // 3. Normal address.
  return locationIqSearch(trimmedAddress);
}