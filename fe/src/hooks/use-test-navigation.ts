import { usePracticeTest } from "../store/test-store";

/**
 * Hook for test navigation logic
 */
export function useTestNavigation() {
  const {
    currentPart,
    currentGroup,
    nextPart,
    nextGroup,
    previousGroup,
    setCurrentPart,
    setCurrentGroup,
    partCache,
  } = usePracticeTest();

  const canGoToNextPart = () => {
    if (!currentPart) return false;
    return partCache.has(currentPart.partNumber + 1);
  };

  const canGoToPreviousPart = () => {
    if (!currentPart) return false;
    return partCache.has(currentPart.partNumber - 1);
  };

  const canGoToNextGroup = () => {
    if (!currentPart || !currentGroup) return false;
    
    const currentGroupIndex = currentPart.groups.findIndex(
      (g) => g.id === currentGroup.id
    );
    
    // Check if there's next group in current part
    if (currentGroupIndex < currentPart.groups.length - 1) {
      return true;
    }
    
    // Check if there's next part
    return canGoToNextPart();
  };

  const canGoToPreviousGroup = () => {
    if (!currentPart || !currentGroup) return false;
    
    const currentGroupIndex = currentPart.groups.findIndex(
      (g) => g.id === currentGroup.id
    );
    
    // Check if there's previous group in current part
    if (currentGroupIndex > 0) {
      return true;
    }
    
    // Check if there's previous part
    return canGoToPreviousPart();
  };

  const jumpToPart = (partNumber: number) => {
    if (partCache.has(partNumber)) {
      setCurrentPart(partNumber);
    }
  };

  const jumpToGroup = (groupId: string) => {
    setCurrentGroup(groupId);
  };

  const getPartNumbers = () => {
    return Array.from(partCache.keys()).sort((a, b) => a - b);
  };

  return {
    // Current state
    currentPart,
    currentGroup,
    
    // Navigation actions
    nextPart,
    nextGroup,
    previousGroup,
    jumpToPart,
    jumpToGroup,
    
    // Navigation checks
    canGoToNextPart,
    canGoToPreviousPart,
    canGoToNextGroup,
    canGoToPreviousGroup,
    
    // Utilities
    getPartNumbers,
  };
}
