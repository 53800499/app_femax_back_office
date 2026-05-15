import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { EquipeType } from "@/server/modules/equipe/equipe.types";

const API_URL = "/api/admin/equipe";

export const useEquipes = () => {
  const [equipes, setEquipes] = useState<EquipeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ------------------------------ GET ALL ----------------------------- */

  const getEquipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await api.get<{ data: EquipeType[] }>(API_URL);

      setEquipes(result.data ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement de l'équipe"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* ------------------------------ CREATE ----------------------------- */

  const createEquipe = useCallback(
    async (data: Omit<EquipeType, "id">) => {
      try {
        setLoading(true);
        setError(null);

        await api.post(API_URL, data);

        await getEquipes();
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
    [getEquipes]
  );

  /* ------------------------------ UPDATE ----------------------------- */

  const updateEquipe = useCallback(
    async (id: string, data: Partial<EquipeType>) => {
      try {
        setLoading(true);
        setError(null);

        await api.put(`${API_URL}/${id}`, data);

        await getEquipes();
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
    [getEquipes]
  );

  /* ------------------------------ DELETE ----------------------------- */

  const deleteEquipe = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        await api.delete(`${API_URL}/${id}`);

        await getEquipes();
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
    [getEquipes]
  );

  /* ------------------------------ INIT ----------------------------- */

  useEffect(() => {
    getEquipes();
  }, [getEquipes]);

  return {
    equipes,
    loading,
    error,
    getEquipes,
    createEquipe,
    updateEquipe,
    deleteEquipe,
  };
};