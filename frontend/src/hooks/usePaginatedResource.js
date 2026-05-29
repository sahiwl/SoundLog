import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

export const usePaginatedResource = (endpoint, { enabled = true } = {}) => {
  const [items, setItems] = useState([]);
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
        const response = await axiosInstance.get(endpoint, { params: { page } });
        const data = response.data;

        setItems(data.albums ?? data.reviews ?? []);
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

  const goToPage = (page) => {
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
