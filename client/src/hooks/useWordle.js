import { useState, useEffect, useMemo } from 'react'

const API = `${import.meta.env.VITE_BACKEND_URL}/api/wordles`
export const MAX_GUESSES = 6

export default function useWordle() {
    // -- states --
    const [wordleId, setWordleId] = useState(null)
    const [length, setLength] = useState(5)
    const [guesses, setGuesses] = useState([])
    const [currentGuess, setCurrentGuess] = useState("")
    const [status, setStatus] = useState("loading")
    const [answer, setAnswer] = useState(null)
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    // error checking
    useEffect(() => {
        if (!error) return
            const timer = setTimeout(() => setError(""), 2000)  // message lasts for only 2 seconds
            return () => clearTimeout(timer)
    }, [error])

    // start up a game when the page loads
    useEffect(() => {
        let ignore = false   
                
        const startGame = async () => {
            try {
                const res = await fetch(`${API}/random`, { credentials: "include" })
                const data = await res.json()
                if (ignore) return

                if(!res.ok) {
                    setError(data.error)
                    return
                }

                // setting states of solution and game status
                setWordleId(data.id)
                setLength(data.length)
                setStatus("playing")

            } catch {
                if (!ignore) setError("Could not reach the server!")
            }
        }

        startGame()
        return () => { ignore = true }

    }, [])

    const submitGuess = async () => {
        if(currentGuess.length !== length) {
            setError(`Guess must be ${length} letters`)
            return
        }

        setSubmitting(true)
        setError("")
        try {
            const res = await fetch(`${API}/${wordleId}/guesses`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ guess: currentGuess }),
            })
            const data = await res.json()

            if(!res.ok) {
                setError(data.error)
                return
            }

            // adding our current guess to our list of guesses
            setGuesses((prev) => [...prev, { word: currentGuess, result: data.result }])
            setCurrentGuess("")
            setStatus(data.status) // server decides whether the game is still going ("playing", "lost", or "won")

            if(data.answer) setAnswer(data.answer) // finally loads answer when the game is over 


        } catch {
            setError("Could not reach the server!")
        } finally {
            setSubmitting(false)
        }
    }

    // To handle keyboard key events when the user types in a guess
    const handleKey = (key) => {
        if (status !== "playing" || submitting) return
        
        if (key === "Enter") {
            submitGuess()
            return
        }

        if (key === "Backspace") {
            setCurrentGuess((prev) => prev.slice(0, -1))
            return
        }

        // if the key is a single letter (a-z, any case) and there's still room in the row, add it
        if(/^[a-z]$/i.test(key) && currentGuess.length < length) {
            setCurrentGuess((prev) => prev + key.toLowerCase())
        }
    }

    // listens to the physical keyboard
    useEffect(() => {
        const onKeyDown = (e) => handleKey(e.key)
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown) // function cleanup to only have one listener per render
    })

    const keyStatuses = useMemo(() => {
        const RANK = { absent: 1, present: 2, correct: 3 }
        const map = {} // e.g. { c: "correct", r: "present", x: "absent" }

        // ranking system to keep a key its best color it has earned throughout the guesses
        // best way to think about it is "The *best* thing i learned about letter 'r' is that it's green"
        for(const { word, result } of guesses) {
            [...word].forEach((letter, i) => {
                const newStatus = result[i]
                // only upgrade a key's color (absent -> present -> correct), never downgrade it
                if (!map[letter] || RANK[newStatus] > RANK[map[letter]]) {
                    map[letter] = newStatus
                }
            })
        }
        return map
    }, [guesses]) // recompute only when guesses change

    return { wordleId, length, guesses, currentGuess, status, answer, error, submitting, handleKey, keyStatuses };
}