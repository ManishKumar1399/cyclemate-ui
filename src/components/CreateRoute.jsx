import { useState } from 'react';
import axios from '../api/axiosInstance';

export default function CreateRoute() {
  const [route, setRoute] = useState({
    startLocation: '',
    endLocation: '',
    distanceKm: '',
    elevationGain: '',
    trafficScore: '',
    mapPath: '',
  });

  const handleChange = e => {
    setRoute({ ...route, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');

    try {
      await axios.post(`/routes?userId=${userId}`, route);
      alert('Route created!');
    } catch (err) {
      console.error('Error creating route:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Route</h3>
      <input name="startLocation" placeholder="Start" onChange={handleChange} />
      <input name="endLocation" placeholder="End" onChange={handleChange} />
      <input name="distanceKm" placeholder="Distance" onChange={handleChange} />
      <input name="elevationGain" placeholder="Elevation" onChange={handleChange} />
      <input name="trafficScore" placeholder="Traffic Score" onChange={handleChange} />
      <input name="mapPath" placeholder="Map Path (JSON/coords)" onChange={handleChange} />
      <button type="submit">Save</button>
    </form>
  );
}
