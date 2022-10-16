export const sourceTypeList = [
  {
    value: 4,
    label: '运营',
  },
  {
    value: 5,
    label: '计算',
  },
];

function getSourceTypeName(v) {
  return sourceTypeList.find(it => it.value - v === 0)?.label
}

export const statusList = [
  {
    value: 0,
    label: '生效',
  },
  {
    value: 1,
    label: '失效',
  },
];

function getStatusName(v) {
  return statusList.find(it => it.value - v === 0)?.label
}

export const undef = v => v === null || v === undefined || isNaN(v)

export const inputList = [
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ["cityCode", "cityCode"], // 返回数据的key名
    placeholder: "全国",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: "所属城市：", // 展示的字段名
    changeOnSelect: false,
    titleWidth: 80
  },
  {
    name: "text-input",
    bind_key: "address",
    placeholder: "请输入",
    value: "",
    titleWidth: 100,
    title: "推荐点名称："
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "sourceType", // 返回数据的key名默认索引
    placeholder: "请选择状态",
    value: "", // 用于数据绑定
    title: "推荐点类型 :", // 展示的字段名
    titleWidth: 100, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    dropList: sourceTypeList
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "disable", // 返回数据的key名
    placeholder: "请选择状态",
    value: "", // 用于数据绑定
    title: "状态 :", // 展示的字段名
    titleWidth: 100, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    dropList: statusList
  },
  {
    name: "date-time-input",
    placeholder: "请选择更新时间",
    bind_key: ["queryTimeFrom", "queryTimeTo"],
    value: "",
    titleWidth: 100, // 展示的字段名的宽度
    title: "编辑时间：",
    inputWidth: 300,
  },
];

export const tableColumns = that => {
  return [
    {
      title: "推荐点名称",
      key: "address",
      tooltip: true,
      minWidth: 220
    },
    {
      title: "推荐点类型",
      key: "sourceType",
      tooltip: true,
      minWidth: 120,
      render(h, { row }) {
        return <span>{getSourceTypeName(row.sourceType)}</span>
      }
    },
    {
      title: "经纬度",
      key: "latlng",
      tooltip: true,
      minWidth: 220,
      render: (h, params) => {
        let data = `${Number(params.row.lng).toFixed(6)}${
          params.row.lng ? "," : ""
        }${Number(params.row.lat).toFixed(6)}`;
        return h("span", data);
      }
    },
    {
      title: "所属城市",
      key: "cityName",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "状态",
      key: "isUpdate",
      tooltip: true,
      minWidth: 100,
      render(h, { row }) {
        return <span>{!!row.disable ? "失效" : "生效"}</span>
      }
    },
    {
      title: "是否限停",
      key: "noParking",
      tooltip: true,
      minWidth: 100,
      render(h, { row }) {
        return <span>{!!row.noParking ? "是" : "否"}</span>
      }
    },
    {
      title: "限停时长(分钟)",
      key: "parkingTime",
      tooltip: true,
      minWidth: 180
    },
    {
      title: "编辑人",
      key: "updater",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let data = params.row.updater || "-";
        return h("div", data);
      }
    },
    {
      title: "编辑时间",
      key: "updateTime",
      tooltip: true,
      minWidth: 180
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      fixed: "right",
      render: (h, params) => {
        return h("div", [
          h(
            "a",
            {
              directives: [
                {
                  name: "hasAuth",
                  value: "recom_poi_edit"
                }
              ],
              on: {
                click() {
                  that.item = params.row;
                  that.modalShow = true;
                }
              }
            },
            "编辑"
          )
        ]);
      }
    }
  ];
};

export const pageData = {
  isShowAudit: false,
  pageData: {
    total: 0,
    currPage: 1,
    pageSize: 10
  },
  pageSizeOpts: [20, 50, 100],
  tableColumns: [],
  tableData: []
};
