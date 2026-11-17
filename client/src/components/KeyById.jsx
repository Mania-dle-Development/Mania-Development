import { useParams } from "react-router"

// rebuilds the page from scratch when the id changes (ex: /clock/50 → /clock),
// so old guesses and the stopwatch don't carry over into the next game
export default function KeyById({ page: Page }) {
	const { id } = useParams()
	return <Page key={id ?? "random"} />
}
