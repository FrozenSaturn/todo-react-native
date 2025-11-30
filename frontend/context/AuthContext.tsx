import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../services/apiClient';
import { router } from 'expo-router';

interface AuthContextType {
    userToken: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                if (token) {
                    // Validate token
                    try {
                        await apiClient.get('/auth/me', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setUserToken(token);
                    } catch (err) {
                        console.log('Token validation failed, clearing token');
                        await SecureStore.deleteItemAsync('userToken');
                        setUserToken(null);
                    }
                }
            } catch (e) {
                console.error('Failed to load token', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadToken();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            const token = response.data.access_token;
            console.log('Login successful, received token:', token);
            await SecureStore.setItemAsync('userToken', token);
            console.log('Token saved to SecureStore');
            setUserToken(token);
            router.replace('/');
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const signup = async (full_name: string, email: string, password: string) => {
        try {
            await apiClient.post('/auth/signup', { full_name, email, password });
            // Auto login after signup
            await login(email, password);
        } catch (error) {
            console.error('Signup failed', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync('userToken');
            setUserToken(null);
            router.replace('/auth/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AuthContext.Provider value={{ userToken, isLoading, login, signup, logout }}>
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
