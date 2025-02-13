import React, { createContext, useContext, useState } from 'react';

type UserType = 'patient' | 'doctor';

type User = {
  firstName: string;
  userId?: number;
  doctorId?: number;
  userType?: UserType;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  setAuthenticated: (
    value: boolean,
    token?: string,
    userData?: User
  ) => void;
  logout: () => void;
};

const defaultContextValue: AuthContextType = {
  isAuthenticated: false,
  user: null,
  setAuthenticated: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

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
      localStorage.setItem('user', JSON.stringify({
        firstName: userData.firstName,
        userId: userData.userId,
        doctorId: userData.doctorId,
        userType: userData.userType
      }));
      setUser({
        firstName: userData.firstName,
        userId: userData.userId,
        doctorId: userData.doctorId,
        userType: userData.userType
      });
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