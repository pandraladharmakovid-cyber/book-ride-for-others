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
  process.env.EXPO_PUBLIC_LOCATIONIQ_API_KEY;

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

function extractCoordinates(
  input: string,
): { latitude: number; longitude: number } | null {
  const coordinatePattern =
    /(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/;

  const match = input.match(coordinatePattern);

  if (!match) {
    return null;
  }

  const latitude = Number(match[1]);
  const longitude = Number(match[2]);

  if (!isValidCoordinate(latitude, longitude)) {
    return null;
  }

  return { latitude, longitude };
}

function extractPlusCode(input: string): string | null {
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
  const url =
    'https://us1.locationiq.com/v1/search' +
    `?key=${encodeURIComponent(LOCATIONIQ_API_KEY!)}` +
    `&q=${encodeURIComponent(query)}` +
    '&format=json';

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `LocationIQ geocoding failed (${response.status}).`,
    );
  }

  const data = (await response.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(
      `No destination found for "${query}".`,
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
    address: result.display_name,
  };
}

async function reverseGeocodeCoordinates(
  latitude: number,
  longitude: number,
): Promise<GeocodedLocation> {
  const url =
    'https://us1.locationiq.com/v1/reverse' +
    `?key=${encodeURIComponent(LOCATIONIQ_API_KEY!)}` +
    `&lat=${latitude}` +
    `&lon=${longitude}` +
    '&format=json';

  const response = await fetch(url);

  if (!response.ok) {
    return {
      latitude,
      longitude,
      address: `${latitude}, ${longitude}`,
    };
  }

  const data = (await response.json()) as {
    display_name?: string;
  };

  return {
    latitude,
    longitude,
    address:
      data.display_name ||
      `${latitude}, ${longitude}`,
  };
}

async function resolvePlusCode(
  input: string,
  plusCode: string,
): Promise<GeocodedLocation> {
  // Full Plus Code: decode directly without needing a reference location.
  if (isFull(plusCode)) {
    const area = decode(plusCode);

    return reverseGeocodeCoordinates(
      area.latitudeCenter,
      area.longitudeCenter,
    );
  }

  // Short Plus Code: we need the accompanying place/address
  // as a reference location.
  if (!isShort(plusCode)) {
    throw new Error('The Plus Code is not valid.');
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
    throw new Error('Please enter a destination.');
  }

  if (!LOCATIONIQ_API_KEY) {
    throw new Error(
      'LocationIQ API key is not configured.',
    );
  }

  // 1. Coordinates / Google Maps URLs containing coordinates.
  const coordinates = extractCoordinates(trimmedAddress);

  if (coordinates) {
    return reverseGeocodeCoordinates(
      coordinates.latitude,
      coordinates.longitude,
    );
  }

  // 2. Plus Code.
  const plusCode = extractPlusCode(trimmedAddress);

  if (plusCode) {
    return resolvePlusCode(
      trimmedAddress,
      plusCode,
    );
  }

  // 3. Normal address/place name.
  return locationIqSearch(trimmedAddress);
}