import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with webpack
// This is needed because webpack handles assets differently
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const RouteMap = ({ routes, onRouteClick }) => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  
  // Center map on India (approximate center coordinates)
  const indiaCenter = [20.5937, 78.9629];
  const defaultZoom = 5;
  
  // Generate a random color for each route
  const getRouteColor = (index) => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33A8', '#33FFF6', '#FFD133'];
    return colors[index % colors.length];
  };
  
  // Convert string coordinates to array of [lat, lng]
  const parseMapPath = (mapPathString) => {
    try {
      // Guard: Empty or invalid input
      if (!mapPathString || mapPathString.trim() === '') return [];

      // Try parsing
      const coordinates = JSON.parse(mapPathString);

      // Optional: Validate format
      if (!Array.isArray(coordinates)) return [];

      return coordinates;
    } catch (error) {
      console.error("Error parsing map path:", error);
      return [];
    }
  };
  
  const handleRouteClick = (route) => {
    setSelectedRoute(route);
    if (onRouteClick) {
      onRouteClick(route);
    }
  };
  
  return (
    <div style={styles.mapContainer}>
      <MapContainer 
        center={indiaCenter} 
        zoom={defaultZoom} 
        style={styles.map}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {routes && routes.map((route, index) => {
          const positions = parseMapPath(route.mapPath);
          return positions.length > 0 ? (
            <Polyline
              key={route.id || index}
              positions={positions}
              pathOptions={{ 
                color: getRouteColor(index),
                weight: 5,
                opacity: 0.7,
                // Highlight the selected route
                ...(selectedRoute && selectedRoute.id === route.id ? 
                  { weight: 8, opacity: 1 } : {})
              }}
              eventHandlers={{
                click: () => handleRouteClick(route)
              }}
            >
              <Tooltip sticky>
                <div>
                  <strong>{route.startLocation} to {route.endLocation}</strong>
                  <br />
                  Distance: {route.distanceKm} km
                </div>
              </Tooltip>
              <Popup>
                <div style={styles.popup}>
                  <h3>{route.startLocation} to {route.endLocation}</h3>
                  <p>Distance: {route.distanceKm} km</p>
                  <p>Elevation Gain: {route.elevationGain} m</p>
                  <p>Traffic Score: {route.trafficScore}/5</p>
                  <button 
                    style={styles.viewButton}
                    onClick={() => handleRouteClick(route)}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Polyline>
          ) : null;
        })}
      </MapContainer>
    </div>
  );
};

const styles = {
  mapContainer: {
    width: '100%',
    height: '100%',
    minHeight: '400px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  map: {
    width: '100%',
    height: '100%',
    minHeight: '400px',
  },
  popup: {
    padding: '5px',
    maxWidth: '250px',
  },
  viewButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
    fontWeight: 'bold',
  }
};

export default RouteMap;