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
export const updateItem = async ({ file, id, projectId }) => {
  const { data } = await http.put(`update-item/${projectId}/${id}/`, file);
  return data;
};
export const slideItem = async ({ id, projectId, direction }) => {
  const { data } = await http.put(`slide-item/${projectId}/${id}/${direction}`);
  return data;
};
export const removeItem = async ({ id, projectId }) => {
  const { data } = await http.delete(`remove-item/${projectId}/${id}/`);
  return data;
};
