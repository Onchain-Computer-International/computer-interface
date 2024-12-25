import { useState, useEffect, useContext } from 'react';
import { Twitter, User, Wallet, Shield, MessageCircle } from 'lucide-react';
import { AuthContext } from '../../../Provider';

type ConnectedAccount = {
  platform: string;
  username: string;
  verified: boolean;
};

export default function Settings() {
  const { user, socket } = useContext(AuthContext);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [isConnectingX, setIsConnectingX] = useState(false);
  const [isConnectingTelegram, setIsConnectingTelegram] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!socket) return;

    const handleWebSocketMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'accounts-update':
          setConnectedAccounts(data.accounts);
          break;
        case 'connect-error':
          setError(data.message);
          setIsConnectingX(false);
          setIsConnectingTelegram(false);
          break;
        case 'telegram-code':
          alert(`To connect your Telegram account, send this code to @onchain_computer_bot: ${data.code}`);
          break;
      }
    };

    socket.addEventListener('message', handleWebSocketMessage);

    // Request initial accounts data
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'get-connected-accounts',
        address: user.address
      }));
    }

    return () => {
      socket.removeEventListener('message', handleWebSocketMessage);
    };
  }, [socket, user.address]);

  const handleConnectX = () => {
    setIsConnectingX(true);
    setError('');
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'connect-x-account',
        address: user.address
      }));
    }
  };

  const handleConnectTelegram = () => {
    setIsConnectingTelegram(true);
    setError('');
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'connect-telegram',
        address: user.address
      }));
    }
  };

  const handleDisconnectAccount = (platform: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'disconnect-account',
        address: user.address,
        platform
      }));
    }
  };

  return (
    <div className="h-full bg-gray-100 p-4 overflow-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Identity Section */}
        <section className="bg-white p-4 rounded-lg shadow win95-border">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Identity
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Ethereum Address</p>
                  <p className="text-sm text-gray-600">{user.address}</p>
                </div>
              </div>
              <Shield className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </section>

        {/* Connected Accounts Section */}
        <section className="bg-white p-4 rounded-lg shadow win95-border">
          <h2 className="text-lg font-bold mb-4">Connected Accounts</h2>
          
          <div className="space-y-4">
            {/* X (Twitter) Connection */}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <Twitter className="w-5 h-5" />
                <div>
                  <p className="font-medium">X (Twitter)</p>
                  {connectedAccounts.find(acc => acc.platform === 'twitter') ? (
                    <p className="text-sm text-gray-600">
                      @{connectedAccounts.find(acc => acc.platform === 'twitter')?.username}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Not connected</p>
                  )}
                </div>
              </div>
              
              {connectedAccounts.find(acc => acc.platform === 'twitter') ? (
                <button
                  onClick={() => handleDisconnectAccount('twitter')}
                  className="win95-button text-sm"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={handleConnectX}
                  disabled={isConnectingX}
                  className="win95-button text-sm"
                >
                  {isConnectingX ? 'Connecting...' : 'Connect'}
                </button>
              )}
            </div>

            {/* Telegram Connection */}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <div>
                  <p className="font-medium">Telegram</p>
                  {connectedAccounts.find(acc => acc.platform === 'telegram') ? (
                    <p className="text-sm text-gray-600">
                      @{connectedAccounts.find(acc => acc.platform === 'telegram')?.username}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Not connected</p>
                  )}
                </div>
              </div>
              
              {connectedAccounts.find(acc => acc.platform === 'telegram') ? (
                <button
                  onClick={() => handleDisconnectAccount('telegram')}
                  className="win95-button text-sm"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={handleConnectTelegram}
                  disabled={isConnectingTelegram}
                  className="win95-button text-sm"
                >
                  {isConnectingTelegram ? 'Connecting...' : 'Connect'}
                </button>
              )}
            </div>

            {error && (
              <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
                {error}
              </div>
            )}
          </div>
        </section>

        {/* System Info Section */}
        <section className="bg-white p-4 rounded-lg shadow win95-border">
          <h2 className="text-lg font-bold mb-4">System Information</h2>
          <div className="space-y-2 text-sm">
            <p>OS: Onchain Computer 1.0</p>
            <p>Memory: 640K</p>
            <p>Display: CRT Mode</p>
            <p>Network: Connected</p>
          </div>
        </section>
      </div>
    </div>
  );
}