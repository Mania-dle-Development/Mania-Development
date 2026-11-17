import { pool } from "../config/database.js"


// the user's basic info
const USER_QUERY = `
    SELECT id, username, avatar, created_at
    FROM users
    WHERE id = $1
`

// how many games were played, and how many of them were solved
// (COUNT(solved_at) skips NULLs, so it only counts solved games)
const TOTALS_QUERY = `
    SELECT
        COUNT(*) AS played,
        COUNT(solved_at) AS solved
    FROM solves
    WHERE solver_id = $1
`

// how many wins took 1 guess, 2 guesses, and so on
// buckets with no wins are missing here and get filled in with 0 below
const GUESS_COUNTS_QUERY = `
    SELECT num_of_guesses, COUNT(*) AS total
    FROM solves
    WHERE solver_id = $1
      AND solved_at IS NOT NULL
    GROUP BY num_of_guesses
`

// every game's result in the order it was played (oldest first).
// used to work out the streaks
const RESULTS_QUERY = `
    SELECT solved_at IS NOT NULL AS won
    FROM solves
    WHERE solver_id = $1
    ORDER BY started_at, wordle_id, mode
`

// the last 3 games played (newest first)
const RECENT_GAMES_QUERY = `
    SELECT
        wordles.word,
        solves.mode,
        solves.num_of_guesses,
        solves.started_at,
        solves.solved_at
    FROM solves
    JOIN wordles ON wordles.id = solves.wordle_id
    WHERE solves.solver_id = $1
    ORDER BY solves.started_at DESC, solves.wordle_id DESC, solves.mode DESC
    LIMIT 3
`

// walks through the results oldest to newest.
// a win adds to the current streak, a loss resets it to 0.
// when the loop ends, currentStreak is the streak the user is on right now
function calculateStreaks(results) {
    let currentStreak = 0
    let bestStreak = 0

    for (const result of results) {
        if (result.won) {
            currentStreak += 1
            bestStreak = Math.max(bestStreak, currentStreak)
        } else {
            currentStreak = 0
        }
    }

    return { currentStreak, bestStreak }
}

// makes sure there is one entry for each of 1-6 guesses, using 0 when there are no wins
function buildGuessDistribution(guessCounts) {
    return [1, 2, 3, 4, 5, 6].map((guesses) => {
        const row = guessCounts.find((r) => r.num_of_guesses === guesses)
        return { guesses, total: row ? Number(row.total) : 0 }
    })
}

// formats a game row for the frontend
function formatRecentGame(game) {
    const won = game.solved_at !== null

    // only clock games that were solved have a time (in whole seconds)
    let seconds = null
    if (game.mode === "clock" && won) {
        const milliseconds = new Date(game.solved_at) - new Date(game.started_at)
        seconds = Math.round(milliseconds / 1000)
    }

    return {
        word: game.word,
        mode: game.mode,
        won: won,
        guesses: game.num_of_guesses,
        seconds: seconds,
        playedAt: game.started_at,
    }
}

export const getProfileInformation = async (req, res) => {
    try {
        //get the userid
        const user_id = req.user?.id

        //if the auth middleware did not set a user, the user is not logged in
        if (!user_id) {
            console.error("Profile Error: req.user is missing, check the auth middleware on this route")
            return res.status(401).json({ error: "Not logged in" })
        }

        //1. user info
        const userResult = await pool.query(USER_QUERY, [user_id])
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" })
        }
        const user = userResult.rows[0]

        //2. played and solved totals
        const totalsResult = await pool.query(TOTALS_QUERY, [user_id])
        const played = Number(totalsResult.rows[0].played)
        const solved = Number(totalsResult.rows[0].solved)
        const solveRate = played === 0 ? 0 : Math.round((solved / played) * 100)

        //3. guess distribution
        const guessCountsResult = await pool.query(GUESS_COUNTS_QUERY, [user_id])
        const guessDistribution = buildGuessDistribution(guessCountsResult.rows)

        //4. streaks
        const resultsResult = await pool.query(RESULTS_QUERY, [user_id])
        const { currentStreak, bestStreak } = calculateStreaks(resultsResult.rows)

        //5. recent games
        const recentGamesResult = await pool.query(RECENT_GAMES_QUERY, [user_id])
        const recentGames = recentGamesResult.rows.map(formatRecentGame)

        //format data into JSON
        res.json({
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            joinedAt: user.created_at,
            played: played,
            solved: solved,
            solveRate: solveRate,
            currentStreak: currentStreak,
            bestStreak: bestStreak,
            guessDistribution: guessDistribution,
            recentGames: recentGames,
        })

    } catch (error) {
        console.error(`Profile Error: ${error}`)
        res.status(500).json({ error: "Could not get profile info" })
    }
}