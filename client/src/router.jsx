import { createBrowserRouter } from "react-router";
import KeyById from "./components/KeyById.jsx"
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import ClassicWordle from "./pages/ClassicWordle";
import ClockWordle from "./pages/ClockWordle";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ProfilePage from "./pages/Profile.jsx"
import SwitcharooWordle from "./pages/SwitcharooWordle.jsx";
import CreateWordle from "./pages/CreateWordle";
import BrowseWordles from "./pages/BrowseWordles";

export const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{
				element: <ProtectedRoute />,
				// protected routes
				children: [
					{ path: "profile", element: <ProfilePage/> },
					{ path: "test", element: <p>Test Protected Route</p> },
					{ path: "create", element: <CreateWordle /> },
				],
			},
			// game pages: guests can play, only logged-in users' solves are saved
			// :id? is optional. /classic loads random default word, /classic/42 loads custom wordle #42
			{ path: "classic/:id?", element: <KeyById page={ClassicWordle} /> },
			{ path: "clock/:id?", element: <KeyById page={ClockWordle} /> },
			{ path: "switcharoo", element: <SwitcharooWordle /> },
			// non-protected routes with sidebar menu (pages accessible to guest)
			{
				path: "non-protected",
				element: <div className="px-55">Non-Protected Page with Sidebar Menu</div>,
			},
			{
				path: "wordles",
				element: <BrowseWordles />,
			},
			{
				path: "*",
				element: <div className="px-55">404 Not Found</div>,
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
]);