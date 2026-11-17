import { useParams } from "react-router"
import useWordle, { MAX_GUESSES } from "../hooks/useWordle";
import Board from "../components/Wordle/Board.jsx";
import Keyboard from "../components/Wordle/Keyboard.jsx";

// Container: gets everything from useWordle and passes it down to the presenters
export default function ClassicWordle() {
	const { id } = useParams() // /classic/42 loads "42" (custom wordle), /classic is undefined (random Wordle)
	const { guesses, currentGuess, length, status, answer, error, submitting, handleKey, keyStatuses } =
		useWordle("classic", id)

	return (
		<div className="min-h-screen max-w-3xl mx-auto bg-board flex flex-col items-center gap-8 py-16">
			<title>Classic | Mania-dle</title>
			<Board guesses={guesses} currentGuess={currentGuess} length={length} maxGuesses={MAX_GUESSES} />

			{/* messages */}
			<div className="h-7 text-center">
				{error && <p className="text-secondary-pink font-semibold">{error}</p>}
				{status === "won" && <p className="text-xl font-bold">You got it! 🎉</p>}
				{status === "lost" && <p className="text-xl font-bold">The word was {answer?.toUpperCase()}</p>}
			</div>

			<Keyboard
				onKey={handleKey}
				keyStatuses={keyStatuses}
				disabled={submitting || status !== "playing"}
			/>
		</div>
	);
}
