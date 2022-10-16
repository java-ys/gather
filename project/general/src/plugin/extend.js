const Fragment = {
  name: "fragment",
  functional: true,
  render: (h, ctx) => ctx.children
};


export default (Vue) => {
  Vue.component(Fragment.name, Fragment);
}
