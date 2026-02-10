const getApiBaseUrl = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    if (apiUrl) {
        console.log('Using configured API base:', apiUrl);
        return apiUrl;
    }

    if (import.meta.env.PROD) {
        console.warn('WARNING: Running in production but VITE_API_BASE_URL is not set. Defaulting to localhost, which will likely fail with CORS/mixed-content errors.');
    }

    console.log('Using default API base: http://127.0.0.1:5000/api');
    return 'http://127.0.0.1:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();
