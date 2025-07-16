import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
});

const openPaths = ["/users/login", "/users/register", "/users/refresh"];

instance.interceptors.request.use((config) => {
  const isPublic = openPaths.some(path => config.url.endsWith(path));
  if (!isPublic) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});


// 🔁 Handle 403 (token expired), auto-refresh, and retry
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post('http://localhost:8080/api/users/refresh', {
          refreshToken: refreshToken,
        });

        const newToken = res.data.token;
        localStorage.setItem('token', newToken);

        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (err) {
        console.error("Refresh token expired. Logging out.");
        // localStorage.clear();
        // window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
