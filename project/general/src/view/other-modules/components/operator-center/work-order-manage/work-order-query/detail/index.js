const files = require.context(".", false, /.*\.vue$/);
const dynamicStoreModules = {};
let moduleList = [];

files.keys().forEach(key => {
  const module = files(key).default;
  moduleList = moduleList.concat(module);
});

for (const module of moduleList) {
  if (!module || !module.name) {
    continue
  }
  dynamicStoreModules[toUpper(module.name)] = module;
}
// aa-bb-cc => AaBbCc
function toUpper(str="") {
  if(!str) return ""
  let a = str.split('-');
  let len = a.length;
  if(!len) return ""
  let s = firstToUpper(a[0]);
  for(let i = 1; i < len; i++) {
   s += firstToUpper(a[i])
  }
  return s
}
// word -> Word
function firstToUpper(s = "") {
  let a = s.split("");
  return a[0].toUpperCase() + a.slice(1).join("")
}
export default dynamicStoreModules;
