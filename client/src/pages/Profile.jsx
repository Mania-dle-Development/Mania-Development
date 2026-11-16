import ProfileHeader from "../components/Profile/ProfileHeader.jsx";
import StatCards from "../components/Profile/StatCards.jsx";
import GuessDistribution from "../components/Profile/GuessDistribution.jsx";
import RecentGames from "../components/Profile/RecentGames.jsx";
import useProfile from "../hooks/useProfile.js";


export default function Profile() {
	//call hook for profile
	const {profile, error} = useProfile()

	//frontend for profile
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
