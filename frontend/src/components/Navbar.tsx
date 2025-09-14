import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gray-800 text-gray-100 px-6 py-4 shadow-md rounded">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold tracking-wide">Techdex</h1>

                {/* Hamburger button (mobile only) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden text-gray-100 focus:outline-none"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {isOpen ? (
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

                {/* Desktop menu */}
                <div className="hidden lg:flex space-x-6 text-xl">
                    <Link to="/" className="hover:text-blue-400 transition-colors">
                        Youtube
                    </Link>
                    <Link to="/articles" className="hover:text-blue-400 transition-colors">
                        Articles
                    </Link>
                    <Link to="/people" className="hover:text-blue-400 transition-colors">
                        People
                    </Link>
                    <Link to="/papers" className="hover:text-blue-400 transition-colors">
                        Papers
                    </Link>
                    <Link to="/ctf" className="hover:text-blue-400 transition-colors">
                        CTF
                    </Link>
                    <Link to="/my-blogs" className="hover:text-blue-400 transition-colors">
                        My blogs
                    </Link>
                    <Link to="https://github.com/tren03" target="_blank" className="hover:text-blue-400 transition-colors">
                        GitHub
                    </Link>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="lg:hidden mt-4 flex flex-col space-y-2 text-lg">
                    <Link to="/" className="hover:text-blue-400 transition-colors">
                        Youtube
                    </Link>
                    <Link to="/articles" className="hover:text-blue-400 transition-colors">
                        Articles
                    </Link>
                    <Link to="/people" className="hover:text-blue-400 transition-colors">
                        People
                    </Link>
                    <Link to="/papers" className="hover:text-blue-400 transition-colors">
                        Papers
                    </Link>
                    <Link to="/ctf" className="hover:text-blue-400 transition-colors">
                        CTF
                    </Link>
                    <Link to="/my-blogs" className="hover:text-blue-400 transition-colors">
                        My blogs
                    </Link>
                    <Link to="https://github.com/tren03" target="_blank" className="hover:text-blue-400 transition-colors">
                        GitHub
                    </Link>
                </div>
            )}
        </nav>
    );
}