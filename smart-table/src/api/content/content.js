import http from "@/api/http";

const createProject = async (projectName) => {
  const { data } = await http.post("create-project", { name: projectName, content: [] });
  return data;
};
