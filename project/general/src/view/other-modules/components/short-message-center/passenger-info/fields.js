export const findKeyInList = (value, key, list) => {
  return list.find(l => (key ? l[key] === value : l === value)) || {}
}
