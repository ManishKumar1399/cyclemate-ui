import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

export default function RideHistory() {
const [rides, setRides] = useState([]);
  const [distance, setDistance] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      getRidesByUser(userId)
        .then(res => setRides(res.data))
        .catch(err => console.error(err));
    }
  }, [userId]);

  const handleCreateRide = () => {
    const rideData = { userId, distance };
    createRide(rideData)
      .then(res => {
        setRides([...rides, res.data]);
        setDistance('');
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Ride History</h2>
      <ul className="mb-4">
        {rides.map((ride, idx) => (
          <li key={idx}>Distance: {ride.distance} km</li>
        ))}
      </ul>
      <input
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        placeholder="Distance"
        className="border p-2 mr-2"
      />
      <button onClick={handleCreateRide} className="bg-blue-500 text-white px-4 py-2">Add Ride</button>
    </div>
  );
};
