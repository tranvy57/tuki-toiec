export const BASE_CEFR: Record<string, string> = {
  L1: 'B1',
  L2a: 'A2',
  L2b: 'B1',
  L2c: 'B1',
  L2d: 'B1',
  L3: 'B1',
  L4: 'B2',
  R1: 'B1',
  R2: 'B1',
  R3: 'B2',
  R4: 'C1',
  G1: 'B1',
};

export const CEFR_TO_DIFFICULTY: Record<string, number> = {
  A2: 0.3,
  B1: 0.5,
  B2: 0.7,
  C1: 0.9,
};
