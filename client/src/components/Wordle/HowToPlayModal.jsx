import { useCallback, useEffect, useState } from "react"

// rules for each game mode
const RULES = {
	classic: {
		title: "Classic",
		steps: [
			"Guess the hidden word in 6 tries.",
			"Green = right letter, right spot.",
			"Yellow = right letter, wrong spot.",
			"Gray = letter isn't in the word.",
		],
	},
	clock: {
		title: "Clock",
		steps: [
			"Same rules as Classic.",
			"The stopwatch starts on your first key press.",
			"Solve it as fast as you can to climb the leaderboard.",
		],
	},
	switcharoo: {
		title: "Switcharoo",
		steps: [
			"Same rules as Classic.",
			"Halfway through your guesses, the word switches!",
			"Use your new clues to find the new word.",
		],
	},
}

// remembers (per browser) which modes the player has already seen the rules for.
// try/catch because localStorage can throw (private browsing, blocked storage)
const storageKey = (mode) => `seenHowToPlay-${mode}`

function hasSeen(mode) {
	try {
		return localStorage.getItem(storageKey(mode)) === "true"
	} catch {
		return false
	}
}

function markSeen(mode) {
	try {
		localStorage.setItem(storageKey(mode), "true")
	} catch {
		// storage blocked: the modal just shows again next time
	}
}

// shows only the first time a player opens each mode
export default function HowToPlayModal({ mode }) {
	const { title, steps } = RULES[mode]
	const [open, setOpen] = useState(() => !hasSeen(mode))

	const onClose = useCallback(() => {
		markSeen(mode)
		setOpen(false)
	}, [mode])

	// capture phase (the "true") runs before useWordle's keydown listener,
	// so keys typed while the modal is open don't reach the game
	useEffect(() => {
		if (!open) return
		const onKey = (e) => {
			e.stopImmediatePropagation()
			if (e.key === "Escape" || e.key === "Enter") onClose()
		}
		window.addEventListener("keydown", onKey, true)
		return () => window.removeEventListener("keydown", onKey, true)
	}, [open, onClose])

	// when closed, show a "?" button so players can reopen the rules anytime
	if (!open) {
		return (
			<button
				onClick={() => setOpen(true)}
				aria-label="How to play"
				title="How to play"
				className="fixed top-5 right-5 z-40 cursor-pointer size-12 rounded-full bg-white border-[3px] border-text text-text text-2xl font-bold hover:brightness-95 active:translate-y-0.5 transition"
			>
				?
			</button>
		)
	}

	return (
		// dark background, clicking it closes the modal
		<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4" onClick={onClose}>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="how-to-play-title"
				className="w-full max-w-lg bg-board border-[3px] border-text rounded-2xl p-8 text-text"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 id="how-to-play-title" className="font-pixel text-4xl mb-2">How to Play</h2>
				<p className="text-xl font-semibold mb-4">{title}</p>

				<ul className="list-disc pl-6 flex flex-col gap-2 text-lg mb-8">
					{steps.map((step) => (
						<li key={step}>{step}</li>
					))}
				</ul>

				<button
					onClick={onClose}
					className="cursor-pointer w-full bg-secondary-green hover:brightness-110 active:translate-y-0.5 transition border-[3px] border-text rounded-xl px-8 py-2 text-xl font-medium"
				>
					Close
				</button>
			</div>
		</div>
	)
}
