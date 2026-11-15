export default function StatCards({
	played,
	solveRate,
	currentStreak,
	bestStreak,
}) {
	// one entry per box, in the order they appear on the page
	const cards = [
		{ label: "played", value: played, color: "bg-white" },
		{ label: "solved", value: `${solveRate}%`, color: "bg-secondary-green" },
		{ label: "streak", value: currentStreak, color: "bg-primary-yellow" },
		{ label: "best streak", value: bestStreak, color: "bg-white" },
	];

	return (
		<section
			aria-label="Stats"
			className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-9"
		>
			{cards.map((card) => (
				<div
					key={card.label}
					className={`${card.color} px-1 py-3 md:py-4 lg:py-5 flex flex-col items-center justify-center text-center rounded-[0.85rem] border-[3px] md:border-4 border-text`}
				>
					<span className="font-bold text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] leading-tight">
						{card.value}
					</span>
					<span className="text-[1rem] md:text-[1.25rem] lg:text-[2rem] leading-tight">
						{card.label}
					</span>
				</div>
			))}
		</section>
	);
}
