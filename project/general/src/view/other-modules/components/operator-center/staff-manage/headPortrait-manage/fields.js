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
      title: "群组名称",
      key: "name",
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    condition: {
      title: "状态",
      key: "condition",
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        let str = ""
        if (Number(params.row.recordStatus) === 3) {
          str = "新建"
        } else if (Number(params.row.recordStatus) === 1) {
          str = "启用"
        } else if (Number(params.row.recordStatus) === 2) {
          str = "停用"
        }
        return h("span", {}, str)
      }
    },
    updateTime: {
      title: "编辑时间",
      key: "updateTime",
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    modifierName: {
      title: "编辑人员",
      key: "modifierName",
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    action: {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 290,
      render: (h, params) => {
        return h("div", [
          h("Button", {
            props: {
              type: "warning",
              ghost: true,
              size: "small"
            },
            "class": {
              tableBtn: true
            },
            directives: [{
              name: "hasAuth",
              value: "headPortrait-manage-compile"
            }],
            style: {
              display: Number(params.row.recordStatus) === 3 ? "inline-block" : "none"
            },
            on: {
              click: () => {
                let paramsrow = params.row
                that.modalTitle = "修改群组"
                that.payQSData = {
                  question: paramsrow.name,
                  headPortrait: paramsrow.headPortrait,
                  uuid: paramsrow.uuid
                }

                that.daoru = true
                that.isModal = true
                that.editorModal = true
                that.importTables = false
                that.tables = false
              }
            }
          }, "编辑"),
          h("Button", {
            props: {
              type: "info",
              ghost: true,
              size: "small"
            },
            "class": {
              tableBtn: true
            },
            directives: [{
              name: "hasAuth",
              value: "headPortrait-manage-detail"
            }],
            on: {
              click: () => {
                localStorage.removeItem("uuid");
                that.$router.push({
                  name: "detailed",
                  query: {
                    uuid: params.row.uuid,
                    recordStatus: params.row.recordStatus
                  },

                })
              }
            },
          }, "详情"),
          h("Button", {
            props: {
              type: Number(params.row.recordStatus) === 3 ? "success" : "error",
              ghost: true,
              size: "small"
            },
            directives: [{
              name: "hasAuth",
              value: "headPortrait-manage-update"
            }],
            style: {
              display: Number(params.row.recordStatus) === 2 ? "none" : "inline-block",
              marginRight: " 15px"
            },
            on: {
              click: () => {
                let uuid = { uuid: params.row.uuid }
                if (Number(params.row.recordStatus) === 1) {
                  that.$Modal.confirm({
                    title: "提示",
                    content: "确定停用吗？停用后不可再次启用",
                    onOk: () => {
                      that.outOfService(uuid)
                    }
                  })
                } else if (Number(params.row.recordStatus) === 3) {
                  that.startUsing(uuid)
                }
              }
            }
          }, Number(params.row.recordStatus) === 3 ? "启用" : "停用"),
          h("Button", {
            props: {
              type: "info",
              ghost: true,
              size: "small"
            },
            "class": {
              tableBtn: true
            },
            directives: [{
              name: "hasAuth",
              value: "headPortrait-manage-lead"
            }],
            style: {
              display: Number(params.row.recordStatus) === 3 ? "inline-block" : "none"
            },
            on: {
              click: () => {
                that.isModal = true
                that.modalTitle = "成员导入"
                that.daoru = false
                that.importTables = true
                that.tables = false

                that.upPercent = 0;
                that.isShowUpBar = false;
                that.importMessage = that.sameMessage;
                that.parameter = { groupId: params.row.uuid }
              }
            }
          }, "成员导入")
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
    title: "群组名称："
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "recordStatus", // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "状态：", // 展示的字段名
    dropList: [
      {
        label: "新建",
        value: 3
      },
      {
        label: "启用",
        value: 1
      },
      {
        label: "停用",
        value: 2
      }
    ]
  }
]
