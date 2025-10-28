export const ITEM_MODALITIES = [
  'mcq',
  'cloze',
  'ordering',
  'image_pick',
  'minimal_pair',
  'dictation',
  'short_answer',
  'email_reply',
  'opinion_paragraph',
  'error_fix',
  'read_aloud',
  'repeat_sentence',
  'describe_picture',
  'respond_to_questions',
  'respond_using_info',
  'express_opinion',
  'true_false',
  'hotspot',
] as const;
export type ItemModality = (typeof ITEM_MODALITIES)[number];

export const ITEM_STATUS = ['draft', 'active', 'archived'] as const;
export type ItemStatus = (typeof ITEM_STATUS)[number];

export const ITEM_SOURCE = [
  'toeic',
  'manual',
  'generated',
  'external',
] as const;
export type ItemSourceType = (typeof ITEM_SOURCE)[number];

export const ATTEMPT_CONTEXTS = ['lesson', 'practice', 'test'] as const;
export type AttemptContext = (typeof ATTEMPT_CONTEXTS)[number];

export const AI_EVAL_STATUS = ['queued', 'done', 'failed'] as const;
export type AiEvalStatus = (typeof AI_EVAL_STATUS)[number];

// export const TOEIC_PART_MODALITY_MAP = {
//   1: ['image_pick', 'describe_picture'],
//   2: ['mcq'],
//   3: ['mcq', 'cloze'],
//   4: ['mcq', 'read_aloud'],
//   5: ['cloze', 'error_fix'],
//   6: ['cloze', 'ordering'],
//   7: ['mcq', 'short_answer'],
// };