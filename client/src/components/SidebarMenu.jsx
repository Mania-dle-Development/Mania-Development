import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router";
import LogoutIcon from "../assets/logout-icon.svg";
import SwitcharooIcon from "../assets/switcharoo-icon.svg";
import ClockModeIcon from "../assets/clock-icon.svg";
import HomeIcon from "../assets/home-icon.svg";
import CustomWordleIcon2 from "../assets/custom-wordle-icon_2.svg";
import ClassicWordleIcon from "../assets/classic-wordle-icon.svg";
import ProfileIcon from "../assets/profile-icon.svg";
import WordleGalleryIcon from "../assets/gallery-icon.svg";

export default function SidebarMenu() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	return (
		<div className="absolute top-1/2 left-5 -translate-y-1/2 z-10 bg-[#0014280D] p-4 rounded-[6.25rem]">
			<div className="flex flex-col gap-2.5 items-center">
				{/* user actions */}
				<div className="flex flex-col gap-1 bg-[linear-gradient(0deg,#FFF,#FFF),linear-gradient(0deg,rgba(97,224,95,0.05),rgba(97,224,95,0.05))] p-2.5 rounded-full">
					<button
						onClick={() => navigate("/profile")}
						className="cursor-pointer size-20 rounded-full flex items-center justify-center bg-[linear-gradient(0deg,rgba(224,95,142,0.15),rgba(224,95,142,0.15)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))] hover:bg-[linear-gradient(0deg,rgba(224,95,142,0.3),rgba(224,95,142,0.3)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))]"
					>
						<img src={ProfileIcon} />
					</button>
					{/*new-wordle-icon*/}
					<button
						onClick={() => navigate("/create")}
						className="cursor-pointer size-20 rounded-full flex items-center justify-center bg-[linear-gradient(0deg,rgba(224,95,142,0.15),rgba(224,95,142,0.15)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))] hover:bg-[linear-gradient(0deg,rgba(224,95,142,0.3),rgba(224,95,142,0.3)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))]"
					>
						<img src={CustomWordleIcon2} />
					</button>
					{/* Home Button */}
					<button
						onClick={() => navigate("/")}
						className="cursor-pointer size-20 rounded-full flex items-center justify-center bg-[linear-gradient(0deg,rgba(224,95,142,0.15),rgba(224,95,142,0.15)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))] hover:bg-[linear-gradient(0deg,rgba(224,95,142,0.3),rgba(224,95,142,0.3)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))]"
					>
						<img src={HomeIcon} />
					</button>
				</div>
				{/* games */}
				<div className="flex flex-col gap-1 bg-[linear-gradient(0deg,#FFF,#FFF),linear-gradient(0deg,rgba(97,224,95,0.05),rgba(97,224,95,0.05))] p-2.5 rounded-full">
					<button
						onClick={() => navigate("/classic")}
						className="cursor-pointer size-20 rounded-full flex items-center justify-center bg-[linear-gradient(0deg,rgba(218,99,59,0.15),rgba(218,99,59,0.15)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))] hover:bg-[linear-gradient(0deg,rgba(218,99,59,0.3),rgba(218,99,59,0.3)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))]"
					>
						<img src={ClassicWordleIcon} />
					</button>
					<button
						onClick={() => navigate("/switcharoo")}
						className="cursor-pointer size-20 rounded-full flex items-center justify-center bg-[linear-gradient(0deg,rgba(218,99,59,0.15),rgba(218,99,59,0.15)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))] hover:bg-[linear-gradient(0deg,rgba(218,99,59,0.3),rgba(218,99,59,0.3)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))]"
					>
						<img src={SwitcharooIcon} />
					</button>
					<button
						onClick={() => navigate("/clock")}
						className="cursor-pointer size-20 rounded-full flex items-center justify-center bg-[linear-gradient(0deg,rgba(218,99,59,0.15),rgba(218,99,59,0.15)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))] hover:bg-[linear-gradient(0deg,rgba(218,99,59,0.3),rgba(218,99,59,0.3)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))]"
					>
						<img src={ClockModeIcon} />
					</button>
					<button
						onClick={() => navigate("/wordles")}
						className="cursor-pointer size-20 rounded-full flex items-center justify-center bg-[linear-gradient(0deg,rgba(218,99,59,0.15),rgba(218,99,59,0.15)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))] hover:bg-[linear-gradient(0deg,rgba(218,99,59,0.3),rgba(218,99,59,0.3)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))]"
					>
						<img src={WordleGalleryIcon} />
					</button>
				</div>
				{/* exit / logout */}
				<div className="bg-[linear-gradient(0deg,#FFF,#FFF),linear-gradient(0deg,rgba(97,224,95,0.05),rgba(97,224,95,0.05))] p-2.5 rounded-full">
					<button
						onClick={user ? logout : () => navigate("/login")}
						className="cursor-pointer size-20 rounded-full flex items-center justify-center bg-[linear-gradient(0deg,rgba(97,224,95,0.15),rgba(97,224,95,0.15)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))] hover:bg-[linear-gradient(0deg,rgba(97,224,95,0.3),rgba(97,224,95,0.3)),linear-gradient(0deg,rgba(0,20,40,0),rgba(0,20,40,0))]"
					>
						<img src={LogoutIcon} />
					</button>
				</div>
			</div>
		</div>
	);
}
