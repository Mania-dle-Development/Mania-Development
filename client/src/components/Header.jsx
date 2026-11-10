import Tile from "./Tile.jsx";

export default function Header() {
	return (
		<div className="flex flex-col gap-10 items-center">
			<h1 className="font-pixel text-[4rem] md:text-[6rem] lg:text-[7.813rem] font-bold tracking-wider leading-none text-center filter-[drop-shadow(3px_0_0_#001428)_drop-shadow(-3px_0_0_#001428)_drop-shadow(0_3px_0_#001428)_drop-shadow(0_-3px_0_#001428)] md:filter-[drop-shadow(5px_0_0_#001428)_drop-shadow(-5px_0_0_#001428)_drop-shadow(0_5px_0_#001428)_drop-shadow(0_-5px_0_#001428)]">
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
			<p className="text-[1.5rem] md:text-[2.125rem] lg:text-[2.813rem] text-white font-sans">
				Classic Wordle, with a few twists
			</p>
		</div>
	);
}
