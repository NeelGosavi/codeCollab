import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

console.log('🔗 API Base URL:', API_BASE_URL);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📡 Making request to:', config.url);
    return config;
});

// Auth APIs
export const signup = (userData) => api.post('/auth/signup', userData);
export const login = (loginData) => api.post('/auth/login', loginData);

// Room APIs
export const createRoom = (roomData, email) => api.post('/rooms/create', roomData, {
    headers: { 'X-User-Email': email }
});

export const getRoom = (roomId, email) => api.get(`/rooms/${roomId}`, {
    headers: { 'X-User-Email': email }
});

export const joinRoom = (roomId, email) => api.post('/rooms/join', { roomId }, {
    headers: { 'X-User-Email': email }
});

export const getUserRooms = (email) => api.get('/rooms/my-rooms', {
    headers: { 'X-User-Email': email }
});

export const updateCode = (roomId, codeContent, email) => api.put(`/rooms/${roomId}/code`, codeContent, {
    headers: { 
        'X-User-Email': email,
        'Content-Type': 'text/plain'
    }
});

export const executeCode = (executionData) => api.post('/execute', executionData);

export const deleteRoom = (roomId, email) => {
    console.log('DELETE request to:', `/rooms/${roomId}`, 'with email:', email);
    return api.delete(`/rooms/${roomId}`, {
        headers: { 'X-User-Email': email }
    });
};

export const leaveRoom = (roomId, email) => api.post(`/rooms/${roomId}/leave`, {}, {
    headers: { 'X-User-Email': email }
});

export default api;