import axios from 'axios';
import { NavigateFunction } from 'react-router-dom';
import { AppDispatch, store } from '../reduxConfig/store';
import { setAccessToken } from '../../redux/auth/authSlice';

// Let dispatch be undefined initially
let dispatch: AppDispatch | undefined = undefined;
let navigate: NavigateFunction | undefined = undefined;

// Function to initialize Axios with the dispatch
export const initializeAxios = (appDispatch: AppDispatch, navFunction: NavigateFunction) => {
    dispatch = appDispatch;
    navigate = navFunction
};

const api = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true, // Axios will include any cookies associated with the request's domain in the Cookie header of the request
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const access_token = store.getState().persistedReducer.auth.access_token
    if (access_token) {
        config.headers['Authorization'] = `Bearer ${access_token}`;
    }
    return config;
})

// Add a response interceptor
api.interceptors.response.use(
    response => {
        // Handle successful responses
        if (response.status === 200) {
            // Store the new access token in Redux if present
            if (response.data.access_token && dispatch) {
                dispatch(setAccessToken(response.data.access_token));
            }
        }
        return response;
    },
    error => {
        if (error.response) {
            console.error('Erreur de réponse:', error.response.data);
            console.error('Statut HTTP:', error.response.status);

            // Check the HTTP status code to handle specific cases
            if (error.response.status === 401) {
                console.error('Token expiré ou non valide');
                // Navigate to the login page
                if (navigate) {
                    navigate('/login');
                }
            }

            // Store the new access token in Redux if present in the error response
            if (error.response.data.access_token && dispatch) {
                dispatch(setAccessToken(error.response.data.access_token));
            }
        } else if (error.request) {
            console.error('Pas de réponse reçue:', error.request);
        } else {
            console.error('Erreur:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;