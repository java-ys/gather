const files = require.context("../view", true, /router\/index\.js$/);

let dynamicRouters = [];

files.keys().forEach(key => {
  dynamicRouters = dynamicRouters
    .concat(files(key).default)
    .filter(route => !!route.path);
});

export default dynamicRouters;
