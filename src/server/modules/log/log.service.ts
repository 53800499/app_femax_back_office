import { LogType } from "@/server/modules/log/log.types";
import { logRepository } from "@/server/repositories/log.repository";

export const logService = {
  /* ------------------------------ GET LOGS ----------------------------- */

  async getLogs() {
    return await logRepository.getAll();
  },

  /* ------------------------------ CREATE LOG ----------------------------- */

  async createLog(data: LogType) {
    if (
      !data.title ||
      !data.category ||
      !data.author ||
      !data.status
    ) {
      throw new Error(
        "Missing required fields"
      );
    }

    return await logRepository.create(data);
  },

  /* ------------------------------ UPDATE LOG ----------------------------- */

  async updateLog(
    id: string,
    data: Partial<LogType>
  ) {
    if (!id) {
      throw new Error(
        "Log ID is required"
      );
    }

    return await logRepository.update(
      id,
      data
    );
  },

  /* ------------------------------ DELETE LOG ----------------------------- */

  async deleteLog(id: string) {
    if (!id) {
      throw new Error(
        "Log ID is required"
      );
    }

    return await logRepository.delete(id);
  },
};