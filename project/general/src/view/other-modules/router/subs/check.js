import Main from "_a/main";
import parentView from "_a/parent-view";

// 考核管理+结算管理+角色组管理
export default  [
  {
    path: "check-management",
    name: "check-management",
    meta: {
      title: "考核管理"
      // showWhenDev: true
    },
    component: parentView,
    children: [
      {
        path: "target",
        name: "check-management-target",
        meta: {
          title: "考核指标库",
          notCache: true
          // showWhenDev: true
        },
        component: () =>
          import(
            "_o/components/operator-center/carrier-management/check-management/target/index.vue"
          )
      },
      {
        path: "rules",
        name: "check-management-rules",
        meta: {
          title: "管理条例模板",
          notCache: true
          // hideInMenu: true
          // showWhenDev: true
        },
        component: () =>
          import(
            "_o/components/operator-center/carrier-management/check-management/rules/index.vue"
          )
      },
      {
        path: "city",
        name: "check-management-city",
        meta: {
          title: "城市考核模板",
          notCache: true
          // showWhenDev: true
        },
        component: () =>
          import(
            "_o/components/operator-center/carrier-management/check-management/city/index.vue"
          )
      },
      {
        path: "league",
        name: "check-management-league",
        meta: {
          title: "考核流程管理",
          notCache: true
          // showWhenDev: true
        },
        component: () =>
          import(
            "_o/components/operator-center/carrier-management/check-management/league/index.vue"
          )
      },
      {
        path: "process",
        name: "check-management-process",
        meta: {
          title: "考核待办流程",
          notCache: true
          // showWhenDev: true
        },
        component: () =>
          import(
            "_o/components/operator-center/carrier-management/check-management/league/process.vue"
          )
      },
      {
        path: "sign",
        name: "check-management-sign",
        meta: {
          title: "条例签章管理",
          notCache: true,
          // showWhenDev: true
        },
        component: () =>
          import(
            "_o/components/operator-center/carrier-management/check-management/sign/index.vue"
          )
      },
      {
        path: "commission-rules",
        name: "commission-rules",
        meta: {
          title: "带车加盟佣金规则",
          notCache: true,
          // showWhenDev: true
        },
        component: () =>
          import(
            "_o/components/operator-center/carrier-management/check-management/commission/index.vue"
            )
      },
      {
        path: "city-coefficient",
        name: "city-coefficient",
        meta: {
          title: "城市系数管理",
          notCache: true,
          showWhenDev: true
        },
        component: () =>
          import(
            "_o/components/operator-center/carrier-management/check-management/coefficient/index.vue"
            )
      },
      {
        path: "check-goal",
        name: "check-goal",
        meta: {
          title: "考核目标管理",
          notCache: true,
          // showWhenDev: true
        },
        component: () =>
          import(
            "_o/components/operator-center/carrier-management/check-management/goal/index.vue"
            )
      },
    ]
  },
  {
    path: "settle-management",
    name: "settle-management",
    meta: {
      title: "结算管理",
      showWhenDev: true
    },
    component: parentView,
    children: [
      {
        path: "order",
        name: "settle-management-order",
        meta: {
          title: "结算账单管理",
          // showWhenDev: true,
          notCache: true
        },
        component: () =>
          import(
            "_o/components/operator-center/carrier-management/settle-management/order"
          )
      },
      {
        path: "process",
        name: "settle-management-process",
        meta: {
          title: "账单待办流程",
          // showWhenDev: true,
          notCache: true,
        },
        component: () =>
          import(
            "_o/components/operator-center/carrier-management/settle-management/order/process.vue"
          )
      },
      {
        path: "sign",
        name: "settle-management-sign",
        meta: {
          title: "账单签章管理",
          // showWhenDev: true,
          notCache: true,
        },
        component: () =>
          import(
            "_o/components/operator-center/carrier-management/settle-management/sign/index.vue"
          )
      },
      {
        path: "custom-target",
        name: "custom-target",
        meta: {
          title: "自定义指标考核",
          // showWhenDev: true,
          notCache: true,
        },
        component: () =>
          import(
            "_o/components/operator-center/carrier-management/settle-management/custom/index.vue"
            )
      }
    ]
  },
  {
    path: "role-config",
    name: "role-config",
    meta: {
      title: "角色组管理",
      // showWhenDev: true,
      notCache: true,
    },
    component: () =>
      import(
        "_o/components/operator-center/carrier-management/role-config/index.vue"
      )
  }
];
