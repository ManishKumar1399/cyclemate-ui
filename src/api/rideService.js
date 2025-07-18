// rideService.js
import axios from './axiosInstance';

export const getRidesByUser = (userId) => axios.get(`/rides/user/${userId}`);
export const createRide = (rideData) => axios.post(`/rides`, rideData);
