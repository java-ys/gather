/*
 * @Author: NapierPLUS
 * @Date: 2021-07-20 21:15:03
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-08-25 16:17:48
 * @Description: 配置项
 */
export const formRule = _this => {
  return {
    declareTitle: [{ required: true, type: "string", message: "请维护", trigger: "blur" }],
    accountPeirod: [{ required: true, type: "string", message: "请维护", trigger: "blur" }],
    collectionCompany: [{ required: true, type: "string", message: "请维护", trigger: "blur" }],
    accountBank: [{ required: true, type: "string", message: "请维护", trigger: "blur" }],
    accountNumber: [{ required: true, type: "string", message: "请维护", trigger: "blur" }],
    // fileCacheKey: [{ required: true, type: "string", message: "请维护", trigger: "change" }],
  };
};
export const rentStateList =  [

    {
      label: "待代扣",
      value: 0
    },
    {
      label: "代扣中",
      value: 1
    },
    {
      label: "代扣结束",
      value: 2
    },
    {
        label: "代扣失败",
        value: 3
    },
    {
        label: "终止代扣",
        value: 4
    }
  ]
export const inputList =  [
  {
    name: "text-input", // 文本输入框
    bind_key: "declareNo",
    placeholder: "请输入",
    title: "申报单编号：",
    titleWidth: 75,
    inputWidth: 200,
    isHide: false,
  },
  {
    name: "drop-input", // 下拉选择框
    bind_key: "declareState",
    placeholder: "请选择",
    value: "",
    title: "代扣状态：",
    titleWidth: 75,
    inputWidth: 200,
    dropList: rentStateList,
    key: "",
    isHide: false,
    filterable: true
  },
]
export const detailColumns = (that) => {
    return [
      {
        type: "index",
        title: "序号",
        minWidth: 65
      },
      {
        title: "司机ID",
        key: "driverNo",
        ellipsis: true,
        minWidth: 120,
        tooltip: true,
      },
      {
        title: "姓名",
        key: "driverName",
        minWidth: 120,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "手机号",
        key: "driverPhone",
        minWidth: 150,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "身份证号",
        key: "driverIdCard",
        minWidth: 150,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "车牌号",
        key: "plateNum",
        minWidth: 150,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "车架号",
        key: "vin",
        minWidth: 180,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "车辆型号",
        key: "carBrand",
        minWidth: 150,
        ellipsis: true,
        tooltip: true,
        render: (h, { row }) => {
          return h("span", {}, `${row.carBrand}${row.carSeries}${row.carLevel}`)
        }
      },
      {
        title: "起租日期",
        key: "deliveryDate",
        minWidth: 180,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "租期",
        key: "stage",
        minWidth: 100,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "需代扣月份",
        key: "withholdDate",
        minWidth: 150,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "代扣金额",
        key: "rent",
        minWidth: 150,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "司机是否同意代扣",
        key: "declareTitle",
        minWidth: 150,
        ellipsis: true,
        tooltip: true,
        render: (h, { row }) => {
          return h("span", {}, row.withholdType === 1 ? "是" : "否")
        }
      },
      {
        title: "代扣状态",
        key: "declareState",
        minWidth: 120,
        ellipsis: true,
        tooltip: true,
        render: (h, { row }) => {
          return h("span", {}, Number(row.declareState) >= 0 ? rentStateList[Number(row.declareState)].label : "")
        }
      },
      {
        title: "代扣明细",
        key: "actions",
        minWidth: 190,
        render: (h, { row }) => {
          return h("a", [h("span", {
            style: {
              display: "inline-block",
              margin: "3px",
              color: "#3399ff"
            },
            on: {
              click: () => {
                that.showDetailModal(row)
              }
            }
          }, "查看")])
        }
      }
    ]
  }
