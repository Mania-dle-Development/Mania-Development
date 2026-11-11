import { useEffect, useState } from "react";

const API = `${import.meta.env.VITE_BACKEND_URL}/api/wordles`;

const modeColors = {
	classic: "var(--color-secondary-green)",
	switcharoo: "var(--color-secondary-pink)",
	clock: "var(--color-primary-yellow)",
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function WordleCard({ wordle }) {
	const label = capitalize(wordle.mode);
	const pattern = `${label} Mode ${label} Mode ${label}`;

	return (
		<div className="relative overflow-hidden h-44 border-[3px] border-text rounded-xl bg-white cursor-pointer hover:-translate-y-1 transition">
			{/* faded mode text in the background */}
			<div aria-hidden className="absolute -inset-10 -rotate-12 text-4xl font-bold leading-tight opacity-25 select-none" style={{ color: modeColors[wordle.mode] }}>
				{[0, 1, 2, 3].map((i) => (
					<p key={i} className="whitespace-nowrap">{pattern}</p>
				))}
			</div>
			<div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to bottom, transparent, white 65%)" }} />

			<div className="absolute bottom-0 left-0 p-6">
				<p className="text-2xl font-bold truncate">{wordle.creator} - Wordle #{wordle.id}</p>
				<p className="text-lg">{wordle.letters} letters - {wordle.plays} {wordle.plays === 1 ? "play" : "plays"}</p>
			</div>
		</div>
	);
}

export default function BrowseWordles() {
	const [wordles, setWordles] = useState([]);
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("newest");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(API)
			.then((res) => res.json())
			.then((data) => (Array.isArray(data) ? setWordles(data) : setError(data.error)))
			.catch(() => setError("Could not load Wordles."))
			.finally(() => setLoading(false));
	}, []);

	const shown = wordles
		.filter((w) => w.creator.toLowerCase().includes(search.toLowerCase()))
		.sort((a, b) => (sort === "newest" ? b.created_at.localeCompare(a.created_at) : b.plays - a.plays));

	const box = "border-[3px] border-text rounded-xl bg-white px-5 py-3 text-xl";

	return (
		<div className="min-h-screen bg-white flex justify-center">
			<main className="w-full max-w-3xl min-h-screen bg-board px-10 py-16 text-text">
				<h1 className="font-pixel text-5xl mb-8">Custom Wordles</h1>

				<div className="flex gap-4 mb-8">
					<input
						className={`${box} flex-1 placeholder:text-gray-400`}
						placeholder="Search by creator"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<select className={box} value={sort} onChange={(e) => setSort(e.target.value)}>
						<option value="newest">Newest</option>
						<option value="plays">Most Played</option>
					</select>
				</div>

				{loading && <p className="text-xl">Loading...</p>}
				{error && <p className="text-xl text-secondary-pink">{error}</p>}

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					{shown.map((w) => (
						<WordleCard key={w.id} wordle={w} />
					))}
				</div>

				{!loading && !error && shown.length === 0 && <p className="text-xl mt-6">No Wordles match your search.</p>}
			</main>
			</div>
	);
}