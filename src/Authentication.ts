import { SiweMessage } from 'siwe';
import { SignMessageArgs } from 'wagmi/actions';
import { getAddress } from 'viem';
import { API_BASE_URL } from './config';

const YOUR_APP_URL = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ""}`;

export const login = async (
  address: string,
  chainId: number,
  signMessage: (args: SignMessageArgs) => Promise<string>
): Promise<boolean> => {
  try {
    if (!address) {
      throw new Error('Address is required for login');
    }

    const nonceRes = await fetch(`${API_BASE_URL}/api/siwe/nonce`, {
      credentials: 'include'
    });
    const { nonce } = await nonceRes.json();

    const checksummedAddress = getAddress(address);
    const message = new SiweMessage({
      domain: YOUR_APP_URL,
      address: checksummedAddress,
      statement: 'Sign in with Ethereum to the Onchain Computer.',
      uri: window.location.origin,
      version: '1',
      chainId: chainId.toString(),
      nonce,
    });

    const signature = await signMessage({
      message: message.prepareMessage(),
    });

    const verifyRes = await fetch(`${API_BASE_URL}/api/siwe/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, signature }),
      credentials: 'include'
    });

    if (!verifyRes.ok) {
      const errorText = await verifyRes.text();
      throw new Error(`Verification failed: ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error('Login failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    return false;
  }
};

export const logout = async (socket: WebSocket | null) => {
  try {
    await fetch(`${API_BASE_URL}/api/siwe/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    if (socket) {
      socket.close();
    }
  } catch (error) {
    console.error('Logout failed:', error);
  }
}; 