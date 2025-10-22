export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://192.168.1.31:5000/api'  // Development
    : 'https://api.heartsync.app/api'      // Production
};