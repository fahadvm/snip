import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/apiServices/auth.api';
import { useNavigate, useLocation } from 'react-router-dom';
import type { User, LoginPayload, RegisterPayload } from '../types/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginPayload) => Promise<boolean>;
    register: (data: RegisterPayload) => Promise<boolean>;
    verifyOtp: (email: string, otp: string) => Promise<boolean>;
    resendOtp: (email: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await authApi.getMe();
                if (res && res.ok) {
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

    const login = async (data: LoginPayload) => {
        const res = await authApi.login(data);
        if (res && res.ok) {
            setUser(res.data.user);
            return true;
        }
        return false;
    };

    const register = async (data: RegisterPayload) => {
        const res = await authApi.register(data);
        return res?.ok || false;
    };

    const verifyOtp = async (email: string, otp: string) => {
        const res = await authApi.verifyOtp({ email, otp });
        if (res && res.ok) {
            setUser(res.data.user);
            return true;
        }
        return false;
    };

    const resendOtp = async (email: string) => {
        const res = await authApi.resendOtp(email);
        return res?.ok || false;
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, resendOtp, logout }}>
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
