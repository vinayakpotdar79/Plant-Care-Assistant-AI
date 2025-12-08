import API from "./api";

export const registerUser = async (userData) => {
  const { data } = await API.post("/auth/register", userData);
  return data;
};

export const loginUser = async (userData) => {
  const { data } = await API.post("/auth/login", userData);
  return data;
};
