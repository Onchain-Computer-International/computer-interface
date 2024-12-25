import keySpacePress from '../../sounds/keyboard/press/SPACE.mp3';
import keySpaceRelease from '../../sounds/keyboard/release/SPACE.mp3';
import keyEnterPress from '../../sounds/keyboard/press/ENTER.mp3';
import keyEnterRelease from '../../sounds/keyboard/release/ENTER.mp3';
import keyBackspacePress from '../../sounds/keyboard/press/BACKSPACE.mp3';
import keyBackspaceRelease from '../../sounds/keyboard/release/BACKSPACE.mp3';
import keyGenericPressR0 from '../../sounds/keyboard/press/GENERIC_R0.mp3';
import keyGenericPressR1 from '../../sounds/keyboard/press/GENERIC_R1.mp3';
import keyGenericPressR2 from '../../sounds/keyboard/press/GENERIC_R2.mp3';
import keyGenericPressR3 from '../../sounds/keyboard/press/GENERIC_R3.mp3';
import keyGenericPressR4 from '../../sounds/keyboard/press/GENERIC_R4.mp3';
import keyGenericRelease from '../../sounds/keyboard/release/GENERIC.mp3';

export const inkred = {
  key: "inkred",
  caption: "Gateron Red Inks",
  press: {
    SPACE: keySpacePress,
    ENTER: keyEnterPress,
    BACKSPACE: keyBackspacePress,
    GENERICR0: keyGenericPressR0,
    GENERICR1: keyGenericPressR1,
    GENERICR2: keyGenericPressR2,
    GENERICR3: keyGenericPressR3,
    GENERICR4: keyGenericPressR4,
  },
  release: {
    SPACE: keySpaceRelease,
    ENTER: keyEnterRelease,
    BACKSPACE: keyBackspaceRelease,
    GENERIC: keyGenericRelease,
  },
};

let lastKeyPressTime = 0;
const MIN_TIME_BETWEEN_SOUNDS = 20; // Minimum milliseconds between sounds

const getRandomGenericPress = () => {
  const randomIndex = Math.floor(Math.random() * 5);
  const key = `GENERICR${randomIndex}` as keyof typeof inkred.press;
  return inkred.press[key];
};

const createAudio = (src: string) => {
  const audio = new Audio(src);
  audio.volume = 0.5; // Adjust volume as needed
  return audio;
};

export const playKeyboardSound = (key: string) => {
  const now = Date.now();
  if (now - lastKeyPressTime < MIN_TIME_BETWEEN_SOUNDS) return;
  lastKeyPressTime = now;

  // Determine which sound to play based on the key
  let pressSound: string;
  let releaseSound: string;

  switch (key.toUpperCase()) {
    case 'SPACE':
    case ' ':
      pressSound = inkred.press.SPACE;
      releaseSound = inkred.release.SPACE;
      break;
    case 'ENTER':
      pressSound = inkred.press.ENTER;
      releaseSound = inkred.release.ENTER;
      break;
    case 'BACKSPACE':
      pressSound = inkred.press.BACKSPACE;
      releaseSound = inkred.release.BACKSPACE;
      break;
    default:
      pressSound = getRandomGenericPress();
      releaseSound = inkred.release.GENERIC;
  }

  // Play the press sound
  const pressAudio = createAudio(pressSound);
  pressAudio.play();

  // Play the release sound after a short delay
  setTimeout(() => {
    const releaseAudio = createAudio(releaseSound);
    releaseAudio.play();
  }, 50);
};