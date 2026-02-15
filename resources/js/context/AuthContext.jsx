import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('lendarios_token'));

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/v1/user');
            setUser(response.data);
        } catch (error) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await axios.post('/api/v1/autenticar', { email, password });
        const { access_token, user } = response.data;
        
        localStorage.setItem('lendarios_token', access_token);
        setToken(access_token);
        setUser(user);
        return response.data;
    };

    const register = async (data) => {
        const response = await axios.post('/api/v1/registrar', data);
        const { access_token, user } = response.data;
        
        localStorage.setItem('lendarios_token', access_token);
        setToken(access_token);
        setUser(user);
        return response.data;
    };

    const logout = async () => {
        try {
            await axios.post('/api/v1/logout');
        } catch (e) {
            // Silencioso
        }
        localStorage.removeItem('lendarios_token');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            loading, 
            login, 
            register, 
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
