// poiService.js
import axios from './axiosInstance';

export const getAllPois = () => axios.get(`/pois`);
export const createPoi = (poiData) => axios.post(`/pois`, poiData);
export const getPoisByRoute = (routeId) => axios.get(`/pois/route/${routeId}`);
