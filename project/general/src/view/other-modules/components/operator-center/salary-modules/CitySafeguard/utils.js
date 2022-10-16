export const isFn = fn => typeof fn === "function";
export const isPromise = v => v instanceof Promise;
export const delay = time => new Promise(resolve => setTimeout(resolve, time));

export const listToMap = list => {
  const map = {};
  list.forEach(({ value, label }) => {
    map[value] = label;
  });

  return map;
};

export const noop = () => {};

export const getLabelFromValueLabelList = (value, list = []) => list.find(v => v.value === value)?.label;
