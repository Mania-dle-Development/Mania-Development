import { useAuth } from "../contexts/AuthContext";
import { Outlet } from "react-router";

// This is temporary just to ensure everyone can call logout properly
// === TODO ===
// Update design to be sidebar

export default function AuthLayout({ children }) {
	const { logout } = useAuth();

	return (
		<div>
			<div className="absolute top-1/2 left-0 -translate-y-1/2 z-10">
				<button onClick={logout} className="px-4 py-2 rounded-2xl bg-primary-blue">
					Logout
				</button>
			</div>
			<main className="px-55">{children || <Outlet />}</main>
		</div>
	);
}
