import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../api/authAPI';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'executive' | 'pm' | 'tpm' | 'em' | 'sre';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isExecutive: boolean;
  isPM: boolean;
  isTPM: boolean;
  isEM: boolean;
  isSRE: boolean;
  hasInputAccess: boolean;
  hasFullAccess: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getCurrentUser()
        .then(response => {
          if (response.data.success) {
            setUser(response.data.data);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.data.success) {
        const { token, user: userData } = response.data.data;
        localStorage.setItem('token', token);
        setUser(userData);
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Optionally call logout API
    authAPI.logout().catch(() => {
      // Ignore errors on logout
    });
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isExecutive: user?.role === 'executive',
    isPM: user?.role === 'pm',
    isTPM: user?.role === 'tpm',
    isEM: user?.role === 'em',
    isSRE: user?.role === 'sre',
    hasInputAccess: user?.role === 'admin' || user?.role === 'pm' || user?.role === 'tpm' || user?.role === 'em',
    hasFullAccess: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
