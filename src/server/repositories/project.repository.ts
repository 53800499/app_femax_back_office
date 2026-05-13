import { db } from "@/server/firebase/admin";
import { Project } from "@/server/modules/project/project.types";

const COLLECTION_NAME = "projects";

export const projectRepository = {
  async getAll(): Promise<Project[]> {
    const snapshot = await db.collection(COLLECTION_NAME).get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
  },

  async create(data: Project) {
    return await db.collection(COLLECTION_NAME).add({
      ...data,
      createdAt: new Date().toISOString(),
    });
  },

  async update(id: string, data: Partial<Project>) {
    return await db.collection(COLLECTION_NAME).doc(id).update(data);
  },

  async delete(id: string) {
    return await db.collection(COLLECTION_NAME).doc(id).delete();
  },
};
