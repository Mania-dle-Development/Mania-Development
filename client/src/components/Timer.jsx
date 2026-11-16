// the stopwatch pill above the board in Clock Mode (should display in minutes:seconds)
export default function Timer({ seconds }) {
	const mins = Math.floor(seconds / 60)
	const secs = String(seconds % 60).padStart(2, "0") // 5 → "05"

	return (
		<div className="flex items-center gap-3 bg-white border-4 border-text rounded-2xl px-8 py-2">
			<ClockIcon className="w-9 h-9 sm:w-10 sm:h-10 text-text" />
			<span className="text-4xl sm:text-5xl font-bold tabular-nums text-text">
				{mins}:{secs}
			</span>
		</div>
	)
}

// simple clock outline: a circle + two hands, drawn in the current text color
function ClockIcon({ className }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className} aria-hidden="true">
			<circle cx="12" cy="12" r="10" />
			<path d="M12 6.5V12l3.5 3.5" />
		</svg>
	)
}
