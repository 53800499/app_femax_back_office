import { db } from "@/server/firebase/admin";

import { ServiceType } from "@/server/modules/service/service.types";

const COLLECTION_NAME = "services";

export const serviceRepository = {
  /* ------------------------------ GET ALL SERVICES ----------------------------- */

  async getAll(): Promise<ServiceType[]> {
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .get();

    return snapshot.docs.map((doc) => ({
      id: Number(doc.id),
      ...doc.data(),
    })) as ServiceType[];
  },

  /* ------------------------------ CREATE SERVICE ----------------------------- */

  async create(data: ServiceType) {
    return await db
      .collection(COLLECTION_NAME)
      .doc(String(data.id))
      .set({
        ...data,
      });
  },

  /* ------------------------------ UPDATE SERVICE ----------------------------- */

  async update(
    id: number,
    data: Partial<ServiceType>
  ) {
    return await db
      .collection(COLLECTION_NAME)
      .doc(String(id))
      .update(data);
  },

  /* ------------------------------ DELETE SERVICE ----------------------------- */

  async delete(id: number) {
    return await db
      .collection(COLLECTION_NAME)
      .doc(String(id))
      .delete();
  },
};