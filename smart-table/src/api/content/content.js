import http from "@/api/http";

export const createProject = async (project) => {
  const { data } = await http.post("create-project", { project: project });
  return data;
};
export const getProjects = async () => {
  const { data } = await http.get("get-projects");
  return data;
};
export const removeProjects = async (id) => {
  const { data } = await http.delete(`delete-project/${id}`);
  return data;
};
export const addItem = async ({ file, id, projectId }) => {
  const { data } = await http.post(`add-item/${projectId}/${id}/`, file);
  return data;
};
