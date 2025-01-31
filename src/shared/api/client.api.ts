import axios from "axios";

const BASE_URL = process.env.API_URL || "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: `${BASE_URL}`,
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.get(`${BASE_URL}/api/user/access-token`, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });
        const { token } = response.data;

        localStorage.setItem("accessToken", token);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (error) {
        localStorage.clear();
        if (window.location.pathname !== "/login")
          window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
