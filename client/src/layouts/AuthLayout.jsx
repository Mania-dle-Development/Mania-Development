import { Outlet } from "react-router";
import SidebarMenu from "../components/SidebarMenu.jsx";

// This is temporary just to ensure everyone can call logout properly
// === TODO ===
// Update design to be sidebar

export default function AuthLayout({ children }) {
	return (
		<div>
			<SidebarMenu />
			<main className="px-55">{children || <Outlet />}</main>
		</div>
	);
}
