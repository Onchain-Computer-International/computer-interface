import { useState, useEffect } from 'react';
import { API_BASE_URL } from './config';

export function useWebSocket(isAuthenticated: boolean) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;

    if (isAuthenticated) {
      const domain = new URL(API_BASE_URL).host;
      const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${domain}/connect`;
      ws = new WebSocket(wsUrl);

      // Set socket immediately so message handlers can be attached
      setSocket(ws);

      ws.onmessage = (event) => {
        console.log('WebSocket received message:', event.data);
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