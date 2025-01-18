export function findIntersection<Type>(arrays: Type[][], areEqual: (a: Type, b: Type) => boolean = (a, b) => a === b): Type[] {
  if (arrays.length === 0) return [];

  return arrays.reduce((acc, currentArray) =>
    acc.filter((item) => currentArray.some((item2) => areEqual(item, item2)))
  );
}


export function removeKeys<K extends string | number | symbol = string, V = any>(record: Record<K, V>, ...keysToRemove: K[]) {
  return Object.fromEntries(
    Object.entries(record).filter(([key]) => !keysToRemove.includes(key as K))
  ) as Record<K, V>;
}

export function getRandomElements(array: any, n: number) {
  if (n > array.length) {
    throw new Error("The number of elements to pick cannot exceed the array length.");
  }

  const result = [];
  const usedIndices = new Set();

  while (result.length < n) {
    const randomIndex = Math.floor(Math.random() * array.length);
    if (!usedIndices.has(randomIndex)) {
      result.push(array[randomIndex]);
      usedIndices.add(randomIndex);
    }
  }

  return result;
}