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
  login: (address: string, chainId: number, signMessage: (args: SignMessageArgs) => Promise<string>) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  socket: null,
  login: async () => false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const socket = useWebSocket(isAuthenticated);

  // Check session status on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/siwe/session`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
    }
  };

  const login = async (
    address: string,
    chainId: number,
    signMessage: (args: SignMessageArgs) => Promise<string>
  ) => {
    const success = await authLogin(address, chainId, signMessage);
    if (success) {
      await checkSession();
    }
    return success;
  };

  const logout = async () => {
    await authLogout(socket);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, socket, login, logout }}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </AuthContext.Provider>
  );
}
