import { createBrowserRouter } from "react-router";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LandingPage from "./pages/LandingPage.jsx";

export const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{
				element: <ProtectedRoute />,
				// protected routes
				children: [
					{ path: "profile", element: <div className="px-55">Profile Page</div> },
					{ path: "test", element: <p>Test Protected Route</p> },
				],
			},
			// non-protected routes with sidebar menu (pages accessible to guest)
			{
				path: "non-protected",
				element: <div className="px-55">Non-Protected Page with Sidebar Menu</div>,
			},
		],
	},
	// non-protected routes without sidebar menu (login page, landing page)
	{
		path: "/",
		element: <LandingPage />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "*",
		element: <div className="px-55">404 Not Found</div>,
	},
]);
