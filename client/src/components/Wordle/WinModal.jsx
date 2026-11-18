import { useEffect } from "react"

// pops up when the player wins; detail = extra line like "Solved in 4 guesses"
export default function WinModal({ detail, onClose }) {
	// close with the Esc key
	useEffect(() => {
		const onKey = (e) => e.key === "Escape" && onClose()
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	}, [onClose])

	return (
		// dark background, clicking it closes the modal
		<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4" onClick={onClose}>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="win-title"
				className="w-full max-w-lg bg-board border-[3px] border-text rounded-2xl p-8 text-text text-center"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 id="win-title" className="font-pixel text-5xl mb-4">You Win! 🎉</h2>
				<p className="text-xl mb-8">{detail}</p>

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
