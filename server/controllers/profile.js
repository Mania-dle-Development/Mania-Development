import { pool } from "../config/database.js";

// Profile data for one user, returned as a single row.
// $1 is the user's id. To test in psql, replace $1 with a real id.
//
// The query is built from small named blocks, top to bottom:
//   1. games               every game the user played, numbered in play order
//   2. totals              games played, games solved, solve rate
//   3. current_streak      wins in a row since the last loss
//   4. best_streak         longest run of wins ever
//   5. guess_distribution  wins for each guess count (1-6), as JSON
//   6. recent_games        the last 3 games played, as JSON
// The final SELECT at the bottom only picks columns from those blocks.
const profile_info_query = `
    WITH
    -- 1. GAMES
    -- One row per game this user played, numbered 1, 2, 3... from oldest to newest.
    -- A game with no solved_at was lost.
    games AS (
        SELECT
            ROW_NUMBER() OVER (ORDER BY s.started_at, s.wordle_id, s.mode) AS game_number,
            s.mode,
            s.started_at,
            s.solved_at,
            s.num_of_guesses,
            w.word,
            (s.solved_at IS NOT NULL) AS won
        FROM solves s
        JOIN wordles w ON w.id = s.wordle_id
        WHERE s.solver_id = $1
    ),
 
    -- 2. TOTALS
    -- Counts every game, counts the won ones, and works out the percentage.
    totals AS (
        SELECT
            COUNT(*) AS played,
            COUNT(*) FILTER (WHERE won) AS solved,
            CASE
                WHEN COUNT(*) = 0 THEN 0
                ELSE FLOOR(100.0 * COUNT(*) FILTER (WHERE won) / COUNT(*))
            END AS solve_rate
        FROM games
    ),
 
    -- 3. CURRENT STREAK
    -- Take the number of the last lost game and count how many games came after it.
    -- Example: 8 games, last loss was game 7, so the streak is 8 - 7 = 1.
    -- If the user never lost, the "last loss" is treated as game 0.
    current_streak AS (
        SELECT
            COUNT(*) - COALESCE(MAX(game_number) FILTER (WHERE NOT won), 0) AS wins_in_a_row
        FROM games
    ),
 
    -- 4. BEST STREAK
    -- A winning streak is the stretch of games between two losses.
    -- Step A: list the number of every lost game. Add a pretend loss before the
    --         first game (number 0) and after the last game (total + 1), so the
    --         first and last stretches are counted too.
    -- Step B: the gap between each pair of neighbouring losses, minus 1, is how many
    --         wins happened in between.
    -- Step C: the best streak is the biggest gap.
    -- Example: losses at games 3 and 7 out of 8 games gives 0, 3, 7, 9.
    --          The gaps are 2, 3 and 1 wins, so the best streak is 3.
    loss_numbers AS (
        SELECT 0 AS loss_number
        UNION ALL
        SELECT game_number FROM games WHERE NOT won
        UNION ALL
        SELECT COUNT(*) + 1 FROM games
    ),
 
    wins_between_losses AS (
        SELECT
            loss_number - LAG(loss_number) OVER (ORDER BY loss_number) - 1 AS wins_in_a_row
        FROM loss_numbers
    ),
 
    best_streak AS (
        SELECT COALESCE(MAX(wins_in_a_row), 0) AS wins_in_a_row
        FROM wins_between_losses
    ),
 
    -- 5. GUESS DISTRIBUTION
    -- generate_series makes the numbers 1 to 6, so every guess count gets a row.
    -- The LEFT JOIN keeps a row with 0 wins when nothing matches.
    guess_counts AS (
        SELECT
            guess_options.guesses,
            COUNT(games.game_number) AS total
        FROM generate_series(1, 6) AS guess_options(guesses)
        LEFT JOIN games
            ON games.won
            AND games.num_of_guesses = guess_options.guesses
        GROUP BY guess_options.guesses
    ),
 
    -- Packs the six rows into a JSON list: [{ "guesses": 1, "total": 0 }, ...]
    guess_distribution AS (
        SELECT
            json_agg(
                json_build_object('guesses', guesses, 'total', total::int)
                ORDER BY guesses
            ) AS as_json
        FROM guess_counts
    ),
 
    -- 6. RECENT GAMES
    -- Takes the 3 newest games and packs them into a JSON list, newest first.
    -- "seconds" is the solve time for won clock games, and null for everything else.
    -- COALESCE returns an empty list when the user has no games.
    recent_games AS (
        SELECT
            COALESCE(
                json_agg(
                    json_build_object(
                        'word',     word,
                        'mode',     mode,
                        'won',      won,
                        'guesses',  num_of_guesses,
                        'seconds',  CASE
                                        WHEN mode = 'clock' AND won
                                        THEN FLOOR(EXTRACT(EPOCH FROM (solved_at - started_at)))::int
                                    END,
                        'playedAt', started_at
                    )
                    ORDER BY game_number DESC
                ),
                '[]'::json
            ) AS as_json
        FROM (
            SELECT *
            FROM games
            ORDER BY game_number DESC
            LIMIT 3
        ) AS last_three_games
    )
 
    -- FINAL RESULT
    -- One row: the user's info plus the value from each block above.
    SELECT
        u.id,
        u.username,
        u.avatar,
        u.created_at,
        totals.played::int                AS played,
        totals.solved::int                AS solved,
        totals.solve_rate::int            AS solve_rate,
        current_streak.wins_in_a_row::int AS current_streak,
        best_streak.wins_in_a_row::int    AS best_streak,
        guess_distribution.as_json        AS guess_distribution,
        recent_games.as_json              AS recent_games
    FROM users u
    CROSS JOIN totals
    CROSS JOIN current_streak
    CROSS JOIN best_streak
    CROSS JOIN guess_distribution
    CROSS JOIN recent_games
    WHERE u.id = $1
`

export const getProfileInformation = async (req, res) => {
    try {
        //get the userid
        const user_id = req.user?.id

        //call the database and request user information
        const results = await pool.query(profile_info_query, [user_id])

        //define data
        const rows = results.rows

        //error if results is null, or rowCount and rows.length == 0
        if (!results || (results.rowCount || rows.length) === 0) {
            return res.status(404).json({error:"User not found"})
        }
        //format data into JSON
        const user_info = rows[0]
        res.status(200).json({
            id: user_id,
            username: user_info.username,
            avatar: user_info.avatar,
            joinedAt: user_info.created_at,
            played: user_info.played,
            solved: user_info.solved,
            solveRate: user_info.solve_rate,
            currentStreak: user_info.current_streak,
            bestStreak: user_info.best_streak,
            guessDistribution: user_info.guess_distribution,
            recentGames: user_info.recent_games,
        })

    } catch (error) {
        console.error(`Profile Error: ${error}`)
        res.status(500).json({error: "Could not get profile info"})
    }
}