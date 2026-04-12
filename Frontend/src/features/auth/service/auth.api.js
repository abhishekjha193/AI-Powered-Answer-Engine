import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true,
}); 

export async function login(username, password) {
    try {
        const response = await api.post("/login", { username, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network error");
    }   
}

export async function register(username, password) {
    try {
        const response = await api.post("/register", { username, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network error");
    }
}

export async function getme() {
    try {
        const response = await api.get("/get-me");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network error");
    }       
}

export async function logout() {
    try {
        const response = await api.post("/logout");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network error");
    }   
}

