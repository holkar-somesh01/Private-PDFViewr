import axios from 'axios';

const api = axios.create({
  baseURL: `http://${window.location.hostname}:5000/api`, // adjust for production later
  withCredentials: true, // Required to send HTTP-only cookies like refreshToken
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401, we haven't retried yet, and it's not the refresh endpoint itself
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/refresh-token')) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`http://${window.location.hostname}:5000/api/auth/refresh-token`, {}, { withCredentials: true });
        
        if (res.data && res.data.accessToken) {
          localStorage.setItem('token', res.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest); // Retry the original request
        }
      } catch (refreshError) {
        // If refresh fails (e.g. refresh token is expired or missing)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
