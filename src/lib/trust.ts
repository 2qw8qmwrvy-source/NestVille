export const TRUSTED_LANDLORD_MIN_RATINGS = 3;
export const TRUSTED_LANDLORD_MIN_AVERAGE = 4;

export function isTrustedLandlord(role: string, average: number, count: number) {
  return (
    role === "landlord" &&
    count >= TRUSTED_LANDLORD_MIN_RATINGS &&
    average >= TRUSTED_LANDLORD_MIN_AVERAGE
  );
}
