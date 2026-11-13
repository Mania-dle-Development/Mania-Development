import { useEffect } from "react";
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

	// scrolls page to top so user won't start halfway down the page after redirect
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<>
			{status === "playing" && guesses.length === MAX_GUESSES / 2 && (
				<div className="absolute top-[35%] md:top-[45%] 2xl:top-2/5 left-1/2 -translate-x-1/2 translate-y-[-65%] md:translate-y-[-55%] 2xl:-translate-y-3/5 pointer-events-none z-50">
					<span className="animate-pop-fade font-pixel text-6xl md:text-7xl lg:text-8xl font-bold text-white [-webkit-text-stroke:6px_#001428] md:[-webkit-text-stroke:8px_#001428] [paint-order:stroke_fill] text-shadow-lg text-shadow-black">
						Switcharoo!
					</span>
				</div>
			)}
			<div className="relative min-h-screen flex flex-col items-center gap-4 py-16 isolate">
				<title>Switcharoo | Mania-dle</title>
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
		</>
	);
}
