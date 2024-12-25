import React, { useState, useContext } from 'react';
import { Wallet } from 'lucide-react';
import { useAccount, useConnect, useSignMessage } from 'wagmi';
import { AuthContext } from '../../Provider';

interface LoginScreenProps {
  onLogin: () => Promise<void>;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const { address, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { signMessageAsync } = useSignMessage();

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      console.log('Starting login flow with:', { 
        address, 
        chainId: chain?.id,
        hasConnectors: connectors.length > 0 
      });

      if (!address || !chain?.id) {
        console.log('No address or chain ID, connecting wallet first...');
        const connector = connectors[0];
        console.log('Using connector:', connector);
        await connect({ connector });
        return;
      }

      console.log('Proceeding with login...');
      const success = await login(address, chain.id, signMessageAsync);
      console.log('Login result:', success);
      
      if (!success) {
        setError('Login failed. Please try again.');
      } else {
        await onLogin();
      }
    } catch (err) {
      console.error('Login error in component:', err);
      setError('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="h-full flex items-center justify-center p-4 [image-rendering:pixelated]"
      style={{
        backgroundColor: '#111',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='8' height='8' fill='%23000' /%3E%3Crect width='1' height='1' fill='%23333' x='0' y='0' /%3E%3C/svg%3E")`,
        backgroundSize: '8px 8px'
      }}
    >
      <div className="w-full max-w-[400px] bg-black border-[6px] border-[#333] p-6 text-white [image-rendering:pixelated] shadow-[8px_8px_0px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8 bg-black border-4 border-[#444] p-4">
          <h1 className="text-2xl font-[Press_Start_2P] text-white mb-4 tracking-wider pixelated">Welcome /onchain</h1>
          <div className="h-2 w-32 mx-auto bg-[#444]" />
        </div>
        
        {error && (
          <div className="text-white text-sm p-4 mb-6 bg-black border-4 border-[#444] font-[Press_Start_2P] text-xs">
            {error}
          </div>
        )}

        <div className="flex items-center mb-8 bg-black border-4 border-[#444] p-4">
          <svg 
            viewBox="0 0 24 24" 
            className="w-20 h-20 mr-4 text-white [image-rendering:pixelated]"
            fill="currentColor"
            style={{ 
              transform: 'scale(0.8)', 
              imageRendering: 'pixelated',
              filter: 'drop-shadow(2px 2px 0 #000)'
            }}
          >
            <path d="M7 15h3c.55 0 1-.45 1-1v-1.5c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1V14c0 .55.45 1 1 1zm12-6h-1V7c0-2.76-2.24-5-5-5S8 4.24 8 7v2H7c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-9-2V7c0-1.66 1.34-3 3-3s3 1.34 3 3v2h-6z"/>
          </svg>
          <div>
            <p className="font-[Press_Start_2P] text-white mb-4 text-sm">Connect your Ethereum Wallet</p>
            <p className="text-xs text-[#666] font-[Press_Start_2P] leading-[1.8]">Sign a message with MetaMask to access your Onchain Computer.</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-4 px-6 bg-black text-white border-[6px] font-[Press_Start_2P] text-sm
            border-t-[#444] border-l-[#444] border-r-[#222] border-b-[#222]
            hover:bg-[#111] active:border-t-[#222] active:border-l-[#222] 
            active:border-r-[#444] active:border-b-[#444] disabled:opacity-50 
            disabled:cursor-not-allowed transition-colors shadow-[4px_4px_0px_rgba(0,0,0,0.5)]
            active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>

          <p className="text-xs text-center text-[#666] font-[Press_Start_2P] leading-[1.8]">
            Your wallet needs to hold an Onchain Computer.
          </p>
        </div>
      </div>
    </div>
  );
}