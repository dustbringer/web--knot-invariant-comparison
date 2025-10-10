export function randRange(min: number, max: number) {
  // exclusive of 'max'
  return min + Math.floor(Math.random() * (max - min));
  // crypto.randomInt(min, max); // for node 23
}

export function randElem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
