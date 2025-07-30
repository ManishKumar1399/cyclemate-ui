// hooks/useLocationTracker.js
import { useEffect, useState, useRef } from 'react';

export function useLocationTracker(track = false) {
  const [path, setPath] = useState([]);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (track && navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setPath(prev => [...prev, [latitude, longitude]]);
        },
        error => console.error('Geolocation error:', error),
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [track]);

  return path;
}

