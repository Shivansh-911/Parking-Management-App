import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "About", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];
  
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-white">
          Parkeaze
        </NavLink>


        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          //aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        

        <nav className="hidden md:flex space-x-6">
          {navLinks.map(({ name, path }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                isActive
                  ? "text-blue-400 font-semibold border-b-2 border-blue-400"
                  : "text-white hover:text-blue-300"
              }
            >
              {name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Navigation links (mobile dropdown) */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4">
          <nav className="flex flex-col space-y-2">
            {navLinks.map(({ name, path }) => (
              <NavLink
                key={name}
                to={path}
                onClick={() => setIsOpen(false)} // Close menu on click
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "text-white hover:text-blue-300"
                }
              >
                {name}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;