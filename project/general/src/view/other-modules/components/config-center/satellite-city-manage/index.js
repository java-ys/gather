import { checkHasBtn } from "@/libs/util";

// 经纬度和时间段
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
        title: "归属城市",
        key: "parentName",
        minWidth: 100,
        tooltip: true
      },

      {
        title: "卫星城市",
        key: "cityName",
        minWidth: 160,
        tooltip: true
      },
      {
        title: "生效状态",
        key: "cityStatus",
        minWidth: 100,
        tooltip: true,
        render: (h, params) => {
          return h(
            "span",
            params.row.cityStatus === 0 ? "生效中" : "已失效"
          );
        }
      },

      {
        title: "创建日期",
        key: "createTime",
        minWidth: 160,
        tooltip: true
      },
      {
        title: "创建人",
        key: "creater",
        minWidth: 100,
        tooltip: true
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 250,
        render: (h, params) => {
          const paramData = params.row;
          return h("div", [
            h(
              "Button",
              {
                class: {
                  tableBtn: true
                },
                props: {
                  type: "info",
                  ghost: true,
                  size: "small"
                },
                style: {
                  display: !checkHasBtn("satellite-city-manage-status") ? "none" : "inline-block"
                },
                on: {
                  click: () => {
                    that.rowActive(paramData);
                  }
                }
              },
              paramData.cityStatus === 0 ? "失效" : "生效"
            ),
            h(
              "Button",
              {
                class: {
                  tableBtn: true
                },
                props: {
                  type: "warning",
                  ghost: true,
                  size: "small"
                },
                style: {
                  display: !checkHasBtn("satellite-city-manage-update") ? "none" : "inline-block"
                },
        

                on: {
                  click: () => {
                    that.edit(paramData);
                  }
                }
              },
              "编辑"
            ),
            h(
              "Button",
              {
                class: {
                  tableBtn: true
                },
                props: {
                  type: "error",
                  ghost: true,
                  size: "small"
                },
                style: {
                  display: !checkHasBtn("satellite-city-manage-delete") ? "none" : "inline-block"
                },
                on: {
                  click: () => {
                    that.deleteItem(paramData);
                  }
                }
              },
              "删除"
            )
          ]);
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
    name: "text-input",
    bind_key: "creater",
    placeholder: "请填写创建人",
    value: "", // 用于数据绑定
    title: "创建人:", // 展示的字段名
    titleWidth: 120
  },
  {
    name: "drop-input",
    bind_key: "cityStatus",
    placeholder: "请选择生效状态",
    value: "",
    dropList: [
      { value: "0", label: "生效中" },
      { value: "1", label: "已失效" },
    ],
    title: "生效状态：",
    changeOnSelect: true,
    trigger: "click",
    multiple: false
  },
];
