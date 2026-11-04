import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { GitHub } from "./config/auth.js";

const app = express();

app.use(express.json());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	}),
);
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		methods: "GET,POST,PUT,DELETE,PATCH",
		credentials: true,
	}),
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(GitHub);

passport.serializeUser((user, done) => {
	const { accesstoken, ...sessionUser } = user;
	done(null, sessionUser);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

app.get("/", (req, res) => {
	res.status(200).send('<h1 style="text-align: center; margin-top: 50px;"> Mania-dle </h1>');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
