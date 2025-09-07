export function excelRowsToTestDto(
  rows: any[],
  title: string,
  audioUrl: string,
) {
  const parts: any[] = [];
  const partMap = new Map();

  for (const row of rows) {
    let part = partMap.get(row.partNumber);
    if (!part) {
      part = {
        partNumber: row.partNumber,
        directions: row.directions ?? '',
        groups: [],
      };
      partMap.set(row.partNumber, part);
      parts.push(part);
    }

    let group = part.groups.find((g) => g.orderIndex === row.groupOrder);
    if (!group) {
      group = {
        orderIndex: row.groupOrder,
        paragraphEn: row.groupParagraphEn ?? '',
        paragraphVn: row.groupParagraphVn ?? '',
        imageUrl: row.groupImageUrl ?? '',
        audioUrl: row.groupAudioUrl ?? '',
        questions: [],
      };
      part.groups.push(group);
    }

    const answers = [
      { content: row.answerA, isCorrect: !!row.isCorrectA, answerKey: 'A' },
      { content: row.answerB, isCorrect: !!row.isCorrectB, answerKey: 'B' },
      { content: row.answerC, isCorrect: !!row.isCorrectC, answerKey: 'C' },
      { content: row.answerD, isCorrect: !!row.isCorrectD, answerKey: 'D' },
    ];

    group.questions.push({
      numberLabel: row.questionNumberLabel,
      content: row.questionContent,
      explanation: row.questionExplanation ?? '',
      answers,
    });
  }

  return {
    title,
    audioUrl,
    parts,
  };
}
