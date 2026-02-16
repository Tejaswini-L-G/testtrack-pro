import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000"
});

// Auto attach access token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Auto refresh expired token
instance.interceptors.response.use(
  (response) => response,
  async (error) => {

    if (error.response?.status === 403) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axios.post(
          "http://localhost:5000/refresh-token",
          { refreshToken }
        );

        localStorage.setItem("token", res.data.accessToken);

        error.config.headers.Authorization =
          `Bearer ${res.data.accessToken}`;

        return axios(error.config);

      } catch {
        localStorage.clear();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
