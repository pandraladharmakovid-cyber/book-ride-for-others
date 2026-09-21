import { geocodeAddress } from './geocoding';
import type {
  LocationData,
  LocationSource,
} from '../types/location';

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