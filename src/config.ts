export const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : 'https://api.onchain.computer';

export const COOKIE_DOMAIN = process.env.NODE_ENV === 'development'
  ? 'localhost'
  : 'onchain.computer'; 