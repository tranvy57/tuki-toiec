import React from 'react';

export const useStudyPlanActions = () => {
  const handleLessonPress = React.useCallback((lessonId: string) => {
    // TODO: Navigate to lesson details
    // Example: router.push(`/lesson/${lessonId}/details`);
  }, []);

  const handleLessonStart = React.useCallback((lessonId: string) => {
    // TODO: Navigate to lesson
    // Example: router.push(`/lesson/${lessonId}/start`);
  }, []);

  return React.useMemo(
    () => ({ handleLessonPress, handleLessonStart }),
    [handleLessonPress, handleLessonStart]  
  );
};
