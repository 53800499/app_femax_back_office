import { db } from "@/server/firebase/admin";

import { BlogType } from "@/server/modules/blog/blog.types";

const COLLECTION_NAME = "blogs";

export const blogRepository = {
  /* ------------------------------ GET ALL BLOGS ----------------------------- */

  async getAll(): Promise<BlogType[]> {
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogType[];
  },

  /* ------------------------------ CREATE BLOG ----------------------------- */

  async create(data: BlogType) {
    return await db
      .collection(COLLECTION_NAME)
      .add({
        ...data,

        createdAt:
          new Date().toISOString(),
      });
  },

  /* ------------------------------ UPDATE BLOG ----------------------------- */

  async update(
    id: string,
    data: Partial<BlogType>
  ) {
    return await db
      .collection(COLLECTION_NAME)
      .doc(id)
      .update(data);
  },

  /* ------------------------------ DELETE BLOG ----------------------------- */

  async delete(id: string) {
    return await db
      .collection(COLLECTION_NAME)
      .doc(id)
      .delete();
  },
};