// src/components/RouteManager.jsx
import React, { useEffect, useState } from 'react';
import {
  getUserRoutes,
  createRoute,
  getRouteById,
  deleteRoute
} from '../api/routeService';

export default function RouteManager() {
  const [routes, setRoutes] = useState([]);
  const [newRouteName, setNewRouteName] = useState('');
  const [expandedRoute, setExpandedRoute] = useState(null);
  const userId = localStorage.getItem('userId');

  const fetchRoutes = async () => {
    try {
      const res = await getUserRoutes();
      setRoutes(res.data);
    } catch (err) {
      console.error("Error fetching routes:", err);
    }
  };

  const handleCreate = async () => {
    if (!newRouteName || !userId) return;
    try {
      await createRoute({ name: newRouteName }, userId);
      setNewRouteName('');
      fetchRoutes();
    } catch (err) {
      console.error("Error creating route:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRoute(id);
      fetchRoutes();
    } catch (err) {
      console.error("Error deleting route:", err);
    }
  };

  const toggleRouteExpand = (routeId) => {
    if (expandedRoute === routeId) {
      setExpandedRoute(null);
    } else {
      setExpandedRoute(routeId);
    }
  };

  // Get traffic score color
  const getTrafficScoreColor = (score) => {
    if (score <= 1) return '#4CAF50'; // Green for low traffic
    if (score <= 3) return '#FFC107'; // Yellow for medium traffic
    return '#F44336'; // Red for high traffic
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🛣️ Manage Routes</h3>
      
      <div style={styles.addRouteForm}>
        <input
          type="text"
          placeholder="New route name"
          value={newRouteName}
          onChange={(e) => setNewRouteName(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleCreate} style={styles.button}>Add Route</button>
      </div>

      <div style={styles.routeGrid}>
        {routes.map(route => (
          <div key={route.id} style={styles.routeCard}>
            <div style={styles.routeCardHeader}>
              <h4 style={styles.routeName}>
                {route.startLocation} to {route.endLocation}
              </h4>
              <div style={styles.routeActions}>
                <button 
                  onClick={() => toggleRouteExpand(route.id)} 
                  style={styles.expandBtn}
                >
                  {expandedRoute === route.id ? '▲' : '▼'}
                </button>
                <button 
                  onClick={() => handleDelete(route.id)} 
                  style={styles.deleteBtn}
                >
                  ❌
                </button>
              </div>
            </div>
            
            <div style={styles.routeBasicInfo}>
              <div style={styles.routeInfoItem}>
                <span style={styles.infoLabel}>Distance:</span>
                <span style={styles.infoValue}>{route.distanceKm} km</span>
              </div>
              
              <div style={styles.routeInfoItem}>
                <span style={styles.infoLabel}>Elevation:</span>
                <span style={styles.infoValue}>{route.elevationGain} m</span>
              </div>
              
              <div style={styles.routeInfoItem}>
                <span style={styles.infoLabel}>Traffic:</span>
                <div style={styles.trafficIndicator}>
                  <div 
                    style={{
                      ...styles.trafficDot,
                      backgroundColor: getTrafficScoreColor(route.trafficScore)
                    }}
                  ></div>
                  <span style={styles.infoValue}>{route.trafficScore}/5</span>
                </div>
              </div>
            </div>
            
            {expandedRoute === route.id && (
              <div style={styles.expandedInfo}>
                <div style={styles.expandedInfoItem}>
                  <span style={styles.expandedInfoLabel}>Start Location:</span>
                  <span style={styles.expandedInfoValue}>{route.startLocation}</span>
                </div>
                <div style={styles.expandedInfoItem}>
                  <span style={styles.expandedInfoLabel}>End Location:</span>
                  <span style={styles.expandedInfoValue}>{route.endLocation}</span>
                </div>
                <div style={styles.expandedInfoItem}>
                  <span style={styles.expandedInfoLabel}>Distance:</span>
                  <span style={styles.expandedInfoValue}>{route.distanceKm} kilometers</span>
                </div>
                <div style={styles.expandedInfoItem}>
                  <span style={styles.expandedInfoLabel}>Elevation Gain:</span>
                  <span style={styles.expandedInfoValue}>{route.elevationGain} meters</span>
                </div>
                <div style={styles.expandedInfoItem}>
                  <span style={styles.expandedInfoLabel}>Traffic Score:</span>
                  <span style={styles.expandedInfoValue}>{route.trafficScore}/5</span>
                </div>
                <button style={styles.viewOnMapBtn}>View on Map</button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {routes.length === 0 && (
        <div style={styles.emptyState}>
          <p>No routes found. Create your first route!</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f8f9fa',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: '1.5rem',
    marginTop: 0,
    marginBottom: '20px',
    color: '#2c3e50',
  },
  addRouteForm: {
    display: 'flex',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    flexGrow: 1,
    minWidth: '200px',
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  routeGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  routeCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'box-shadow 0.3s',
  },
  routeCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  routeName: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#2c3e50',
  },
  routeActions: {
    display: 'flex',
    gap: '8px',
  },
  expandBtn: {
    background: 'none',
    border: 'none',
    color: '#555',
    fontSize: '1rem',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#F44336',
    fontSize: '1rem',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  routeBasicInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '10px',
  },
  routeInfoItem: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '80px',
  },
  infoLabel: {
    fontSize: '0.8rem',
    color: '#666',
    marginBottom: '2px',
  },
  infoValue: {
    fontSize: '1rem',
    color: '#2c3e50',
    fontWeight: '500',
  },
  trafficIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  trafficDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  expandedInfo: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  expandedInfoItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  expandedInfoLabel: {
    color: '#555',
    fontSize: '0.9rem',
  },
  expandedInfoValue: {
    color: '#2c3e50',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  viewOnMapBtn: {
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    alignSelf: 'flex-end',
  },
  emptyState: {
    textAlign: 'center',
    padding: '30px',
    color: '#666',
    backgroundColor: 'white',
    borderRadius: '8px',
    marginTop: '20px',
  },
};
