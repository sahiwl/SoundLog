import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import type { PaginatedAlbumsResponse, PaginatedReviewsResponse } from "../types/api";

type PaginatedData = PaginatedAlbumsResponse | PaginatedReviewsResponse;

interface UsePaginatedResourceOptions {
  enabled?: boolean;
}

export const usePaginatedResource = <T,>(
  endpoint: string | null,
  { enabled = true }: UsePaginatedResourceOptions = {}
) => {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPage = useCallback(
    async (page = 1) => {
      if (!endpoint || !enabled) return;

      try {
        setLoading(true);
        setError("");
        const response = await axiosInstance.get<PaginatedData>(endpoint, {
          params: { page },
        });
        const data = response.data;

        const nextItems = (
          "albums" in data ? data.albums : data.reviews
        ) as T[];
        setItems(nextItems);
        setCurrentPage(data.currentPage ?? page);
        setTotalPages(data.totalPages ?? 1);
      } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err);
        setError("Failed to load content.");
      } finally {
        setLoading(false);
      }
    },
    [endpoint, enabled]
  );

  useEffect(() => {
    if (enabled && endpoint) {
      fetchPage(1);
    }
  }, [endpoint, enabled, fetchPage]);

  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      fetchPage(page);
    }
  };

  return {
    items,
    loading,
    error,
    currentPage,
    totalPages,
    goToPage,
    refetch: fetchPage,
  };
};
