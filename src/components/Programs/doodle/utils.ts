interface Coordinates {
  x: number;
  y: number;
}

export const getCoordinates = (
  event: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
): Coordinates => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  const x = Math.floor(((event.clientX - rect.left) * scaleX));
  const y = Math.floor(((event.clientY - rect.top) * scaleY));
  
  return { x, y };
};

export const snapToGrid = (coord: number, gridSize: number): number => {
  return Math.floor(coord / gridSize) * gridSize;
}; 