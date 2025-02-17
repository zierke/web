export interface enumLike {
  [key: number]: string | number;
}

export const bitwiseEncode = (enumValues: number[]): number => {
  return enumValues.reduce((acc, curr) => acc | curr, 0);
};

export const bitwiseDecode = (
  value: number,
  decodeEnum: enumLike,
): number[] => {
  const enumValues = Object.keys(decodeEnum).map(Number).filter(Boolean);
  return enumValues.map((b) => value & b).filter(Boolean);
};
