const modeColors = {
	classic: "var(--color-secondary-green)",
	switcharoo: "var(--color-secondary-pink)",
	clock: "var(--color-primary-yellow)",
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function WordleCard({ wordle }) {
	const label = capitalize(wordle.mode);
	const pattern = `${label} Mode ${label} Mode ${label}`;

	return (
		<div className="relative overflow-hidden h-44 border-[3px] border-text rounded-xl bg-white cursor-pointer hover:-translate-y-1 active:translate-y-0.5 transition">
			{/* faded mode text in the background */}
			<div aria-hidden className="absolute -inset-10 -rotate-12 text-4xl font-bold leading-tight opacity-25 select-none" style={{ color: modeColors[wordle.mode] }}>
				{[0, 1, 2, 3].map((i) => (
					<p key={i} className="whitespace-nowrap">{pattern}</p>
				))}
			</div>
			<div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to bottom, transparent, white 65%)" }} />

			<div className="absolute bottom-0 left-0 p-6">
				<p className="text-2xl font-bold truncate">{wordle.creator} - Wordle #{wordle.id}</p>
				<p className="text-lg">{wordle.letters} letters - {wordle.plays} {wordle.plays === 1 ? "play" : "plays"}</p>
			</div>
		</div>
	);
}