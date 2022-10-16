import Main from "_a/main";

export default {
  path: "/messageCenter",
  name: "messageCenter",
  component: Main,
  meta: {
    icon: "ios-mail",
    title: "消息管理",
    showAlways: true,
    sort: 9
  },
  children: [
    {
      path: "shortmessage-manage",
      name: "shortmessage-manage",
      meta: {
        title: "短信管理"
      },
      component: () => import("_o/components/short-message-center/short-message/index.vue")
    },
    {
      path: "shortmessage-IM",
      name: "shortmessage-IM",
      meta: {
        title: "IM消息管理"
      },
      component: () => import("_o/components/short-message-center/IM/index.vue")
    },
    // {
    //   path: "vechile-voice",
    //   name: "vechile-voice",
    //   meta: {
    //     title: "车机语音管理"
    //   },
    //   component: () =>
    //     import(
    //       "_o/components/short-message-center/vechile-voice/index.vue"
    //     )
    // },
    // PUSH管理 公告管理 业务消息管理 乘客提醒 消息模板管理 迁移至 marketing-operation-admin 应用中
    {
      path: "push-center",
      name: "push-center",
      meta: {
        title: "PUSH管理"
      },
      component: () =>
        import(
          "_o/components/short-message-center/push-management/index.vue"
        )
    },
    {
      path: "add-push",
      name: "add-push",
      meta: {
        title: "新增push",
        hideInMenu: true,
        parentName: "push-center"
      },
      component: () =>
        import(
          "_o/components/short-message-center/push-management/add.vue"
        )
    },
    {
      path: "announcement-center",
      name: "announcement-center",
      meta: {
        title: "公告管理"
      },
      component: () =>
        import(
          "_o/components/short-message-center/announcement/index.vue"
        )
    },
    {
      path: "announcement-add",
      name: "announcement-add",
      meta: {
        title: "添加公告",
        hideInMenu: true,
        parentName: "announcement-center"
      },
      component: () =>
        import(
          "_o/components/short-message-center/announcement/add.vue"
        )
    },
    {
      path: "business-message",
      name: "business-message",
      meta: {
        title: "业务消息管理"
      },
      component: () =>
        import(
          "_o/components/short-message-center/businessMessage/index.vue"
        )
    },
    {
      path: "push-statistics",
      name: "push-statistics",
      meta: {
        title: "push发送详情页",
        hideInMenu: true,
      },
      component: () =>
        import(
          "_o/components/short-message-center/announcement/statistics.vue"
        )
    },
    {
      path: "announcement-statistics",
      name: "announcement-statistics",
      meta: {
        title: "公告发送详情页",
        hideInMenu: true,
      },
      component: () =>
        import(
          "_o/components/short-message-center/announcement/annouceStatistics.vue"
        )
    },
    {
      path: "message-tmp",
      name: "message-tmp",
      meta: {
        title: "消息模板管理",
        hideInMenu: false,
      },
      component: () =>
        import(
          "_o/components/short-message-center/message-tmp/index.vue"
        )
    },
    {
      path: "passenger-info",
      name: "passenger-info",
      meta: {
        title: "乘客消息中心",
        hideInMenu: false,
        showWhenDev: true
      },
      component: () =>
        import(
          "_o/components/short-message-center/passenger-info/index.vue"
          )
    },
  ]
};
