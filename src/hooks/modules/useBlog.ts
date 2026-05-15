import { useCallback, useEffect, useState } from "react";

import { BlogType } from "@/server/modules/blog/blog.types";

import { api } from "@/lib/api";

const API_URL = "/api/admin/blogs";

export const useBlogs = () => {
  const [blogs, setBlogs] =
    useState<BlogType[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* ------------------------------ GET BLOGS ----------------------------- */

  const getBlogs = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const result = await api.get<{
        data: BlogType[];
      }>(API_URL);

      setBlogs(result.data ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des articles"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* ------------------------------ CREATE BLOG ----------------------------- */

  const createBlog = useCallback(
    async (data: BlogType) => {
      try {
        setLoading(true);

        setError(null);

        await api.post(API_URL, data);

        await getBlogs();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la création"
        );

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getBlogs]
  );

  /* ------------------------------ UPDATE BLOG ----------------------------- */

  const updateBlog = useCallback(
    async (
      id: string,
      data: Partial<BlogType>
    ) => {
      try {
        setLoading(true);

        setError(null);

        await api.put(
          `${API_URL}/${id}`,
          data
        );

        await getBlogs();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la mise à jour"
        );

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getBlogs]
  );

  /* ------------------------------ DELETE BLOG ----------------------------- */

  const deleteBlog = useCallback(
    async (id: string) => {
      try {
        setLoading(true);

        setError(null);

        await api.delete(
          `${API_URL}/${id}`
        );

        await getBlogs();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la suppression"
        );

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getBlogs]
  );

  /* ------------------------------ INIT ----------------------------- */

  useEffect(() => {
    getBlogs();
  }, [getBlogs]);

  return {
    blogs,
    loading,
    error,
    getBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  };
};