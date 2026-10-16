import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, company?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  savedUsersCount: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = {
  email: 'admin@technova.com',
  password: 'Admin@123',
};

const DEFAULT_USERS_STORAGE_KEY = 'technova_users';
const CURRENT_USER_STORAGE_KEY = 'technova_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [usersList, setUsersList] = useState<Array<User & { password?: string }>>(() => {
    try {
      const saved = localStorage.getItem(DEFAULT_USERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Initial demo customer
    const initialUsers: Array<User & { password?: string }> = [
      {
        id: 'cust-demo-1',
        name: 'Sarah Jenkins (Enterprise Lead)',
        email: 'sarah.jenkins@enterprise.com',
        role: 'customer',
        company: 'Meridian Global Systems',
        password: 'Customer@123',
        createdAt: '2025-01-15T10:00:00.000Z',
      },
    ];
    try {
      localStorage.setItem(DEFAULT_USERS_STORAGE_KEY, JSON.stringify(initialUsers));
    } catch {
      // ignore
    }
    return initialUsers;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync auth state to localStorage', e);
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Check for Admin exclusive credentials
    if (trimmedEmail === ADMIN_CREDENTIALS.email.toLowerCase()) {
      if (password === ADMIN_CREDENTIALS.password) {
        const adminUser: User = {
          id: 'admin-corp-01',
          name: 'TechNova Executive Admin',
          email: ADMIN_CREDENTIALS.email,
          role: 'admin',
          company: 'TechNova Retail & Infrastructure Inc.',
          createdAt: '2024-01-01T00:00:00.000Z',
        };
        setCurrentUser(adminUser);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid enterprise password for Admin account.' };
      }
    }

    // 2. Check for registered customer
    const foundUser = usersList.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (!foundUser) {
      return { success: false, error: 'No account found with this email. Please register or use Demo credentials.' };
    }

    if (foundUser.password && foundUser.password !== password) {
      return { success: false, error: 'Incorrect password. Please verify your credentials.' };
    }

    const customerUser: User = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: 'customer',
      company: foundUser.company,
      createdAt: foundUser.createdAt,
    };

    setCurrentUser(customerUser);
    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    company?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();

    // Check if trying to register admin email
    if (trimmedEmail === ADMIN_CREDENTIALS.email.toLowerCase()) {
      return {
        success: false,
        error: 'Admin accounts cannot be registered. Use existing credentials on the Login page.',
      };
    }

    // Check if email already registered
    const existing = usersList.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please log in.',
      };
    }

    // STRICT BUSINESS RULE: Hardcode role strictly to 'customer'
    const newCustomer: User & { password?: string } = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      role: 'customer', // strictly customer
      company: company?.trim() || 'Enterprise Client',
      password,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...usersList, newCustomer];
    setUsersList(updatedUsers);
    try {
      localStorage.setItem(DEFAULT_USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    } catch (e) {
      console.error(e);
    }

    const safeUser: User = {
      id: newCustomer.id,
      name: newCustomer.name,
      email: newCustomer.email,
      role: 'customer',
      company: newCustomer.company,
      createdAt: newCustomer.createdAt,
    };

    setCurrentUser(safeUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        register,
        logout,
        savedUsersCount: usersList.length,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
