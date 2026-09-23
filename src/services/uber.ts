import { Linking, Platform } from 'react-native';

export type UberLocation = {
  latitude: number;
  longitude: number;
  address?: string;
  nickname?: string;
};

export type UberRideRequest = {
  pickup: UberLocation;
  dropoff: UberLocation;
};

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

function validateLocation(
  name: string,
  location: UberLocation,
): void {
  if (
    !isValidCoordinate(
      location.latitude,
      location.longitude,
    )
  ) {
    throw new Error(
      `Invalid ${name} coordinates.`,
    );
  }
}

function encodeLocationParameters(
  prefix: 'pickup' | 'dropoff',
  location: UberLocation,
): string[] {
  const parameters = [
    `${prefix}[latitude]=${encodeURIComponent(
      String(location.latitude),
    )}`,
    `${prefix}[longitude]=${encodeURIComponent(
      String(location.longitude),
    )}`,
  ];

  if (location.nickname?.trim()) {
    parameters.push(
      `${prefix}[nickname]=${encodeURIComponent(
        location.nickname.trim(),
      )}`,
    );
  }

  if (location.address?.trim()) {
    parameters.push(
      `${prefix}[formatted_address]=${encodeURIComponent(
        location.address.trim(),
      )}`,
    );
  }

  return parameters;
}

/**
 * Creates an Uber native-app ride request deep link.
 *
 * This does NOT book a ride.
 * It only opens Uber with pickup and destination information.
 */
export function buildUberDeepLink(
  request: UberRideRequest,
): string {
  validateLocation('pickup', request.pickup);
  validateLocation('dropoff', request.dropoff);

  const pickupParameters =
    encodeLocationParameters(
      'pickup',
      request.pickup,
    );

  const dropoffParameters =
    encodeLocationParameters(
      'dropoff',
      request.dropoff,
    );

  const queryParameters = [
    ...pickupParameters,
    ...dropoffParameters,
  ];

  return `uber://riderequest?${queryParameters.join('&')}`;
}

/**
 * Creates a web URL containing the pickup and destination.
 *
 * This is used as a fallback when the Uber app cannot be opened.
 *
 * Note:
 * Uber's web flow can vary by region/account, so this URL should
 * be treated as a navigation fallback rather than a guarantee that
 * a ride can be booked directly from the browser.
 */
export function buildUberWebLink(
  request: UberRideRequest,
): string {
  validateLocation('pickup', request.pickup);
  validateLocation('dropoff', request.dropoff);

  const pickupLatitude = encodeURIComponent(
    String(request.pickup.latitude),
  );

  const pickupLongitude = encodeURIComponent(
    String(request.pickup.longitude),
  );

  const dropoffLatitude = encodeURIComponent(
    String(request.dropoff.latitude),
  );

  const dropoffLongitude = encodeURIComponent(
    String(request.dropoff.longitude),
  );

  return (
    'https://m.uber.com/looking?' +
    `pickup[latitude]=${pickupLatitude}&` +
    `pickup[longitude]=${pickupLongitude}&` +
    `dropoff[latitude]=${dropoffLatitude}&` +
    `dropoff[longitude]=${dropoffLongitude}`
  );
}

/**
 * Opens the Uber native application.
 *
 * Returns true only when React Native confirms that the URL
 * can be opened.
 */
export async function openUberApp(
  request: UberRideRequest,
): Promise<boolean> {
  const deepLink = buildUberDeepLink(request);

  try {
    const supported =
      await Linking.canOpenURL(deepLink);

    if (!supported) {
      return false;
    }

    await Linking.openURL(deepLink);

    return true;
  } catch {
    return false;
  }
}

/**
 * Opens Uber's web fallback.
 */
export async function openUberWeb(
  request: UberRideRequest,
): Promise<boolean> {
  const webLink = buildUberWebLink(request);

  try {
    const supported =
      await Linking.canOpenURL(webLink);

    if (!supported) {
      return false;
    }

    await Linking.openURL(webLink);

    return true;
  } catch {
    return false;
  }
}

/**
 * Opens Uber.
 *
 * Flow:
 *
 * Android/iOS
 *      ↓
 * Try Uber app
 *      ↓
 * If unavailable
 *      ↓
 * Open Uber web fallback
 *
 * Returns:
 *   'app'  → Uber app opened
 *   'web'  → Uber web opened
 *   'none' → neither could be opened
 */
export async function openUberRideRequest(
  request: UberRideRequest,
): Promise<'app' | 'web' | 'none'> {
  validateLocation('pickup', request.pickup);
  validateLocation('dropoff', request.dropoff);

  const appOpened =
    await openUberApp(request);

  if (appOpened) {
    return 'app';
  }

  const webOpened =
    await openUberWeb(request);

  if (webOpened) {
    return 'web';
  }

  return 'none';
}