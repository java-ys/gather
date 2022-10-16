import Main from "_a/main"
import parentView from "_a/parent-view";

export default {
  path: "/opData",
  name: "opData",
  component: Main,
  meta: {
    icon: "md-car",
    title: "运营数据",
    showAlways: true,
    sort: 1
  },
  children: [
    {
      path: "operative-map",
      name: "operative-map",
      meta: {
        title: "运营地图"
      },
      component: () => import("_o/components/operator-data/operative-map/index.vue")
    },
    {
      path: "car-gps",
      name: "car-gps",
      meta: {
        title: "车辆GPS"
      },
      component: () => import("_o/components/operator-data/car-gps/index.vue")
    },
    {
      path: "order-heatMap",
      name: "order-heatMap",
      meta: {
        title: "订单热力图"
      },
      component: () => import("_o/components/operator-data/order-heatMap")
    },
    {
      path: "demand-forecast",
      name: "demand-forecast",
      meta: {
        title: "供需预测",
        notCache: true,
        showAlways: true,
      },
      component: parentView,
      children: [
        {
          path: "realTime-forecase",
          name: "realTime-forecase",
          meta: {
            title: "实时供需预测",
            notCache: true
          },
          component: () => import("_o/components/operator-data/demand-forecast/realTime-forecast/index.vue")
        },
        {
          path: "history-compare",
          name: "history-compare",
          meta: {
            title: "历史供需匹配",
            notCache: true
          },
          component: () => import("_o/components/operator-data/demand-forecast/history-compare/index.vue")
        },
        {
          path: "distribution-forecase",
          name: "distribution-forecase",
          meta: {
            title: "供需实时分布",
            notCache: true
          },
          component: () => import("_o/components/operator-data/demand-forecast/distribution-forecast/index.vue")
        }
      ]
    },
    // {
    //   path: "operative-map-customer",
    //   name: "operative-map-customer",
    //   meta: {
    //     title: "运营地图"
    //   },
    //   component: () => import("_o/components/operator-data-customer/operative-map/index.vue")
    // },
    // {
    //   path: "car-gps-customer",
    //   name: "car-gps-customer",
    //   meta: {
    //     title: "车辆GPS"
    //   },
    //   component: () => import("_o/components/operator-data-customer/car-gps/index.vue")
    // },
    // {
    //   path: "order-heatMap-customer",
    //   name: "order-heatMap-customer",
    //   meta: {
    //     title: "订单热力图"
    //   },
    //   component: () => import("_o/components/operator-data-customer/order-heatMap")
    // }
  ]
}

