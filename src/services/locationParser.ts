import { geocodeAddress } from './geocoding';
import type {
  LocationData,
  LocationSource,
} from '../types/location';

/**
 * Resolves a user-provided location input into a normalized LocationData object.
 *
 * Supported input is handled by geocodeAddress(), including:
 * - Normal addresses
 * - Latitude/longitude coordinates
 * - Google Maps URLs containing coordinates
 * - Full Plus Codes
 * - Short Plus Codes with a nearby address/city
 *
 * The source parameter allows the same resolver to be used for:
 * - manual user input
 * - shared WhatsApp/location links
 * - development/test input
 */
export async function resolveLocationInput(
  input: string,
  source: LocationSource = 'manual',
): Promise<LocationData> {
  const value = input.trim();

  if (!value) {
    throw new Error('Please enter a pickup location.');
  }

  const result = await geocodeAddress(value);

  return {
    latitude: result.latitude,
    longitude: result.longitude,
    address: result.address,
    source,
  };
}

/**
 * Resolves a shared location received from an external source,
 * such as a WhatsApp or Google Maps location link.
 *
 * This intentionally uses the same geocoding/parser pipeline as
 * manual input so both flows produce identical LocationData.
 */
export async function resolveSharedLocation(
  input: string,
): Promise<LocationData> {
  return resolveLocationInput(input, 'shared');
}