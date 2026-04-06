import { Link } from "react-router-dom"
import "../styles/LandingPage.css"


function NavBar({ user, onLogout }) {
    const isLoggedIn = !!user;

    return (
        <nav className="navbar">
            <h2 className="nav-logo">
                <img src="/logo.png" alt="Logo" className="logo-image" />
                <Link to="/login" className="nav-logo-link">Task Managements</Link>
            </h2>
            <ul className="nav-links">
                <li><a href="#about">About</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#contact">Contact</a></li>
                {isLoggedIn ? (
                    <li><Link to="/">Home</Link></li>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    )
}

export default NavBar