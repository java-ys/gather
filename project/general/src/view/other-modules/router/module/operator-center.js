/*
 * @Descritption:
 * @Author: lvzhiyang
 * @Date: 2019-11-02 11:30:07
 * @LastEditors: xuanleilei
 * @LastEditTime: 2022-05-13 10:14:09
 */
import Main from "_a/main";
import parentView from "_a/parent-view";
import Check from "../subs/check"

export default {
  path: "/opCenter",
  name: "opCenter",
  component: Main,
  meta: {
    icon: "md-car",
    title: "营运管理",
    showAlways: true,
    sort: 2
  },
  children: [
    // 产品体验管理-[体验官报名管理 用户反馈管理] 支付常见问题  评价管理-[...] 迁移至 marketing-operation-admin 应用中
    {
      path: "nps-manager",
      name: "nps-manager",
      meta: {
        title: "NPS问卷",
        notCache: true
      },
      component: parentView,
      children: [
        {
          path: "nps-questionnaire",
          name: "nps-questionnaire",
          meta: {
            title: "问卷设置",
            notCache: true
          },
          component: () => import("_o/components/operator-center/nps-manager/nps-questionnaire/index.vue")
        },
        {
          path: "nps-questionnaire/add",
          name: "nps-questionnaire-add",
          meta: {
            title: "新增问卷 ",
            notCache: true,
            closeAlert: true // 关闭/切换导航时弹出二次确认框
          },
          component: () => import("_o/components/operator-center/nps-manager/nps-questionnaire/nps-questionnaire-action/create")
        },
        {
          path: "nps-questionnaire/edit",
          name: "nps-questionnaire-edit",
          meta: {
            title: "编辑问卷 ",
            notCache: true,
            closeAlert: true // 关闭/切换导航时弹出二次确认框
          },
          component: () => import("_o/components/operator-center/nps-manager/nps-questionnaire/nps-questionnaire-action/edit")
        },
        {
          path: "nps-questionnaire/detail",
          name: "nps-questionnaire-detail",
          meta: {
            title: "问卷详情 ",
            notCache: true,
            closeAlert: true // 关闭/切换导航时弹出二次确认框
          },
          component: () => import("_o/components/operator-center/nps-manager/nps-questionnaire/nps-questionnaire-action/details")
        },
        {
          path: "nps-send",
          name: "nps-send",
          meta: {
            title: "发送设置",
            notCache: true
          },
          component: () => import("_o/components/operator-center/nps-manager/nps-send/index.vue")
        },
        {
          path: "fixed-url-ques",
          name: "fixed-url-ques",
          meta: {
            title: "端内固定地址问卷",
            notCache: true
          },
          component: () => import("_o/components/operator-center/nps-manager/fixed-url-ques/index.vue")
        },
        {
          path: "nps-report",
          name: "nps-report",
          meta: {
            title: "NPS报表",
            notCache: true
          },
          component: () => import("_o/components/operator-center/nps-manager/nps-report/index.vue")
        },
        {
          path: "nps-send-add",
          name: "nps-send-add",
          meta: {
            title: "新建发送策略",
            parentName: "nps-send",
            hideInMenu: true,
            closeAlert: true
          },
          component: () => import("_o/components/operator-center/nps-manager/nps-send/add/index.vue")
        },
        {
          path: "nps-send-edit",
          name: "nps-send-edit",
          meta: {
            title: "编辑发送策略",
            parentName: "nps-send",
            hideInMenu: true,
            closeAlert: true
          },
          component: () => import("_o/components/operator-center/nps-manager/nps-send/add/index.vue")
        },

        {
          path: "nps-send-analyse",
          name: "nps-send-analyse",
          meta: {
            title: "分析下载",
            parentName: "nps-send",
            hideInMenu: true
          },
          component: () => import("_o/components/operator-center/nps-manager/nps-send/analyse/index.vue")
        },
        {
          path: "nps-send-detail",
          name: "nps-send-detail",
          meta: {
            title: "详情",
            parentName: "nps-send",
            hideInMenu: true
          },
          component: () => import("_o/components/operator-center/nps-manager/nps-send/detail/index.vue")
        },
        {
          path: "fixed-url-ques-add",
          name: "fixed-url-ques-add",
          meta: {
            title: "新建端内固定地址问卷",
            parentName: "fixed-url-ques",
            hideInMenu: true,
            closeAlert: true
          },
          component: () => import("_o/components/operator-center/nps-manager/fixed-url-ques/add/index.vue")
        },
        {
          path: "fixed-url-ques-edit",
          name: "fixed-url-ques-edit",
          meta: {
            title: "编辑端内固定地址问卷",
            parentName: "fixed-url-ques",
            hideInMenu: true,
            closeAlert: true
          },
          component: () => import("_o/components/operator-center/nps-manager/fixed-url-ques/add/index.vue")
        },
        {
          path: "fixed-url-ques-analyse",
          name: "fixed-url-ques-analyse",
          meta: {
            title: "分析下载",
            parentName: "fixed-url-ques",
            hideInMenu: true
          },
          component: () => import("_o/components/operator-center/nps-manager/fixed-url-ques/analyse/index.vue")
        },
        {
          path: "nfixed-url-ques-detail",
          name: "fixed-url-ques-detail",
          meta: {
            title: "详情",
            parentName: "fixed-url-ques",
            hideInMenu: true
          },
          component: () => import("_o/components/operator-center/nps-manager/fixed-url-ques/detail/index.vue")
        },
      ]
    },
    {
      meta: {
        title: "车型等级变更配置",
      },
      path: "upgrade-config",
      name: "upgrade-config",
      component: () => import("_o/components/operator-center/upgrade-config")
    },
    {
      meta: {
        title: "车型等级变更推荐设置",
      },
      path: "level-change-recommend",
      name: "level-change-recommend",
      component: () => import("_o/components/operator-center/level-change-recommend")
    },
    {
      path: "joindriver-manager",
      name: "joindriver-manager",
      meta: {
        title: "带车加盟换车审核",
        notCache: true
      },
      component: () => import("_o/components/operator-center/joindriver-manager/index.vue"),
    },
    {
      path: "joindriver-manager/detail",
      name: "joindriver-detail",
      meta: {
        title: "带车加盟换车审核详情",
        notCache: true,
        closeAlert: true // 关闭/切换导航时弹出二次确认框
      },
      component: () => import("_o/components/operator-center/joindriver-manager/details/index.vue")
    },
    {
      path: "joindriver-manager/audit",
      name: "joindriver-audit",
      meta: {
        title: "带车加盟换车审核审核",
        notCache: true,
        closeAlert: true // 关闭/切换导航时弹出二次确认框
      },
      component: () => import("_o/components/operator-center/joindriver-manager/audit")
    },
    {
      path: "carrier-center",
      name: "carrier-center",
      meta: {
        title: "运营商管理"
      },
      component: parentView,
      children: [{
        path: "carrier",
        name: "carrier",
        meta: {
          title: "运营商"
        },
        component: () => import("_o/components/operator-center/carrier-management/carrier/index.vue")
      },
      {
        path: "carrier-detail",
        name: "carrier-detail",
        meta: {
          title: "运营商详情",
          parentName: "carrier",
          hideInMenu: true
        },
        component: () => import("_o/components/operator-center/carrier-management/carrier/operation/detail.vue")
      },
      {
        path: "operator-check",
        name: "operator-check",
        meta: {
          title: "检核管理"
        },
        component: () => import("_o/components/operator-center/carrier-management/operator-check/index.vue"),
      },
      // 1022新增安全员管理
      {
        path: "safer-check",
        name: "safer-check",
        meta: {
          title: "安全员管理"
        },
        component: () => import("_o/components/operator-center/carrier-management/safe-check/index.vue"),
      },
      {
        path: "check-list",
        name: "check-list",
        meta: {
          title: "检核列表",
          parentName: "operator-check",
          hideInMenu: true
        },
        component: () => import("_o/components/operator-center/carrier-management/operator-check/checkList.vue"),
      },
      {
        path: "check-detail",
        name: "check-detail",
        meta: {
          title: "司机执行详情",
          parentName: "operator-check",
          hideInMenu: true
        },
        component: () => import("_o/components/operator-center/carrier-management/operator-check/checkDetail.vue"),
      },
      ...Check
      ]
    },
    {
      path: "platform-center",
      name: "platform-center",
      meta: {
        title: "平台信息管理"
      },
      component: () => import("_o/components/operator-center/platform/index.vue")
    },
    {
      path: "asset-account",
      name: "asset-account",
      meta: {
        title: "资产公司共管账户维护"
      },
      component: () => import("_o/components/operator-center/asset-account/index.vue")
    },
    {
      path: "vehicle-center",
      name: "vehicle-center",
      meta: {
        title: "车辆管理"
      },
      component: parentView,
      children: [
        {
          path: "vehicle-manage",
          name: "vehicle-manage",
          meta: {
            title: "车辆管理",
          },
          component: () => import("_o/components/operator-center/vehicle/index.vue")
        },
        {
          path: "car-blacklist",
          name: "car-blacklist",
          meta: {
            title: "车辆黑名单",
          },
          component: () => import("_o/components/operator-center/vehicle-blacklist/index.vue"),
        },
        {
          path: "vehicle-edit-audit",
          name: "vehicle-edit-audit",
          meta: {
            title: "车辆信息修改审核",
            notCache: true
          },
          component: () => import("_o/components/operator-center/vehicle-edit-manager/index.vue"),
        },
        {
          path: "vehicle-edit-audit/detail",
          name: "vehicle-edit-manager-detail",
          meta: {
            title: "车辆信息修改审核详情",
            notCache: true,
            closeAlert: true // 关闭/切换导航时弹出二次确认框
          },
          component: () => import("_o/components/operator-center/vehicle-edit-manager/details/index.vue")
        },
        {
          path: "vehicle-edit-manager/audit",
          name: "vehicle-edit-manager-audit",
          meta: {
            title: "车辆信息修改审核",
            notCache: true,
            closeAlert: true // 关闭/切换导航时弹出二次确认框
          },
          component: () => import("_o/components/operator-center/vehicle-edit-manager/audit")
        },
      ]
    },
    {
      path: "detail/:id",
      name: "vehicle-detail",
      meta: {
        title: "车辆详情",
        parentName: "vehicle-center",
        hideInMenu: true
      },
      component: () => import("_o/components/operator-center/vehicle/vehicle-detail.vue")
    },
    {
      path: "edit/:id",
      name: "add-vehicle",
      meta: {
        title: "编辑车辆",
        parentName: "vehicle-center",
        hideInMenu: true
      },
      component: () => import("_o/components/operator-center/vehicle/edit.vue")
    },
    {
      path: "vehicle-record",
      name: "vehicle-record",
      meta: {
        title: "车辆绑定记录",
      },
      component: () => import("_o/components/operator-center/vehicle-record/index.vue")
    },
    // {
    //   path: "lease-schema",
    //   name: "lease-schema",
    //   meta: {
    //     title: "租赁方案管理"
    //   },
    //   component: () => import("_o/components/operator-center/lease-schema/index.vue")
    // },
    {
      path: "work-order-manage",
      name: "work-order-manage",
      meta: {
        dynamicMountPoint: true,
        dynamicMountPointPath: ["opCenter", "work-order-manage"],
        title: "工单管理",
      },
      component: parentView,
      children: [
        {
          path: "work-order-query",
          name: "work-order-query",
          meta: {
            title: "工单查询",
          },
          component: () => import("_o/components/operator-center/work-order-manage/work-order-query/index.vue"),
        },
        {
          path: "work-order-detail",
          name: "work-order-detail",
          meta: {
            title: "工单详情",
          },
          component: () => import("_o/components/operator-center/work-order-manage/work-order-query/detail.vue"),
        },
        {
          path: "illegal-order-detail",
          name: "illegal-order-detail",
          meta: {
            title: "违规工单详情",
          },
          component: () => import("_o/components/operator-center/work-order-manage/work-order-query/illegalOrderDetail.vue"),
        },
        {
          path: "city-order-detail",
          name: "city-order-detail",
          meta: {
            title: "工单详情",
          },
          component: () => import("_o/components/operator-center/work-order-manage/work-order-query/illegalOrderDetail.vue"),
        },
        {
          path: "work-order-assigin-log",
          name: "work-order-assigin-log",
          meta: {
            title: "指派记录",
          },
          component: () => import("_o/components/operator-center/work-order-manage/work-order-query/assigin-log/index.vue"),
        },
      ]
    },
    {
      path: "partner-workorder",
      name: "partner-workorder",
      meta: {
        title: "我的工单",
      },
      component: () => import("_o/components/operator-center/partner-workorder/index.vue")
    },
    {
      path: "circulation_order",
      name: "circulation_order",
      meta: {
        title: "流转工单",
      },
      component: () => import("_o/components/operator-center/partner-workorder/index.vue")
    },
    {
      path: "work-order-illegal",
      name: "work-order-illegal",
      meta: {
        title: "违规工单明细",
        showWhenDev: true
      },
      component: () => import("_o/components/operator-center/work-order-manage/work-order-illegal"),
    },
    {
      path: "work-order-config",
      name: "work-order-config",
      meta: {
        title: "工单配置管理",
        showWhenDev: true
      },
      component: parentView,
      children: [
        {
          path: "auto-ban-manage",
          name: "auto-ban-manage",
          meta: {
            title: "自动封禁设置",
          },
          component: () => import("_o/components/operator-center/work-order-manage/work-order-config/auto-ban/index.vue"),
        },
        {
          path: "circulation",
          name: "circulation",
          meta: { title: "流转工单配置" },
          component: () => import("_o/components/operator-center/work-order-manage/work-order-config/circulation/index"),
        },
        {
          path: "crew",
          name: "crew",
          meta: {
            title: "人员管理",
          },
          component: () => import("_o/components/operator-center/work-order-manage/work-order-config/crew/index"),
        },
        {
          path: "schedule",
          name: "schedule",
          meta: {
            title: "排班管理",
          },
          component: () => import("_o/components/operator-center/work-order-manage/work-order-config/schedule/index"),
        },
        {
          path: "third-party",
          name: "third-party",
          meta: {
            title: "第三方配置管理",
          },
          component: () => import("_o/components/operator-center/work-order-manage/work-order-config/third-party/index"),
        },
        {
          path: "condemn",
          name: "condemn",
          meta: {
            title: "自动判责配置",
          },
          component: () => import("_o/components/operator-center/work-order-manage/work-order-config/condemn/index"),
        },
        {
          path: "serve-check",
          name: "serve-check",
          meta: {
            title: "服务检核工单配置",
            notCache: true
          },
          component: () => import("_o/components/operator-center/work-order-manage/work-order-config/serve-check/list"),
        },
        // {
        //   path: "illegal-type",
        //   name: "illegal-type",
        //   meta: {
        //     title: "判责类型管理",
        //   },
        //   component: () => import("_o/components/operator-center/work-order-manage/work-order-config/illegal-type/index"),
        // },
        // {
        //   path: "dp-source",
        //   name: "dp-source",
        //   meta: {
        //     title: "判责类型管理",
        //   },
        //   component: () => import("_o/components/operator-center/work-order-manage/work-order-config/dp-source/index"),
        // },
        {
          path: "opencity",
          name: "opencity",
          meta: {
            title: "工单来源配置",
          },
          component: () => import("_o/components/operator-center/work-order-manage/work-order-config/opencity/index"),
        },
        {
          path: "judgement-type-config",
          name: "judgement-type-config",
          meta: {
            title: "判责分类配置",
          },
          component: () => import("_o/components/operator-center/work-order-manage/work-order-config/judgement-type-config/index"),
        },
      ]
    },
    {
      path: "lease-manage",
      name: "lease-manage",
      meta: {
        title: "租赁管理",
        showWhenDev: true
      },
      component: parentView,
      children: [
        {
          path: "lease-contract",
          name: "lease-contract",
          meta: {
            title: "租赁合同管理"
          },
          component: () => import("_o/components/operator-center/lease-contract-manage/index.vue")
        },
        {
          path: "withhold-contract",
          name: "withhold-contract",
          meta: {
            title: "代扣合同管理"
          },
          component: () => import("_o/components/operator-center/withhold-contract-manage/index.vue")
        },
        {
          path: "declaration-validate",
          name: "declaration-validate",
          meta: {
            title: "租金代扣申报单校验"
          },
          component: () => import("_o/components/operator-center/declaration-validate/index.vue")
        },
        {
          path: "lease-schema",
          name: "lease-schema",
          meta: {
            title: "租赁方案管理"
          },
          component: () => import("_o/components/operator-center/lease-schema/index.vue")
        },
        // {
        //   path: "withhold-declare-manage",
        //   name: "withhold-declare-manage",
        //   meta: {
        //     title: "代扣申报审核"
        //   },
        //   component: () => import("_o/components/operator-center/lease-manage/withhold-declare-manage/index.vue")
        // },
        // {
        //   path: "check-bill-manage",
        //   name: "check-bill-manage",
        //   meta: {
        //     title: "对账单管理"
        //   },
        //   component: () => import("_o/components/operator-center/lease-manage/check-bill-manage/index.vue")
        // },
      ]
    },
    {
      path: "work-order-payment-bill",
      name: "work-order-payment-bill",
      meta: {
        title: "工单扣款账单"
      },
      component: () => import("_o/components/operator-center/work-order-payment-bill/index.vue")
    },
    {
      path: "/salary-Manage",
      name: "salary-Manage",
      // component: Main,
      component: parentView,
      meta: { title: "薪酬管理" },
      children: [
        {
          path: "baseWagePage",
          name: "baseWagePage",
          component: () => import("_o/components/operator-center/salary-modules/baseWagePage/index.vue"),
          meta: { location: "6", title: "基本工资规则", index: "1" },
        },
        {
          path: "stepPerformancePage",
          name: "stepPerformancePage",
          component: () => import("_o/components/operator-center/salary-modules/stepPerformancePage"),
          meta: { location: "6", title: "基本流水抽成规则", index: "2" },
        },
        {
          path: "citySafeguard",
          name: "citySafeguard",
          component: () => import("_o/components/operator-center/salary-modules/CitySafeguard/index.vue"),
          meta: { location: "6", title: "城市保底策略管理", index: "3" },
        },
        // {
        //   path: "activityPerformancePage",
        //   name: "ActivityPerformancePage",
        //   component: () =>
        //     import("_o/components/operator-center/salary-modules/activityPerformancePage"),
        //   meta: { location: "6", title: "奖励规则", index: "3" }
        // },
        // {
        //   path: "chargingSubsidyPage",
        //   name: "chargingSubsidyPage",
        //   component: () => import("_o/components/operator-center/salary-modules/chargingSubsidyPage/index.vue"),
        //   meta: { location: "6", title: "能源账户补贴规则", index: "4" },
        // },
        {
          path: "offlineAwardAndFine",
          name: "offlineAwardAndFine",
          component: () => import("_o/components/operator-center/salary-modules/offlineAwardAndFine/index.vue"),
          meta: { location: "6", title: "线下奖励/扣款管理", index: "5" },
        },
        // {
        //   path: "dailySalaryPage",
        //   name: "dailySalaryPage",
        //   component: () =>
        //     import("_o/components/operator-center/salary-modules/dailySalary/index.vue"),
        //   meta: { location: "6", title: "日工资查询", index: "6" }
        // },
        {
          path: "weekReward/modeA",
          name: "weekReward/modeA",
          component: () => import("_o/components/operator-center/salary-modules/weekReward/modeA/index.vue"),
          meta: { location: "6", title: "A模式周收入查询", index: "7" },
        },
        {
          path: "weekReward/modeUP",
          name: "weekReward/modeUP",
          component: () => import("_o/components/operator-center/salary-modules/weekReward/modeUP/index.vue"),
          meta: { location: "6", title: "UP模式周收入查询(乘客流水)", index: "8" },
        },
        {
          path: "weekReward/driverStream",
          name: "weekReward/driverStream",
          component: () => import("_o/components/operator-center/salary-modules/weekReward/driverStream/index.vue"),
          meta: { location: "6", title: "UP模式周收入查询(司机流水)", index: "9" },
        },
        {
          path: "monthlySalary",
          name: "monthlySalary",
          component: () => import("_o/components/operator-center/salary-modules/monthlySalary/index.vue"),
          meta: { location: "6", title: "月工资查询", index: "10" },
        },
        {
          path: "chargingSubsidy",
          name: "chargingSubsidy",
          component: () => import("_o/components/operator-center/salary-modules/chargingSubsidy/index.vue"),
          meta: { location: "6", title: "能源补贴查询", index: "11" },
        },
        // {
        //   path: "driverReward",
        //   name: "driverReward",
        //   component: () =>
        //     import("_o/components/operator-center/salary-modules/driverReward/index.vue"),
        //   meta: { location: "6", title: "司机奖励发放", index: "12" }
        // },
        {
          path: "salaryWarningManage",
          name: "salaryWarningManage",
          component: () => import("_o/components/operator-center/salary-modules/salaryWarningManage/index.vue"),
          meta: { location: "6", title: "薪酬预警管理", index: "14" },
        },
        // {
        //   path: "riskOrderManagement",
        //   name: "riskOrderManagement",
        //   component: () =>
        //     import("_o/components/operator-center/salary-modules/riskOrderManagement/index.vue"),
        //   meta: { location: "6", title: "风控订单管理", index: "13" }
        // },
        {
          path: "customerAdjustment",
          name: "customerAdjustment",
          component: () => import("_o/components/operator-center/salary-modules/customerAdjustment/index.vue"),
          meta: { location: "6", title: "客服调价订单管理", index: "15" },
        },
        // {
        //   path: "abnormalOrder",
        //   name: "abnormalOrder",
        //   component: () => import("_o/components/operator-center/salary-modules/abnormalOrder/index.vue"),
        //   meta: { location: "6", title: "异常订单管理", index: "16" },
        // },
        {
          path: "personalExamine",
          name: "personalExamine",
          component: () => import("_o/components/operator-center/salary-modules/personalExamine/index.vue"),
          meta: { location: "6", title: "薪酬审核管理", index: "17" },
        },
        {
          path: "proportionSetting",
          name: "proportionSetting",
          component: () => import("_o/components/operator-center/salary-modules/proportionSetting/index.vue"),
          meta: { location: "6", title: "个税比例设置", index: "18" },
        },
      ],
    },
    {
      path: "job-Manage/walletManage",
      name: "walletManage",
      component: () => import("_o/components/operator-center/salary-modules/walletManage/index"),
      meta: { location: "5", title: "司机钱包账户管理", index: "6" },
    }
  ]
}
