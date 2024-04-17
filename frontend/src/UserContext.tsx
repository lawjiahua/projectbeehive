import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from './models/User'

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    token: string | null
    setToken: React.Dispatch<React.SetStateAction<string | null>>  
}

const initialUserContext: UserContextType = {
    isLoggedIn: false,
    user: null,
    token: '',
    setIsLoggedIn: () => {},  // Provide noop functions as placeholders
    setUser: () => {},
    setToken: () => {}
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(initialUserContext.token);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initialUserContext.isLoggedIn);

    return (
        <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, token, setToken }}>
            {children}
        </UserContext.Provider>
    );
};