/*
 * @Author: NapierPLUS
 * @Date: 2022-01-26 09:33:13
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-01-26 09:46:43
 * @Description:
 */
import Main from "_a/main";
import parentView from "_a/parent-view";

export default {
  path: "/pricing-manage",
  name: "pricing-manage",
  component: Main,
  meta: {
    icon: "ios-people",
    title: "定价管理",
    showAlways: true,
    sort: 16
  },
  children: [
    // {
    //   path: "dynamic-discount",
    //   name: "dynamic-discount",
    //   meta: {
    //     title: "动态折扣管理"
    //   },
    //   component: parentView,
    //   children: [{
    //     path: "base-discount",
    //     name: "base-discount",
    //     meta: {
    //       title: "基础折扣"
    //     },
    //     component: () => import("_o/components/price-center/dynamic-discount/base-discount/index.vue")
    //   },
    //   // {
    //   //   path: "hexagon-discount",
    //   //   name: "hexagon-discount",
    //   //   meta: {
    //   //     title: "六边形临时折扣"
    //   //   },
    //   //   component: () => import("_o/components/price-center/dynamic-discount/hexagon-discount/index.vue")
    //   // },
    //   {
    //     path: "float-discount",
    //     name: "float-discount",
    //     meta: {
    //       title: "浮动折扣系数"
    //     },
    //     component: () => import("_o/components/price-center/dynamic-discount/float-discount/index.vue")
    //   }
    //   ]
    // },
    {
      path: "dynamic-premium",
      name: "dynamic-premium",
      meta: {
        title: "动态溢价管理",
        showWhenDev: true
      },
      component: () => import("_o/components/price-center/dynamic-premium/index.vue")
    },
    {
      path: "accounting-strategy",
      name: "accounting-strategy",
      meta: {
        title: "计费策略管理",
        showWhenDev: true
      },
      component: () => import("_o/components/price-center/accounting-strategy/index.vue")
    },
    {
      path: "accounting-strategy-add/:uuid?",
      name: "accounting-strategy-add",
      meta: {
        title: "新增策略",
        parentName: "accounting-strategy",
        hideInMenu: true,
        closeAlert: true // 关闭/切换导航时弹出二次确认框
      },
      component: () => import("_o/components/price-center/accounting-strategy/add/index.vue")
    },
    {
      path: "basic-information",
      name: "basic-information",
      meta: {
        title: "基础信息费管理",
        showWhenDev: true
      },
      component: () => import("_o/components/price-center/basic-information/index.vue")
    },
    {
      path: "holiday-expenses",
      name: "holiday-expenses",
      meta: {
        title: "节日服务费管理",
        showWhenDev: true
      },
      component: () => import("_o/components/price-center/holiday-expenses")
    },
    {
      path: "dynamic-price",
      name: "dynamic-price",
      meta: {
        title: "动态一口价",
        showWhenDev: true
      },
      component: () => import("_o/components/price-center/dynamic-price/index.vue")
    },
  ]
};
