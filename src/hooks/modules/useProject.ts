import { useEffect, useState } from "react";
import { Project } from "@/server/modules/project/project.types";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const getProjects = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/projects");
      const result = await res.json();
      console.log("result", result);

      setProjects(result.data || []);
    } catch (error) {
        console.error("Error fetching projects API:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const createProject = async (data: Project) => {
    try {
        await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        });

        await getProjects();
    } catch (error) {
        console.error("Error creating project API:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    try {
      await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      await getProjects();
    } catch (error) {
      console.error("Error updating project API:", error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });

      await getProjects();
    } catch (error) {
      console.error("Error deleting project API:", error);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  return {
    projects,
    loading,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};
