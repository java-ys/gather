export const carTypeMap = [
  {
    value: 1,
    label: "快享"
  },
  {
    value: 2,
    label: "舒适型"
  },
  {
    value: 3,
    label: "行政型"
  },
  {
    value: 4,
    label: "商务型"
  },
  {
    value: 9,
    label: "豪华型"
  },
  {
    value: 8,
    label: "自动驾驶"
  },
  {
    value: 10,
    label: "惠享"
  },
  // {
  //  value: 5,
  //  label: "尊贵型"
  // }
];

export const statusData = {
  0: "停用",
  1: "启用"
};

export const businessTypeData = {
  4: "快享",
  2: "专享",
  1: "出租车"
};

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
        title: "城市",
        key: "city",
        minWidth: 150,
        tooltip: true,
        render: (h, params) => {
          let cityName = params.row.cityName;
          // const getCityName = cityCode => {
          //  let newJSON = {};
          //  that.cityList.forEach(item => {
          //    item.children &&
          //    item.children.length &&
          //    item.children.forEach(element => {
          //      newJSON[element.cityID] = element.__label;
          //    });
          //  });
          //  return newJSON[cityCode] || "暂无";
          // };
          return h("div", cityName);
        }
      },
      {
        title: "产品线",
        key: "businessType",
        tooltip: true,
        minWidth: 150,
        render: (h, params) => {
          const { row } = params;
          const { businessType } = row;
        //   const newtitles = { ...businessTypeData }[businessType];
        //   return h("div", newtitles || "暂无");
          const newtitles = that.gradeInfo.find(it => it.businessCode === businessType)
          return h("div", newtitles ? newtitles.businessCodeDesc: "暂无");
        }
      },
      {
        title: "车型等级",
        key: "carTypes",
        tooltip: true,
        minWidth: 150,
        render: (h, params) => {
          let text = "";
          const { row:{businessType} } = params;
          let  businessTypeMap = that.gradeInfo.find(it => it.businessCode === businessType)
          let carTypeMap = businessTypeMap? businessTypeMap.gradeDtoList :[]
          carTypeMap.forEach(item => {
            // if (params.row.carLevels.includes(item.value)) text += (item.label + `、`);
            if (params.row.carLevels.includes(item.gradeCode)) text += (item.gradeDesc + `、`);
          });
          text = text.substring(0, text.lastIndexOf("、"))
          return h("div", text);
        }
      },
      {
        title: "状态",
        key: "status",
        tooltip: true,
        minWidth: 150,
        render: (h, params) => {
          let statusTitle = statusData[params.row.status] || "暂无";
          return h("div", statusTitle);
        }
      },
      {
        title: "更新时间",
        key: "updateTime",
        minWidth: 150,
        tooltip: true
      },
      {
        title: "更新人",
        key: "updater",
        minWidth: 150,
        tooltip: true
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 300,
        render: (h, params) => {
          const paramData = params.row;
          const { status } = paramData;
          const canStop = status === 1; // 停用
          const canStart = status === 0; // 启用
          return h("div", [
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
                directives: [
                  {
                    name: "hasAuth",
                    value: "product_line_control-edit"
                  }
                ],
                on: {
                  click: () => {
                    let newJSON = {
                      carTypes: [],
                      carrierArea: [],
                      businessType: "",
                    };
                    that.title = "编辑产品线管理策略";
                    that.updateType = "edit";
                    that.uuid = paramData.uuid;
                    for (let key in newJSON) {
                      newJSON[key] = paramData[key];
                    }
                    newJSON.carrierArea = [
                      paramData.cityCode.substring(0, 2) + "0000",
                      paramData.cityCode
                    ];
                    newJSON.businessType = newJSON.businessType
                    newJSON.carTypes = paramData.carLevels
                    that.floatParams = newJSON;
                    that.isPop = true;
                    that.invalidEditor = false;
                  }
                }
              },
              "编辑"
            ),
            canStart
              ? h(
                "Button",
                {
                  class: {
                    tableBtn: true
                  },
                  props: {
                    type: "success",
                    ghost: true,
                    size: "small"
                  },
                  directives: [{
                    name: "hasAuth",
                    value: "product_line_control-active"
                  }],
                  on: {
                    click: () => {
                      that.rowActive(paramData)
                    }
                  }
                },
                "启用"
              ) : "",
            canStop
              ? h(
                "Button",
                {
                  class: {
                    tableBtn: true
                  },
                  style: {
                    color: "red",
                    borderColor: "red",
                    display: "none"
                  },
                  props: {
                    type: "info",
                    ghost: true,
                    size: "small"
                  },
                  directives: [{
                    name: "hasAuth",
                    value: "product_line_control-deactive"
                  }],
                  on: {
                    click: () => {
                      that.rowActive(paramData)
                    }
                  }
                },
                "停用"
              ) : ""
          ]);
        }
      }
    ]
  };
};
export const inputList = [
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ["provinceId", "cityId"], // 返回数据的key名
    placeholder: "请选择省/市",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: "省 / 市："
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "businessType", // 返回数据的key名
    placeholder: "请选择产品线",
    value: "", // 绑定返回数据
    dropList: [], // 级联列表
    title: "产品线："
  }
];
