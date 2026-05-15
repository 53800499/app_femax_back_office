
import { BlogType } from "@/server/modules/blog/blog.types";
import { blogRepository } from "@/server/repositories/blog.repository";

export const blogService = {
  /* ------------------------------ GET BLOGS ----------------------------- */

  async getBlogs() {
    return await blogRepository.getAll();
  },

  /* ------------------------------ CREATE BLOG ----------------------------- */

  async createBlog(data: BlogType) {
    if (
      !data.title ||
      !data.category ||
      !data.author ||
      !data.content
    ) {
      throw new Error(
        "Missing required fields"
      );
    }

    return await blogRepository.create(data);
  },

  /* ------------------------------ UPDATE BLOG ----------------------------- */

  async updateBlog(
    id: string,
    data: Partial<BlogType>
  ) {
    if (!id) {
      throw new Error(
        "Blog ID is required"
      );
    }

    return await blogRepository.update(
      id,
      data
    );
  },

  /* ------------------------------ DELETE BLOG ----------------------------- */

  async deleteBlog(id: string) {
    if (!id) {
      throw new Error(
        "Blog ID is required"
      );
    }

    return await blogRepository.delete(id);
  },
};