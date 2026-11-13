import useWordle, { MAX_GUESSES } from "../hooks/useWordle";
import SwitcharooBoard from "../components/SwitcharooBoard";
import Keyboard from "../components/Keyboard";

// Container: gets everything from useWordle and passes it down to the presenters
export default function SwitcharooWordle() {
	const {
		guesses,
		currentGuess,
		length,
		status,
		answer,
		error,
		submitting,
		handleKey,
		keyStatuses,
	} = useWordle("switcharoo");

	return (
		<div className="relative min-h-screen flex flex-col items-center gap-4 py-16 isolate">
			<div className="absolute top-0 bottom-0 min-h-screen w-full lg:w-3xl bg-[#0014280D] pointer-events-none -z-10" />
			<SwitcharooBoard
				guesses={guesses}
				currentGuess={currentGuess}
				length={length}
				maxGuesses={MAX_GUESSES}
				switcharoo
			/>
			{/* messages */}
			<div className="h-7 text-center">
				{error && <p className="text-secondary-pink font-semibold">{error}</p>}
				{status === "won" && <p className="text-xl font-bold">You got it! 🎉</p>}
				{status === "lost" && (
					<p className="text-xl font-bold">The word was {answer?.toUpperCase()}</p>
				)}
			</div>
			<Keyboard
				onKey={handleKey}
				keyStatuses={keyStatuses}
				disabled={submitting || status !== "playing"}
				bg
			/>
		</div>
	);
}
