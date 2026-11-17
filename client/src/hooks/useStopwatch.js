import { useState, useEffect } from "react"

// Counts up from 0 while `running` is true. Freezes on the last value when it stops.
// Elapsed time comes from the real clock (Date.now()), not from counting ticks,
// so it stays accurate even if the browser delays an interval.

export default function useStopwatch(running) {
	const [elapsedMs, setElapsedMs] = useState(0)

	useEffect(() => {
		if (!running) return

		const start = Date.now()
		// check 4x a second so the display never lags behind by a full second
		const id = setInterval(() => setElapsedMs(Date.now() - start), 250)
		return () => clearInterval(id) // stops ticking when the game ends or the page closes
	}, [running])

	return Math.floor(elapsedMs / 1000) // returns in whole seconds
}
