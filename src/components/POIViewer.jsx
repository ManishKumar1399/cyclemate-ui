import React, { useEffect, useState } from "react";
import { getAllPois } from "../api/poiService";

const POIViewer = () => {
  const [pois, setPois] = useState([]);
  const [routeId, setRouteId] = useState('');
  const [newPOI, setNewPOI] = useState({ name: '', routeId: '' });

  useEffect(() => {
    getAllPois()
      .then(res => setPois(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleFilter = () => {
    getPoisByRoute(routeId)
      .then(res => setPois(res.data))
      .catch(err => console.error(err));
  };

  const handleAddPoi = () => {
    createPoi(newPOI)
      .then(res => {
        setPois([...pois, res.data]);
        setNewPOI({ name: '', routeId: '' });
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Points of Interest</h2>

      <div className="mb-4">
        <input
          type="text"
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
          placeholder="Filter by Route ID"
          className="border p-2 mr-2"
        />
        <button onClick={handleFilter} className="bg-blue-500 text-white px-4 py-2">Filter</button>
      </div>

      <ul className="mb-4">
        {pois.map((poi, idx) => (
          <li key={idx}>{poi.name} (Route ID: {poi.routeId})</li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold">Add POI</h3>
      <input
        value={newPOI.name}
        onChange={(e) => setNewPOI({ ...newPOI, name: e.target.value })}
        placeholder="POI Name"
        className="border p-2 mr-2"
      />
      <input
        value={newPOI.routeId}
        onChange={(e) => setNewPOI({ ...newPOI, routeId: e.target.value })}
        placeholder="Route ID"
        className="border p-2 mr-2"
      />
      <button onClick={handleAddPoi} className="bg-green-500 text-white px-4 py-2">Add POI</button>
    </div>
  );
};

export default POIViewer;
