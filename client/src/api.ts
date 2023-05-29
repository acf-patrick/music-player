import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.API_ENDPOINT || "http://localhost:8000",
});

export default api;
