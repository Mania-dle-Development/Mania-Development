import { Link } from "react-router";

export default function LandingPage() {
	return (
		<div className="px-55 bg-primary-blue min-h-screen min-w-screen">
			<h1>Landing Page</h1>
			<Link to={"/profile"} className="bg-primary-yellow rounded-2xl p-1 my-2">
				To Profile Page
			</Link>
		</div>
	);
}
