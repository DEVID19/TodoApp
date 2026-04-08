import api from "./api";

export const fetchTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

export const addTask = async (title, description) => {
  const response = await api.post("/tasks", { title, description });
  return response.data;
};

export const updateTask = async (id, data) => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};

export const removeTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};
