// src/components/Dashboard.js
import { useEffect, useState } from "react";
import { getUserFromToken } from '../utils/auth';
import { getAllPois } from '../api/poiService';
import { getRidesByUser } from '../api/rideService';
import { getUserRoutes } from "../api/routeService";
import RouteManager from './RouteManager';
import CreateRoute from './CreateRoute';
import RouteMap from './RouteMap';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [pois, setPois] = useState([]);
  const [rides, setRides] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stats, setStats] = useState({
    totalDistance: 0,
    totalRides: 0,
    totalRoutes: 0,
    totalPois: 0
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const userData = getUserFromToken(storedToken);
      if (userData && userData.userId) {
        setUser(userData);
        localStorage.setItem("userId", userData.userId);
      } else {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    
    setIsLoading(true);
    
    // Fetch all data in parallel
    Promise.all([
      getRidesByUser(user.userId).catch(err => {
        console.error("Ride fetch error:", err);
        return { data: [] };
      }),
      getAllPois().catch(err => {
        console.error("POI fetch error:", err);
        return { data: [] };
      }),
      getUserRoutes().catch(err => {
        console.error("Route fetch error:", err);
        return { data: [] };
      })
    ]).then(([ridesRes, poisRes, routesRes]) => {
      const ridesData = ridesRes.data || [];
      const poisData = poisRes.data || [];
      const routesData = routesRes.data || [];
      
      setRides(ridesData);
      setPois(poisData);
      setRoutes(routesData);
      
      // Calculate stats
      const totalDistance = ridesData.reduce((sum, ride) => sum + (parseFloat(ride.distance) || 0), 0);
      
      setStats({
        totalDistance: totalDistance.toFixed(1),
        totalRides: ridesData.length,
        totalRoutes: routesData.length,
        totalPois: poisData.length
      });
      
      setIsLoading(false);
    });
  }, [user]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading your cycling data...</p>
      </div>
    );
  }

  // Function to get responsive styles based on window width
  const getResponsiveStyles = () => {
    // Check if window is available (for SSR compatibility)
    if (typeof window === 'undefined') return {};
    
    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    
    return {
      pageContainer: {
        // No changes needed - flex column works for all devices
      },
      header: {
        padding: isMobile ? '0.75rem 1rem' : '1rem 2rem',
      },
      headerContent: {
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? '0.5rem' : '0',
      },
      logo: {
        fontSize: isMobile ? '1.5rem' : '1.8rem',
      },
      mainContent: {
        flexDirection: isMobile ? 'column' : 'row',
        padding: isMobile ? '1rem' : '2rem',
      },
      sidebar: {
        width: isMobile ? '100%' : (isTablet ? '180px' : '220px'),
        marginRight: isMobile ? '0' : '2rem',
        marginBottom: isMobile ? '1rem' : '0',
      },
      nav: {
        flexDirection: isMobile ? 'row' : 'column',
        overflowX: isMobile ? 'auto' : 'visible',
        position: isMobile ? 'relative' : 'sticky',
        gap: isMobile ? '0.25rem' : '0.5rem',
        padding: isMobile ? '0.5rem 0' : '0',
      },
      navButton: {
        padding: isMobile ? '0.5rem 0.75rem' : '0.8rem 1rem',
        whiteSpace: isMobile ? 'nowrap' : 'normal',
        fontSize: isMobile ? '0.9rem' : '1rem',
      },
      contentArea: {
        padding: isMobile ? '1rem' : '2rem',
      },
      statsContainer: {
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
      },
      heroSection: {
        height: isMobile ? '150px' : '200px',
      },
      routeGrid: {
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
      },
      poiGrid: {
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(250px, 1fr))',
      },
      rideCardDetails: {
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '1rem' : '2rem',
      },
      // Map related responsive styles
      routeMapContainer: isMobile ? {
        flexDirection: 'column',
        height: 'auto',
      } : {},
      routeDetailsSection: isMobile ? {
        marginTop: '15px',
      } : {},
    };
  };

  // Get responsive styles
  const responsiveStyles = getResponsiveStyles();

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <header style={{...styles.header, ...responsiveStyles.header}}>
        <div style={{...styles.headerContent, ...responsiveStyles.headerContent}}>
          <h1 style={{...styles.logo, ...responsiveStyles.logo}}>🚴‍♂️ CycleMate</h1>
          <div style={styles.userSection}>
            <span style={styles.welcomeText}>Welcome, {user?.email || 'Cyclist'}</span>
            <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{...styles.mainContent, ...responsiveStyles.mainContent}}>
        {/* Sidebar */}
        <aside style={{...styles.sidebar, ...responsiveStyles.sidebar}}>
          <nav style={{...styles.nav, ...responsiveStyles.nav}}>
            <button 
              style={activeTab === 'overview' ? 
                {...styles.navButton, ...styles.activeNavButton, ...responsiveStyles.navButton} : 
                {...styles.navButton, ...responsiveStyles.navButton}}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              style={activeTab === 'routes' ? 
                {...styles.navButton, ...styles.activeNavButton, ...responsiveStyles.navButton} : 
                {...styles.navButton, ...responsiveStyles.navButton}}
              onClick={() => setActiveTab('routes')}
            >
              Routes
            </button>
            <button 
              style={activeTab === 'rides' ? 
                {...styles.navButton, ...styles.activeNavButton, ...responsiveStyles.navButton} : 
                {...styles.navButton, ...responsiveStyles.navButton}}
              onClick={() => setActiveTab('rides')}
            >
              Ride History
            </button>
            <button 
              style={activeTab === 'pois' ? 
                {...styles.navButton, ...styles.activeNavButton, ...responsiveStyles.navButton} : 
                {...styles.navButton, ...responsiveStyles.navButton}}
              onClick={() => setActiveTab('pois')}
            >
              Points of Interest
            </button>
            <button 
              style={activeTab === 'create' ? 
                {...styles.navButton, ...styles.activeNavButton, ...responsiveStyles.navButton} : 
                {...styles.navButton, ...responsiveStyles.navButton}}
              onClick={() => setActiveTab('create')}
            >
              Create Route
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <section style={{...styles.contentArea, ...responsiveStyles.contentArea}}>
          {activeTab === 'overview' && (
            <div>
              <div style={{...styles.heroSection, ...responsiveStyles.heroSection}}>
                <div style={styles.heroContent}>
                  <h2 style={styles.heroTitle}>Your Cycling Journey</h2>
                  <p style={styles.heroSubtitle}>Track, discover, and enjoy your rides</p>
                </div>
              </div>
              
              <div style={{...styles.statsContainer, ...responsiveStyles.statsContainer}}>
                <div style={styles.statCard}>
                  <h3 style={styles.statValue}>{stats.totalDistance} km</h3>
                  <p style={styles.statLabel}>Total Distance</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statValue}>{stats.totalRides}</h3>
                  <p style={styles.statLabel}>Rides Completed</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statValue}>{stats.totalRoutes}</h3>
                  <p style={styles.statLabel}>Saved Routes</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statValue}>{stats.totalPois}</h3>
                  <p style={styles.statLabel}>Points of Interest</p>
                </div>
              </div>
              
              <div style={styles.recentActivitySection}>
                <h3 style={styles.sectionTitle}>Recent Activity</h3>
                {rides.length > 0 ? (
                  <div style={styles.activityList}>
                    {rides.slice(0, 3).map((ride, index) => (
                      <div key={ride.id || index} style={styles.activityCard}>
                        <div style={styles.activityIcon}>🚴</div>
                        <div style={styles.activityDetails}>
                          <h4 style={styles.activityTitle}>{ride.startLocation || 'Unknown'} to {ride.endLocation || 'Unknown'}</h4>
                          <p style={styles.activityMeta}>{ride.distance || '0'} km • {ride.date || 'Recent ride'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={styles.emptyState}>No recent rides. Time to hit the road!</p>
                )}
              </div>
              
              <div style={styles.routeSuggestionSection}>
                <h3 style={styles.sectionTitle}>Suggested Routes</h3>
                {routes.length > 0 ? (
                  <div style={{...styles.routeGrid, ...responsiveStyles.routeGrid}}>
                    {routes.slice(0, 2).map((route, index) => (
                      <div key={route.id || index} style={styles.routeCard}>
                        <div style={styles.routeCardImage}></div>
                        <div style={styles.routeCardContent}>
                          <h4 style={styles.routeCardTitle}>{route.name || 'Scenic Route'}</h4>
                          <p style={styles.routeCardDetails}>
                            {route.distanceKm || route.distance || '0'} km • {route.elevationGain ? `${route.elevationGain}m elevation` : 'Flat terrain'}
                          </p>
                          <button style={styles.viewRouteBtn}>View Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={styles.emptyState}>No routes available. Create your first route!</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'routes' && (
            <div>
              <h2 style={styles.contentTitle}>Your Routes</h2>
              
              <div style={{...styles.routeMapContainer, ...responsiveStyles.routeMapContainer}}>
                <div style={styles.mapSection}>
                  <RouteMap 
                    routes={routes} 
                    onRouteClick={(route) => setSelectedRoute(route)}
                  />
                </div>
                
                <div style={{...styles.routeDetailsSection, ...responsiveStyles.routeDetailsSection}}>
                  {selectedRoute ? (
                    <div style={styles.selectedRouteDetails}>
                      <h3 style={styles.selectedRouteTitle}>
                        {selectedRoute.startLocation} to {selectedRoute.endLocation}
                      </h3>
                      <div style={styles.routeDetailItem}>
                        <span style={styles.detailLabel}>Distance:</span>
                        <span style={styles.detailValue}>{selectedRoute.distanceKm} km</span>
                      </div>
                      <div style={styles.routeDetailItem}>
                        <span style={styles.detailLabel}>Elevation Gain:</span>
                        <span style={styles.detailValue}>{selectedRoute.elevationGain} m</span>
                      </div>
                      <div style={styles.routeDetailItem}>
                        <span style={styles.detailLabel}>Traffic Score:</span>
                        <span style={styles.detailValue}>{selectedRoute.trafficScore}/5</span>
                      </div>
                      <button style={styles.startRideButton}>
                        Start Ride
                      </button>
                    </div>
                  ) : (
                    <div style={styles.noRouteSelected}>
                      <p>Select a route on the map to view details</p>
                    </div>
                  )}
                </div>
              </div>
              
              <h3 style={styles.routeListTitle}>Manage Routes</h3>
              <RouteManager />
            </div>
          )}

          {activeTab === 'rides' && (
            <div>
              <h2 style={styles.contentTitle}>Ride History</h2>
              {rides.length > 0 ? (
                <div style={styles.ridesList}>
                  {rides.map((ride, index) => (
                    <div key={ride.id || index} style={styles.rideCard}>
                      <div style={styles.rideCardHeader}>
                        <h3 style={styles.rideCardTitle}>{ride.startLocation || 'Unknown'} to {ride.endLocation || 'Unknown'}</h3>
                        <span style={styles.rideCardDate}>{ride.date || 'No date'}</span>
                      </div>
                      <div style={{...styles.rideCardDetails, ...responsiveStyles.rideCardDetails}}>
                        <div style={styles.rideCardStat}>
                          <span style={styles.rideCardStatLabel}>Distance</span>
                          <span style={styles.rideCardStatValue}>{ride.distance || '0'} km</span>
                        </div>
                        {ride.duration && (
                          <div style={styles.rideCardStat}>
                            <span style={styles.rideCardStatLabel}>Duration</span>
                            <span style={styles.rideCardStatValue}>{ride.duration}</span>
                          </div>
                        )}
                        {ride.elevationGain && (
                          <div style={styles.rideCardStat}>
                            <span style={styles.rideCardStatLabel}>Elevation</span>
                            <span style={styles.rideCardStatValue}>{ride.elevationGain}m</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.emptyState}>No ride history available. Start tracking your rides!</p>
              )}
            </div>
          )}

          {activeTab === 'pois' && (
            <div>
              <h2 style={styles.contentTitle}>Points of Interest</h2>
              {pois.length > 0 ? (
                <div style={{...styles.poiGrid, ...responsiveStyles.poiGrid}}>
                  {pois.map((poi, index) => (
                    <div key={poi.id || index} style={styles.poiCard}>
                      <h3 style={styles.poiName}>{poi.name || 'Unnamed POI'}</h3>
                      <p style={styles.poiDescription}>{poi.description || 'No description available'}</p>
                      {poi.routeId && <p style={styles.poiRoute}>On route: {poi.routeId}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.emptyState}>No points of interest found. Add some to your routes!</p>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div>
              <h2 style={styles.contentTitle}>Create New Route</h2>
              <CreateRoute />
            </div>
          )}
        </section>
      </main>

      <footer style={styles.footer}>
        <p>© 2025 CycleMate - Your Perfect Cycling Companion</p>
      </footer>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '1rem 2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  logo: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  welcomeText: {
    fontSize: '1rem',
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    padding: '2rem',
  },
  sidebar: {
    width: '220px',
    marginRight: '2rem',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    position: 'sticky',
    top: '2rem',
  },
  navButton: {
    textAlign: 'left',
    padding: '0.8rem 1rem',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#555',
    transition: 'all 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  activeNavButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    fontWeight: '500',
  },
  contentArea: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  contentTitle: {
    fontSize: '1.8rem',
    marginTop: 0,
    marginBottom: '1.5rem',
    color: '#333',
  },
  heroSection: {
    height: '200px',
    borderRadius: '12px',
    backgroundImage: 'url("https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=1470&auto=format&fit=crop")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '2rem',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
    color: 'white',
  },
  heroTitle: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  heroSubtitle: {
    margin: '0.5rem 0 0 0',
    fontSize: '1.1rem',
    opacity: 0.9,
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  statValue: {
    fontSize: '2rem',
    margin: 0,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: '1rem',
    color: '#666',
    margin: '0.5rem 0 0 0',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#333',
  },
  recentActivitySection: {
    marginBottom: '2rem',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  activityCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  activityIcon: {
    fontSize: '1.8rem',
    marginRight: '1rem',
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  activityMeta: {
    margin: '0.3rem 0 0 0',
    fontSize: '0.9rem',
    color: '#666',
  },
  routeSuggestionSection: {
    marginBottom: '2rem',
  },
  routeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  routeCard: {
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  routeCardImage: {
    height: '160px',
    backgroundColor: '#ddd',
    backgroundImage: 'url("https://images.unsplash.com/photo-1520531158340-44015069e78e?q=80&w=1472&auto=format&fit=crop")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  routeCardContent: {
    padding: '1.5rem',
  },
  routeCardTitle: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: '500',
  },
  routeCardDetails: {
    margin: '0.5rem 0 1rem 0',
    fontSize: '0.9rem',
    color: '#666',
  },
  viewRouteBtn: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  ridesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  rideCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  rideCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  rideCardTitle: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: '500',
  },
  rideCardDate: {
    fontSize: '0.9rem',
    color: '#666',
  },
  rideCardDetails: {
    display: 'flex',
    gap: '2rem',
  },
  rideCardStat: {
    display: 'flex',
    flexDirection: 'column',
  },
  rideCardStatLabel: {
    fontSize: '0.8rem',
    color: '#666',
    marginBottom: '0.3rem',
  },
  rideCardStatValue: {
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  poiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  poiCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  poiName: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
  },
  poiDescription: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.9rem',
    color: '#555',
  },
  poiRoute: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#666',
    fontStyle: 'italic',
  },
  emptyState: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    padding: '1.5rem',
    textAlign: 'center',
    marginTop: 'auto',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #4CAF50',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  // Map related styles
  routeMapContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    marginBottom: '30px',
    height: '400px',
  },
  mapSection: {
    flex: '1 1 60%',
    minHeight: '400px',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  routeDetailsSection: {
    flex: '1 1 40%',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  selectedRouteDetails: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  selectedRouteTitle: {
    fontSize: '1.5rem',
    marginBottom: '15px',
    color: '#2c3e50',
    borderBottom: '2px solid #4CAF50',
    paddingBottom: '10px',
  },
  routeDetailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '10px 0',
    fontSize: '1.1rem',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  detailValue: {
    color: '#2c3e50',
  },
  startRideButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '4px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: 'auto',
    transition: 'background-color 0.3s',
  },
  noRouteSelected: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: '#777',
    fontSize: '1.1rem',
    textAlign: 'center',
  },
  routeListTitle: {
    fontSize: '1.3rem',
    marginBottom: '15px',
    color: '#2c3e50',
  },
};