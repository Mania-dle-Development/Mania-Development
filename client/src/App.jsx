import { useEffect, useState } from "react";
import Login from "./pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router";

function App() {
	const [user, setUser] = useState(null);
	useEffect(() => {
		const getUser = async () => {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login/success`, {
				credentials: "include",
			});
			const json = await response.json();
			setUser(json.user);
		};
		getUser();
	}, []);

	const logout = async () => {
		const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`;
		const response = await fetch(url, { credentials: "include" });
		await response.json();
		window.location.href = "/";
	};

	const router = createBrowserRouter([
		{
			path: "/",
			element:
				user && user.id ? (
					<div className="text-center">
						<h1 className="text-4xl font-sans">Mania-dle</h1>
						<button onClick={logout} className="px-4 py-2 rounded-2xl bg-primary-blue">
							Logout
						</button>
					</div>
				) : (
					<Login />
				),
		},
	]);
	return <RouterProvider router={router} />;
}

export default App;
