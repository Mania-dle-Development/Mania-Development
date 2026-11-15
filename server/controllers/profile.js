import "./dotenv.js";
import { pool } from "../config/database.js";

const profile_info_query = (user_id) =>
    `WITH games AS (
        -- Every finished game by this user. A NULL solved_at means the game was lost.
        SELECT
            s.mode,
            s.started_at,
            s.solved_at,
            s.num_of_guesses,
            w.word,
            (s.solved_at IS NOT NULL) AS won,
            ROW_NUMBER() OVER (ORDER BY s.started_at, s.wordle_id, s.mode) AS rn
        FROM solves s
                 JOIN wordles w ON w.id = s.wordle_id
        WHERE s.solver_id = ${user_id}
    ),

    -- Gaps-and-islands: consecutive games with the same result share a group number.
          grouped AS (
              SELECT
                  rn,
                  won,
                  rn - ROW_NUMBER() OVER (PARTITION BY won ORDER BY rn) AS grp
              FROM games
          ),

          win_runs AS (
              SELECT COUNT(*) AS len, MAX(rn) AS last_rn
              FROM grouped
              WHERE won
              GROUP BY grp
          ),

          totals AS (
              SELECT
                  COUNT(*)                      AS played,
                  COUNT(*) FILTER (WHERE won)   AS solved
              FROM games
          ),

          streaks AS (
              SELECT
                  -- Current streak: the win run that ends on the user's most recent game, else 0.
                  COALESCE(
                          (SELECT len FROM win_runs WHERE last_rn = (SELECT MAX(rn) FROM games)),
                          0
                  ) AS current_streak,
                  COALESCE((SELECT MAX(len) FROM win_runs), 0) AS best_streak
          ),

    -- One row per guess count 1-6, including buckets with zero wins.
          distribution AS (
              SELECT g.n AS guesses, COUNT(gm.rn) AS total
              FROM generate_series(1, 6) AS g(n)
                       LEFT JOIN games gm ON gm.won AND gm.num_of_guesses = g.n
              GROUP BY g.n
          ),

          recent AS (
              SELECT
                  rn,
                  word,
                  mode,
                  won,
                  num_of_guesses,
                  started_at,
                  -- Clock solve time in whole seconds; NULL for non-clock games and clock losses.
                  CASE
                      WHEN mode = 'clock' AND won
                          THEN ROUND(EXTRACT(EPOCH FROM (solved_at - started_at)))::int
    END AS seconds
  FROM games
  ORDER BY rn DESC
  LIMIT 3
)

    SELECT
        u.id,
        u.username,
        u.avatar,
        u.created_at,
        t.played::int AS played,
        t.solved::int AS solved,
        CASE WHEN t.played = 0 THEN 0
             ELSE ROUND(100.0 * t.solved / t.played)::int
    END AS solve_rate,
  st.current_streak::int AS current_streak,
  st.best_streak::int    AS best_streak,
  (
    SELECT json_agg(
             json_build_object('guesses', guesses, 'total', total::int)
             ORDER BY guesses
           )
    FROM distribution
  ) AS guess_distribution,
  COALESCE(
    (
      SELECT json_agg(
               json_build_object(
                 'word',     word,
                 'mode',     mode,
                 'won',      won,
                 'guesses',  num_of_guesses,
                 'seconds',  seconds,
                 'playedAt', started_at
               )
               ORDER BY rn DESC
             )
      FROM recent
    ),
    '[]'::json
  ) AS recent_games
FROM users u
CROSS JOIN totals t
CROSS JOIN streaks st
WHERE u.id = ${user_id};
`

export const getProfileInformation = async (req, res) => {
    try {
        //get the userid
        const user_id = req.user.id

        //call the database and request user information
        const { rows } = await pool.query(profile_info_query(user_id))

        //error
        if (rows.length === 0) {
            return res.status(404).json({error:"User not found"})
        }
        //format data into JSON
        const user_info = rows[0]
        res.json({
            id: user_id,
            username: user_info.username,
            avatar: user_info.avatar,
            joinedAt: user_info.joinedAt,
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