import axios from "axios";

//communication with the server
export const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000",
  timeout: 10000,
});
