export const toNumber = (val) => {
  let v = `${val}`.replace(/[^\d\.]/g, "");
  let vArr = v.split(".");
  if (vArr.length > 2) {
    v = vArr.slice(0, 2).join(".");
  }
  if (vArr[1] && vArr[1].length > 6) {
    v = Number(v).toFixed(6);
  }
  if (v > 100) {
    v = 100;
  } else if (v < 0) {
    // v = 0;
  }
  return v;
};

export const toNum = (val) => {
  let v = `${val}`;
  v = `${val}`.replace(/[^\d\.-]/g, "");
  let vArr = v.split(".");
  if (vArr.length > 2) {
    v = vArr.slice(0, 2).join(".");
  }
  if (vArr[1] && vArr[1].length > 6) {
    v = Number(v).toFixed(6);
  }
  return v;
};
