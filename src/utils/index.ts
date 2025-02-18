import Fuse, {IFuseOptions} from "fuse.js";

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

export function roundGoals(goals: number | undefined) {
  return goals === undefined? 0: Math.round(goals);
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

/**
 * Determines the best match for an array of strings (`searchFor`)
 * against a 2D array of strings (`searchIn`) using Fuse.js.
 *
 * Returns the string array (subarray) from `searchIn` that achieved the best match
 * along with the score of the best match.
 *
 * @param searchFor - An array of strings to search for.
 * @param searchIn - A 2D array of strings to search in.
 * @param threshold
 * @returns An object with the best matching string array and the best match score.
 */
export const matchString = (
  searchFor: string[],
  searchIn: string[][], threshold: number = 0.3
): { matchedArray: string[]; bestScore: number, bestTerm: string } | null => {

  const options: IFuseOptions<string> = {
    includeScore: true,
    threshold,
  };

  let bestScore = Infinity;
  let bestMatchArray: string[] | null = null;
  let bestTerm: string | null = null;

  for (const subArray of searchIn) {
    const fuse = new Fuse(subArray, options);

    for (const term of searchFor) {
      const results = fuse.search(term);

      if (results.length > 0) {
        const lowestScore = results[0].score || 0;
        if (lowestScore < bestScore) {
          bestScore = lowestScore;
          bestMatchArray = subArray;
          bestTerm = term
        }
      }
    }
  }

  return bestMatchArray ? {matchedArray: bestMatchArray, bestScore, bestTerm: bestTerm!} : null;
};
