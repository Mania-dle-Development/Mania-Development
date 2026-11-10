import Header from "../components/Header.jsx";
import { useNavigate } from "react-router";

export default function Login() {
	const AUTH_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth/github`;
	const navigate = useNavigate();
	return (
		<main className="bg-[#0283B3] min-h-screen min-w-screen">
			<title>Login | Mania-dle</title>
			<div className="mx-8 md:mx-25 lg:mx-35 xl:mx-55 min-h-screen bg-[#0014280D]">
				<div className="pt-20 flex flex-col gap-8 items-center text-sans">
					<Header />
					<div className="flex flex-col gap-6 items-center">
						{/* redirects the user to login with github */}
						<a href={AUTH_URL}>
							<button className="w-85 md:w-120 lg:w-132 h-15 md:h-20 lg:h-25 rounded-[1.25rem] text-[2rem] md:text-[2.25rem] lg:text-[2.5rem] bg-[#001428] hover:bg-[#012549] text-white hover:text-[#dadada] font-sans cursor-pointer">
								Login in with Github
							</button>
						</a>
						<button
							onClick={() => navigate("/")}
							className="w-85 md:w-120 lg:w-132 h-15 md:h-20 lg:h-25 rounded-[1.25rem] inline-block text-[2rem] md:text-[2.25rem] lg:text-[2.5rem] border-[#001428] border-2 md:border-4 bg-white hover:bg-[#dadada] text-white hover:text-[#dadada] font-sans cursor-pointer"
						>
							<span className="[-webkit-text-stroke:6px_#001428] md:[-webkit-text-stroke:8px_#001428] [paint-order:stroke_fill]">
								Play as Guest
							</span>
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
