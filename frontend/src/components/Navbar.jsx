import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Menu, X } from "lucide-react";
import Logo from "/Logo.png"
export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-emerald-600/85 backdrop-blur-md text-white shadow-md">
      <div className="w-full flex items-center justify-between md:px-14 px-6 py-3">
        {/* Logo */}
       <Link to="/" className="flex items-center text-xl font-bold hover:opacity-90 transition">
         <img src={Logo} className="w-14 mr-2" alt="Flora AI Logo" />
          {/* The text provides context for the link */}
          <span>Flora AI</span>
        </Link>
        {/* Hamburger (mobile only) */}
        <button
          className="md:hidden block hover:opacity-80 transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Links (desktop only) */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:opacity-80 transition">
            My Plants
          </Link>
          <Link to="/add-plant" className="hover:opacity-80 transition">
            Add Plant
          </Link>
          <Link to="/report-issue" className="hover:opacity-80 transition">
            Ask Flora
          </Link>
          <Link to="/profile" className="hover:opacity-80 transition">
            Profile
          </Link>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-emerald-700/95 backdrop-blur-lg px-6 py-5 space-y-4 md:hidden shadow-lg transition">
          <Link
            to="/"
            className="block hover:opacity-90 transition"
            onClick={() => setIsOpen(false)}
          >
            My Plants
          </Link>
          <Link
            to="/add-plant"
            className="block hover:opacity-90 transition"
            onClick={() => setIsOpen(false)}
          >
            Add Plant
          </Link>
          <Link
            to="/report-issue"
            className="block hover:opacity-90 transition"
            onClick={() => setIsOpen(false)}
          >
             Ask Flora
          </Link>
          <Link
            to="/profile"
            className="block hover:opacity-90 transition"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}