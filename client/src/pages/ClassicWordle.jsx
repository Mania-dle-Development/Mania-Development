import useWordle, { MAX_GUESSES } from "../hooks/useWordle";
import Board from "../components/Board";
import Keyboard from "../components/Keyboard";

// Container: gets everything from useWordle and passes it down to the presenters
export default function ClassicWordle() {
	const { guesses, currentGuess, length, status, answer, error, submitting, handleKey, keyStatuses } =
		useWordle();

	return (
		<div className="min-h-screen max-w-3xl mx-auto bg-board flex flex-col items-center gap-8 py-16">
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
