import { useEffect, useState } from "react";

const API = `${import.meta.env.VITE_BACKEND_URL}/api/wordles`;

export default function useBrowsleWordles() {
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

    return {search, sort, error, loading, shown, setSearch, setSort}
}