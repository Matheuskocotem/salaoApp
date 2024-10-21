import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:8001",
});

export default api;