import { useEffect, useState } from "react";
import validateWord from "../utils/validateWord";
import EditWordleModal from "../components/EditWordleModal";


const API = `${import.meta.env.VITE_BACKEND_URL}/api/wordles`;
const PER_PAGE = 5;


export default function CreateWordle() {
	const [word, setWord] = useState("");
	const [length, setLength] = useState(5);
	const [mode, setMode] = useState("classic");
	const [wordles, setWordles] = useState([]);
	const [editing, setEditing] = useState(null); // the wordle open in the edit modal
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);

	// load the logged-in user's wordles
	useEffect(() => {
		fetch(`${API}/me`, { credentials: "include" })
			.then((res) => res.json())
			.then((data) => (Array.isArray(data) ? setWordles(data) : setError(data.error)))
			.catch(() => setError("Could not load your Wordles."))
			.finally(() => setLoading(false));
	}, []);

	// pagination: only show PER_PAGE wordles at a time
	const totalPages = Math.max(1, Math.ceil(wordles.length / PER_PAGE));
	const currentPage = Math.min(page, totalPages);
	const shown = wordles.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

	// create a new wordle
	async function handleCreate(e) {
		e.preventDefault();
		const problem = validateWord(word, length);
		if (problem) return setError(problem);
		setError("");

		const res = await fetch(API, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ word: word.trim().toUpperCase(), mode }),
		});
		const data = await res.json();
		if (!res.ok) return setError(data.error);

		setWordles((prev) => [data, ...prev]);
		setPage(1); // new wordles show up at the top of page 1
		setWord("");
	}

	// save changes from the edit modal; returns an error message or null
	async function handleSave(changes) {
		const res = await fetch(`${API}/${editing.id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify(changes),
		});
		const data = await res.json();
		if (!res.ok) return data.error;

		setWordles((prev) => prev.map((w) => (w.id === editing.id ? { ...w, ...data } : w)));
		setEditing(null);
		return null;
	}

	async function handleDelete(id) {
		const res = await fetch(`${API}/${id}`, { method: "DELETE", credentials: "include" });
		if (!res.ok) return setError((await res.json()).error);
		setWordles((prev) => prev.filter((w) => w.id !== id));
	}

	const box = "border-[3px] border-text rounded-xl bg-white px-5 py-3 text-xl";
	const iconBtn = "cursor-pointer transition active:translate-y-0.5";
	const pageBtn =
		"cursor-pointer border-[3px] border-text rounded-xl bg-white px-4 py-1 text-lg font-medium transition hover:bg-primary-yellow active:translate-y-0.5 disabled:opacity-40 disabled:cursor-default disabled:hover:bg-white disabled:active:translate-y-0";

	return (
		<div className="min-h-screen bg-white flex justify-center">
			<title>Create a Wordle | Mania-dle</title>
			<main className="w-full max-w-3xl min-h-screen bg-board px-10 py-16 text-text">
				<h1 className="font-pixel text-5xl mb-8">Create a Wordle</h1>

				<form onSubmit={handleCreate} className="flex flex-col gap-5">
					<label className="text-2xl">Your Word</label>
					<input
						className={`${box} uppercase placeholder:text-gray-400`}
						placeholder="HEART"
						value={word}
						onChange={(e) => setWord(e.target.value)}
					/>

					<div className="grid grid-cols-2 gap-5">
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

					<button
						type="submit"
						className="self-start cursor-pointer bg-secondary-green hover:brightness-110 active:translate-y-0.5 transition border-[3px] border-text rounded-xl px-10 py-3 text-2xl font-medium"
					>
						Create
					</button>
				</form>

				<h2 className="text-2xl font-bold mt-14 mb-2">Your Wordles</h2>
				{loading && <p className="text-xl">Loading...</p>}
				{!loading && wordles.length === 0 && <p className="text-xl">You haven't made any Wordles yet.</p>}
				<ul>
					{shown.map((w) => (
						<li key={w.id} className="flex justify-between items-center border-b border-text py-4 text-2xl">
							<span>{w.word.toUpperCase()} - {w.plays} {w.plays === 1 ? "play" : "plays"}</span>
							<span className="flex gap-4">
								<button onClick={() => setEditing(w)} aria-label="Edit" className={iconBtn}>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2"><path d="M4 20h4L19 9l-4-4L4 16v4z" /></svg>
								</button>
								<button onClick={() => handleDelete(w.id)} aria-label="Delete" className={iconBtn}>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary-pink)" strokeWidth="2"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" /></svg>
								</button>
							</span>
						</li>
					))}
				</ul>

				{totalPages > 1 && (
					<div className="flex justify-between items-center mt-6">
						<button className={pageBtn} onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1}>
							Prev
						</button>
						<span className="text-lg">Page {currentPage} of {totalPages}</span>
						<button className={pageBtn} onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages}>
							Next
						</button>
					</div>
				)}
			</main>

			{editing && <EditWordleModal wordle={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
		</div>
	);
}