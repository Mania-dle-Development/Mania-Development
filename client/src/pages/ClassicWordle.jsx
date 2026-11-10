import useWordle from "../hooks/useWordle"

export default function ClassicWordle() {
    const game = useWordle()

    // just for testing but to print the hook's state to check that it works
    return <pre>{JSON.stringify(game, null, 2)}</pre>
}