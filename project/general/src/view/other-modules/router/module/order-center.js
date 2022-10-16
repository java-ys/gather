/*
 * @Descritption:
 * @Author: lvzhiyang
 * @Date: 2019-11-02 11:30:07
 * @LastEditors: lvzhiyang
 * @LastEditTime: 2019-11-02 17:11:58
 */
import Main from "_a/main";

export default {
  path: "/order",
  name: "order",
  component: Main,
  meta: {
    icon: "md-list-box",
    title: "订单管理",
    showAlways: true,
    sort: 7
  },
  children: [
    // 快享订单信息 专享订单信息 包车订单信息 迁移至 marketing-operation-admin 应用中
    {
      path: "insurance-info",
      name: "insurance-info",
      meta: {
        title: "保单信息"
      },
      component: () =>
        import("_o/components/order-center/insurance-info/index.vue")
    },
  ]
};
