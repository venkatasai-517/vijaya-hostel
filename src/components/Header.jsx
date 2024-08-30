import { useState } from "react";
import { signOut } from "firebase/auth";
import { logout } from "../helper";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css"; // Add this import at the top of your Header.js file

const Header = () => {
  const [activeItem, setActiveItem] = useState("");
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const handleSetActive = (id) => {
    setActiveItem(id);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand text-white badge text-bg-dark" href="#">
          HOSTEL MANAGMENT
        </a>
        <button
          className="navbar-toggler text-bg-secondary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-4 ms-5">
            <li className="nav-item">
              <a
                id="dashboard"
                className={`nav-link badge ${
                  activeItem === "dashboard"
                    ? "active bg-secondary text-white"
                    : "text-white"
                }`}
                aria-current="page"
                href="/dashboard"
                onClick={() => handleSetActive("dashboard")}
              >
                DASHBOARD
              </a>
            </li>
            <li className="nav-item">
              <a
                id="rooms"
                className={`nav-link badge ${
                  activeItem === "rooms"
                    ? " bg-secondary text-white"
                    : "text-white"
                }`}
                aria-current="page"
                href="/room_no"
                onClick={() => handleSetActive("rooms")}
              >
                ROOMS
              </a>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <button
              className="btn badge text-bg-success"
              onClick={handleLogout}
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Header;
