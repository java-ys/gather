export default [
  {
    path: "/login",
    name: "login",
    meta: {
      title: "Login - 登录",
      hideInMenu: true
    },
    component: () => import("_a/login/login.vue")
  },
  {
    path: "/forget-pwd",
    name: "forget-pwd",
    meta: {
      title: "忘记密码",
      hideInMenu: true
    },
    component: () => import("_a/forget-pwd/forget-pwd.vue")
  },
  {
    path: "/change-pwd",
    name: "change-pwd",
    meta: {
      title: "修改密码",
      hideInMenu: true
    },
    component: () => import("_a/change-pwd/change-pwd.vue")
  },
];
