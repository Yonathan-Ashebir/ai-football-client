export function findIntersection<Type>(arrays: Type[][], areEqual: (a: Type, b: Type) => boolean = (a, b) => a === b): Type[] {
  if (arrays.length === 0) return [];

  return arrays.reduce((acc, currentArray) =>
    acc.filter((item) => currentArray.some((item2) => areEqual(item, item2)))
  );
}
