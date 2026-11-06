import Header from "../components/Header.jsx";

export default function Login() {
	const AUTH_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth/github`;
	return (
		<main className="bg-[#0283B3] min-h-screen min-w-screen">
			<title>Login | Mania-dle</title>
			<div className="mx-55 min-h-screen bg-[#0014280D]">
				<div className="pt-20 flex flex-col gap-8 items-center text-sans">
					<Header />
					<div className="flex flex-col gap-6 items-center">
						{/* redirects the user to login with github */}
						<a href={AUTH_URL}>
							<button className="w-132 h-25 rounded-[1.25rem] text-[2.5rem] bg-[#001428] hover:bg-[#012549] text-white hover:text-[#dadada] font-sans cursor-pointer">
								Login in with Github
							</button>
						</a>
						<button className="w-132 h-25 rounded-[1.25rem] inline-block text-[2.75rem] border-[#001428] border-4 bg-white hover:bg-[#dadada] text-white hover:text-[#dadada] font-sans cursor-pointer">
							<span className="[-webkit-text-stroke:8px_#001428] [paint-order:stroke_fill]">
								Play as Guest
							</span>
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
