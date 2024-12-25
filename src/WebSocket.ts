import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from './config';

export function useWebSocket(isAuthenticated: boolean) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const connectWebSocket = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('No auth token found for WebSocket connection');
      return null;
    }

    const domain = new URL(API_BASE_URL).host;
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${domain}/connect`;
    const ws = new WebSocket(wsUrl, [token]);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('WebSocket received message:', message);
        
        if (!message || typeof message !== 'object') {
          console.warn('Invalid message format received');
          return;
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onopen = () => {
      console.log('WebSocket connected');
      // Clear any existing reconnection timeout
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = undefined;
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setSocket(null);
      // Schedule reconnection attempt
      if (isAuthenticated) {
        reconnectTimeout.current = setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          const newSocket = connectWebSocket();
          if (newSocket) setSocket(newSocket);
        }, 5000);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return ws;
  };

  useEffect(() => {
    let ws: WebSocket | null = null;

    if (isAuthenticated) {
      ws = connectWebSocket();
      if (ws) setSocket(ws);
    }

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [isAuthenticated]);

  return socket;
} 