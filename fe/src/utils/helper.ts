export const getVisiblePages = (
  current: number,
  total: number
): (number | string)[] => {
  const pages: (number | string)[] = [];

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  pages.push(1);

  if (current > 4) {
    pages.push("...");
  }

  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }

  if (current < total - 3) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
};




