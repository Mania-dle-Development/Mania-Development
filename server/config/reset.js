import "./dotenv.js";
import { pool } from "./database.js";
import { words as solutions, getAnagrams } from "../utils/anagrams.js";

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
        solved_at TIMESTAMPTZ,
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

// seed database with a default set of wordles
const seedDatabase = async () => {
	try {
		// seeding every word in valid_solutions.csv as a default wordle (playable in every mode)
		// inserted 500 at a time, so it's 5 queries instead of 2,315 trips to the database
		const CHUNK_SIZE = 500
		for (let i = 0; i < solutions.length; i += CHUNK_SIZE) {
			const chunk = solutions.slice(i, i + CHUNK_SIZE)

			// builds "($1, $2), ($3, $4), ..." with one pair of placeholders per word
			const placeholders = chunk.map((_, j) => `($${j * 2 + 1}, $${j * 2 + 2})`).join(", ")
			// matching values: [word1, anagrams1, word2, anagrams2, ...]
			const values = chunk.flatMap((word) => [word, getAnagrams(word)])

			await pool.query(`INSERT INTO wordles (word, valid_anagrams) VALUES ${placeholders}`, values)
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
