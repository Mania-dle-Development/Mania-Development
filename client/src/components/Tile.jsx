export default function Tile({ mode, children }) {
	if (mode === "correct")
		return (
			<div className="size-25 flex items-center justify-center rounded-[5px] border-[5px] border-solid border-[#1D5138] bg-[#61E05F] box-border">
				<span class="font-sans font-normal text-[4.688rem] leading-none uppercase select-none text-[#184736]">
					{children}
				</span>
			</div>
		);
	else if (mode === "wrong")
		return (
			<div className="size-25 flex items-center justify-center rounded-[5px] border-[5px] border-solid border-[#40422D] bg-[#FFCA3B] box-border">
				<span class="font-sans font-normal text-[4.688rem] leading-none uppercase select-none text-[#40422D]">
					{children}
				</span>
			</div>
		);

	return (
		<div className="size-25 flex items-center justify-center rounded-[5px] border-[5px] border-solid border-[#001428] bg-[#001428BF] box-border">
			<span class="font-sans font-normal text-[4.688rem] leading-none uppercase select-none text-[#F2F3F4]">
				{children}
			</span>
		</div>
	);
}
