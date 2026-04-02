import axios from 'axios';
window.axios = axios;

// Configurer la base URL pour l'API Laravel
window.axios.defaults.baseURL = 'http://localhost:8000';
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
