/**
 * Generates visible page numbers for pagination
 * @param current - Current page number (1-based)
 * @param total - Total number of pages
 * @returns Array of page numbers and ellipsis strings
 */
export function getVisiblePages(
  current: number,
  total: number
): (number | string)[] {
  const pages: (number | string)[] = [];

  // If total pages is small, show all pages
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Always show first page
  pages.push(1);

  // Add ellipsis if current page is far from start
  if (current > 4) {
    pages.push("...");
  }

  // Add pages around current page
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }

  // Add ellipsis if current page is far from end
  if (current < total - 3) {
    pages.push("...");
  }

  // Always show last page (if total > 1)
  if (total > 1) {
    pages.push(total);
  }

  return pages;
}

/**
 * Calculates pagination metadata
 * @param page - Current page (1-based)
 * @param limit - Items per page
 * @param total - Total number of items
 * @returns Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number;
  endIndex: number;
}

export function getPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit - 1, total - 1);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    startIndex,
    endIndex,
  };
}
