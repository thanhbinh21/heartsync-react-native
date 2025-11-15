import { Platform } from 'react-native';

const getApiUrl = () => {
  // Production
  if (!__DEV__) {
    return 'https://api.heartsync.app/api';
  }

  // Development - Use backend IP (works for all platforms)
  // Backend is running at: http://192.168.1.31:5000
  const BACKEND_IP = '192.168.1.31';
  const BACKEND_PORT = '5000';
  
  return `http://${BACKEND_IP}:${BACKEND_PORT}/api`;
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Log for debugging
console.log('🌐 API Config:');
console.log('  Platform:', Platform.OS);
console.log('  DEV mode:', __DEV__);
console.log('  Base URL:', API_CONFIG.BASE_URL);