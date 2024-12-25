import { useState, useEffect } from 'react';
import { API_BASE_URL } from './config';

export function useWebSocket(isAuthenticated: boolean) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;

    if (isAuthenticated) {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('No auth token found for WebSocket connection');
        return;
      }

      const domain = new URL(API_BASE_URL).host;
      const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${domain}/connect`;
      ws = new WebSocket(wsUrl, [token]);

      // Set socket immediately so message handlers can be attached
      setSocket(ws);

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          // Log parsed message instead of raw data
          console.log('WebSocket received message:', message);
          
          // Validate message structure before processing
          if (!message || typeof message !== 'object') {
            console.warn('Invalid message format received');
            return;
          }
          
          // Add your message handling logic here
          
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setSocket(null);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [isAuthenticated]);

  return socket;
} 