import { getDirectives } from "@/mixins/base";

export const bizTypeMap = {
  1: "出租车",
  2: "专车",
  4: "快享",
  6: "惠享",
  7: "自动驾驶"
};

export const defaultVehicleList = [
  {
    bizType: "",
    bizTypeName: "惠享",
    levels: [
      {
        vehicleAias: "",
        vehicleName: "限时特惠",
        vehicleLevel: "",
        tipMsg: ""
      },
      {
        vehicleAias: "",
        vehicleName: "惠享",
        vehicleLevel: "",
        tipMsg: ""
      }
    ]
  },
  {
    bizType: "",
    bizTypeName: "快享",
    levels: [
      {
        vehicleAias: "",
        vehicleName: "快享",
        vehicleLevel: "",
        tipMsg: "服务号更安全"
      }
    ]
  },
  {
    bizType: "",
    bizTypeName: "专车",
    levels: [
      {
        vehicleAias: "",
        vehicleName: "尊享",
        vehicleLevel: "",
        tipMsg: ""
      },
      {
        vehicleAias: "",
        vehicleName: "专享",
        vehicleLevel: "",
        tipMsg: ""
      },
      {
        vehicleAias: "",
        vehicleName: "商务型",
        vehicleLevel: "",
        tipMsg: ""
      },
      {
        vehicleAias: "",
        vehicleName: "行政型",
        vehicleLevel: "",
        tipMsg: ""
      },
      {
        vehicleAias: "",
        vehicleName: "尊贵型",
        vehicleLevel: "",
        tipMsg: ""
      },
    ]
  },
  {
    bizType: "",
    bizTypeName: "出租车",
    levels: [
      {
        vehicleAias: "",
        vehicleName: "出租车",
        vehicleLevel: "",
        tipMsg: "勾选接单快"
      }
    ]
  },
  {
    bizType: "",
    bizTypeName: "自动驾驶",
    levels: [
      {
        vehicleAias: "",
        vehicleName: "自动驾驶",
        vehicleLevel: "",
        tipMsg: "全程安心陪护"
      }
    ]
  },
]

export const inputList = [
  {
    name: "cascader-input", // 级联
    bind_key: ["provinceCode", "cityCode"],
    value: [],
    cascaderList: [],
    filterable: true,
    title: "城市"
  }
];

export const webTypeInfo = {
  0: {
    editTitle: "实时单正在呼叫页面管理策略",
    introText: [
      "本页面用以配置乘客端(APP/小程序)确认用车，周家车型页面的车型展示顺序。",
      "未配置的城市将以默认配置生效。新建策略后的初始化配置与默认配置一致。"
    ]
  }
};

export const rules = {
  area: [
    {
      required: true,
      message: "请选择城市",
    },
    {
      validator: (rule, value, callback) => {
        if (!value || !value[1]) {
          callback(new Error("请选择城市"));
        } else {
          callback();
        }
      },
    },
  ],
}

export const descList = [
  {label: "惠享·限时特惠", key: "a"},
  {label: "快享·快享", key: "b"},
  {label: "惠享·惠享", key: "c"},
  {label: "专车·尊享", key: "d"},
  {label: "专车·专享", key: "e"},
  {label: "专车·服务型", key: "f"},
  {label: "专车·行政型", key: "g"},
  {label: "出租车·出租车", key: "h"},
  {label: "自动驾驶·自动驾驶", key: "aa"},
  {label: "专车·尊贵型", key: "aa"}
]

export const column = _this => {
  return [
    {
      title: "序号",
      width: 80,
      render: (h, params) => {
        return h(
          "span",
          {},
          (_this.current - 1) * _this.pageSize + params.index + 1
        );
      }
    },
    {
      key: "provinceName",
      title: "城市",
      render: (h, {row}) => {
        return (<span>{row.provinceName}/{row.cityName}</span>)
      }
    },
    {
      key: "creator",
      title: "创建人"
    },
    {
      key: "createTime",
      title: "创建时间"
    },
    {
      key: "updateTime",
      title: "更新时间"
    },
    {
      title: "操作",
      render: (h, { row }) => {
        return (
          <div>
            <Button
              type="primary"
              style={{
                marginRight: "5px",
              }}
              {...getDirectives("car-desc-edit")}
              onClick={() => _this.edit(row)}
            >
              编辑
            </Button>
            <Button
              type="default"
              style={{
                marginRight: "5px",
              }}
              {...getDirectives("car-desc-detail")}
              onClick={() => _this.showDetail(row)}
            >
              详情
            </Button>
            {!row.delFalg ? (
              <Button
                type="error"
                {...getDirectives("car-desc-delete")}
                onClick={() => _this.deleteRow(row)}
              >
                删除
              </Button>
            ) : null}
          </div>
        );
      }
    }
  ];
};
