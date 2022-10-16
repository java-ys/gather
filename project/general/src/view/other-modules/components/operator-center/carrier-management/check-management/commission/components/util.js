export const findInList = (key, v, list) => {
  return list.find(t => t[key] === v || t[key] - v === 0)
}
