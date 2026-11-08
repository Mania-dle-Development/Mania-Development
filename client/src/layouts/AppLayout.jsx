import { Outlet } from "react-router";
import SidebarMenu from "../components/SidebarMenu.jsx";

export default function AppLayout({ children }) {
	return (
		<>
			<SidebarMenu />
			<main>{children || <Outlet />}</main>
		</>
	);
}
