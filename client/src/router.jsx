import { createBrowserRouter } from "react-router";
import App from "./App";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import CreateWordle from "./pages/CreateWordle";
import BrowseWordles from "./pages/BrowseWordles";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				element: <AuthLayout />,
				// protected routes
				children: [
					{ index: true, element: <p>Landing Page</p> },
					{ path: "test", element: <p>Test Protected Route</p> },
				],
			},
		],
	},
	// non-protected routes
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/create",
		element: <CreateWordle />,
	},
	{
		path: "/wordles",
		element: <BrowseWordles />,
	},
	{
		path: "*",
		element: <div>404 Not Found</div>,
	},
]);
