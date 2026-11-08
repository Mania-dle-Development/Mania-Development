import { useAuth } from "../contexts/AuthContext.jsx";
import LogoutIcon from "../assets/logout-icon.svg";
import SwitcharooIcon from "../assets/switcharoo-icon.svg";
import ClockModeIcon from "../assets/clock-icon.svg";
import HintIcon from "../assets/hint-icon.svg";
import LeaderboardIcon from "../assets/leaderboard-icon.svg";
import CustomWordleIcon from "../assets/custom-wordle-icon.svg";
import ProfileIcon from "../assets/profile-icon.svg";

export default function SidebarMenu() {
	const { user, logout } = useAuth();
	return (
		<div className="absolute top-1/2 left-5 -translate-y-1/2 z-10 bg-[#0014280D] p-4 rounded-[6.25rem]">
			<div className="flex flex-col gap-2.5 items-center">
				{/* user actions */}
				<div className="flex flex-col gap-1 bg-[linear-gradient(0deg,#FFF,#FFF),linear-gradient(0deg,rgba(97,224,95,0.05),rgba(97,224,95,0.05))] p-2.5 rounded-full">
					<button
						onClick={logout}
						className="cursor-pointer size-20 rounded-full flex items-center justify-center bg-[linear-gradient(0deg,rgba(224,95,142,0.15),rgba(224,95,142,0.15)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))] hover:bg-[linear-gradient(0deg,rgba(224,95,142,0.3),rgba(224,95,142,0.3)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))]"
					>
						<img src={ProfileIcon} />
					</button>
					<button
						onClick={logout}
						className="cursor-pointer size-20 rounded-full flex items-center justify-center bg-[linear-gradient(0deg,rgba(224,95,142,0.15),rgba(224,95,142,0.15)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))] hover:bg-[linear-gradient(0deg,rgba(224,95,142,0.3),rgba(224,95,142,0.3)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))]"
					>
						<img src={LeaderboardIcon} />
					</button>
					<button
						onClick={logout}
						className="cursor-pointer size-20 rounded-full flex items-center justify-center bg-[linear-gradient(0deg,rgba(224,95,142,0.15),rgba(224,95,142,0.15)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))] hover:bg-[linear-gradient(0deg,rgba(224,95,142,0.3),rgba(224,95,142,0.3)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))]"
					>
						<img src={HintIcon} />
					</button>
				</div>
				{/* games */}
				<div className="flex flex-col gap-1 bg-[linear-gradient(0deg,#FFF,#FFF),linear-gradient(0deg,rgba(97,224,95,0.05),rgba(97,224,95,0.05))] p-2.5 rounded-full">
					<button
						onClick={logout}
						className="cursor-pointer size-20 rounded-full flex items-center justify-center bg-[linear-gradient(0deg,rgba(218,99,59,0.15),rgba(218,99,59,0.15)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))] hover:bg-[linear-gradient(0deg,rgba(218,99,59,0.3),rgba(218,99,59,0.3)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))]"
					>
						<img src={CustomWordleIcon} />
					</button>
					<button
						onClick={logout}
						className="cursor-pointer size-20 rounded-full flex items-center justify-center bg-[linear-gradient(0deg,rgba(218,99,59,0.15),rgba(218,99,59,0.15)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))] hover:bg-[linear-gradient(0deg,rgba(218,99,59,0.3),rgba(218,99,59,0.3)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))]"
					>
						<img src={SwitcharooIcon} />
					</button>
					<button
						onClick={logout}
						className="cursor-pointer size-20 rounded-full flex items-center justify-center bg-[linear-gradient(0deg,rgba(218,99,59,0.15),rgba(218,99,59,0.15)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))] hover:bg-[linear-gradient(0deg,rgba(218,99,59,0.3),rgba(218,99,59,0.3)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))]"
					>
						<img src={ClockModeIcon} />
					</button>
				</div>
				{/* exit / logout */}
				{user && (
					<div className="bg-[linear-gradient(0deg,#FFF,#FFF),linear-gradient(0deg,rgba(97,224,95,0.05),rgba(97,224,95,0.05))] p-2.5 rounded-full">
						<button
							onClick={logout}
							className="cursor-pointer size-20 rounded-full flex items-center justify-center bg-[linear-gradient(0deg,rgba(97,224,95,0.15),rgba(97,224,95,0.15)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))] hover:bg-[linear-gradient(0deg,rgba(97,224,95,0.3),rgba(97,224,95,0.3)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))]"
						>
							<img src={LogoutIcon} />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
