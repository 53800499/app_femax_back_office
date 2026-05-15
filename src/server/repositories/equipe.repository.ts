import { db } from "@/server/firebase/admin";

import { EquipeType } from "@/server/modules/equipe/equipe.types";

const COLLECTION_NAME =
  "equipes";

export const equipeRepository = {
  /* ------------------------------ GET ALL EQUIPES ----------------------------- */

  async getAll(): Promise<
    EquipeType[]
  > {
    const snapshot =
      await db
        .collection(
          COLLECTION_NAME
        )
        .get();

    return snapshot.docs.map(
      (doc) => ({
        id: Number(doc.id),

        ...doc.data(),
      })
    ) as EquipeType[];
  },

  /* ------------------------------ CREATE EQUIPE ----------------------------- */

  async create(
    data: EquipeType
  ) {
    return await db
      .collection(
        COLLECTION_NAME
      )
      .doc(String(data.id))
      .set({
        ...data,
      });
  },

  /* ------------------------------ UPDATE EQUIPE ----------------------------- */

  async update(
    id: number,
    data: Partial<EquipeType>
  ) {
    return await db
      .collection(
        COLLECTION_NAME
      )
      .doc(String(id))
      .update(data);
  },

  /* ------------------------------ DELETE EQUIPE ----------------------------- */

  async delete(id: number) {
    return await db
      .collection(
        COLLECTION_NAME
      )
      .doc(String(id))
      .delete();
  },
};