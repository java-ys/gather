import { mapToList } from "@/libs/util.js";

export const statusMap = {
  "-2": "已失效",
  0: "未生效",
  1: "生效中",
}
export const businessLineMap = { 11: "限时特惠", 14: "快享必达" }
export const statusList = mapToList(statusMap)
export const businessLineList = mapToList(businessLineMap)
// 列表
export const returnFields = that => {
  return {
    current: 1,
    pageSize: 10,
    total: 0,
    parColumns: [
      {
        title: "序号",
        key: "num",
        tooltip: true,
        width: 70,
        fixed: "left",
        render: (h, params) => {
          return h(
            "div",
            that.pageSize * (that.current - 1) + params.index + 1
          );
        }
      },
      {
        title: "名称",
        key: "ruleName",
        minWidth: 100,
        tooltip: true
      },
      {
        title: "业务线",
        key: "expandBizLine",
        minWidth: 100,
        tooltip: true,
        render: (h, params) => {
          return h(
            "span",
            businessLineMap[params.row.expandBizLine]
          );
        }
      },
      {
        title: "城市",
        key: "cityName",
        minWidth: 160,
        tooltip: true
      },
      {
        title: "生效日期",
        key: "effectiveTime",
        minWidth: 240,
        render: (h, params) => {
          return h(
            "span",
            `${params.row.effectiveTime} - ${params.row.failureTime}`
          );
        }
      },
      {
        title: "状态",
        key: "status",
        minWidth: 100,
        tooltip: true,
        render: (h, params) => {
          return h(
            "span",
            statusMap[params.row.status]
          );
        }
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 260,
        render: (h, params) => {
          let a = h(
            "Button",
            {
              class: {
                tableBtn: true
              },
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "fastride-car-stop"
                }
              ],
              on: {
                click: () => {
                  that.stop(params.row.uuid);
                }
              }
            },
            "停用"
          )
          let b = h(
            "Button",
            {
              class: {
                tableBtn: true
              },
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "fastride-car-edit"
                }
              ],
              on: {
                click: () => {
                  that.edit(params.row.uuid);
                }
              }
            },
            "编辑"
          )
          let c = h(
            "Button",
            {
              class: {
                tableBtn: true
              },
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "fastride-car-view"
                }
              ],
              on: {
                click: () => {
                  that.view(params.row.uuid);
                }
              }
            },
            "查看"
          )
          let d = h(
            "Button",
            {
              class: {
                tableBtn: true
              },
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "fastride-car-copy"
                }
              ],
              on: {
                click: () => {
                  that.copy(params.row.uuid);
                }
              }
            },
            "复制"
          )
          if (params.row.status === -2) {
            return h("div", [c, d]);
          }
          return h("div", [a, b, c, d]);
        }
      }
    ]
  };
};
export const inputList = [
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ["provinceID", "cityCode"], // 返回数据的key名
    placeholder: "请选择城市",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: "城市：", // 展示的字段名
    changeOnSelect: false
  },
  {
    name: "drop-input",
    bind_key: "status",
    placeholder: "请选择生效状态",
    value: "",
    dropList: statusList,
    title: "状态：",
    changeOnSelect: true,
    trigger: "click",
    multiple: false
  },
  {
    name: "drop-input",
    bind_key: "expandBizLine",
    placeholder: "请选择业务线",
    value: "",
    dropList: businessLineList,
    title: "业务线：",
    changeOnSelect: true,
    trigger: "click",
    multiple: false
  },
];