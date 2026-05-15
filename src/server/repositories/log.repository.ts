import { db } from "@/server/firebase/admin";

import { LogType } from "@/server/modules/log/log.types";

const COLLECTION_NAME = "logs";

export const logRepository = {
  /* ------------------------------ GET ALL LOGS ----------------------------- */

  async getAll(): Promise<LogType[]> {
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as LogType[];
  },

  /* ------------------------------ CREATE LOG ----------------------------- */

  async create(data: LogType) {
    return await db
      .collection(COLLECTION_NAME)
      .add({
        ...data,

        createdAt:
          new Date().toISOString(),
      });
  },

  /* ------------------------------ UPDATE LOG ----------------------------- */

  async update(
    id: string,
    data: Partial<LogType>
  ) {
    return await db
      .collection(COLLECTION_NAME)
      .doc(id)
      .update(data);
  },

  /* ------------------------------ DELETE LOG ----------------------------- */

  async delete(id: string) {
    return await db
      .collection(COLLECTION_NAME)
      .doc(id)
      .delete();
  },
};