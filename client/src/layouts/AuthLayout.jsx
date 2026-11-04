import { useAuth } from "../contexts/AuthContext";
import { Outlet } from "react-router";

export default function AuthLayout({ children }) {
	const { logout } = useAuth();

	return (
		<div>
			<div className="text-center">
				<h1 className="text-4xl font-pixel">Mania-dle</h1>
				<button onClick={logout} className="px-4 py-2 rounded-2xl bg-primary-blue">
					Logout
				</button>
			</div>
			<main>{children || <Outlet />}</main>
		</div>
	);
}
