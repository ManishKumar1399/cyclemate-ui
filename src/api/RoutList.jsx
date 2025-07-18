import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

export default function RoutesList() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    axios.get('/routes')
      .then(res => setRoutes(res.data))
      .catch(err => console.error('Error fetching routes:', err));
  }, []);

  return (
    <div>
      <h3>Your Routes</h3>
      <ul>
        {routes.map(route => (
          <li key={route.id}>
            {route.startLocation} → {route.endLocation} ({route.distanceKm} km)
          </li>
        ))}
      </ul>
    </div>
  );
}
