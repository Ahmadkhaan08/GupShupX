import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/authContext";
import { Github } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signInWithGitHub, signOut,signInWithGoogle } = useAuth();
  console.log("User data:", user);

  const linkClass = (path: any) =>
    `text-white transition-all duration-300 ${
      location.pathname === path
        ? "p-2 rounded-4xl bg-gradient-to-r from-blue-500 to-purple-500 font-semibold"
        : "hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500"
    }`;

  const displayName = user?.user_metadata.user_name || user?.email;
  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg ">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link className="font-mono text-xl font-bold text-white" to="/">
            GupShup
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent text-3xl ">
              X
            </span>
          </Link>
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link className={linkClass("/")} to="/">
              Home
            </Link>
            <Link className={linkClass("/create")} to="/create">
              Create Posts
            </Link>
            <Link className={linkClass("/community")} to="/community">
              Community
            </Link>
            <Link
              className={linkClass("/communities/create")}
              to="/communities/create"
            >
              Create Communities
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.avatar_url && (
                  <img
                    className="w-8 h-8 rounded-full object-cover"
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                  />
                )}
                <span className="text-gray-300">{displayName}</span>
                <button
                  className="bg-red-500 px-3 py-1 rounded"
                  onClick={signOut}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex  space-x-2">
              <button
  className="flex flex-row items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded hover:opacity-90 transition"
  onClick={signInWithGitHub}
>
  <Github size={20} />
  <span>Sign in with GitHub</span>
</button>
              <button  onClick={signInWithGoogle} className="flex flex-row items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded hover:opacity-90 transition">
  <img src="https://www.svgrepo.com/show/475656/google-color.svg"  className="w-5 h-5 " />
  Sign in with Google
</button>

            </div>
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              onClick={() => setMenuOpen(false)}
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
            >
              Home
            </Link>
            <Link
              to="/create"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-mediumtext-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
            >
              Communities
            </Link>
            <Link
              to="/communities/create"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
            >
              Create Community
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
