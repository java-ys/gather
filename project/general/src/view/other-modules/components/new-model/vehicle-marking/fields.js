// table数据
export const returnFields = (that) => {
  return {
    index: {
      title: "序号",
      type: "index",
      width: 60,
      align: "center"
    },
    name: {
      title: "所属城市",
      key: "cityName",
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    },
    supplierName: {
      title: "所属运营商",
      key: "agentName",
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    },
    vin: {
      title: "VIN码",
      key: "vin",
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    },
    plateNumber: {
      title: "车牌号",
      key: "plateNum",
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    },
    markingTime: {
      title: "打标时间",
      key: "updateTime",
      ellipsis: true,
      tooltip: true,
      minWidth: 160
    },
    modifier: {
      title: "操作人",
      key: "modifier",
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    action: {
      title: "操作",
      key: "action",
      width: 120,
      fixed: "right",
      render: (h, params) => {
        return h("div", [
          h("Button", {
            props: {
              type: "error",
              ghost: true,
              size: "small"
            },
            directives: [{
              name: "hasAuth",
              value: "vehicle-marking-cancel"
            }],
            style: {
              marginRight: " 15px"
            },
            on: {
              click: () => {
                let vin = params.row.vin;
                that.$Modal.confirm({
                  title: "提示",
                  content: "请再次确认要执行取消标记操作!",
                  onOk: () => {
                    that.outOfService(vin)
                  }
                });
              }
            }
          }, "取消标记")
        ])
      }
    }
  }
}

// 搜索项
export const inputList = [
  {
    name: "cascader-input",
    bind_key: ["provinceCode", "cityUuid"], // 返回数据的key名
    placeholder: "请选择",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: "所属城市：", // 展示的字段名
    changeOnSelect: false,
    titleWidth: 72,
    // inputWidth: 165
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "agentUuid", // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "所属运营商：", // 展示的字段名
    dropList: [],
    titleWidth: 72,
  },
  {
    name: "text-input", // 文本输入框名
    bind_key: "vin", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "VIN码：",
    titleWidth: 72,
  },
  {
    name: "text-input", // 文本输入框名
    bind_key: "plateNum", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "车牌号：",
    titleWidth: 72,
  },
]
