import SwitcharooIcon from "../assets/switcharoo-icon-bw.svg";
import ClockIcon from "../assets/clock-icon-bw.svg";
import GalleryIcon from "../assets/gallery-icon-bw.svg";
import { useNavigate } from "react-router";

export default function ModeButton({ mode }) {
	const navigate = useNavigate();
	if (mode === "classic")
		return (
			// === TODO ===
			// Update link once details are finalized
			<button
				onClick={() => navigate("/classic")}
				className="cursor-pointer border-[5px] border-[#001428] bg-[#61E05F] hover:bg-[#86ff84] rounded-[6.25rem] w-full py-4 lg:py-5 font-sans text-[1.25rem] md:text-[2rem] lg:text-[2.5rem] text-left"
			>
				<div className="flex flex-col px-10 md:px-12 lg:px-14">
					<p className="font-extrabold">Classic</p>
					<p>6 guesses. The original.</p>
				</div>
			</button>
		);
	else if (mode === "switcharoo")
		return (
			// === TODO ===
			// Update link once details are finalized
			<button
				onClick={() => navigate("/switcharoo")}
				className="group flex flex-row items-stretch cursor-pointer bg-[#E05F8E80] hover:bg-[#ff86b280] rounded-[6.25rem] overflow-hidden w-full font-sans text-[1.25rem] md:text-[2rem] lg:text-[2.5rem] text-left"
			>
				<div className="flex flex-col justify-center px-10 md:px-12 lg:px-14 w-3/4 lg:w-[4/5] xl:w-[84%] bg-[#E05F8E] group-hover:bg-[#ff86b2] rounded-[6.25rem] py-4 lg:py-5 border-[5px] border-[#001428]">
					<p className="font-extrabold">Switcharoo</p>
					<p>The word shuffles mid-game.</p>
				</div>
				<div className="flex-1 flex items-center justify-end -ml-24 px-4 md:px-10 lg:px-12 border-y-[5px] border-r-[5px] rounded-r-[6.25rem]">
					<img
						src={SwitcharooIcon}
						alt="Switcharoo Mode Icon"
						className="size-10 md:size-15 lg:size-20 2xl:size-25"
					/>
				</div>
			</button>
		);
	else if (mode === "clock")
		return (
			// === TODO ===
			// Update link once details are finalized
			<button
				onClick={() => navigate("/clock")}
				className="group flex flex-row items-stretch cursor-pointer bg-[#FFCA3B80] hover:bg-[#fed76c80] rounded-[6.25rem] overflow-hidden w-full font-sans text-[1.25rem] md:text-[2rem] lg:text-[2.5rem] text-left"
			>
				<div className="flex flex-col justify-center px-10 md:px-12 lg:px-14 w-3/4 lg:w-[4/5] xl:w-[84%] bg-[#FFCA3B] group-hover:bg-[#fed76c] rounded-[6.25rem] py-4 lg:py-5 border-[5px] border-[#001428]">
					<p className="font-extrabold">Clock</p>
					<p>Race the timer.</p>
				</div>
				<div className="flex-1 flex items-center justify-end -ml-24 px-4 md:px-10 lg:px-12 border-y-[5px] border-r-[5px] rounded-r-[6.25rem]">
					<img
						src={ClockIcon}
						alt="Clock Mode Icon"
						className="size-10 md:size-15 lg:size-20 2xl:size-25"
					/>
				</div>
			</button>
		);
	return (
		// === TODO ===
		// Update link once details are finalized
		<button
			onClick={() => navigate("/gallery")}
			className="group flex flex-row items-stretch cursor-pointer bg-[#0283B380] hover:bg-[#3ca1c580] rounded-[6.25rem] overflow-hidden w-full font-sans text-[1.25rem] md:text-[2rem] lg:text-[2.5rem] text-left"
		>
			<div className="flex flex-col justify-center px-10 md:px-12 lg:px-14 w-3/4 lg:w-[4/5] xl:w-[84%] bg-[#0283B3] group-hover:bg-[#3ca1c5] rounded-[6.25rem] py-4 lg:py-5 border-[5px] border-[#001428] text-white">
				<p className="font-extrabold">Gallery</p>
				<p>Try out other puzzles.</p>
			</div>
			<div className="flex-1 flex items-center justify-end -ml-24 px-4 md:px-10 lg:px-12 border-y-[5px] border-r-[5px] rounded-r-[6.25rem]">
				<img
					src={GalleryIcon}
					alt="Gallery Icon"
					className="size-10 md:size-15 lg:size-20 2xl:size-25"
				/>
			</div>
		</button>
	);
}
