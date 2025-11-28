// frontend/src/components/Navbar.jsx
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-logo">CryptoPlace</div>

    
      <button
        className={`nav-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      
      <div className={`nav-right ${isOpen ? "show" : ""}`}>
        <ul className="nav-links">
          <li>Home</li>
          <li>Market</li>
          <li>Community</li>
          <li>About</li>
        </ul>
        <button className="nav-login-btn">Log in</button>
      </div>
    </nav>
  );
}

export default Navbar;
