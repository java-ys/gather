// 提示场景

export const promNameList = [
  { label: "预约成功-免费取消", value: 1 },
  { label: "预约成功", value: 2 },
  { label: "等待接驾-免费取消", value: 3 },
  { label: "等待接驾-超过免费取消时长", value: 4 },
  { label: "接力单-等待接驾-免费取消", value: 5 },
  { label: "接力单-等待接驾-超过免费取消时长", value: 6 },
  { label: "司机已经到达", value: 7 },
  { label: "行程中", value: 8 },
  { label: "行程结束未支付", value: 9 }
]

// 业务线类型
export const getServiceTypeName = (i) => {
  let map = {
    4: "快享",
    2: "专享",
    1: "出租车",
    5: "顺风车",
    10: "包车",
    13: "企业用车",
  }
  return map[i];
}
// 生效状态
export const getStatusName = (i) => {
  let map = {
    1: "启用",
    0: "停用"

  }
  return map[i];
}

// 校验日期
export const validatorTime = (rule, value, callback) => {
  let date = value;
  if (!date) {
    callback(new Error("必选"));
  }
  let timestamp = new Date(date).getTime();
  if (timestamp < Date.now()) {
    callback(new Error("生效时间不得小于当前时间"));
  } else {
    callback();
  }
}
// 列表数据
export const listColumns = {
  columns(_this) {
    return [{
      title: "序号",
      width: 80,
      render(h, params) {
        return h("span", {}, (_this.current - 1) * _this.pageSize + params.index + 1);
      }
    },
    {
      title: "提示场景",
      minWidth: 180,
      key: "promptName"
    },
    {
      title: "产品线",
      minWidth: 80,
      key: "serviceType",
      render: (h, params) => {
        return h("div", (_this.bizTypeList.find(it => it.value === Number(params.row.productLine))||{}).label || "")
      }
    },
    {
      title: "标题文案",
      minWidth: 120,
      key: "promptTitle"
    },
    {
      title: "内容文案",
      width: 650,
      key: "promptDetail"
    },
    {
      title: "更新时间",
      minWidth: 160,
      key: "updateTime",
      render: (h, params) => {
        return h("div", _this.$moment(params.row.updateTime).format("YYYY-MM-DD HH:mm:ss"))
      }
    },
    {
      title: "状态",
      minWidth: 60,
      render: (h, params) => {
        return h("div", getStatusName(String(params.row.promptStatus)))
      }
    },
    {
      title: "操作人",
      minWidth: 100,
      key: "updater"
    },
    {
      title: "操作",
      width: 150,
      fixed: "right",
      render(h, params) {
        return h("div", {
          style: {
            display: "flex",
          }
        }, [
          h(
            "Button", {
              props: {
                type: params.row.promptStatus === 1 ? "error" : "success",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: "hasAuth",
                value: "prompt-start"
              }],
              on: {
                click() {
                  _this.deleteData(params.row);
                }
              }
            },
            params.row.promptStatus === 1 ? "停用" : "启用"
          ),
          h(
            "Button", {
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: "hasAuth",
                value: "prompt-edit"
              }],
              on: {
                click() {
                  _this.goEdit(params.row);
                }
              }
            },
            "编辑"
          )
        ]);
      }
    }
    ];
  }
}
