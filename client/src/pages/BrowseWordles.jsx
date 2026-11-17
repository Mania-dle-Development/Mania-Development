import WordleCard from "../components/Wordle/WordleCard.jsx";
import useBrowsleWordles from "../hooks/useBrowseWordle.js";


export default function BrowseWordles() {
	const {search, sort, error, loading, shown, setSearch, setSort} = useBrowsleWordles()

	const box = "border-[3px] border-text rounded-xl bg-white px-5 py-3 text-xl";

	return (
		<div className="min-h-screen bg-white flex justify-center">
			<title>Custom Wordles | MANIA-dle</title>
			<main className="w-full max-w-3xl min-h-screen bg-board px-10 py-16 text-text">
				<h1 className="font-pixel text-5xl mb-8">Custom Wordles</h1>

				<div className="flex gap-4 mb-8">
					<input
						className={`${box} flex-1 placeholder:text-gray-400`}
						placeholder="Search by creator"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<select className={`${box} cursor-pointer`} value={sort} onChange={(e) => setSort(e.target.value)}>
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