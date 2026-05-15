import { EquipeType } from "@/server/modules/equipe/equipe.types";
import { equipeRepository } from "@/server/repositories/equipe.repository";


export const equipeService = {
  /* ------------------------------ GET EQUIPES ----------------------------- */

  async getEquipes() {
    return await equipeRepository.getAll();
  },

  /* ------------------------------ CREATE EQUIPE ----------------------------- */

  async createEquipe(
    data: EquipeType
  ) {
    if (
      !data.name ||
      !data.role ||
      !data.image ||
      !data.description
    ) {
      throw new Error(
        "Missing required fields"
      );
    }

    return await equipeRepository.create(
      data
    );
  },

  /* ------------------------------ UPDATE EQUIPE ----------------------------- */

  async updateEquipe(
    id: number,
    data: Partial<EquipeType>
  ) {
    if (!id) {
      throw new Error(
        "Equipe ID is required"
      );
    }

    return await equipeRepository.update(
      id,
      data
    );
  },

  /* ------------------------------ DELETE EQUIPE ----------------------------- */

  async deleteEquipe(id: number) {
    if (!id) {
      throw new Error(
        "Equipe ID is required"
      );
    }

    return await equipeRepository.delete(
      id
    );
  },
};