import { Outlet, Navigate } from "react-router";
import { useAuth } from "./contexts/AuthContext";
import LoadingState from "./components/LoadingState";

function App() {
	const { user, loading } = useAuth();

	if (loading) return <LoadingState />;

	// if user isn't logged in, navigate them to login page
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}

export default App;
