import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.0.104:8000'; // Updated to local IP for device access

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
apiClient.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('userToken');
        console.log('Token from SecureStore:', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Authorization Header:', config.headers.Authorization);
        } else {
            console.log('No token found in SecureStore');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.log('Received 401, clearing token and redirecting to login');
            await SecureStore.deleteItemAsync('userToken');
            // We can't easily access AuthContext's logout here, but we can force a navigation
            // Ideally, AuthContext should listen to this, but for now:
            // You might need to reload the app or use a global event emitter.
            // For simplicity, let's just let the error propagate, but the user will be logged out on next app load/check.
            // Or better, import router
            const { router } = require('expo-router');
            router.replace('/auth/login');
        }
        return Promise.reject(error);
    }
);

export default apiClient;
