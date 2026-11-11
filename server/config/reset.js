import "./dotenv.js";
import { pool } from "./database.js";
import { defaultSolutions } from "../data/wordles.js";
import { getAnagrams } from "../utils/anagrams.js";

const resetTable = (table_name) =>
	`DROP TABLE IF EXISTS ${table_name};
    `;

//Define Query Prompts for each table
const createEnumQuery = `CREATE TYPE game_mode AS ENUM ('all','classic','clock','switcharoo');   
    `;

const createUserTableQuery = `CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        avatar TEXT,
				github_id INT
    );
    `;

const createWordlesTableQuery = `CREATE TABLE wordles (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        word VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now() , 
        creator_id UUID DEFAULT NULL,
        mode game_mode NOT NULL DEFAULT 'all',
        valid_anagrams VARCHAR(255)[] NOT NULL,
    
        CONSTRAINT foreign_key_creator
            FOREIGN KEY (creator_id)
            REFERENCES users(id)
            ON DELETE CASCADE
    );
    `;

const createSolvesTableQuery = `CREATE TABLE solves (
        solver_id UUID NOT NULL,
        wordle_id INT NOT NULL,
        mode game_mode NOT NULL,
        started_at TIMESTAMPTZ NOT NULL,
        solved_at TIMESTAMPTZ NOT NULL,
        num_of_guesses INTEGER NOT NULL,
        switched_word VARCHAR(255),

        PRIMARY KEY (solver_id, wordle_id, mode),
        
        CONSTRAINT foreign_key_solver
            FOREIGN KEY (solver_id)
            REFERENCES users(id)
            ON DELETE CASCADE,
        
        CONSTRAINT foreign_key_wordle
            FOREIGN KEY (wordle_id)
            REFERENCES wordles(id)
            ON DELETE CASCADE,
        
        CONSTRAINT validate_guess CHECK (num_of_guesses > 0),
        CONSTRAINT validate_time CHECK (started_at <= solved_at),
        CONSTRAINT check_solve_mode CHECK (mode <> 'all'),
        CONSTRAINT check_switcharoo CHECK (mode = 'switcharoo' OR switched_word IS NULL)
        );`;

//Form Table Creation Query
const createUserTable = async () => {
	const queryBody = `
        ${resetTable("solves")}
        ${resetTable("wordles")}
        ${resetTable("users")}
        DROP TYPE IF EXISTS game_mode;
        ${createEnumQuery}
        ${createUserTableQuery}
        ${createWordlesTableQuery}
        CREATE INDEX idx_wordles_creator_id ON wordles(creator_id);
        
        ${createSolvesTableQuery}
        
        CREATE INDEX idx_solves_wordle_id ON solves(wordle_id);
       `;

	try {
		const response = await pool.query(queryBody);
		console.log("Tables created successfully.");
	} catch (error) {
		console.error("Error:" + error);
		throw error;
	}
};

// sample data
const sampleUsers = ["jay", "vanessa", "phil", "eve", "christian"];

const sampleWordles = [
	{ word: "crane", creator: "jay" },
	{ word: "light", creator: "vanessa" },
	{ word: "trace", creator: "phil" },
	{ word: "acorn", creator: "eve" },
	{ word: "adopt", creator: "christian" },
];

const sampleSolves = [
	{
		solver: "vanessa",
		word: "crane",
		startedAt: "2026-11-01T10:00:00Z",
		solvedAt: "2026-11-01T10:03:20Z",
		guesses: 4,
	},
	{
		solver: "phil",
		word: "light",
		startedAt: "2026-11-01T11:00:00Z",
		solvedAt: "2026-11-01T11:01:15Z",
		guesses: 3,
	},
	{
		solver: "eve",
		word: "trace",
		startedAt: "2026-11-01T14:30:00Z",
		solvedAt: "2026-11-01T14:34:45Z",
		guesses: 5,
	},
	{
		solver: "christian",
		word: "acorn",
		startedAt: "2026-11-02T09:00:00Z",
		solvedAt: "2026-11-02T09:02:10Z",
		guesses: 2,
	},
	{
		solver: "jay",
		word: "adopt",
		startedAt: "2026-11-02T16:15:00Z",
		solvedAt: "2026-11-02T16:20:30Z",
		guesses: 6,
	},
];

// seed database with a default set of wordles
const seedDatabase = async () => {
	try {
		const userIds = {};
		for (const username of sampleUsers) {
			const { rows } = await pool.query("INSERT INTO users (username) VALUES ($1) RETURNING id", [
				username,
			]);
			userIds[username] = rows[0].id;
		}

		const wordleIds = {};

		// seeding the sample wordles that's used as placeholder data
		for (const { word, creator } of sampleWordles) {
			const { rows } = await pool.query(
				`INSERT INTO wordles (word, creator_id, mode, valid_anagrams) VALUES ($1, $2, 'classic', $3) RETURNING id`,
				[word, userIds[creator], getAnagrams(word)],
			);
			wordleIds[word] = rows[0].id;
		}

		// seeding default wordles that'll be playable in MVP + final product
		for (const word of defaultSolutions) {
			await pool.query(
				`INSERT INTO wordles (word, valid_anagrams) VALUES ($1, $2) RETURNING id`,
				[word, getAnagrams(word)]
			)
		}

		for (const { solver, word, startedAt, solvedAt, guesses } of sampleSolves) {
			await pool.query(
				`INSERT INTO solves (solver_id, wordle_id, mode, started_at, solved_at, num_of_guesses) VALUES ($1, $2, 'classic', $3, $4, $5)`,
				[userIds[solver], wordleIds[word], startedAt, solvedAt, guesses],
			);
		}

		console.log("Database seeded successfully.");
	} catch (error) {
		console.error("Error:" + error);
		throw error;
	}
};

//Call SQL Queries
const resetDatabase = async () => {
	await createUserTable();
	await seedDatabase();
};

resetDatabase();
