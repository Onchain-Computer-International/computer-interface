import { useState, useEffect } from 'react';

export function useWebSocket(isAuthenticated: boolean) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;

    if (isAuthenticated) {
      const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/connect`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setSocket(ws);
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