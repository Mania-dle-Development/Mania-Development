import GitHubStrategy from "passport-github2";
import { pool } from "./database.js";

// GitHub Strategy Config
const options = {
	clientID: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET,
	callbackURL: process.env.GITHUB_CALLBACK_URL,
};

// verify callback function
const verify = async (accessToken, refreshToken, profile, callback) => {
	const {
		_json: { id, login, avatar_url },
	} = profile;
	const userData = {
		githubId: id,
		username: login,
		avatarUrl: avatar_url,
	};
	try {
		// finds if the user in the database based on their github id
		// not great to use username b/c it can be easily updated and changed
		const results = await pool.query("SELECT * FROM users WHERE github_id = $1", [
			userData.githubId,
		]);
		const user = results.rows[0];

		// if the user has not logged into the app before, insert their info into the database
		if (!user) {
			const results = await pool.query(
				`INSERT INTO users (username, avatar, github_id)
        VALUES($1, $2, $3)
        RETURNING *`,
				[userData.username, userData.avatarUrl, userData.githubId],
			);

			const newUser = results.rows[0];

			return callback(null, newUser);
		}
		return callback(null, user);
	} catch (error) {
		return callback(error);
	}
};

export const GitHub = new GitHubStrategy(options, verify);
