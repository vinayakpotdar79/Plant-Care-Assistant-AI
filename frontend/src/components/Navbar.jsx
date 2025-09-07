import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const {logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className=" top-0 left-0 w-full z-50 bg-emerald-600/80 backdrop-blur-md text-white shadow-md">
  <div className="w-full flex items-center justify-between md:px-14 py-3">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          🌱 Flora AI
        </Link>

        {/* Hamburger (mobile only) */}
        <button className="md:hidden block" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Links (desktop only) */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-gray-200">
            My Plants
          </Link>
          <Link to="/add-plant" className="hover:text-gray-200">
            Add Plant
          </Link>
           <Link to="/dashboard" className="hover:text-gray-200">
            Dashboard
          </Link>
          <Link to="/report-issue" className="hover:text-gray-200">
            Report Issue
          </Link>
          <Link to="/profile" className="hover:text-gray-200">
            Profile
          </Link>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile dropdown (overlay, not pushing content) */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-emerald-700/95 backdrop-blur-lg px-4 py-4 space-y-4 md:hidden">
          <Link to="/" className="block hover:text-gray-200"onClick={() => setIsOpen(false)}>
            My Plants
          </Link>
          <Link to="/add-plant" className="block hover:text-gray-200"onClick={() => setIsOpen(false)}>
            Add Plant
          </Link>
          <Link to="/report-issue" className="block hover:text-gray-200"onClick={() => setIsOpen(false)}>
            Report Issue
          </Link>
          <Link to="/rewards" className="block hover:text-gray-200"onClick={() => setIsOpen(false)}>
            Rewards
          </Link>
          <Link to="/profile" className="block hover:text-gray-200" onClick={() => setIsOpen(false)}>
            Profile
          </Link>
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
