function calculatePartAccuracies(parts) {
  return parts.map((part) => {
    const allQuestions = part.groups.flatMap((group) => group.questions);
    const total = allQuestions.length;
    const correct = allQuestions.filter((q) => q.isCorrect).length;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    return { ...part, accuracy };
  });
}
