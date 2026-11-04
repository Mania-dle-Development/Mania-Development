import { Link } from "react-router";

export default function Login() {
	const AUTH_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth/github`;
	return (
		<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<Link to={AUTH_URL}>
				<button className="px-4 py-2 rounded-2xl bg-primary-blue">Login via Github</button>
			</Link>
		</div>
	);
}
