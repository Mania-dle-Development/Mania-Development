import { useState, useEffect } from "react";
import BackspaceIcon from "./BackspaceIcon";

// the three rows on a keyboard below
const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

// key colors: same palette as the tiles
// will change as player guesses through the game, and is closer to the answer
const KEY_STYLES = {
	correct: "bg-secondary-green text-text",
	present: "bg-primary-yellow text-text",
	absent: "bg-tile-absent text-white",
	unused: "bg-white text-text",
};

// -- shared "3D key" design: dark border w/ a solid bottom edge, presses down while clicked --
const BASE =
	"h-14 rounded-lg border-2 border-text font-bold uppercase flex items-center justify-center " +
	"active:translate-y-1 active:shadow-none transition-all duration-75 disabled:opacity-60";
const DARK_EDGE = "shadow-[0_4px_0_0_var(--color-text)]";
const YELLOW_EDGE = "shadow-[0_4px_0_0_var(--color-primary-yellow)]";
// same "pushed down" look as :active, applied when the PHYSICAL key is held
const PRESSED = "translate-y-1 shadow-none!";

// -- on-screen keyboard; every click goes through the same handleKey as the physical keyboard --
export default function Keyboard({ onKey, keyStatuses, disabled }) {
	// which physical key is held down right now
	const [pressedKey, setPressedKey] = useState(null);

	useEffect(() => {
		const onDown = (e) => setPressedKey(e.key.toLowerCase())
		const onUp = () => setPressedKey(null)
		window.addEventListener("keydown", onDown)
		window.addEventListener("keyup", onUp)
		return () => {
			window.removeEventListener("keydown", onDown)
			window.removeEventListener("keyup", onUp)
		};
	}, []);

	// extra class for a key that's being held on the physical keyboard
	const pressedClass = (key) => (!disabled && pressedKey === key.toLowerCase() ? PRESSED : "")

	// blur after clicking so pressing physical Enter doesn't "click" the focused button again
	const press = (key) => (e) => {
		e.currentTarget.blur()
		onKey(key)
	};

	return (
		<div className="flex flex-col items-center gap-3 w-full max-w-xl px-2">
			{ROWS.map((row, r) => (
				<div key={r} className="flex gap-1.5 sm:gap-2 w-full justify-center">
					{r === 2 && (
						<button
							onClick={press("Enter")}
							disabled={disabled}
							className={`${BASE} ${YELLOW_EDGE} cursor-pointer px-3 text-xs text-white bg-secondary-pink ${pressedClass("Enter")}`}
						>
							Enter
						</button>
					)}

					{[...row].map((letter) => (
						<button
							key={letter}
							onClick={press(letter)}
							disabled={disabled}
							className={`${BASE} ${DARK_EDGE} cursor-pointer flex-1 max-w-12 text-lg ${KEY_STYLES[keyStatuses[letter] ?? "unused"]} ${pressedClass(letter)}`}
						>
							{letter}
						</button>
					))}

					{r === 2 && (
						<button
							onClick={press("Backspace")}
							disabled={disabled}
							aria-label="Backspace"
							className={`${BASE} ${YELLOW_EDGE} cursor-pointer px-3 text-white bg-secondary-pink ${pressedClass("Backspace")}`}
						>
							<BackspaceIcon className="w-7 h-5" />
						</button>
					)}
				</div>
			))}
		</div>
	);
}
