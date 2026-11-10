import { createBrowserRouter } from "react-router";
import App from "./App";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import ClassicWordle from "./pages/ClassicWordle"

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
					{ path: "classic", element: <ClassicWordle /> }
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
		path: "*",
		element: <div>404 Not Found</div>,
	},
]);
