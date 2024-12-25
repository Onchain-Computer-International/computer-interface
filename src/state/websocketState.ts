import { atom } from 'jotai';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

export const onlineUsersAtom = atom<number>(0);

export function useWebSocketMessages(socket: WebSocket | null) {
  const setOnlineUsers = useSetAtom(onlineUsersAtom);

  useEffect(() => {
    if (socket) {
      const messageHandler = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'users-update') {
            setOnlineUsers(Number(message.data));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.addEventListener('message', messageHandler);

      return () => {
        socket.removeEventListener('message', messageHandler);
      };
    }
  }, [socket, setOnlineUsers]);
} 