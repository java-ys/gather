export default [
  {
    path: "/opData/operative-map-customer",
    name: "operative-map-customer",
    meta: {
      title: "运营地图"
    },
    component: () => import("_o/components/operator-data-customer/operative-map/index.vue")
  },
  {
    path: "/opData/car-gps-customer",
    name: "car-gps-customer",
    meta: {
      title: "车辆GPS"
    },
    component: () => import("_o/components/operator-data-customer/car-gps/index.vue")
  },
  {
    path: "/opData/order-heatMap-customer",
    name: "order-heatMap-customer",
    meta: {
      title: "订单热力图"
    },
    component: () => import("_o/components/operator-data-customer/order-heatMap")
  }
];
