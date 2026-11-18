import { useEffect, useState } from "react";

const API = `${import.meta.env.VITE_BACKEND_URL}/api/wordles`;

const formatTime = (ms) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

// clock shows time; classic and switcharoo show points (6 for 1 guess, 5 for 2, ...)
function scoreText(player, mode) {
    if (mode === "clock") return `${player.guesses}/6 ....... ${formatTime(player.time_ms)}`;
    const pts = 7 - player.guesses;
    return `${player.guesses}/6 ....... ${pts} ${pts === 1 ? "PT" : "PTS"}`;
}

// podium order left to right: 2nd, 1st, 3rd
const PODIUM = [
    { place: 2, height: "h-28", color: "bg-primary-blue", text: "text-white" },
    { place: 1, height: "h-40", color: "bg-primary-yellow", text: "text-text" },
    { place: 3, height: "h-16", color: "bg-secondary-pink", text: "text-white" },
];

function Crown() {
    return (
        <svg width="32" height="24" viewBox="0 0 32 24" aria-hidden="true">
            <path
                d="M3 20 L2 6 L10 12 L16 3 L22 12 L30 6 L29 20 Z"
                fill="var(--color-primary-yellow)"
                stroke="var(--color-text)"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function Row({ player, mode }) {
    const name = player.is_me ? "YOU" : player.username.toUpperCase();
    return (
        <li
            className={`flex justify-between gap-4 ${player.is_me ? "bg-[#cdd1d6] border-4 border-text rounded-full px-5 py-2" : "px-1"
                }`}
        >
            <span className="truncate">
                {String(player.rank).padStart(2, "0")} {name}
            </span>
            <span className="whitespace-nowrap">{scoreText(player, mode)}</span>
        </li>
    );
}

export default function Leaderboard({ wordleId, mode, gameOver }) {
    const [players, setPlayers] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // load when the wordle changes, and again when the game ends so the new score shows up
    useEffect(() => {
        if (!wordleId) return;
        let ignore = false;
        fetch(`${API}/${wordleId}/leaderboard?mode=${mode}`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                if (ignore) return;
                if (data.error) return setError(data.error);
                setPlayers(data.players);
                setTotal(data.total);
                setError("");
            })
            .catch(() => !ignore && setError("Could not load the leaderboard."))
            .finally(() => !ignore && setLoading(false));
        return () => {
            ignore = true;
        };
    }, [wordleId, mode, gameOver]);

    if (!wordleId) return null;

    const top3 = players.filter((p) => p.rank <= 3);
    const rest = players.filter((p) => p.rank > 3 && p.rank <= 10);
    const me = players.find((p) => p.is_me && p.rank > 10);
    const label = mode.charAt(0).toUpperCase() + mode.slice(1);
    const hasList = rest.length > 0 || me;

    return (
        <section
            aria-labelledby="leaderboard-title"
            className="w-full max-w-2xl bg-white border-4 border-text rounded-3xl px-6 sm:px-10 py-10 text-text"
        >
            <h2 id="leaderboard-title" className="font-pixel text-4xl text-center">
                Leaderboard
            </h2>
            <p className="text-center uppercase tracking-wide mt-1">
                Wordle #{wordleId} · {label}
            </p>

            {loading && <p className="text-center mt-8">Loading...</p>}
            {error && <p className="text-center mt-8 text-secondary-pink">{error}</p>}
            {!loading && !error && players.length === 0 && (
                <p className="text-center mt-8 text-lg">No one has solved this Wordle yet.</p>
            )}

            {players.length > 0 && (
                <div className={`grid grid-cols-1 gap-8 mt-10 ${hasList ? "sm:grid-cols-[auto_1fr]" : ""}`}>
                    {/* podium */}
                    <div
                        className={`flex items-end justify-center gap-4 ${hasList ? "sm:pr-8 sm:border-r-2 sm:border-dashed sm:border-text" : ""
                            }`}
                    >
                        {PODIUM.map(({ place, height, color, text }) => {
                            const p = top3.find((x) => x.rank === place);
                            if (!p) return null;
                            return (
                                <div key={place} className="flex flex-col items-center gap-2 w-20">
                                    {place === 1 && <Crown />}
                                    <p className={`font-bold truncate max-w-full ${p.is_me ? "underline" : ""}`}>
                                        {p.is_me ? "You" : p.username}
                                    </p>
                                    <p className="text-sm">
                                        {mode === "clock" ? formatTime(p.time_ms) : `${p.guesses}/6`}
                                    </p>
                                    <div
                                        className={`w-16 ${height} ${color} border-4 border-text rounded-full flex items-end justify-center pb-3`}
                                    >
                                        <span className={`font-pixel text-2xl ${text}`}>{place}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ranks 4-10, then your spot if you're lower */}
                    {hasList && (
                        <ol className="flex flex-col gap-3 text-lg">
                            {rest.map((p) => (
                                <Row key={p.rank} player={p} mode={mode} />
                            ))}
                            {me && (
                                <>
                                    <li aria-hidden="true" className="text-center tracking-[0.5em]">
                                        ...
                                    </li>
                                    <Row player={me} mode={mode} />
                                </>
                            )}
                        </ol>
                    )}
                </div>
            )}

            {total > 0 && (
                <p className="text-center text-sm mt-8">
                    {total} {total === 1 ? "player" : "players"} solved this Wordle
                </p>
            )}
        </section>
    );
}