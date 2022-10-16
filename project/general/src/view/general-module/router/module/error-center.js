import Main from "_a/main";

export default [
  {
    path: "/401",
    name: "error_401",
    meta: {
      hideInMenu: true
    },
    component: () => import("_a/error-page/401.vue")
  },
  {
    path: "/500",
    name: "error_500",
    meta: {
      hideInMenu: true
    },
    component: () => import("_a/error-page/500.vue")
  },
  {
    path: "*",
    name: "error_404",
    meta: {
      hideInMenu: true
    },
    component: () => import("_a/error-page/404.vue")
  },
  {
    path: "/error_logger",
    name: "error_logger",
    meta: {
      hide: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: "error_logger_page",
        name: "error_logger_page",
        meta: {
          icon: "ios-bug",
          title: "错误收集"
        },
        component: () => import("_a/error-page/error-logger.vue")
      },
      {
        path: "/404",
        name: "error_404",
        meta: {
          hideInMenu: true
        },
        component: () => import("_a/error-page/404.vue")
      },
    ]
  }
];
