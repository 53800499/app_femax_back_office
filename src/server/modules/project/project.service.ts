import { projectRepository } from "@/server/repositories/project.repository";
import { Project } from "@/server/modules/project/project.types";

export const projectService = {
  async getProjects() {
    return await projectRepository.getAll();
  },

  async createProject(data: Project) {
    if (!data.title || !data.description || !data.image) {
      throw new Error("Missing required fields");
    }

    return await projectRepository.create(data);
  },

  async updateProject(id: string, data: Partial<Project>) {
    if (!id) {
      throw new Error("Project ID is required");
    }

    return await projectRepository.update(id, data);
  },

  async deleteProject(id: string) {
    if (!id) {
      throw new Error("Project ID is required");
    }

    return await projectRepository.delete(id);
  },
};
