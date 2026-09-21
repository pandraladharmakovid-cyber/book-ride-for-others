declare module '@erikmichelson/open-location-code-ts' {
  export type DecodedCodeArea = {
    latitudeCenter: number;
    longitudeCenter: number;
    latitudeLo: number;
    longitudeLo: number;
    latitudeHi: number;
    longitudeHi: number;
    codeLength: number;
  };

  export function decode(code: string): DecodedCodeArea;

  export function isFull(code: string): boolean;

  export function isShort(code: string): boolean;

  export function recoverNearest(
    shortCode: string,
    referenceLatitude: number,
    referenceLongitude: number,
  ): string;
}