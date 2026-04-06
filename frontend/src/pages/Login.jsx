import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api";
import "../styles/LandingPage.css";
import NavBar from "../components/NavBar";
import { useState } from "react";

function Login({ setUser }) {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await api.post("/api/auth/google/", {
                credential: credentialResponse.credential,
            });
            setUser(res.data.user);
            navigate("/");
        } catch (err) {
            setError("Google login failed. Please try again.");
        }
    };

    const handleGoogleError = () => {
        setError("Google login failed. Please try again.");
    };

    return (
        <div className="landing-container">
            <NavBar />
            <header className="landing-header">
                <h1 className="landing-title">Task Managements</h1>
                <p className="landing-subtitle">
                    Sign in to access your tasks and manage your workflow.
                </p>
                <div className="google-login-button">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                </div>
            </header>
        </div>
    );
}

export default Login;
