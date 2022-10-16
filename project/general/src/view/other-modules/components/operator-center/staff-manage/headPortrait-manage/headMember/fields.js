
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
      title: "姓名",
      key: "name",
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    idCard: {
      title: "身份证号",
      key: "idCard",
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    action: {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 120,
      render: (h, params) => {
        return h("div", [
          h("Button", {
            props: {
              type: "error",
              ghost: true,
              size: "small"
            },
            "class": {
              tableBtn: true
            },
            style: {
              display: Number(that.recordStatus) === 2 ? "none" : "inline-block",
            },
            on: {
              click: () => {
                that.$Modal.confirm({
                  title: "确定移除吗？移除后不可恢复？",
                  onOk: () => {
                    let uuid = { uuid: params.row.uuid }
                    that.removes(uuid)
                  }
                });
              }
            }
          }, "移除"),
        ])
      }
    }
  }
}

export const inputList = [
  {
    name: "text-input", // 文本输入框名
    bind_key: "name", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "司机姓名："
  },
  {
    name: "text-input", // 文本输入框名
    bind_key: "idCard", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "身份证号：", // 展示的字段名

  }
]
