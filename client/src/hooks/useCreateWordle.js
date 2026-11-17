import { useEffect, useState } from "react";
import validateWord from "../utils/validateWord";


const API = `${import.meta.env.VITE_BACKEND_URL}/api/wordles`;
const PER_PAGE = 5;

export default function useCreateWordle() {
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

    return {word, length, setLength, mode, setMode, wordles, editing, setEditing, error, loading, shown, handleCreate, handleSave, handleDelete,
        currentPage, setPage, totalPages, setWord}
}