// this will be an indivdual tile on the Wordle board.
// each row has 5 tiles

const STYLES = {
	correct: "bg-secondary-green text-text",
	present: "bg-primary-yellow text-text",
	absent: "bg-tile-absent text-white",
	typing: "bg-white text-text",
	empty: "bg-tile-empty",
};

// one square on the board
export default function Tile({ letter, status }) {
	return (
		<div
			className={`w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center
				border-4 border-text rounded-sm
				text-3xl sm:text-4xl font-bold uppercase ${STYLES[status]}`}
		>
			{letter}
		</div>
	);
}
