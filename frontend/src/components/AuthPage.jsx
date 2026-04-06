import { useState } from "react";
import { useNavigate } from "react-router-dom";


function AuthPage() {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>Welcome</h1>
                <p>Continue with Google to sign in.</p>

                {error && <p className="error-message">{error}</p>}

                <GoogleLoginButton
                    onSuccess={() => navigate("/")}
                    onError={setError}
                />
            </div>
        </div>
    );
}

export default AuthPage;