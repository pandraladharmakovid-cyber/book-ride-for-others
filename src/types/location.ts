export type LocationSource = 'manual' | 'test' | 'shared';

export type LocationData = {
  latitude: number;
  longitude: number;
  address: string;
  source: LocationSource;
};