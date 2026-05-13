export interface Project {
  id?: string;
  title: string;
  category: string;
  client: string;
  description: string;
  image: string;
  link?: string;
  status: string;
  createdAt?: string;
}

export type ProjectType = {
  id?: string;
  title: string;
  category: string;
  client: string;
  description: string;
  image: string;
  link?: string;
  status: string;
  createdAt?: string;
};