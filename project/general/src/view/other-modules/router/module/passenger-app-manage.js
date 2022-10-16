import Main from "_a/main"

export default {
  path: "/passenger-app-manage",
  name: "passenger-app-manage",
  component: Main,
  meta: {
    title: "乘客APP管理",
    icon: "md-list-box",
    showAlways: true,
  },
  children: [
    {
      name: "vehicle-default",
      path: "vehicle-default",
      component: () => import("_o/components/passenger-app-manage/vehicle-default"),
      meta: {
        showWhenDev: true,
        title: "确认用车页默认车型配置"
      }
    },
    {
      name: "fare-page-manage",
      path: "fare-page-manage",
      component: () => import("_o/components/passenger-app-manage/fare-page-manage"),
      meta: {
        showWhenDev: true,
        title: "费用详情页面配置"
      }
    },
    {
      name: "fare-rule-manage",
      path: "fare-rule-manage",
      component: () => import("_o/components/passenger-app-manage/fare-rule-manage/index"),
      meta: {
        showWhenDev: true,

        title: "计价规则页面配置"
      }
    },
    {
      name: "question-manage",
      path: "question-manage",
      component: () => import("_o/components/passenger-app-manage/question-manager"),
      meta: {
        showWhenDev: true,
        title: "费用说明/常见问题配置"
      },
    },
    {
      name: "calling-manage",
      path: "calling-manage",
      component: () => import("_o/components/passenger-app-manage/calling-manage"),
      meta: {
        title: "实时正在呼叫页管理",
        webType: 0
      }
    },
    {
      name: "reserve-calling-manage",
      path: "reserve-calling-manage",
      component: () => import("_o/components/passenger-app-manage/calling-manage"),
      meta: {
        title: "预约正在呼叫页管理",
        webType: 1
      }
    },
    {
      name: "car-sort",
      path: "car-sort",
      component: () => import("_o/components/passenger-app-manage/car-sort"),
      meta: {
        title: "车型展示顺序管理"
      }
    },
    {
      name: "car-desc",
      path: "car-desc",
      component: () => import("_o/components/passenger-app-manage/car-desc"),
      meta: {
        title: "车型文案展示管理",
        // showWhenDev: true,
      }
    },
    {
      name: "price-inform-manage",
      path: "price-inform-manage",
      component: () => import("_o/components/passenger-app-manage/price-inform"),
      meta: {
        title: "特殊费用告知管理",
        showWhenDev: true,
      },
    },
    {
      name: "home-page",
      path: "home-page",
      component: () => import("_o/components/passenger-app-manage/home-page/index"),
      meta: {
        title: "首页风格管理"
      }
    },
  ]
}
