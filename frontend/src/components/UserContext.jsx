import React, { createContext, useContext, useState, useEffect } from "react";

// UserContext.js
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profilePhoto, setProfilePhoto] = useState();

 

  
  return (
    <UserContext.Provider value={{ profilePhoto, setProfilePhoto }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
