import api from "./api";
import * as SecureStore from "expo-secure-store";

export const signupUser = async (name, email, password) => {
  const response = await api.post("/auth/signup", { name, email, password });

  await SecureStore.setItemAsync("token", response.data.token);
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });

  await SecureStore.setItemAsync("token", response.data.token);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  await SecureStore.deleteItemAsync("token");
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
