import { useEffect, useState } from "react";

const API = `${import.meta.env.VITE_BACKEND_URL}/api/wordles`;

export default function CreateWordle() {
	const [word, setWord] = useState("");
	const [length, setLength] = useState(5);
	const [mode, setMode] = useState("classic");
	const [wordles, setWordles] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	// load the logged-in user's wordles
	useEffect(() => {
		fetch(`${API}/mine`, { credentials: "include" })
			.then((res) => res.json())
			.then((data) => (Array.isArray(data) ? setWordles(data) : setError(data.error)))
			.catch(() => setError("Could not load your Wordles."))
			.finally(() => setLoading(false));
	}, []);

	async function handleSubmit(e) {
		e.preventDefault();
		const clean = word.trim().toUpperCase();

		// check the word before sending it
		if (!/^[A-Z]+$/.test(clean)) return setError("Letters only, please.");
		if (clean.length !== length) return setError(`Your word needs ${length} letters.`);
		setError("");

		const res = await fetch(editingId ? `${API}/${editingId}` : API, {
			method: editingId ? "PATCH" : "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ word: clean, mode }),
		});
		const data = await res.json();
		if (!res.ok) return setError(data.error);

		if (editingId) {
			setWordles(wordles.map((w) => (w.id === editingId ? { ...w, ...data } : w)));
			setEditingId(null);
		} else {
			setWordles([data, ...wordles]);
		}
		setWord("");
	}

	function handleEdit(w) {
		setWord(w.word.toUpperCase());
		setLength(w.word.length);
		setMode(w.mode);
		setEditingId(w.id);
		setError("");
	}

	function cancelEdit() {
		setEditingId(null);
		setWord("");
		setError("");
	}

	async function handleDelete(id) {
		const res = await fetch(`${API}/${id}`, { method: "DELETE", credentials: "include" });
		if (!res.ok) return setError((await res.json()).error);
		setWordles(wordles.filter((w) => w.id !== id));
		if (editingId === id) cancelEdit();
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
							<option value="classic">Classic</option>
						</select>
					</div>

					{error && <p className="text-secondary-pink font-medium">{error}</p>}

					<div className="flex gap-4 items-center">
						<button
							type="submit"
							className="bg-secondary-green hover:brightness-110 border-[3px] border-text rounded-xl px-10 py-3 text-2xl font-medium"
						>
							{editingId ? "Save" : "Create"}
						</button>
						{editingId && (
							<button type="button" onClick={cancelEdit} className="text-xl underline">
								Cancel
							</button>
						)}
					</div>
				</form>

				<h2 className="text-2xl font-bold mt-14 mb-2">Your Wordles</h2>
				{loading && <p className="text-xl">Loading...</p>}
				{!loading && wordles.length === 0 && <p className="text-xl">You haven't made any Wordles yet.</p>}
				<ul>
					{wordles.map((w) => (
						<li key={w.id} className="flex justify-between items-center border-b border-text py-4 text-2xl">
							<span>{w.word.toUpperCase()} - {w.plays} {w.plays === 1 ? "play" : "plays"}</span>
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