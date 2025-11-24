import { useMemo, useState } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  pageSize: number;
}

export const usePagination = <T,>({ items, pageSize }: UsePaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, pageSize]);

  const totalPages = Math.ceil(items.length / pageSize);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    paginatedItems,
    totalPages,
    totalItems: items.length,
    goToPage,
    setCurrentPage,
    resetPagination,
  };
};

