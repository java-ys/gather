const files = require.context("../view", true, /\/store\/index\.js$/);

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
  dynamicStoreModules[module.name] = module;
}

export default dynamicStoreModules;
