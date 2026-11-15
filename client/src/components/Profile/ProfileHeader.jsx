import { useEffect, useRef, useState } from "react";

// the link added to the share message
// replace this once the real link exists
const SHARE_LINK = "[soon-to-be-made-link]";

// the message copied to the clipboard when the user presses share
// edit this function to change the wording later
const buildShareMessage = (username) =>
	`I'm ${username}, and I'm playing Mania-dle. You can play too at this link ${SHARE_LINK}`;

// how long the button says "Copied!" before going back to "Share"
const COPIED_RESET_MS = 2000;

// turns an ISO date into "Oct 2026"
function formatJoined(joinedAt) {
	if (!joinedAt) return "";
	const date = new Date(joinedAt).toLocaleDateString("en-US", {
		month: "short",
		year: "numeric",
	});
	return `Joined ${date}`;
}

export default function ProfileHeader({ username, avatar, joinedAt }) {
	const [copied, setCopied] = useState(false);
	const [avatarFailed, setAvatarFailed] = useState(false);
	const resetTimer = useRef(null);

	// clear the timer if the component unmounts mid-countdown
	useEffect(() => () => clearTimeout(resetTimer.current), []);

	const handleShare = async () => {
		try {
			await navigator.clipboard.writeText(buildShareMessage(username));
			setCopied(true);
			clearTimeout(resetTimer.current);
			resetTimer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
		} catch (error) {
			console.error(`Share Error: ${error}`);
		}
	};

	// shows the first two letters of the username if there is no avatar image
	const showImage = avatar && !avatarFailed;
	const avatarSize = "size-20 md:size-28 lg:size-35";

	return (
		<section className="flex flex-wrap items-center gap-x-4 gap-y-4 md:gap-x-8">
			{showImage ? (
				<img
					src={avatar}
					alt={`${username}'s avatar`}
					onError={() => setAvatarFailed(true)}
					className={`${avatarSize} shrink-0 rounded-full border-[3px] md:border-4 border-secondary-pink object-cover`}
				/>
			) : (
				<div
					aria-hidden="true"
					className={`${avatarSize} shrink-0 rounded-full border-[3px] md:border-4 border-secondary-pink bg-secondary-pink/20 flex items-center justify-center font-pixel text-secondary-pink text-[1.75rem] md:text-[2.5rem] lg:text-[3.5rem]`}
				>
					{username.slice(0, 2).toUpperCase()}
				</div>
			)}

			<div className="flex flex-col flex-1 min-w-40">
				<h2 className="font-bold text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] leading-tight wrap-anywhere">
					{username}
				</h2>
				<p className="text-[1.125rem] md:text-[1.5rem] lg:text-[2rem] leading-tight">
					{formatJoined(joinedAt)}
				</p>
			</div>

			<button
				onClick={handleShare}
				className="min-w-30 md:min-w-38 lg:min-w-47 px-4 py-2 md:px-5 flex items-center justify-center gap-2 rounded-[0.85rem] border-[3px] md:border-4 border-text bg-secondary-pink hover:brightness-95 text-white text-[1rem] md:text-[1.5rem] lg:text-[2rem] cursor-pointer"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="size-5 md:size-6 lg:size-8"
					aria-hidden="true"
				>
					<circle cx="18" cy="5" r="3" />
					<circle cx="6" cy="12" r="3" />
					<circle cx="18" cy="19" r="3" />
					<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
					<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
				</svg>
				<span aria-live="polite">{copied ? "Copied!" : "Share"}</span>
			</button>
		</section>
	);
}
