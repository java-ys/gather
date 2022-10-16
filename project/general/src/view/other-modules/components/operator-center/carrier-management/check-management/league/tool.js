
export const removeDuplicate = (list, uniqueKey) => {
  let map = new Map();
  for (let item of list) {
    if (!map.has(item[uniqueKey])) {
      map.set(item[uniqueKey], item);
    }
  }
  return [...map.values()];
}
