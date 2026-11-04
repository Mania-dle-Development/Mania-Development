import { Outlet, Navigate } from "react-router";
import { useAuth } from "./contexts/AuthContext";

function App() {
	const { user, loading } = useAuth();

	if (loading) return <div>Loading...</div>;

	// if user isn't logged in, navigate them to login page
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}

export default App;
