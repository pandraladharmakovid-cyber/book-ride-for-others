import { Linking } from 'react-native';

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

function encodeLocationParameters(
  prefix: 'pickup' | 'dropoff',
  location: UberLocation,
): string[] {
  const parameters = [
    `${prefix}[latitude]=${encodeURIComponent(String(location.latitude))}`,
    `${prefix}[longitude]=${encodeURIComponent(String(location.longitude))}`,
  ];

  if (location.nickname?.trim()) {
    parameters.push(
      `${prefix}[nickname]=${encodeURIComponent(location.nickname.trim())}`,
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
 * This does not book a ride.
 * It opens Uber with the pickup and destination pre-populated.
 */
export function buildUberDeepLink(request: UberRideRequest): string {
  const pickupParameters = encodeLocationParameters(
    'pickup',
    request.pickup,
  );

  const dropoffParameters = encodeLocationParameters(
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
 * Opens the generated Uber deep link.
 *
 * Returns true when the device successfully accepts the URL.
 * Returns false when Uber cannot be opened.
 */
export async function openUberRideRequest(
  request: UberRideRequest,
): Promise<boolean> {
  const deepLink = buildUberDeepLink(request);

  try {
    await Linking.openURL(deepLink);
    return true;
  } catch {
    return false;
  }
}