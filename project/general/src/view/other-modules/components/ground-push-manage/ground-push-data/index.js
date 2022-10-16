import { mapToList, checkHasBtn } from "@/libs/util"

export const statusData = {
  1: "正常",
  2: "未生效",
  3: "失效",
  4: "停用"
}

export const returnFields = that => {
  return {
    current: 1,
    pageSize: 10,
    total: 0,
    parColumns: [
      {
        title: "地推单编号",
        key: "num",
        // tooltip: true,
        minWidth: 150,
        // fixed: "left",
        render: (h, params) => {
          return h(
            "div",
            that.pageSize * (that.current - 1) + params.index + 1
          )
        }
      },
      {
        title: "地推单名称",
        key: "createTime",
        minWidth: 180,
      },
      {
        title: "手机号码",
        key: "name",
        minWidth: 150,
        // fixed: "left"
      },
      {
        title: "姓名",
        key: "name",
        minWidth: 150,
        // fixed: "left"
      },
      {
        title: "有效注册",
        key: "name",
        minWidth: 150,
        // fixed: "left"
      },
      {
        title: "有效首单",
        key: "name",
        minWidth: 150,
        // fixed: "left"
      },
      {
        title: "有效多单",
        key: "name",
        minWidth: 150,
        // fixed: "left"
      },
      {
        title: "异常人数",
        key: "name",
        minWidth: 150,
        // fixed: "left"
      },
      {
        title: "目标首单转化量",
        key: "name",
        minWidth: 150,
        // fixed: "left"
      },
    ]
  }
}
export const inputList = [
  {
    name: "text-input",
    bind_key: "userName",
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "地推单号：", // 展示的字段名
    // titleWidth: 40
  },
  {
    name: "text-input",
    bind_key: "userName",
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "地推单名称：", // 展示的字段名
    titleWidth: 80,
  },
  {
    name: "cascader-input",
    bind_key: ["provinceCode", "cityCode"],
    placeholder: "请选择城市",
    value: [],
    cascaderList: [],
    title: "城市：",
    filterable: true,
    changeOnSelect: false,
    titleWidth: 60,
    inputWidth: 165
  },
  {
    name: "text-input",
    bind_key: "userName",
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "作业人员姓名：", // 展示的字段名
    titleWidth: 100,
  },
  {
    name: "text-input",
    bind_key: "userName",
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "作业人员手机：", // 展示的字段名
    titleWidth: 100,
  },
  {
    name: "date-input",
    placeholder: "请选择",
    bind_key: ["queryTimeFrom", "queryTimeTo"],
    value: "",
    // format: 'yyyy-MM-dd',
    title: "选择日期：",
    inputWidth: 300,
  },
]
