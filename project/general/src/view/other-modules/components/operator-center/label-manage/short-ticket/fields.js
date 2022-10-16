import {
  timeFormat
} from "@/libs/util";
// 业务线
export const businessCarList = [{
  value: 4,
  label: "快享"
},
{
  value: 2,
  label: "专享"
},
{
  value: 11,
  label: "企业用车"
},
{
  value: 5,
  label: "顺风车"
},
{
  value: 8,
  label: "包车"
}
]
let statusList = [{
  label: "启用",
  value: "1"
},
{
  label: "停用",
  value: "0"
}
]
export let pushNodeList = [{
  label: "等待接驾",
  value: "0"
},
{
  label: "行程中",
  value: "1"
},
{
  label: "行程结束",
  value: "2"
}
]
export const inputList = [{
  name: "drop-input", // 下拉
  bind_key: "businessType",
  value: "",
  dropList: businessCarList,
  title: "业务线",
  clearable: true,
  isHide: false
},
{
  name: "drop-input", // 下拉
  bind_key: "tagId",
  value: "",
  dropList: [],
  title: "评价标签",
  clearable: true,
  isHide: false
},
{
  name: "drop-input", // 下拉
  bind_key: "status",
  value: "",
  dropList: statusList,
  title: "状态",
  clearable: true,
  isHide: false
},
{
  name: "drop-input", // 下拉
  bind_key: "pushNode",
  value: "",
  dropList: pushNodeList,
  title: "推送节点",
  clearable: true,
  isHide: false
}
]
export const parColumns = (that) => {
  return [{
    title: "序号",
    type: "index",
    width: 60,
    align: "center"
  },
  {
    title: "业务线",
    key: "businessType",
    tooltip: true,
    ellipsis: true,
    minWidth: 150
  },
  {
    title: "推送节点",
    key: "pushNode",
    tooltip: true,
    ellipsis: true,
    minWidth: 150,
    render: (h, params) => {
      switch (params.row.pushNode) {
        default:
          return h("div", (pushNodeList.find(item => String(item.value) === String(params.row.pushNode)) || {}).label || "")
      }
    }
  },
  {
    title: "评价标签",
    key: "tagName",
    tooltip: true,
    ellipsis: true,
    minWidth: 120,
    render(h, params) {
      return h("span", {}, params.row.surveyTagResDtoList[0] ? params.row.surveyTagResDtoList[0].tagName : "")
    }
  },
  {
    title: "问题",
    key: "name",
    minWidth: 260
  },
  {
    title: "问卷反馈数",
    key: "usageQuantity",
    tooltip: true,
    ellipsis: true,
    minWidth: 100
  },
  {
    title: "选项1",
    key: "option0",
    tooltip: true,
    ellipsis: true,
    minWidth: 90,
    render(h, params) {
      if (params.row.surveyOptionResDtoList && params.row.surveyOptionResDtoList[0]) {
        let obj = params.row.surveyOptionResDtoList[0]
        let option0 = obj.name
        return h("div", {}, option0)
      }
      return h("div", {}, "")
    }
  },
  {
    title: "选项1反馈",
    key: "feedback0",
    tooltip: true,
    // ellipsis: true,
    minWidth: 150,
    render(h, params) {
      if (params.row.surveyOptionResDtoList && params.row.surveyOptionResDtoList[0]) {
        let obj = params.row.surveyOptionResDtoList[0]
        let feedback0 = obj.usageQuantity + " / " + obj.percentage + "%"
        return h("div", [
          h("span", {
            style: {
              "margin-right": "4px"
            }
          }, feedback0),
          obj.usageQuantity > 0 ? h("Button", detailBtn(that, {
            questionId: params.row.id,
            optionId: obj.id,
            name: params.row.name,
          }, "short-ticket_detail_1"), "详情") : "",
        ])
      }
      return h("div", {}, "")
    }
  },
  {
    title: "选项2",
    key: "option1",
    tooltip: true,
    ellipsis: true,
    minWidth: 90,
    render(h, params) {
      if (params.row.surveyOptionResDtoList && params.row.surveyOptionResDtoList[1]) {
        let obj = params.row.surveyOptionResDtoList[1]
        let option1 = obj.name
        return h("div", {}, option1)
      }
      return h("div", {}, "")
    }
  },
  {
    title: "选项2反馈",
    key: "feedback1",
    tooltip: true,
    // ellipsis: true,
    minWidth: 150,
    render(h, params) {
      if (params.row.surveyOptionResDtoList && params.row.surveyOptionResDtoList[1]) {
        let obj = params.row.surveyOptionResDtoList[1]
        let feedback1 = obj.usageQuantity + " / " + obj.percentage + "%"
        return h("div", [
          h("span", {
            style: {
              "margin-right": "4px"
            }
          }, feedback1),
          obj.usageQuantity > 0 ? h("Button", detailBtn(that, {
            questionId: params.row.id,
            optionId: obj.id,
            name: params.row.name,
          }, "short-ticket_detail_2"), "详情") : "",
        ])
      }
      return h("div", {}, "")
    }
  },
  {
    title: "状态",
    key: "status",
    tooltip: true,
    ellipsis: true,
    minWidth: 80,
    render: (h, params) => {
      switch (params.row.status) {
        case 0:
          return h("div", "停用")
        case 1:
          return h("div", "启用")
      }
    }
  },
  {
    title: "操作",
    key: "action",
    tooltip: true,
    width: 200,
    slot: "action",
  }
  ]
}

let detailBtn = (that, params, hasAuth) => {
  return {
    "class": {
      tableBtn: true
    },
    props: {
      type: "info",
      ghost: true,
      size: "small"
    },
    directives: [{
      name: "hasAuth",
      value: hasAuth
    }],
    on: {
      click: () => {
        that.goAnswerDetail(params)
      }
    }
  }
}

export const ruleValidate = {
  businessType: [{
    required: true,
    type: "array",
    min: 1,
    message: "请至少选择一个业务线",
    trigger: "change"
  }],
  name: [{
    required: true,
    message: "请填写问题",
    trigger: "blur"
  }],
  pushNode: [{
    required: true,
    message: "请选择推送节点",
    trigger: "change"
  }],
  picture: [{
    required: true,
    message: "请选择图标",
    trigger: "change"
  }]
}
export const hisColumns = [{
  title: "序号",
  type: "index",
  width: 60,
  align: "center"
},
{
  title: "操作人",
  key: "userName",
  tooltip: true,
  width: 120
},
{
  title: "问题",
  key: "name",
  minWidth: 120
},
{
  title: "操作类型",
  key: "operationType",
  tooltip: true,
  width: 70
},
{
  title: "操作项",
  key: "operationName",
  tooltip: true,
  width: 100,
  render: (h, params) => {
    let list = []
    for (let key in params.row.modifiedValue) {
      list.push(h("p", key))
    }
    return h("div", {
      style: {
        "padding-top": "6px",
        "padding-bottom": "6px",
      }
    }, list)
  }
},
{
  title: "操作值",
  key: "modifiedValue",
  tooltip: true,
  minWidth: 420,
  render: (h, params) => {
    let list = []
    for (let key in params.row.modifiedValue) {
      list.push(h("p", params.row.modifiedValue[key]))
    }
    return h("div", {
      style: {
        padding: "4px 0;"
      }
    }, list)
  }
},
{
  title: "操作时间",
  key: "logTime",
  tooltip: true,
  width: 160,
  render: (h, params) => {
    return h("div", timeFormat(params.row.logTime, "yyyy-mm-dd"))
  }
}
]
