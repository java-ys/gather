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
    parColumns: [{
      title: "序号",
      key: "num",
      tooltip: true,
      width: 70,
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
        const {
          row
        } = params; const {
          businessType
        } = row;
        const newtitles = {
          ...businessTypeData
        }[businessType];

        return h("div", newtitles || "暂无");
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
      width: 300,
      render: (h, params) => {

        return h("div", [
          h(
            "Button", {
              class: {
                tableBtn: true
              },
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: "hasAuth",
                value: "orderValue-detail"
              }],
              on: {
                click: () => {
                  that.goDetail(params.row);
                }
              }
            },
            "详情"
          ),
          h(
            "Button", {
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
                value: "orderValue-edit"
              }],
              on: {
                click: () => {
                  that.goEdit(params.row);

                }
              }
            },
            "编辑"
          ),
          h(
            "Button", {
              class: {
                tableBtn: true
              },
              props: {
                type: "error",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: "hasAuth",
                value: "orderValue-delete"
              }],
              on: {
                click: () => {
                  that.deleteData(params.row.uuid);
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
export const inputList = [{
  name: "cascader-input", // 文本输入框名
  bind_key: ["cityUuid"], // 返回数据的key名
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

export const formValidate = {
  cityCodeArr: [{
    required: true,
    message: "必选",
    trigger: "change",
    type: "array",
  },],
  businessType: [{
    required: true,
    message: "必选",
    trigger: "change",
  },],
  membershipLevels: [{
    required: true,
    message: "必选",
    trigger: "change",
    type: "array"
  },],
  orderAmount: [{
    required: true,
    message: "必填",
    trigger: "change",
  },],
  orderAmountRuleWeight: [{
    required: true,
    message: "必选",
    trigger: "change",
  },],
  membershipRuleWeight: [{
    required: true,
    message: "必选",
    trigger: "change",
  },],
  membershipScoreMap1: [{
    required: true,
    message: "必选",
    trigger: "change",
  }],
  membershipScoreMap2: [{
    required: true,
    message: "必选",
    trigger: "change",
  }],
  membershipScoreMap3: [{
    required: true,
    message: "必选",
    trigger: "change",
  }],
  membershipScoreMap4: [{
    required: true,
    message: "必选",
    trigger: "change",
  }],
  membershipScoreMap5: [{
    required: true,
    message: "必选",
    trigger: "change",
  }],
  enterpriseUserRuleweight: [{
    required: true,
    message: "必选",
    trigger: "change",
  }],
  isEnterpriseUserScore: [{
    required: true,
    message: "必选",
    trigger: "change",
  }],
  isNotEnterpriseUserScore: [{
    required: true,
    message: "必选",
    trigger: "change",
  }],
  newUserFirstAddScore: [{
    required: true,
    message: "必选",
    trigger: "change",
  }],
  max: [{
    required: true,
    message: "必填",
    trigger: "change"
  }],
  gears: [{
    required: true,
    message: "必填",
    trigger: "change"
  }]
}

export const persentQz = {
  5: "5%",
  10: "10%",
  15: "15%",
  20: "20%",
  25: "25%",
  30: "30%",
  35: "35%",
  40: "40%",
  45: "45%",
  50: "50%",
  55: "55%",
  60: "60%",
  65: "65%",
  70: "70%",
  75: "75%",
  80: "80%",
  85: "85%",
  90: "90%",
  95: "95%",
  100: "100%"
}
export const personWeight = [
  "0",
  "0.1",
  "0.2",
  "0.3",
  "0.4",
  "0.5",
  "0.6",
  "0.7",
  "0.8",
  "0.9",
  "1"
]

// export const personWeight = [
//   0,
//   0.1,
//   0.2,
//   0.3,
//   0.4,
//   0.5,
//   0.6,
//   0.7,
//   0.8,
//   0.9,
//   1
// ]
