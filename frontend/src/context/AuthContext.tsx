import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/apiServices/auth.api';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
    user: any;
    loading: boolean;
    login: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const checkAuth = async () => {
        try {
            const res = await authApi.getMe();
            if (res.ok) {
                setUser(res.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (!loading) {
            const isAuthPage = ['/login', '/register'].includes(location.pathname);
            if (user && isAuthPage) {
                navigate('/dashboard');
            }
        }
    }, [user, loading, location.pathname, navigate]);

    const login = async (data: any) => {
        const res = await authApi.login(data);
        if (res && res.ok) {
            await checkAuth();
            navigate('/dashboard');
        }
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
