import Main from "_a/main";

export default {
  path: "/",
  name: "_home",
  redirect: "/home",
  component: Main,
  meta: {
    hideInMenu: true,
    notCache: true
  },
  children: [
    {
      path: "/home",
      name: "home",
      meta: {
        hideInMenu: true,
        title: "工作台首页",
        icon: "md-home"
      },
      component: () => import("_a/home")
    }
  ]
};
