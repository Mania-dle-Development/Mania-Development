import { useState } from "react";

const modeColors = {
	Classic: "var(--color-secondary-green)",
	Switcharoo: "var(--color-secondary-pink)",
	Clock: "var(--color-primary-yellow)",
};

const fakeWordles = [
	{ id: 1, creator: "Jay", title: "Daily", number: 34, letters: 5, plays: 30, mode: "Classic", createdAt: "2026-11-01" },
	{ id: 2, creator: "Vanessa", title: "Fish", number: 50, letters: 6, plays: 8, mode: "Switcharoo", createdAt: "2026-11-03" },
	{ id: 3, creator: "Eve", title: "Geography", number: 7, letters: 4, plays: 3, mode: "Clock", createdAt: "2026-11-05" },
	{ id: 4, creator: "Phil", title: "JavaScript", number: 4, letters: 5, plays: 12, mode: "Classic", createdAt: "2026-10-30" },
	{ id: 5, creator: "Christian", title: "Plants", number: 1, letters: 4, plays: 3, mode: "Classic", createdAt: "2026-11-04" },
];

function WordleCard({ wordle }) {
	const color = modeColors[wordle.mode];
	const pattern = `${wordle.mode} Mode ${wordle.mode} Mode ${wordle.mode}`;

	return (
		<div className="relative overflow-hidden h-44 border-[3px] border-text rounded-xl bg-white cursor-pointer hover:-translate-y-1 transition">
			{/* faded mode text in the background */}
			<div aria-hidden className="absolute -inset-10 -rotate-12 text-4xl font-bold leading-tight opacity-25 select-none" style={{ color }}>
				{[0, 1, 2, 3].map((i) => (
					<p key={i} className="whitespace-nowrap">{pattern}</p>
				))}
			</div>
			<div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to bottom, transparent, white 65%)" }} />

			<div className="absolute bottom-0 left-0 p-6">
				<p className="text-2xl font-bold truncate">{wordle.creator} - {wordle.title} #{wordle.number}</p>
				<p className="text-lg">{wordle.letters} letters - {wordle.plays} plays</p>
			</div>
		</div>
	);
}

export default function BrowseWordles() {
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("newest");

	const shown = fakeWordles
		.filter((w) => `${w.creator} ${w.title}`.toLowerCase().includes(search.toLowerCase()))
		.sort((a, b) => (sort === "newest" ? b.createdAt.localeCompare(a.createdAt) : b.plays - a.plays));

	const box = "border-[3px] border-text rounded-xl bg-white px-5 py-3 text-xl";

	return (
		<div className="min-h-screen bg-white flex justify-center">
			<main className="w-full max-w-3xl min-h-screen bg-[#F1F2F4] px-10 py-16 text-text">
				<h1 className="font-pixel text-5xl mb-8">Custom Wordles</h1>

				<div className="flex gap-4 mb-8">
					<input
						className={`${box} flex-1 placeholder:text-gray-400`}
						placeholder="Search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<select className={box} value={sort} onChange={(e) => setSort(e.target.value)}>
						<option value="newest">Newest</option>
						<option value="plays">Most Played</option>
					</select>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					{shown.map((w) => (
						<WordleCard key={w.id} wordle={w} />
					))}
				</div>

				{shown.length === 0 && <p className="text-xl mt-6">No Wordles match your search.</p>}
			</main>
		</div>
	);
}