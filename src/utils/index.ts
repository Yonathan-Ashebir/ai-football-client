export function findIntersection<Type>(arrays: Type[][], areEqual: (a: Type, b: Type) => boolean = (a, b) => a === b): Type[] {
  if (arrays.length === 0) return [];

  return arrays.reduce((acc, currentArray) =>
    acc.filter((item) => currentArray.some((item2) => areEqual(item, item2)))
  );
}


export function filterKeys<K extends string | number | symbol = string, V = any>(record: { [k in K]?: V }, ...keysToRemove: K[]) {
  return Object.fromEntries(
    Object.entries(record).filter(([key]) => !keysToRemove.includes(key as K))
  ) as { [k in K]?: V };
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

export function replaceUnderscoreAndHyphen(str: string) {
  return str.replace(/[_-]/g, " ");
}

export function areDependenciesChanged(oldDep: readonly any[] | null | undefined, newDep: readonly any[] | null | undefined) {
  if (!oldDep || !newDep || oldDep.length !== newDep.length) return true
  return oldDep.some((item, ind) => !Object.is(item, newDep[ind]));
}


export function roundToNearest(num: number, decimalPlaces: number = 2) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor
}

export function createManagedPromise() {
  let resolveFunc: (_: any) => void | undefined, rejectFunc: (_: any) => void | undefined;

  // Create a new promise and store the resolve and reject functions
  const promise = new Promise((resolve, reject) => {
    resolveFunc = resolve;  // Store the resolve function
    rejectFunc = reject;    // Store the reject function
  });

  // Return the promise and an object to control it
  return {
    promise,
    resolve: resolveFunc!,
    reject: rejectFunc!
  };
}
