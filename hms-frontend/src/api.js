import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",  // Django backend URL
    timeout: 10000,
});

// Add token to all requests (for authentication)
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle token refresh on 401 errors
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refresh_token");
                const response = await axios.post("http://127.0.0.1:8000/api/refresh/", {
                    refresh: refreshToken,
                });
                localStorage.setItem("access_token", response.data.access);
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return API(originalRequest);
            } catch (err) {
                // Redirect to login if refresh fails
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default API;