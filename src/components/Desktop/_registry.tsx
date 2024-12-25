import type { Program } from './Desktop';

// This function uses Vite's import.meta.glob to dynamically import all program configs
const programModules = import.meta.glob('../Programs/*/index.tsx', { eager: true });

const programs: Program[] = Object.values(programModules)
  .map((module: any) => module.config)
  .filter(Boolean); // Filter out any undefined configs

export const getPrograms = () => programs; 