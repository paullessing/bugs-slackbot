export function getUnique<T>(values: T[], comparator?: (a: T, b: T) => boolean): T[] {
  values = values.filter(x => !!x);
  if (!comparator) {
    return values.filter((value, index) => values.indexOf(value) === index);
  } else {
    const returnValues = [];
    values.forEach((value) => {
      if (!returnValues.find((r) => comparator(r, value))) {
        returnValues.push(value);
      }
    });
    return returnValues;
  }
}
