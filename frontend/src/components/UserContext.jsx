import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  // Check if user data exists in localStorage on component mount
  const initialUser = JSON.parse(localStorage.getItem('user')) || null;
  const [user, setUser] = useState(initialUser);

  // Update localStorage whenever the user value changes
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
