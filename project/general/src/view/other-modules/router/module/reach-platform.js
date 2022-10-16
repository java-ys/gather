import Main from "_a/main";

export default {
  path: "/reach_platform",
  name: "reach_platform",
  component: Main,
  meta: {
    icon: "ios-send",
    title: "触达平台",
    showWhenDev: true,
  },
  children: [
    {
      path: "app-manage",
      name: "app-manage",
      meta: {
        showWhenDev: true,
        title: "应用管理",
        notCache: true,
      },
      component: () => import("_o/components/reach-platform/app-manage/index.vue")
    },
    {
      path: "app-manage/:id",
      name: "app-info",
      alias: "app-manage/create",
      meta: {
        title: "应用详情",
        notCache: true,
      },
      component: () => import("_o/components/reach-platform/app-manage/info.vue")
    },
    {
      path: "template-manage",
      name: "template-manage",
      meta: {
        showWhenDev: true,
        notCache: true,
        title: "模板管理"
      },
      component: () => import("_o/components/reach-platform/template-manage/index.vue"),
    },
    {
      path: "template-manage/:id",
      name: "template-info",
      alias: "template-manage/create",
      meta: {
        title: "模板详情",
        notCache: true,
      },
      component: () => import("_o/components/reach-platform/template-manage/info.vue")
    },
    {
      path: "fatigue-manage",
      name: "fatigue-manage",
      meta: {
        showWhenDev: true,
        title: "疲劳度管理",
        notCache: true,
      },
      component: () => import("_o/components/reach-platform/fatigue-manage/index.vue"),
    },
    {
      path: "fatigue-manage/:id",
      name: "fatigue-info",
      alias: "fatigue-manage/create",
      meta: {
        title: "疲劳度详情",
        notCache: true,
      },
      component: () => import("_o/components/reach-platform/fatigue-manage/info.vue")
    },
    {
      path: "task-manage",
      name: "task-manage",
      meta: {
        showWhenDev: true,
        notCache: true,
        title: "任务查询",
      },
      component: () => import("_o/components/reach-platform/task-manage/index.vue")
    },
  ]
};
