import { useCallback, useEffect, useState } from "react";

import { LogType } from "@/server/modules/log/log.types";

import { api } from "@/lib/api";

const API_URL = "/api/admin/logs";

export const useLogs = () => {
  const [logs, setLogs] =
    useState<LogType[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* ------------------------------ GET LOGS ----------------------------- */

  const getLogs = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const result = await api.get<{
        data: LogType[];
      }>(API_URL);

      setLogs(result.data ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des activités"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* ------------------------------ CREATE LOG ----------------------------- */

  const createLog = useCallback(
    async (data: LogType) => {
      try {
        setLoading(true);

        setError(null);

        await api.post(API_URL, data);

        await getLogs();
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
    [getLogs]
  );

  /* ------------------------------ UPDATE LOG ----------------------------- */

  const updateLog = useCallback(
    async (
      id: string,
      data: Partial<LogType>
    ) => {
      try {
        setLoading(true);

        setError(null);

        await api.put(
          `${API_URL}/${id}`,
          data
        );

        await getLogs();
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
    [getLogs]
  );

  /* ------------------------------ DELETE LOG ----------------------------- */

  const deleteLog = useCallback(
    async (id: string) => {
      try {
        setLoading(true);

        setError(null);

        await api.delete(
          `${API_URL}/${id}`
        );

        await getLogs();
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
    [getLogs]
  );

  /* ------------------------------ INIT ----------------------------- */

  useEffect(() => {
    getLogs();
  }, [getLogs]);

  return {
    logs,
    loading,
    error,
    getLogs,
    createLog,
    updateLog,
    deleteLog,
  };
};