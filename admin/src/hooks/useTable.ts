import { useState, useCallback, useMemo } from "react";
import { useAsync } from "./useAsync";

interface UseTableState<T> {
  items: T[];
  filteredItems: T[];
  searchQuery: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  currentPage: number;
  pageSize: number;
  selectedItems: Set<string>;
}

interface UseTableActions<T> {
  setItems: (items: T[]) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (field: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  toggleSelectItem: (id: string) => void;
  selectAllItems: () => void;
  clearSelection: () => void;
  loadData: (fetchFn: () => Promise<T[]>) => Promise<void>;
}

interface UseTableConfig<T> {
  initialPageSize?: number;
  searchFields?: (keyof T)[];
  sortable?: boolean;
}

export function useTable<T extends Record<string, any>>(
  config: UseTableConfig<T> = {}
): UseTableState<T> &
  UseTableActions<T> & { loading: boolean; error: string | null } {
  const { initialPageSize = 10, searchFields = [], sortable = true } = config;

  const { data: items, loading, error, execute } = useAsync<T[]>();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Filter and sort items
  const filteredItems = useMemo(() => {
    if (!items) return [];

    let filtered = items;

    // Apply search filter
    if (searchQuery && searchFields.length > 0) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(query);
        })
      );
    }

    // Apply sorting
    if (sortBy && sortable) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [items, searchQuery, searchFields, sortBy, sortOrder, sortable]);

  // Pagination
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredItems.length / pageSize);

  const setItems = useCallback(
    (newItems: T[]) => {
      execute(async () => newItems);
    },
    [execute]
  );

  const toggleSelectItem = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAllItems = useCallback(() => {
    setSelectedItems(
      new Set(paginatedItems.map((item) => item.id || item._id))
    );
  }, [paginatedItems]);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const loadData = useCallback(
    async (fetchFn: () => Promise<T[]>) => {
      await execute(fetchFn);
      setCurrentPage(1);
      clearSelection();
    },
    [execute, clearSelection]
  );

  // Reset page when search changes
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  return {
    // State
    items: items || [],
    filteredItems: paginatedItems,
    searchQuery,
    sortBy,
    sortOrder,
    currentPage,
    pageSize,
    selectedItems,
    loading,
    error,

    // Actions
    setItems,
    setSearchQuery: handleSearchChange,
    setSortBy,
    setSortOrder,
    setCurrentPage,
    setPageSize,
    toggleSelectItem,
    selectAllItems,
    clearSelection,
    loadData,
  };
}
