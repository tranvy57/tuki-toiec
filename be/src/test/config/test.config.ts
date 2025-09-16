import { group } from 'console';

export const REVIEW_TEST_CONFIG = {
  title: 'Review Test',
  totalQuestions: 30,
  parts: [
    {
      partNumber: 1,
      groups: 2, // 2 caau
      skills: {
        L1: 2,
      },
    },
    {
      partNumber: 2,
      groups: 8, // 5 cau
      skills: {
        L2a: 2,
        L2b: 2,
        L2c: 2,
        L2d: 2,
      }
    },
    {
      partNumber: 3,
      groups: 2, // 8 cau
      skills: {
        L3: 4,
      }
    },
    {
      partNumber: 4,
      groups: 1, // 4 cau
      skills: {
        L4: 4,
      }
    },
    {
      partNumber: 5,
      groups: 4, // 4 cau
      skills: {
        G1: 4,
        R1: 1,
      }
    },
    {
      partNumber: 6,
      groups: 1, // 3-4 cau
      skills: {
        R2: 4,
      }
    },
    {
      partNumber: 7,
      groups: 2, // 6-8 cau
      skills: {
        R3: 8,
        // R4: 4,
      }
    },
  ],
};
