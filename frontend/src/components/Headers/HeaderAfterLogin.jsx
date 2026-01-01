import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';


const HeaderAfterLogin = ({photoUrl}) => {

  const navLinks = [
    { name: "Vehicle", path: "/vehicle" },
    { name: "Bookings", path: "/bookings" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Drive Out", path: "/driveout" },
  ];


  const profileImageUrl = photoUrl || "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000"; 

  return (
    <>
      <header className="bg-gray-900 text-white  z-50 ">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          <NavLink className="text-2xl font-bold text-white"
            to="/user"
          >
            Parkeaze
          </NavLink>

          <div className="flex gap-6">
            <nav className="hidden md:flex items-center space-x-6">
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
            {/* Profile Photo */}
            <NavLink to="/profile">
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white hover:border-blue-400 transition"
              />
            </NavLink>


          </div>
          
          
        </div>
      </header>

      {/* Bottom Navbar for Mobile */}
      <nav className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white flex justify-around items-center py-2 shadow-md md:hidden z-50">
        {navLinks.map(({ name, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              isActive
                ? "text-blue-400 flex flex-col items-center text-sm"
                : "text-white hover:text-blue-300 flex flex-col items-center text-sm"
            }
          >
            {name}
          </NavLink>
        ))}
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="h-5 md:hidden" />
    </>
  );
};

export default HeaderAfterLogin;
