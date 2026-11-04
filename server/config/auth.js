import GitHubStrategy from "passport-github2";
import { pool } from "./database.js";

const options = {
	clientID: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET,
	callbackURL: process.env.GITHUB_CALLBACK_URL,
};

const verify = async (accessToken, refreshToken, profile, callback) => {
	const {
		_json: { id, name, login, avatar_url },
	} = profile;
	const userData = {
		username: login,
		avatarUrl: avatar_url,
	};
	try {
		const results = await pool.query("SELECT * FROM users WHERE username = $1", [
			userData.username,
		]);
		const user = results.rows[0];

		if (!user) {
			const results = await pool.query(
				`INSERT INTO users (username, avatar)
        VALUES($1, $2)
        RETURNING *`,
				[userData.username, userData.avatarUrl],
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
