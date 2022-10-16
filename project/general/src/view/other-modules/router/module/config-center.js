import Main from "_a/main";
import parentView from "_a/parent-view";

export default {
  path: "/configCenter",
  name: "configCenter",
  component: Main,
  meta: {
    icon: "md-construct",
    title: "配置管理",
    sort: 4
  },
  children: [
    {
      path: "carpool-management",
      name: "carpool-management",
      meta: {
        title: "拼车管理",
        showAlways: true,
        showWhenDev: true
      },
      component: parentView,
      children: [
        {
          path: "carpool-strategy",
          name: "carpool-strategy",
          meta: {
            title: "拼车策略配置",
            notCache: true
          },
          component: () => import("_o/components/config-center/carpool-strategy/index.vue")
        },
        {
          path: "vehicle-rule",
          name: "vehicle-rule",
          meta: {
            title: "拼车规则文案配置",
          },
          component: () => import("_o/components/config-center/carpool-rule/index.vue")
        },
        {
          path: "add-carpool-strategy",
          name: "add-carpool-strategy",
          meta: {
            title: "新建拼车策略",
            closeAlert: true,
          },
          component: () => import("_o/components/config-center/carpool-strategy/add/index.vue")
        },

      ]
    },
    {
      path: "opencity-configure",
      name: "opencity-configure",
      meta: {
        title: "开城配置",
        showAlways: true,
        showWhenDev: true
      },
      component: parentView,
      children: [
        {
          path: "opencity_control",
          name: "opencity_control",
          meta: {
            title: "开城管理",
          },
          component: () => import("_o/components/config-center/opencity-control/index.vue")
        },
        {
          path: "bizline-vehicle-control",
          name: "bizline-vehicle-control",
          meta: {
            title: "业务线与车型等级关系管理",
          },
          component: () => import("_o/components/config-center/bizline-vehicle-control/index.vue")
        },
        {
          path: "vehicle-group-manage",
          name: "vehicle-group-manage",
          meta: {
            title: "车型组管理",
            showWhenDev: true
          },
          component: () => import("_o/components/config-center/vehicle-group-manage/index.vue")
        },
        // {
        //   path: "driver-pricing-strategy-manage",
        //   name: "driver-pricing-strategy-manage",
        //   meta: {
        //     title: "司机定价策略管理",
        //     showWhenDev: true
        //   },
        //   component: () => import("_o/components/config-center/driver-pricing-strategy-manage/index.vue")
        // },
        {
          path: "driver-pricing-manage",
          name: "driver-pricing-manage",
          meta: {
            title: "司机定价管理",
            showAlways: true,
            showWhenDev: true
          },
          component: parentView,
          children: [
            {
              path: "driver-pricing-strategy-manage",
              name: "driver-pricing-strategy-manage",
              meta: {
                title: "司机定价策略管理",
                showWhenDev: true
              },
              component: () => import("_o/components/config-center/driver-pricing-strategy-manage/index.vue")
            },   
            {
              path: "driver-pricing-complete-manage",
              name: "driver-pricing-complete-manage",
              meta: {
                title: "流水补足策略管理",
                showWhenDev: true
              },
              component: () => import("_o/components/config-center/driver-pricing-complete-manage/passenger/index.vue")
            },   
          ]
        }

      ]
    },
    {
      path: "city_control",
      name: "city_control",
      meta: {
        title: "开城管理",
        hideInMenu: true,
      },
      component: () => import("_o/components/config-center/city-control/index.vue")
    },
    {
      path: "city_package_control",
      name: "city_package_control",
      meta: {
        title: "套餐管理"
      },
      component: () => import("_o/components/config-center/city-control/package.vue")
    },
    {
      path: "city_control_operation",
      name: "city_control_operation",
      meta: {
        title: "开城必要策略配置",
        hideInMenu: true,
      },
      component: () => import("_o/components/config-center/city-control/operation.vue")
    },
    {
      path: "driver_pricing_strategy",
      name: "driver_pricing_strategy",
      meta: {
        title: "司机定价策略",
        hideInMenu: true,
      },
      component: () => import("_o/components/config-center/driver-pricing-strategy-manage/components/index.vue")
    },
    {
      path: "site_control",
      name: "site_control",
      meta: {
        title: "场地管理"
      },
      component: () => import("_o/components/config-center/site-control/index.vue")
    },
    {
      path: "strategy_control",
      name: "strategy_control",
      meta: {
        title: "系统策略管理"
      },
      component: () => import("_o/components/config-center/strategy-control/index.vue")
    },
    {
      path: "orderSend_control",
      name: "orderSend_control",
      meta: {
        title: "派单策略管理",
      },
      component: () => import("_o/components/config-center/orderSend-control")
    },
    {
      path: "orderFirstRule_add",
      name: "orderFirstRule_add",
      meta: {
        title: "订单优先级策略",
        hideInMenu: true,
        parentName: "orderSend_control",
        closeAlert: true // 关闭/切换导航时弹出二次确认框
      },
      component: () => import("_o/components/config-center/orderSend-control/orderFirstRuleAdd/index.vue")
    },
    {
      path: "orderFirstRule_copy",
      name: "orderFirstRule_copy",
      meta: {
        title: "复制订单优先级策略",
        hideInMenu: true,
        parentName: "orderSend_control",
        closeAlert: true // 关闭/切换导航时弹出二次确认框
      },
      component: () => import("_o/components/config-center/orderSend-control/orderFirstRuleAdd/copy.vue")
    },
    {
      path: "orderFirstRule_edit",
      name: "orderFirstRule_edit",
      meta: {
        title: "编辑订单优先级策略",
        hideInMenu: true,
        parentName: "orderSend_control",
        closeAlert: true // 关闭/切换导航时弹出二次确认框
      },
      component: () => import("_o/components/config-center/orderSend-control/orderFirstRuleAdd/edit.vue")
    },
    {
      path: "externalFee",
      name: "externalFee",
      meta: {
        title: "附加费限额配置",
        // isMicroApp:true,
        // isMenu:true
      },
      component: () => import("_o/components/config-center/externalFee/index.vue")
    },
    {
      path: "satellite-city-manage",
      name: "satellite-city-manage",
      meta: {
        title: "卫星城关系管理",
        // isMicroApp:true,
        // isMenu:true
      },
      component: () => import("_o/components/config-center/satellite-city-manage/index.vue")
    },
    {
      path: "brand_control",
      name: "brand_control",
      meta: {
        title: "品牌管理"
      },
      component: () => import("_o/components/config-center/brand-control/index.vue")
    },
    {
      path: "model_control",
      name: "model_control",
      meta: {
        title: "车型管理"
      },
      component: () => import("_o/components/config-center/model-control/index.vue")
    },
    {
      path: "elecfence_control",
      name: "elecfence_control",
      meta: {
        title: "电子围栏管理",
        hideInMenu: true
      },
      component: () => import("_o/components/config-center/elecfence-control/index.vue")
    },
    {
      path: "elecfence_manage",
      name: "elecfence_manage",
      meta: {
        title: "城市电子围栏管理"
      },
      component: () => import("_o/components/config-center/elecfence-manage/index.vue")
    },
    {
      path: "car-machine",
      name: "car-machine",
      meta: {
        title: "车机远程管理"
      },
      component: () => import("_o/components/config-center/car-machine/index.vue")
    },
    {
      path: "approval_control",
      name: "approval_control",
      meta: {
        title: "审批管理"
      },
      component: () => import("_o/components/config-center/approval-control/index.vue")
    },
    // {
    //   path: "product_line_control",
    //   name: "product_line_control",
    //   meta: {
    //     title: "产品线管理"
    //   },
    //   component: () => import("_o/components/config-center/product-line-control/index.vue")
    // },
    {
      path: "chartered_car_control",
      name: "chartered_car_control",
      meta: {
        title: "包车业务策略管理"
      },
      component: () => import("_o/components/config-center/chartered_car_control/index.vue")
    },
    {
      path: "fastride-manage",
      name: "fastride-manage",
      meta: {
        title: "矩阵策略管理",
        // isMicroApp:true,
        // isMenu:true
      },
      component: () => import("_o/components/config-center/fastride-manage/index.vue")
    },
    // 菜单管理 体验管理-意见反馈 广告位管理 迁移至 marketing-operation-admin 应用中

    {
      path: "guide-management",
      name: "guide-management",
      meta: {
        title: "引导管理",
        showAlways: true,
      },
      component: parentView,
      children: [
        {
          path: "secret-free-payment",
          name: "secret-free-payment",
          meta: {
            title: "免密支付",
            notCache: true
          },
          component: () => import("_o/components/config-center/secret-free-payment/index.vue")
        },
        {
          path: "secret-free-payment-trigger",
          name: "secret-free-payment-trigger",
          meta: {
            title: "免密支付触发频率",
            notCache: true
          },
          component: () => import("_o/components/config-center/secret-free-payment/trigger.vue")
        },
        {
          path: "payment-strategy-detail/:id",
          name: "payment-strategy-detail",
          meta: {
            title: "免密支付策略详情",
            notCache: true
          },
          component: () => import("_o/components/config-center/secret-free-payment/detail"),
        },
        {
          path: "payment-strategy/create", // type: 'create'
          name: "payment-strategy-create",
          meta: {
            title: "创建免密支付策略",
            notCache: true
          },
          component: () => import("_o/components/config-center/secret-free-payment/create"),
        },
        {
          path: "payment-strategy/edit/:id", // type: 'edit', id: number
          name: "payment-strategy-edit",
          meta: {
            title: "编辑免密支付策略",
            notCache: true
          },
          component: () => import("_o/components/config-center/secret-free-payment/edit"),
        },
      ]
    },
    {
      path: "demand-manage",
      name: "demand-manage",
      meta: {
        title: "需求管理"
      },
      component: () => import("_o/components/config-center/demand-manage/index.vue")
    },
    {
      path: "driver-orderFlow-setting",
      name: "driver-orderFlow-setting",
      meta: {
        title: "司机端订单流水设置",
        showWhenDev: true
      },
      component: () => import("_o/components/config-center/driver-orderFlow-setting/index.vue")
    },
    {
      path: "new-model",
      name: "new-model",
      meta: {
        title: "新模式",
        showAlways: true,
      },
      component: parentView,
      children: [{
        path: "vehicle-marking",
        name: "vehicle-marking",
        meta: {
          title: "车辆标注"
        },
        component: () => import("_o/components/new-model/vehicle-marking/index.vue")
      }]
    },
    // {
    //   path: "bizline-vehicle-control",
    //   name: "bizline-vehicle-control",
    //   meta: {
    //     title: "业务线与车型等级关系管理",
    //     hideInMenu: true
    //   },
    //   component: () => import("_o/components/config-center/bizline-vehicle-control/index.vue")
    // },
    {
      path: "airport-pick-up-manage",
      name: "airport-pick-up-manage",
      meta: {
        title: "接送机配置管理"
      },
      component: parentView,
      children: [
        {
          path: "airport-pick-up",
          name: "airport-pick-up",
          meta: {
            title: "接送机管理"
          },
          component: () => import("_o/components/config-center/airportPickUp/index.vue")
        },
        {
          path: "airport-config",
          name: "airport-config",
          meta: {
            title: "接送机文案配置"
          },
          component: () => import("_o/components/config-center/airportPickUpConfig/index.vue")
        },
        {
          path: "warning-strategy",
          name: "warning-strategy",
          meta: {
            title: "预警策略"
          },
          component: () => import("_o/components/config-center/warning-strategy/index.jsx")
        }
      ]
    },
    {
      path: "driver-waterflow-strategy-manage",
      name: "driver-waterflow-strategy-manage",
      meta: {
        title: "司机流水策略管理",
        showWhenDev: true,
        notCache: true
      },
      component: () => import("_o/components/config-center/driver-waterflow-strategy-manage/index.vue"),
    },
    {
      path: "driver-waterflow-strategy-rule/:uuid?",
      name: "driver-waterflow-strategy-rule",
      parentName: "driver-waterflow-strategy-manage",
      meta: {
        title: "规则详情",
        hideInMenu: true,
        showWhenDev: true,
      },
      component: () => import("_o/components/config-center/driver-waterflow-strategy-manage/add/index.vue")
    }
  ]
};
