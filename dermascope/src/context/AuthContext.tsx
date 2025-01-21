import React, { createContext, useContext, useState } from 'react';

type User = {
  firstName: string;
  userId: number;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  setAuthenticated: (value: boolean, token?: string, userData?: User) => void;
  logout: () => void;
};

// Create the context with a default value matching the type
const defaultContextValue: AuthContextType = {
  isAuthenticated: false,
  user: null,
  setAuthenticated: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Export the hook before the provider
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Changed to function declaration for better HMR compatibility
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('token') !== null;
  });

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const setAuthenticated = (value: boolean, token?: string, userData?: User) => {
    setIsAuthenticated(value);
    if (value && token && userData) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const contextValue = {
    isAuthenticated,
    user,
    setAuthenticated,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}