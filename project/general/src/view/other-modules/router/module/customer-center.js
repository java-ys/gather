import Main from "_a/main";

export default {
  path: "/customer",
  name: "customer",
  component: Main,
  meta: {
    icon: "md-person",
    title: "乘客管理",
    showAlways: true,
    sort: 8
  },
  children: [
    // 乘客信息 乘客详情 实名认证审核 迁移至 marketing-operation-admin 应用中
  ]
};
