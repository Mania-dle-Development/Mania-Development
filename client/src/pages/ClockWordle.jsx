import { useState, useEffect } from "react"
import useWordle, { MAX_GUESSES } from "../hooks/useWordle"
import useStopwatch from "../hooks/useStopwatch"
import Board from "../components/Board"
import Keyboard from "../components/Keyboard"
import Timer from "../components/Timer"

const API = `${import.meta.env.VITE_BACKEND_URL}/api/wordles`

// same game as Classic (useWordle hook) + a stopwatch that times how long you take
export default function ClockWordle() {
	const { wordleId, guesses, currentGuess, length, status, answer, timeMs, error, submitting, handleKey, keyStatuses } =
		useWordle("clock")

	const [started, setStarted] = useState(false)

	// start at the top of the page
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	// start the stopwatch on the first letter typed (physical OR on-screen keyboard).
	// once started (on any first key pressed), it stays started,
	// so typing a letter and deleting it doesn't stop the clock
	if (!started && (currentGuess.length > 0 || guesses.length > 0)) {
		setStarted(true)
	}

	// send the server OUR start time, so the saved time matches the stopwatch.
	// fire-and-forget: the server only keeps the first start (safe if this runs twice),
	// and if this request fails, the server starts the clock on the first guess instead
	useEffect(() => {
		if (!started || !wordleId) return
		fetch(`${API}/clock/${wordleId}/start`, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ startedAt: Date.now() }),
		}).catch(() => {})
	}, [started, wordleId])

	// live stopwatch while playing; once the game ends, show the server's final time
	// so what the user sees is exactly what gets saved
	const liveSeconds = useStopwatch(started && status === "playing")
	const seconds = timeMs != null ? Math.floor(timeMs / 1000) : liveSeconds
	const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`

	return (
		<div className="min-h-screen bg-linear-to-b from-clock-top to-clock-bottom">
			<title>Clock | Mania-dle</title>
			<div className="min-h-screen max-w-3xl mx-auto bg-text/5 flex flex-col items-center gap-6 py-12">
				<Timer seconds={seconds} />

				<Board guesses={guesses} currentGuess={currentGuess} length={length} maxGuesses={MAX_GUESSES} />

				{/* messages */}
				<div className="h-7 text-center text-white">
					{error && <p className="font-semibold">{error}</p>}
					{status === "won" && <p className="text-xl font-bold">Solved in {time}! 🎉</p>}
					{status === "lost" && <p className="text-xl font-bold">The word was {answer?.toUpperCase()}</p>}
				</div>

				{/* white panel around the keyboard, like the Figma wireframe */}
				<div className="w-full max-w-xl bg-white border-4 border-text rounded-3xl py-4 sm:py-6">
					<Keyboard
						onKey={handleKey}
						keyStatuses={keyStatuses}
						disabled={submitting || status !== "playing"}
					/>
				</div>
			</div>
		</div>
	)
}
