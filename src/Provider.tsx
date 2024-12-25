import { createContext, useEffect, useState, ReactNode } from 'react';
import { SignMessageArgs } from 'wagmi/actions';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { http, createConfig } from "wagmi";
import { base, baseSepolia, mainnet } from "wagmi/chains";
import { coinbaseWallet, injected, safe } from "wagmi/connectors";
import { useWebSocket } from './WebSocket';
import { login as authLogin, logout as authLogout } from './Authentication';
import { API_BASE_URL } from './config';
import { useWebSocketMessages } from './state/websocketState';

const queryClient = new QueryClient();

const config = createConfig({
  chains: [mainnet, base, baseSepolia],
  connectors: [
    injected(),
    //walletConnect({ projectId }),
    //metaMask(),
    safe(),
    coinbaseWallet({ appName: "Your App Name", preference: "smartWalletOnly" }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  socket: WebSocket | null;
  token: string | null;
  login: (address: string, chainId: number, signMessage: (args: SignMessageArgs) => Promise<string>) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  socket: null,
  token: null,
  login: async () => false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const socket = useWebSocket(isAuthenticated);
  useWebSocketMessages(socket);

  // Check session status on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    console.log('Saved token found:', !!savedToken); // Debug log
    if (savedToken) {
      checkSession(savedToken);
    }
  }, []);

  const checkSession = async (authToken: string) => {
    try {
      console.log('Checking session with token:', authToken); // Debug log
      
      const response = await fetch(`${API_BASE_URL}/api/siwe/session`, {
        headers: {
          'Authorization': `Bearer ${authToken.trim()}` // Ensure token is properly formatted
        }
      });
      
      console.log('Session response status:', response.status); // Debug log
      
      if (response.ok) {
        const data = await response.json();
        console.log('Session response data:', data); // Debug log
        
        setIsAuthenticated(data.authenticated);
        if (data.authenticated && data.user) {
          setUser(data.user);
          setToken(authToken);
        }
      } else {
        // Handle invalid token
        console.error('Session check failed:', response.status);
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    }
  };

  const login = async (
    address: string,
    chainId: number,
    signMessage: (args: SignMessageArgs) => Promise<string>
  ) => {
    const success = await authLogin(address, chainId, signMessage);
    if (success) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await checkSession(token);
      }
    }
    return success;
  };

  const logout = async () => {
    await authLogout(socket);
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, socket, token, login, logout }}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </AuthContext.Provider>
  );
}
