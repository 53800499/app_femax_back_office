import { ServiceType } from "@/server/modules/service/service.types";

import { serviceRepository } from "@/server/repositories/service.repository";

export const serviceService = {
  /* ------------------------------ GET SERVICES ----------------------------- */

  async getServices() {
    return await serviceRepository.getAll();
  },

  /* ------------------------------ CREATE SERVICE ----------------------------- */

  async createService(data: ServiceType) {
    if (
      !data.title ||
      !data.shortDescription ||
      !data.description ||
      !data.image
    ) {
      throw new Error(
        "Missing required fields"
      );
    }

    return await serviceRepository.create(
      data
    );
  },

  /* ------------------------------ UPDATE SERVICE ----------------------------- */

  async updateService(
    id: number,
    data: Partial<ServiceType>
  ) {
    if (!id) {
      throw new Error(
        "Service ID is required"
      );
    }

    return await serviceRepository.update(
      id,
      data
    );
  },

  /* ------------------------------ DELETE SERVICE ----------------------------- */

  async deleteService(id: number) {
    if (!id) {
      throw new Error(
        "Service ID is required"
      );
    }

    return await serviceRepository.delete(
      id
    );
  },
};