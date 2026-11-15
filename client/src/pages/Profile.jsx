import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ProfileHeader from "../components/Profile/ProfileHeader.jsx";
import StatCards from "../components/Profile/StatCards.jsx";
import GuessDistribution from "../components/Profile/GuessDistribution.jsx";
import RecentGames from "../components/Profile/RecentGames.jsx";

const PROFILE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/profile`;

export default function Profile() {
	const navigate = useNavigate();
	const [profile, setProfile] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const controller = new AbortController();

		const loadProfile = async () => {
			try {
				// credentials: "include" sends the login cookie with the request
				const response = await fetch(PROFILE_URL, {
					credentials: "include",
					signal: controller.signal,
				});

				// not logged in, so send the user to the login page
				if (response.status === 401) {
					navigate("/login");
					return;
				}
				if (!response.ok) {
					throw new Error(`Request failed with status ${response.status}`);
				}

				setProfile(await response.json());
			} catch (err) {
				// ignore the abort that happens when the page unmounts
				if (err.name === "AbortError") return;
				console.error(`Profile Error: ${err}`);
				setError("We couldn't load your profile. Try again in a moment.");
			}
		};

		loadProfile();
		return () => controller.abort();
	}, [navigate]);

	return (
		<main className="bg-white min-h-screen">
			<title>Profile | Mania-dle</title>
			{/* the sidebar is rendered by the app-level layout */}
			<div className="mx-auto w-full max-w-250 min-h-screen bg-[#0014280D] px-6 py-8 md:px-10 md:py-12 lg:px-14 lg:pt-24 lg:pb-16 font-sans text-text">
				<div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
					<h1 className="font-pixel text-[2.5rem] md:text-[3.25rem] lg:text-[4rem] leading-none">
						PROFILE
					</h1>

					{error && (
						<p role="alert" className="text-[1.125rem] md:text-[1.5rem] lg:text-[2rem]">
							{error}
						</p>
					)}

					{!error && !profile && (
						<p className="text-[1.125rem] md:text-[1.5rem] lg:text-[2rem]">
							Loading your profile...
						</p>
					)}

					{profile && (
						<>
							<ProfileHeader
								username={profile.username}
								avatar={profile.avatar}
								joinedAt={profile.joinedAt}
							/>
							<StatCards
								played={profile.played}
								solveRate={profile.solveRate}
								currentStreak={profile.currentStreak}
								bestStreak={profile.bestStreak}
							/>
							<GuessDistribution distribution={profile.guessDistribution} />
							<RecentGames games={profile.recentGames} />
						</>
					)}
				</div>
			</div>
		</main>
	);
}
