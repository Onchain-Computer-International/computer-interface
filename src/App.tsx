import { useContext, useState, useEffect } from 'react';
import Desktop from './components/Desktop/Desktop';
import LoginScreen from './components/Desktop/LoginScreen';
import { AuthContext } from './Provider';
import RetroFrame from './components/Desktop/RetroFrame';
import LoadingScreen from './components/Desktop/LoadingScreen';
import { playCRTGlitchSound, playStartupSound } from './components/Desktop/Sounds';
import { playKeyboardSound } from './components/Desktop/KeyboardSounds';

function App() {
  const { isAuthenticated, login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      playKeyboardSound(event.key);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    await login();
    // Simulate boot time
    setTimeout(() => {
      setFlash(true);
      playCRTGlitchSound();
      setTimeout(() => {
        setFlash(false);
        setIsLoading(false);
        // Play startup sound after desktop is shown
        setTimeout(() => {
          playStartupSound();
        }, 100);
      }, 400);
    }, 6000);
  };

  return (
    <div className="w-screen h-screen overflow-hidden">
      <RetroFrame>
        {flash && (
          <>
            <div className="absolute inset-0 z-50">
              {/* Primary flash effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white via-cyan-300 to-white opacity-70 mix-blend-screen animate-crt-flash" />
              {/* Multiple scanline layers */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-40 animate-scanline" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-30 animate-scanline-delayed" />
              </div>
              {/* Color distortion and chromatic aberration */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent mix-blend-color animate-color-shift" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500/20 mix-blend-color animate-color-shift-delayed" />
              </div>
              {/* Phosphor afterglow */}
              <div className="absolute inset-0 bg-phosphor mix-blend-screen animate-phosphor" />
            </div>
          </>
        )}
        {isAuthenticated ? (
          isLoading ? (
            <LoadingScreen />
          ) : (
            <Desktop />
          )
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </RetroFrame>
    </div>
  );
}

export default App;