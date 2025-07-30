import { useState } from 'react';
import { useLocationTracker } from '../hooks/useLocationTracker';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import { createRoute } from '../api/routeService';

// Optional helper to calculate distance
function calculateDistance(coords) {
  if (coords.length < 2) return 0;

  const toRad = x => (x * Math.PI) / 180;
  const R = 6371; // km

  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    const [lat1, lon1] = coords[i - 1];
    const [lat2, lon2] = coords[i];
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += R * c;
  }

  return total;
}

export default function CreateRoute() {
  const [tracking, setTracking] = useState(false);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const path = useLocationTracker(tracking);

  const startRide = () => setTracking(true);
  const endRide = () => setTracking(false);

  const saveRide = async () => {
    const userId = localStorage.getItem('userId');

    const route = {
      startLocation,
      endLocation,
      distanceKm: calculateDistance(path).toFixed(2), // You can improve this later
      elevationGain: '0', // Placeholder
      trafficScore: '2', // Placeholder
      mapPath: JSON.stringify(path),
    };

    try {
      await createRoute(route, userId);
      alert('Route saved!');
    } catch (err) {
      console.error('Error saving route:', err);
    }
  };

  return (
    <div>
      <h3>Create Route with GPS Tracking</h3>
      <input value={startLocation} onChange={e => setStartLocation(e.target.value)} placeholder="Start Location" />
      <input value={endLocation} onChange={e => setEndLocation(e.target.value)} placeholder="End Location" />
      {!tracking ? (
        <button onClick={startRide}>Start Ride</button>
      ) : (
        <button onClick={endRide}>End Ride</button>
      )}
      <button onClick={saveRide} disabled={path.length < 2}>Save Route</button>

      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "400px", marginTop: 20 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {path.length > 0 && <Polyline positions={path} color="blue" />}
        {path.length > 0 && <Marker position={path[0]} />}
      </MapContainer>
    </div>
  );
}