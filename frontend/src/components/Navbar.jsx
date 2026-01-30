// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/1erhibo.png";

function Navbar({ className = "" }) {
  return (
    <nav className={`navbar ${className}`}>
      <div className="navbar-inner">
        {/* Gauche : logo */}
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <img src={logo} alt="CryptoSight logo" className="nav-logo-img" />
          </Link>
        </div>

        {/* Centre : liens */}
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/market">Market</Link>
          </li>
        </ul>

        {/* Droite : actions */}
        <div className="nav-right">
          <button className="nav-text-btn">
            Login
          </button>
          <Link to="/market" className="nav-cta-btn">
            Predire
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
