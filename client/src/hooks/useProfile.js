import {useNavigate} from "react-router";
import {useEffect, useState} from "react";

//URL to call backend API
const PROFILE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/profile`;

export default function useProfile() {
    //create React elements used to populate page
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

                //test
                console.log(response);

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

    return {profile, error}
}