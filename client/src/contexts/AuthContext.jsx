import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState({ status: false, message: "" });

	useEffect(() => {
		const getUser = async () => {
			setLoading(true);
			setError({ status: false, message: "" });
			try {
				// checks to see if the user is authenticated
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login/success`, {
					credentials: "include",
				});
				const json = await response.json();
				setUser(json.user);
			} catch (error) {
				setError({ status: true, message: error });
			}
			setLoading(false);
		};
		getUser();
	}, []);

	// logs the user out and redirects them to login page
	const logout = async () => {
		const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`;
		const response = await fetch(url, { credentials: "include" });
		await response.json();
		window.location.href = "/login";
	};

	const value = {
		user,
		logout,
		loading,
		error,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export default AuthContext;
