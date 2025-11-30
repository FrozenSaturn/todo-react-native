import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.106:8000';

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
        // console.log('Token from SecureStore:', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
            console.log('Received 401 from API');
            // Let AuthContext handle the logout logic via state check or event
            // We won't delete the token here to avoid race conditions
            // But we can redirect to ensure the user is moved away
            const { router } = require('expo-router');
            router.replace('/auth/login');
        }
        return Promise.reject(error);
    }
);

export default apiClient;
