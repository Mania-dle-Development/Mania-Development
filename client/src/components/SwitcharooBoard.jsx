import { Fragment } from "react";
import Tile from "./Tile.jsx";
import SwitcharooBoardIcon from "../assets/switcharoo-board-icon.svg";
import SwitcharooSeparator from "../assets/switcharoo-separator.svg";

export default function SwitcharooBoard({ guesses, currentGuess, length, maxGuesses }) {
	// each row is { word, result }: submitted guess, the row being typed, or empty
	const rows = Array.from({ length: maxGuesses }, (_, i) => {
		if (i < guesses.length) return guesses[i];
		if (i === guesses.length) return { word: currentGuess, result: null };
		return { word: "", result: null };
	});

	return (
		// draws the whole wordle board
		<div className="flex flex-col gap-2 sm:gap-3">
			{rows.map((row, r) => (
				<Fragment key={r}>
					<div className="flex gap-2 sm:gap-3">
						{Array.from({ length }, (_, c) => {
							const letter = row.word[c] ?? ""; // render the letter in the spot, or nothing if still blank.
							const status = row.result ? row.result[c] : letter ? "typing" : "empty"; // runs and evaluates each tile in a row on the board
							return <Tile key={c} letter={letter} status={status} />;
						})}
					</div>
					{maxGuesses / 2 === r + 1 && (
						<div className="py-1 flex items-center justify-center w-full">
							<div
								aria-hidden="true"
								className="pointer-events-none absolute top-1/2 -mt-40 left-0 right-0 bottom-0 flex flex-col -z-20"
							>
								<img
									src={SwitcharooSeparator}
									alt="Switcharoo Board Separator"
									className="w-full block shrink-0 -mb-px"
								/>

								<div className="flex-1 w-full bg-[linear-gradient(180deg,#0283B3_34.62%,#E05F8E_67.79%)]" />
							</div>

							<img
								src={SwitcharooBoardIcon}
								alt="Switcharoo Board Icon"
								className="relative size-18 z-1"
							/>
						</div>
					)}
				</Fragment>
			))}
		</div>
	);
}
