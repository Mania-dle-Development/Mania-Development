import { useState } from "react";

const starterWordles = [
	{ id: 1, word: "TREMOR", mode: "Classic", plays: 12 },
	{ id: 2, word: "CARPAL", mode: "Classic", plays: 4 },
];

export default function CreateWordle() {
	const [word, setWord] = useState("");
	const [length, setLength] = useState(5);
	const [mode, setMode] = useState("Classic");
	const [wordles, setWordles] = useState(starterWordles);
	const [editingId, setEditingId] = useState(null);
	const [error, setError] = useState("");

	function handleSubmit(e) {
		e.preventDefault();
		const clean = word.trim().toUpperCase();

		// check the word before saving
		if (!/^[A-Z]+$/.test(clean)) return setError("Letters only, please.");
		if (clean.length !== length) return setError(`Your word needs ${length} letters.`);
		setError("");

		if (editingId) {
			setWordles(wordles.map((w) => (w.id === editingId ? { ...w, word: clean, mode } : w)));
			setEditingId(null);
		} else {
			setWordles([{ id: Date.now(), word: clean, mode, plays: 0 }, ...wordles]);
		}
		setWord("");
	}

	function handleEdit(w) {
		setWord(w.word);
		setLength(w.word.length);
		setMode(w.mode);
		setEditingId(w.id);
	}

	function handleDelete(id) {
		setWordles(wordles.filter((w) => w.id !== id));
	}

	const box = "border-[3px] border-text rounded-xl bg-white px-5 py-3 text-xl";

	return (
		<div className="min-h-screen bg-white flex justify-center">
			<main className="w-full max-w-3xl min-h-screen bg-[#F1F2F4] px-10 py-16 text-text">
				<h1 className="font-pixel text-5xl mb-8">Create a Wordle</h1>

				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<label className="text-2xl">Your Word</label>
					<input
						className={`${box} uppercase placeholder:text-gray-400`}
						placeholder="HEART"
						value={word}
						onChange={(e) => setWord(e.target.value)}
					/>

					<div className="grid grid-cols-2 gap-5">
						<select className={box} value={length} onChange={(e) => setLength(Number(e.target.value))}>
							{[4, 5, 6, 7, 8].map((n) => (
								<option key={n} value={n}>{n} letters</option>
							))}
						</select>
						<select className={box} value={mode} onChange={(e) => setMode(e.target.value)}>
							<option>Classic</option>
						</select>
					</div>

					{error && <p className="text-secondary-pink font-medium">{error}</p>}

					<button
						type="submit"
						className="self-start bg-secondary-green hover:brightness-110 border-[3px] border-text rounded-xl px-10 py-3 text-2xl font-medium"
					>
						{editingId ? "Save" : "Create"}
					</button>
				</form>

				<h2 className="text-2xl font-bold mt-14 mb-2">Your Wordles</h2>
				<ul>
					{wordles.map((w) => (
						<li key={w.id} className="flex justify-between items-center border-b border-text py-4 text-2xl">
							<span>{w.word} - {w.plays} plays</span>
							<span className="flex gap-4">
								<button onClick={() => handleEdit(w)} aria-label="Edit">
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2"><path d="M4 20h4L19 9l-4-4L4 16v4z" /></svg>
								</button>
								<button onClick={() => handleDelete(w.id)} aria-label="Delete">
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary-pink)" strokeWidth="2"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" /></svg>
								</button>
							</span>
						</li>
					))}
				</ul>
			</main>
		</div>
	);
}