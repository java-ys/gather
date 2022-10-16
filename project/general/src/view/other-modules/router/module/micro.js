import Main from "_a/main";

export default {
  path: "/micro",
  name: "micro-app",
  component: Main,
  meta: {
    title: 'vue 子应用',
    // showAlways: true,
    isMicroApp: true,
  },
  children: [
    // {
    //   path: "/vue/c",
    //   name: "vue-c",
    //   meta: {
    //     title: "vue 列表",
    //     isMicroApp: true,
    //   },
    // },
  ]
};
