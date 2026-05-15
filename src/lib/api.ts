class APIService {
  private async request<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        },
        ...options,
      });

      if (!response.ok) {
        let message = "Une erreur est survenue";

        try {
          const errorData = await response.json();
          message = errorData.message || message;
        } catch {
          message = await response.text();
        }

        throw new Error(message);
      }

      /**
       * Cas DELETE sans body
       */
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  get<T>(url: string) {
    return this.request<T>(url, {
      method: "GET",
    });
  }

  post<T>(url: string, data?: unknown) {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put<T>(url: string, data?: unknown) {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  patch<T>(url: string, data?: unknown) {
    return this.request<T>(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  delete<T>(url: string) {
    return this.request<T>(url, {
      method: "DELETE",
    });
  }
}

export const api = new APIService();