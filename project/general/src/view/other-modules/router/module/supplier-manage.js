import Main from "_a/main";

export default {
  path: "/supplier-management",
  name: "supplier-management",
  component: Main,
  meta: {
    icon: "ios-clipboard",
    title: "供应商管理",
    showAlways: true,
    sort: 18
  },
  children: [
    {
      path: "info-management",
      name: "info-management",
      meta: {
        title: "供应商信息管理"
      },
      component: () =>
        import("_o/components/supplier-management/info-management/index.vue")
    },
  ]
};
