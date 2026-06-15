import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, signup as signupApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            setUser(userData);
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await loginApi({ email, password });
            const { token, message } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ email }));
            setToken(token);
            setUser({ email });
            return { success: true, message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (username, email, password) => {
        try {
            const response = await signupApi({ username, email, password });
            const { token, message } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ email, username }));
            setToken(token);
            setUser({ email, username });
            return { success: true, message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Signup failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        navigate('/');  // Redirect to landing page
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};