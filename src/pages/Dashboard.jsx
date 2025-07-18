import RoutesList from "../components/RoutesList";
import CreateRoute from "../components/CreateRoute";
import RideHistory from "../components/rideHistory";

export default function Dashboard() {
  return (
    <div>
      <h2>🚴 Dashboard</h2>
      <CreateRoute />
      <RoutesList />
      <RideHistory />
    </div>
  );
}
