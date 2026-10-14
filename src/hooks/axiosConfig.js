import axios from 'axios'
import { pageRoutes } from '../contants/index';

import { DefaultAPIRoute } from '../contants/index';

const api = `${DefaultAPIRoute}/nbpo_api`;

const clearAccessToken = () => {
    localStorage.removeItem('access_token');
};

axios.defaults.baseURL = api;

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        Promise.reject(error)
    });

axios.interceptors.response.use((response) => {
    return response
}, function (error) {
    if (error.response && error.response.status === 401) {
        clearAccessToken();
        return Promise.reject(error);
    }
    if (error.response && error.response.status === 403) {
        // LocalStorageService.clearToken();
        clearAccessToken();
        window.location.href = pageRoutes.LOGIN;

        return Promise.reject(error);
    }
    return Promise.reject(error);
});
