import Main from "_a/main";

export default {
  path: "/ground-push-management",
  name: "ground-push-management",
  component: Main,
  meta: {
    icon: "ios-clipboard",
    title: "地推",
    showAlways: true,
    showWhenDev: true,
    sort: 18
  },
  children: [
    // {
    //   path: "ground-push-team",
    //   name: "ground-push-team",
    //   meta: {
    //     title: "团队管理",
    //     showWhenDev: true,
    //   },
    //   component: () =>
    //     import("_o/components/ground-push-manage/ground-push-team/index.vue")
    // },
    {
      path: "ground-push-order",
      name: "ground-push-order",
      meta: {
        title: "地推单管理",
        showWhenDev: true,
      },
      component: () =>
        import("_o/components/ground-push-manage/ground-push-order/index.vue")
    },
    // {
    //   path: "ground-push-data",
    //   name: "ground-push-data",
    //   meta: {
    //     title: "数据看板",
    //     showWhenDev: true,
    //   },
    //   component: () =>
    //     import("_o/components/ground-push-manage/ground-push-data/index.vue")
    // },
  ]
};
