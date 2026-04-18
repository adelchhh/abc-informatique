import axios from 'axios';
window.axios = axios;

// Configurer la base URL pour l'API Laravel
window.axios.defaults.baseURL = 'https://abcinformatique.org';
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
