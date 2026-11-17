import { useEffect, useState } from "react";
import validateWord from "../utils/validateWord";

export default function EditWordleModal({ wordle, onSave, onClose }) {
	const [word, setWord] = useState(wordle.word.toUpperCase());
	const [length, setLength] = useState(wordle.word.length);
	const [mode, setMode] = useState(wordle.mode);
	const [error, setError] = useState("");
	const [saving, setSaving] = useState(false);

	// close with the Esc key
	useEffect(() => {
		const onKey = (e) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);

	async function handleSubmit(e) {
		e.preventDefault();
		const problem = validateWord(word, length);
		if (problem) return setError(problem);

		setSaving(true);
		const saveError = await onSave({ word: word.trim().toUpperCase(), mode });
		setSaving(false);
		if (saveError) setError(saveError);
	}

	const box = "border-[3px] border-text rounded-xl bg-white px-5 py-3 text-xl";

	return (
		// dark background; clicking it closes the modal
		<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4" onClick={onClose}>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="edit-title"
				className="w-full max-w-lg bg-board border-[3px] border-text rounded-2xl p-8 text-text"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 id="edit-title" className="font-pixel text-4xl mb-6">Edit Wordle</h2>

				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<label className="text-xl">Your Word</label>
					<input autoFocus className={`${box} uppercase`} value={word} onChange={(e) => setWord(e.target.value)} />

					<div className="grid grid-cols-2 gap-4">
						<select className={`${box} cursor-pointer`} value={length} onChange={(e) => setLength(Number(e.target.value))}>
							{[4, 5, 6, 7, 8].map((n) => (
								<option key={n} value={n}>{n} letters</option>
							))}
						</select>
						<select className={`${box} cursor-pointer`} value={mode} onChange={(e) => setMode(e.target.value)}>
							<option value="classic">Classic</option>
							<option value="clock">Clock</option>
						</select>
					</div>

					{error && <p className="text-secondary-pink font-medium">{error}</p>}

					<div className="flex gap-4 items-center">
						<button
							type="submit"
							disabled={saving}
							className="cursor-pointer bg-secondary-green hover:brightness-110 active:translate-y-0.5 transition border-[3px] border-text rounded-xl px-8 py-2 text-xl font-medium disabled:opacity-50 disabled:cursor-default"
						>
							{saving ? "Saving..." : "Save"}
						</button>
						<button type="button" onClick={onClose} className="cursor-pointer text-xl underline">
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}