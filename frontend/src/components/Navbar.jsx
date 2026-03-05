import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookOpen, LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-white dark:bg-dark-surface shadow-sm border-b border-gray-100 dark:border-dark-border py-4 px-6 md:px-12 flex justify-between items-center transition-colors duration-200">
      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-500 hover:text-primary-700 transition"
      >
        <BookOpen className="w-6 h-6" />
        <span>CollabNote</span>
      </Link>

      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-300 font-medium hidden sm:block">
              {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-3 py-2 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/40 rounded-lg transition"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-primary-600 text-white font-medium hover:bg-primary-700 rounded-lg shadow-sm transition"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
