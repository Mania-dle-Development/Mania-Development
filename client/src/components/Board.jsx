import Tile from "./Tile";

export default function Board({ guesses, currentGuess, length, maxGuesses }) {
	// each row is { word, result }: submitted guess, the row being typed, or empty
	const rows = Array.from({ length: maxGuesses }, (_, i) => {
		if (i < guesses.length) return guesses[i]
		if (i === guesses.length) return { word: currentGuess, result: null }
		return { word: "", result: null }
	});

	return (
		// draws the whole wordle board
		<div className="flex flex-col gap-2 sm:gap-3">
			{rows.map((row, r) => (
				<div key={r} className="flex gap-2 sm:gap-3">
					{Array.from({ length }, (_, c) => {
						const letter = row.word[c] ?? "" // render the letter in the spot, or nothing if still blank.
						const status = row.result ? row.result[c] : letter ? "typing" : "empty" // runs and evaluates each tile in a row on the board
						return <Tile key={c} letter={letter} status={status} />
					})}
				</div>
			))}
		</div>
	);
}
