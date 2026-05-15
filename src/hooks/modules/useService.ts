import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { ServiceType } from "@/server/modules/service/service.types";

import { api } from "@/lib/api";

const API_URL =
  "/api/admin/services";

export const useServices = () => {
  const [services, setServices] =
    useState<ServiceType[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* ------------------------------ GET SERVICES ----------------------------- */

  const getServices =
    useCallback(async () => {
      try {
        setLoading(true);

        setError(null);

        const result =
          await api.get<{
            data: ServiceType[];
          }>(API_URL);

        setServices(
          result.data ?? []
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des services"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  /* ------------------------------ CREATE SERVICE ----------------------------- */

  const createService =
    useCallback(
      async (
        data: ServiceType
      ) => {
        try {
          setLoading(true);

          setError(null);

          await api.post(
            API_URL,
            data
          );

          await getServices();
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
      [getServices]
    );

  /* ------------------------------ UPDATE SERVICE ----------------------------- */

  const updateService =
    useCallback(
      async (
        id: number,
        data: Partial<ServiceType>
      ) => {
        try {
          setLoading(true);

          setError(null);

          await api.put(
            `${API_URL}/${id}`,
            data
          );

          await getServices();
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
      [getServices]
    );

  /* ------------------------------ DELETE SERVICE ----------------------------- */

  const deleteService =
    useCallback(
      async (id: number) => {
        try {
          setLoading(true);

          setError(null);

          await api.delete(
            `${API_URL}/${id}`
          );

          await getServices();
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
      [getServices]
    );

  /* ------------------------------ INIT ----------------------------- */

  useEffect(() => {
    getServices();
  }, [getServices]);

  return {
    services,
    loading,
    error,
    getServices,
    createService,
    updateService,
    deleteService,
  };
};