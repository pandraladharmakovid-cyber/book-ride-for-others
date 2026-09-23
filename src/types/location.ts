export type LocationSource =
  | 'manual'
  | 'shared';

export type LocationData = {
  latitude: number;
  longitude: number;
  address: string;
  source: LocationSource;
};