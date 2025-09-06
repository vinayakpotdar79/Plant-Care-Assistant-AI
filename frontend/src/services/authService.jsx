import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/";

export const registerUser = async (userData) => {
  console.log(userData)
  const { data } = await axios.post(API_URL + "register", userData);
  return data;
};

export const loginUser = async (userData) => {
  const { data } = await axios.post(API_URL + "login", userData);
  return data;
};
