const playWindowOpenSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create two oscillators for a richer mechanical sound
  const oscillator1 = audioContext.createOscillator();
  const oscillator2 = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  // Main tone: quick upward sweep
  oscillator1.type = 'triangle';
  oscillator1.frequency.setValueAtTime(120, audioContext.currentTime);
  oscillator1.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
  
  // Secondary tone: subtle higher frequency for "click" character
  oscillator2.type = 'sine';
  oscillator2.frequency.setValueAtTime(600, audioContext.currentTime);
  oscillator2.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.05);
  
  // Volume envelope with quick attack and natural decay (further reduced volume)
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.002, audioContext.currentTime + 0.1);
  
  oscillator1.connect(gainNode);
  oscillator2.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator1.start(audioContext.currentTime);
  oscillator2.start(audioContext.currentTime);
  oscillator1.stop(audioContext.currentTime + 0.1);
  oscillator2.stop(audioContext.currentTime + 0.1);
};

const playWindowCloseSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create two oscillators for a richer mechanical sound
  const oscillator1 = audioContext.createOscillator();
  const oscillator2 = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  // Main tone: quick downward sweep
  oscillator1.type = 'triangle';
  oscillator1.frequency.setValueAtTime(300, audioContext.currentTime);
  oscillator1.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.1);
  
  // Secondary tone: subtle lower frequency for "thud" character
  oscillator2.type = 'sine';
  oscillator2.frequency.setValueAtTime(400, audioContext.currentTime);
  oscillator2.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.08);
  
  // Volume envelope with quick attack and natural decay (further reduced volume)
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.002, audioContext.currentTime + 0.1);
  
  oscillator1.connect(gainNode);
  oscillator2.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator1.start(audioContext.currentTime);
  oscillator2.start(audioContext.currentTime);
  oscillator1.stop(audioContext.currentTime + 0.1);
  oscillator2.stop(audioContext.currentTime + 0.1);
};

const playMenuSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create two tones for a "pop" effect
  const frequencies = [1200, 900];
  const duration = 0.05;
  
  frequencies.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + (index * 0.02));
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + (index * 0.02));
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + (index * 0.02) + duration
    );
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(audioContext.currentTime + (index * 0.02));
    oscillator.stop(audioContext.currentTime + (index * 0.02) + duration);
  });
};

const playLogoutSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Define melody notes (in Hz) - descending pattern
  const notes = [659.25, 523.25, 392.00, 329.63];
  const noteDuration = 0.1;
  const noteSpacing = 0.08;
  
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + (index * noteSpacing));
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime + (index * noteSpacing));
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + (index * noteSpacing) + noteDuration
    );
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(audioContext.currentTime + (index * noteSpacing));
    oscillator.stop(audioContext.currentTime + (index * noteSpacing) + noteDuration);
  });
};

const playHDDSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create multiple oscillators for complex mechanical sounds
  const osc1 = audioContext.createOscillator();
  const osc2 = audioContext.createOscillator();
  const osc3 = audioContext.createOscillator(); // Added third oscillator for more detail
  const gain1 = audioContext.createGain();
  const gain2 = audioContext.createGain();
  const gain3 = audioContext.createGain();
  
  const soundType = Math.random();
  
  if (soundType < 0.5) {
    // Head seeking sound (mechanical movement)
    osc1.type = 'triangle';
    osc2.type = 'square';
    osc3.type = 'sawtooth';
    
    // Main mechanical movement (stepper motor)
    osc1.frequency.setValueAtTime(60, audioContext.currentTime);
    osc1.frequency.linearRampToValueAtTime(40, audioContext.currentTime + 0.03);
    osc1.frequency.linearRampToValueAtTime(55, audioContext.currentTime + 0.06);
    osc1.frequency.linearRampToValueAtTime(35, audioContext.currentTime + 0.08);
    
    // Servo movement
    osc2.frequency.setValueAtTime(250, audioContext.currentTime);
    osc2.frequency.linearRampToValueAtTime(180, audioContext.currentTime + 0.08);
    
    // Mechanical resonance
    osc3.frequency.setValueAtTime(120, audioContext.currentTime);
    osc3.frequency.linearRampToValueAtTime(80, audioContext.currentTime + 0.08);
    
    gain1.gain.setValueAtTime(0.04, audioContext.currentTime);
    gain1.gain.linearRampToValueAtTime(0.003, audioContext.currentTime + 0.08);
    gain2.gain.setValueAtTime(0.006, audioContext.currentTime);
    gain2.gain.linearRampToValueAtTime(0.003, audioContext.currentTime + 0.08);
    gain3.gain.setValueAtTime(0.012, audioContext.currentTime);
    gain3.gain.linearRampToValueAtTime(0.003, audioContext.currentTime + 0.08);
    
  } else {
    // Read/write head micro-adjustments
    osc1.type = 'triangle';
    osc2.type = 'square';
    osc3.type = 'sine';
    
    // Head positioning
    osc1.frequency.setValueAtTime(80, audioContext.currentTime);
    osc1.frequency.setValueAtTime(70, audioContext.currentTime + 0.02);
    osc1.frequency.setValueAtTime(85, audioContext.currentTime + 0.04);
    osc1.frequency.setValueAtTime(75, audioContext.currentTime + 0.06);
    
    // Electrical components
    osc2.frequency.setValueAtTime(180, audioContext.currentTime);
    osc2.frequency.linearRampToValueAtTime(120, audioContext.currentTime + 0.1);
    
    // Actuator movement
    osc3.frequency.setValueAtTime(90, audioContext.currentTime);
    osc3.frequency.linearRampToValueAtTime(75, audioContext.currentTime + 0.04);
    osc3.frequency.linearRampToValueAtTime(95, audioContext.currentTime + 0.08);
    
    gain1.gain.setValueAtTime(0.021, audioContext.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.003, audioContext.currentTime + 0.1);
    gain2.gain.setValueAtTime(0.0045, audioContext.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.003, audioContext.currentTime + 0.1);
    gain3.gain.setValueAtTime(0.012, audioContext.currentTime);
    gain3.gain.exponentialRampToValueAtTime(0.003, audioContext.currentTime + 0.1);
  }

  // Connect and start oscillators
  osc1.connect(gain1);
  osc2.connect(gain2);
  osc3.connect(gain3);
  gain1.connect(audioContext.destination);
  gain2.connect(audioContext.destination);
  gain3.connect(audioContext.destination);
  
  osc1.start(audioContext.currentTime);
  osc2.start(audioContext.currentTime);
  osc3.start(audioContext.currentTime);
  osc1.stop(audioContext.currentTime + 0.2);
  osc2.stop(audioContext.currentTime + 0.2);
  osc3.stop(audioContext.currentTime + 0.2);
};

const playCRTGlitchSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create two oscillators for a richer sound
  const oscillator1 = audioContext.createOscillator();
  const oscillator2 = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  // First oscillator: high-frequency sweep
  oscillator1.type = 'sine'; // Smoother sine wave
  oscillator1.frequency.setValueAtTime(3000, audioContext.currentTime);
  oscillator1.frequency.exponentialRampToValueAtTime(1500, audioContext.currentTime + 0.15);
  
  // Second oscillator: low-frequency component
  oscillator2.type = 'triangle'; // Warmer triangle wave
  oscillator2.frequency.setValueAtTime(150, audioContext.currentTime);
  oscillator2.frequency.linearRampToValueAtTime(50, audioContext.currentTime + 0.15);
  
  // Gentle volume envelope
  gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
  
  // Connect both oscillators to the gain node
  oscillator1.connect(gainNode);
  oscillator2.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Play the sound
  oscillator1.start(audioContext.currentTime);
  oscillator2.start(audioContext.currentTime);
  oscillator1.stop(audioContext.currentTime + 0.15);
  oscillator2.stop(audioContext.currentTime + 0.15);
};

const playStartupSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Shorter, more impactful chord progression
  const chords = [
    // Initial bright chord
    [
      { freq: 392.00, type: 'sine', time: 0, duration: 0.4 },     // G4 (base)
      { freq: 493.88, type: 'sine', time: 0, duration: 0.4 },     // B4
      { freq: 587.33, type: 'triangle', time: 0, duration: 0.4 }, // D5 (texture)
      { freq: 783.99, type: 'sine', time: 0.1, duration: 0.3 },   // G5 (sparkle)
    ],
    // Resolution chord
    [
      { freq: 523.25, type: 'sine', time: 0.3, duration: 0.3 },    // C5
      { freq: 659.25, type: 'sine', time: 0.3, duration: 0.3 },    // E5
      { freq: 783.99, type: 'triangle', time: 0.3, duration: 0.3 }, // G5
    ]
  ];
  
  chords.forEach(notes => {
    notes.forEach(({ freq, type, time, duration }) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = type as OscillatorType;
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + time);
      
      // Quick attack, smooth release
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + time);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + time + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + time + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(audioContext.currentTime + time);
      oscillator.stop(audioContext.currentTime + time + duration);
    });
  });
};

export { 
  playWindowOpenSound, 
  playWindowCloseSound, 
  playMenuSound, 
  playLogoutSound,
  playHDDSound,
  playCRTGlitchSound,
  playStartupSound
}; 