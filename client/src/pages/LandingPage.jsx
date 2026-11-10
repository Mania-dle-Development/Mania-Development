import Header from "../components/Header.jsx";
import ZigZagSeparator from "../assets/zig-zag-separator.svg";
import { useAuth } from "../contexts/AuthContext.jsx";
import ModeButton from "../components/ModeButton.jsx";

export default function LandingPage() {
	const { user } = useAuth();
	return (
		<div className="bg-[#0283B3] min-h-screen min-w-screen">
			<title>Landing | Mania-dle</title>
			<div className="relative min-h-screen flex flex-col">
				<div className="min-h-screen top-0 bottom-0 left-55 right-55 absolute z-1 bg-[#0014280D] pointer-events-none" />
				<div className="mx-55 py-20 flex flex-col gap-8 items-center text-sans">
					<Header />
				</div>
				<img src={ZigZagSeparator} alt="separator" />
				<div className="bg-white flex-1 flex flex-col">
					<div className="mx-55 flex-1 py-12.5 px-11.25 flex flex-col gap-8.75">
						<p className="text-[#001428] text-[50px] font-sans">
							Hi {user ? user.username : "Guest"}, pick a mode
						</p>
						<ModeButton mode="classic" />
						<ModeButton mode="switcharoo" />
						<ModeButton mode="clock" />
						<ModeButton mode="gallery" />
					</div>
				</div>
			</div>
		</div>
	);
}
