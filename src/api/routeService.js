// src/services/routeService.js
import axios from './axiosInstance';

export const getUserRoutes = () => axios.get('/routes');
export const getRouteById = (id) => axios.get(`/routes/${id}`);
export const createRoute = (routeData, userId) => axios.post(`/routes?userId=${userId}`, routeData);
export const deleteRoute = (id) => axios.delete(`/routes/${id}`);
