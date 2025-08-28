import React from 'react';
import { LessonNode } from '~/types/example';

// types gợi ý
export type LessonStatus = 'locked' | 'next' | 'in_progress' | 'done' | 'mastered';
export type NodeType = 'lesson' | 'review' | 'checkpoint' | 'chest';

export interface PlanResponse {
  nodes: LessonNode[];
  dailyGoal: { targetXP: number; todayXP: number; streak: number };
}

export type Row =
  | { type: 'unit'; unit: number; key: string }
  | { type: 'lesson'; node: LessonNode; isLeft: boolean; lessonIndex: number; key: string };

export function useStudyPlanData(plan: PlanResponse, opts?: { zigzagResetPerUnit?: boolean }) {
  const { zigzagResetPerUnit = true } = opts ?? {};
  const rows = React.useMemo<Row[]>(() => {
    const out: Row[] = [];
    let lastUnit: number | null = null;
    let lessonIndex = 0; // đếm toàn plan

    // nếu muốn ziczac theo từng unit -> reset theo unit
    let perUnitIndex = 0;

    for (const node of plan.nodes) {
      if (node.unit !== lastUnit) {
        out.push({ type: 'unit', unit: node.unit, key: `unit-${node.unit}` });
        if (zigzagResetPerUnit) perUnitIndex = 0;
        lastUnit = node.unit;
      }
      const idx = zigzagResetPerUnit ? perUnitIndex : lessonIndex;
      out.push({
        type: 'lesson',
        node,
        isLeft: idx % 2 === 0,
        lessonIndex, // index “toàn cục” nếu bạn cần
        key: node.id,
      });
      lessonIndex++;
      perUnitIndex++;
    }
    return out;
  }, [plan.nodes, zigzagResetPerUnit]);

  // tiện ích cho FlashList
  const keyExtractor = React.useCallback((item: Row) => item.key, []);
  const getItemType = React.useCallback((item: Row) => item.type, []);
  const stickyHeaderIndices = React.useMemo(
    () => rows.map((r, i) => (r.type === 'unit' ? i : -1)).filter((i) => i >= 0),
    [rows]
  );

  // chỉ re-render item khi dữ liệu dùng để render thay đổi
  const shouldItemUpdate = React.useCallback((prev: { item: Row }, next: { item: Row }) => {
    if (prev.item.type !== next.item.type) return true;
    if (prev.item.type === 'unit') return prev.item.unit !== (next.item as any).unit;
    const a = prev.item as Extract<Row, { type: 'lesson' }>;
    const b = next.item as Extract<Row, { type: 'lesson' }>;
    return (
      a.node.id !== b.node.id ||
      a.node.status !== b.node.status ||
      a.node.title !== b.node.title || // thêm những prop bạn dùng để render
      a.isLeft !== b.isLeft
    );
  }, []);

  return {
    rows,
    dailyGoal: plan.dailyGoal,
    keyExtractor,
    getItemType,
    stickyHeaderIndices,
    shouldItemUpdate,
  };
}
