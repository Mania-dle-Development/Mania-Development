import express from "express";
import passport from "passport";

const router = express.Router();

// successful login attempt
router.get("/login/success", (req, res) => {
	if (req.user) {
		return res.status(200).json({ success: true, user: req.user });
	}
	res.status(401).json({ success: false, message: "User not authenticated" });
});

// failed login attempt
router.get("/login/failed", (req, res) => {
	res.status(401).json({ success: true, message: "Login Failed" });
});

router.get("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) {
			// passes error to next middleware function
			return next(err);
		}
		// destroys and removes session data if there are no errors
		req.session.destroy((err) => {
			// clear cookie set by express session
			res.clearCookie("connect.sid");
			res.json({ status: "logged out", user: {} });
		});
	});
});

// authenticates the user using github strategy
router.get(
	"/github",
	passport.authenticate("github", {
		scope: ["read:user"],
	}),
);

// called after the user logins into github
// redirects the user to the specified routes on success or failure
router.get(
	"/github/callback",
	passport.authenticate("github", {
		successRedirect: `${process.env.FRONTEND_URL}`,
		failureRedirect: `${process.env.FRONTEND_URL}/login`,
	}),
);

export default router;
