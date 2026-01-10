import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user exists in localStorage
        const storedUser = localStorage.getItem('opshandover_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Simple sign in - just store user info
    const signIn = async (email, name) => {
        const userData = {
            email,
            user_metadata: {
                full_name: name
            },
            id: `user_${Date.now()}` // Simple ID for now
        };

        localStorage.setItem('opshandover_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
    };

    // Sign out
    const signOut = async () => {
        localStorage.removeItem('opshandover_user');
        setUser(null);
    };

    const value = {
        user,
        loading,
        signIn,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
