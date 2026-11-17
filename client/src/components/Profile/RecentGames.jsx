// label and style for each game mode badge
const MODES = {
	classic: { label: "CLASSIC", style: "bg-[#0014280D] text-text" },
	clock: { label: "CLOCK", style: "bg-primary-yellow text-text" },
	switcharoo: { label: "SWITCHAROO", style: "bg-secondary-pink text-white" },
};

// 163 seconds -> "2:43s"
function formatClock(seconds) {
	const minutes = Math.floor(seconds / 60);
	const remainder = String(seconds % 60).padStart(2, "0");
	return `${minutes}:${remainder}s`;
}

// clock games show a time ("x:xx" for a loss), other modes show guesses out of 6 ("X/6" for a loss)
function formatResult(game) {
	if (game.mode === "clock") {
		return game.won ? formatClock(game.seconds) : "x:xx";
	}
	return `${game.won ? game.guesses : "X"}/6`;
}

// turns an ISO date into "Oct 25"
function formatDay(playedAt) {
	return new Date(playedAt).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
}

export default function RecentGames({ games }) {
	return (
		<section className="flex flex-col gap-2 md:gap-4">
			<h2 className="font-pixel text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] leading-tight">
				RECENT GAMES
			</h2>

			{games.length === 0 ? (
				<p className="text-[1rem] md:text-[1.5rem] lg:text-[2rem]">
					No games yet. Play a round to see it here.
				</p>
			) : (
				<ul>
					{games.map((game) => {
						const mode = MODES[game.mode];
						return (
							<li
								key={`${game.playedAt}-${game.word}-${game.mode}`}
								className="flex flex-wrap items-center gap-x-3 gap-y-1 md:gap-x-5 py-2 md:py-3 border-b border-text text-[1rem] md:text-[1.5rem] lg:text-[2rem]"
							>
								<span className="uppercase">{game.word}</span>
								<span
									className={`${mode.style} px-3 md:px-4 rounded-full border-[3px] md:border-4 border-text text-[0.75rem] md:text-[1rem] lg:text-[1.25rem] font-medium`}
								>
									{mode.label}
								</span>
								<span className="ml-auto whitespace-nowrap">
									{formatResult(game)} - {formatDay(game.playedAt)}
								</span>
							</li>
						);
					})}
				</ul>
			)}
		</section>
	);
}
