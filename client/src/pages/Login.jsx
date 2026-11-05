import Tile from "../components/Tile";

export default function Login() {
	const AUTH_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth/github`;
	return (
		<div className="bg-[#0283B3] min-h-screen min-w-screen">
			<div className="mx-55 min-h-screen bg-[#0014280D]">
				<div className="pt-20 flex flex-col gap-8 items-center text-sans">
					<h1 className="font-pixel text-[7.813rem] font-bold tracking-wider leading-none text-center filter-[drop-shadow(5px_0_0_#001428)_drop-shadow(-5px_0_0_#001428)_drop-shadow(0_5px_0_#001428)_drop-shadow(0_-5px_0_#001428)]">
						<span className="bg-[linear-gradient(88.22deg,#61E05F_21.38%,#C7E475_28.82%,#FFCA3B_35.69%,#F29F5C_43.13%,#E05F8E_58.59%,#FFFFFF_61.54%)] bg-clip-text text-transparent">
							MANIA-dle
						</span>
					</h1>
					<div className="flex flex-row gap-8 text-center">
						<Tile mode="correct">P</Tile>
						<Tile mode="wrong">L</Tile>
						<Tile mode="error">A</Tile>
						<Tile mode="correct">Y</Tile>
					</div>
					<p className="text-[2.813rem] text-white">Classic Wordle, with a few twists</p>
					<div className="flex flex-col gap-4 items-center">
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
		</div>
	);
}
