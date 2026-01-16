import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/apiServices/auth.api';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
    user: any;
    loading: boolean;
    login: (data: any) => Promise<boolean>;
    register: (data: any) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await authApi.getMe();
                if (res?.ok) {
                    setUser(res.data);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
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
        if (res?.ok) {
            setUser(res.data.user);
            return true;
        }
        return false;
    };

    const register = async (data: any) => {
        const res = await authApi.register(data);
        if (res?.ok) {
            setUser(res.data.user);
            return true;
        }
        return false;
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
