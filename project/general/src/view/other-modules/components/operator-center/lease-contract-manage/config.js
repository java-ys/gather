export const searchData = {
  searchData: {
    contractName: null, // 合同名称
    customizationFlag: "", // 分类 0 基线版 1 定制版
    cpIdList: [], // 适用对象 (多选)
    contractStatus: "", //  状态 1 启用  2 停用
  },
  customizationList: [{
    label: "基线版",
    value: 0
  }, {
    label: "定制版",
    value: 1
  }],
  signNumList: [{
    label: "双方合同",
    value: 2
  }, {
    label: "三方合同",
    value: 3
  }],
  statusList: [{
    label: "启用",
    value: 1
  }, {
    label: "停用",
    value: 2
  }]
}
export const parColumns = _this => {
  return [
    {
      type: "index",
      title: "序号",
      minWidth: 60
    },
    {
      title: "安证通合同ID",
      key: "templateId",
      ellipsis: true,
      minWidth: 300,
      tooltip: true
    },
    {
      title: "合同名称",
      key: "name",
      minWidth: 140,
      ellipsis: true,
      tooltip: true
    },
    {
      title: "类型",
      key: "customizationFlag",
      minWidth: 100,
      ellipsis: true,
      tooltip: true,
      render: (h, params) => {
        const {
          row: { signNum }
        } = params;
        let text = signNum === 2 ? "双方合同" : signNum === 3 ? "三方合同" : "";
        return <span>{text}</span>;
      }
    },
    {
      title: "分类",
      key: "customizationFlag",
      minWidth: 100,
      ellipsis: true,
      tooltip: true,
      render: (h, params) => {
        const {
          row: { customizationFlag }
        } = params;
        let text = customizationFlag === 0 ? "基线版" : "定制版";
        return <span>{text}</span>;
      }
    },
    {
      title: "适用对象",
      key: "cpNameList",
      minWidth: 240,
      // ellipsis: true,
      render: (h, params) => {
        const {
          row: { customizationFlag, cpNameList }
        } = params;
        let text = customizationFlag === 0 ? "所有CP公司（已配置定制版的CP公司除外）" : cpNameList;
        if (Array.isArray(text)) {
          text = text.join(",")
        }
        return <span>{text}</span>;
      }
    },
    {
      title: "有效期",
      key: "startTime",
      minWidth: 340,
      ellipsis: true,
      tooltip: true,
      render: (h, params) => {
        let {
          row: { startTime, endTime }
        } = params;
        startTime = _this.$moment(startTime).format("YYYY-MM-DD HH:mm:ss")
        endTime = _this.$moment(endTime).format("YYYY-MM-DD HH:mm:ss")
        let text = `${startTime} 至 ${endTime}`;
        return <span>{text}</span>;
      }
    },
    {
      title: "状态",
      key: "status",
      minWidth: 140,
      ellipsis: true,
      tooltip: true,
      render: (h, params) => {
        const {
          row: { status }
        } = params;
        let text = status === 1 ? "启用" : "停用";
        return <span>{text}</span>;
      }
    },
    {
      title: "操作人",
      key: "updaterName",
      minWidth: 140,
      ellipsis: true,
      tooltip: true
    },
    {
      title: "操作时间",
      key: "updateTime",
      minWidth: 200,
      ellipsis: true,
      tooltip: true,
      render: (h, params) => {
        let x = params.row.updateTime
        x = _this.$moment(x).format("YYYY-MM-DD HH:mm:ss")
        return <span>{x}</span>;
      }
    },
    {
      title: "操作",
      key: "actions",
      minWidth: 180,
      fixed: "right",
      render: (h, params) => {
        const { row } = params;
        const { status, endTime } = row;
        const nowTime = new Date()
        let endTimeStr = new Date(endTime)
        const showCancellation = status === 1 ? "停用" : "启用";
        return h("div", {
          "class": "actions"
        }, [
          endTimeStr > nowTime ? h("Button", {
            props: {
              type: "primary",
              ghost: true,
              size: "small"
            },
            on: {
              click() {
                _this.updateContractStatus(row)
              }
            }
          }, showCancellation) : "",
          endTimeStr > nowTime ? h("Button", {
            props: {
              type: "primary",
              ghost: true,
              size: "small"
            },
            on: {
              click() {
                _this.navtoEdit(row)
              }
            }
          }, "编辑") : "",
          h("Button", {
            props: {
              type: "primary",
              ghost: true,
              size: "small"
            },
            on: {
              click() {
                _this.navtoContractDetail(row)
              }
            }
          }, "详情")
        ])
      }
    }
  ];
};

export const rules = _this => ({
  contractName: [
    {
      required: true,
      message: "合同名称不能为空",
      trigger: "change"
    },
    {
      validator: (rule, value, callback) => {
        if (value.length > 100) {
          return callback("合同名称内容最多只能100个字符");
        }
        callback()
      }
    }
  ],
  customizationFlag: [
    {
      required: true,
      message: "分类不能为空",
    }
  ],
  signNum: [
    {
      required: true,
      message: "合同类型不能为空",
    }
  ],
  cpDtoList: [
    {
      required: true,
      message: "适用对象不能为空",
      trigger: "blur"
    }
  ],
  startTime: [
    {
      required: true,
      message: "有效期不能为空",

    },
    {
      validator: (rule, value, callback) => {
        let now = new Date();
        let dataTime = new Date(value);
        if (dataTime < now) {
          callback(new Error("开始时间不能小于当前时间"));
        } else {
          callback();
        }
      }
    }
  ],
  endTime: [
    {
      required: true,
      message: "有效期不能为空",
    },
    {
      validator: (rule, value, callback) => {
        let now = new Date();
        let dataTime = new Date(value);
        if (dataTime < now) {
          callback(new Error("有效期结束时间不能小于当前时间"));
        } else {
          callback();
        }
      }
    }
  ],
  templateId: [
    {
      required: true,
      message: "安证通合同模板不能为空",

    }
  ],
  cpIds: [
    {
      required: true,
      message: "适用对象不能为空",
    }
  ]
});

export const formData = {
  contractType: "",
  customizationFlag: "",
  contractName: "",
  templateId: "",
  templateName: "",
  startTime: "",
  endTime: "",
  cpDtoList: null,
  signNum: ""
}
