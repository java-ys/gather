/**
 * Created by fantinyu on 2018/12/6 0006.
 */
import { getInvoiceDetail } from "_g/api/finance.js";

export const applySourceMap = {
  1: "app申请",
  2: "客服申请"
};
export const bussinessTypeMap = {
  1: "开具发票",
  2: "发票作废"
};

let applySourceList = [];
for (let key in applySourceMap) {
  let obj = {
    value: Number(key),
    label: applySourceMap[key]
  };
  applySourceList.push(obj);
}

let bussinessTypeList = [];
for (let key in bussinessTypeMap) {
  let obj = {
    value: Number(key),
    label: bussinessTypeMap[key]
  };
  bussinessTypeList.push(obj);
}

export const inputList = [
  {
    name: "text-input", // 文本输入框名
    bind_key: "passengerName", // 返回数据的key名
    placeholder: "请输入乘客姓名",
    value: "", // 用于数据绑定
    title: "乘客姓名："
  },
  {
    name: "number-input", // 文本输入框名
    bind_key: "passengerMobile", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "手机号："
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "invoiceType", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "发票类型：", // 展示的字段名
    dropList: [
      {
        label: "全部",
        value: ""
      },
      {
        label: "电子发票",
        value: 1
      },
      {
        label: "纸质发票",
        value: 2
      }
    ]
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "status", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "发票状态：",
    dropList: [
      {
        label: "全部",
        value: ""
      },
      {
        label: "待开票",
        value: "0"
      },
      {
        label: "待寄出",
        value: "1"
      },
      {
        label: "已寄出",
        value: "2"
      },
      {
        label: "已取消",
        value: "3"
      },
      {
        label: "已作废",
        value: "4"
      },
      {
        label: "已开票（电子发票）",
        value: "5"
      },
      {
        label: "作废中",
        value: "6"
      },
      {
        label: "作废成功",
        value: "7"
      },
      {
        label: "作废失败",
        value: "8"
      }
    ]
  },
  {
    name: "drop-input", // 下拉选择框
    bind_key: "payType",
    placeholder: "请输入",
    value: "",
    title: "邮费方式：",
    dropList: [
      {
        label: "全部",
        value: ""
      },
      {
        label: "到付",
        value: "1"
      },
      {
        label: "寄付",
        value: "2"
      },
      {
        label: "无",
        value: "0"
      }
    ]
  },
  {
    title: "申请来源：",
    name: "drop-input",
    bind_key: "applySource",
    dropList: applySourceList
  },
  {
    title: "业务类型：",
    name: "drop-input",
    bind_key: "bizType",
    dropList: bussinessTypeList
  },
  {
    name: "section-input", // 文本输入框名
    bind_key: ["moneyMix", "moneyMax"], // 返回数据的key名
    placeholder: "元",
    value1: null, // 用于数据绑定
    value2: null, // 用于数据绑定d
    title: "金额(元)：", // 展示的字段名
    inputWidth: 55
  }
];

export const Columns = that => {
  return {
    passengerName: {
      title: "乘客姓名",
      key: "passengerName",
      tooltip: true,
      minWidth: 100,
      fixed: "left"
    },
    passengerMobile: {
      title: "手机号",
      key: "passengerMobile",
      tooltip: true,
      minWidth: 150
    },
    invoiceType: {
      title: "发票类型",
      key: "invoiceType",
      tooltip: true,
      minWidth: 150,
      render: (h, params) => {
        let text = "";
        if (params.row.invoiceType === 1) {
          text = "电子发票";
        } else if (params.row.invoiceType === 2) {
          text = "纸质发票";
        }
        return h("span", text);
      }
    },
    headerType: {
      title: "发票抬头类型",
      key: "headerType",
      tooltip: true,
      minWidth: 150,
      render: (h, params) => {
        let text = "";
        if (params.row.headerType === 1) {
          text = "企业单位";
        } else if (params.row.headerType === 2) {
          text = "个人/非企业单位";
        }
        return h("span", text);
      }
    },
    money: {
      title: "开票金额(元)",
      key: "money",
      minWidth: 150,
      tooltip: true
    },
    status: {
      title: "发票状态",
      key: "status",
      tooltip: true,
      minWidth: 150,
      render: (h, params) => {
        let text = "";
        if (params.row.status === 0) {
          text = "待开票";
        } else if (params.row.status === 1) {
          text = "已开票-寄送中";
        } else {
          text = "已开票";
        }
        return h("span", text);
      }
    },
    payType: {
      title: "邮费",
      key: "payType",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let text = "";
        if (params.row.payType == 0) {
          text = "无";
        } else if (params.row.payType == 1) {
          text = "到付";
        } else if (params.row.payType == 2) {
          text = "寄付";
        }
        return h("span", text);
      }
    },
    applySource: {
      title: "申请来源",
      key: "applySource",
      minWidth: 150,
      render: (h, params) => {
        let status = params.row.applySource;
        return h("span", {}, applySourceMap[status] || "暂无");
      }
    },
    bussinessType: {
      title: "业务类型",
      key: "bizType",
      minWidth: 150,
      render: (h, params) => {
        let status = params.row.bizType;
        return h("span", {}, bussinessTypeMap[status] || "暂无");
      }
    },
    createTime: {
      title: "提交时间",
      key: "createTime",
      tooltip: true,
      minWidth: 150
    },
    action: {
      title: "操作",
      key: "action",
      width: 200,
      fixed: "right",
      render: (h, params) => {
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "info",
                ghost: true,
                size: "small"
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "invoice-management-detail"
                }
              ],
              on: {
                click: () => {
                  let data = { uuid: params.row.uuid };
                  getInvoiceDetail(data).then(res => {
                    if (res.data.success) {
                      that.detailForm = res.data.data;
                      that.oderData = res.data.data.itineraryList;
                    } else {
                      that.$Message.error("获取信息时发生了未知错误，请联系管理员");
                    }
                  });
                  that.detailMobel = true;
                }
              }
            },
            "详情"
          ),
          h(
            "Button",
            {
              props: {
                type: "warning",
                ghost: true,
                size: "small"
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "invoice-management-import"
                }
              ],
              style: {
                marginLeft: "15px",
                display:
                  params.row.invoiceType === 2 && params.row.status === 0
                    ? "inline-block"
                    : "none"
              },
              on: {
                click: () => {
                  that.postForm.uuid = "";
                  that.postForm.uuid = params.row.uuid;
                  that.editMobel = true;
                  that.toType = 2;
                }
              }
            },
            "快递单号录入"
          )
        ]);
      }
    }
  };
};

export const columnOrder = that => {
  return [
    {
      title: "运营类型",
      key: "typeModuleName",
      tooltip: true,
      minWidth: 60
    },
    {
      title: "上车时间",
      key: "deparTime",
      tooltip: true,
      minWidth: 60
    },
    {
      title: "起点",
      key: "originAddress",
      tooltip: true,
      minWidth: 60
    },
    {
      title: "终点",
      key: "destAddress",
      tooltip: true,
      minWidth: 60
    },
    {
      title: "开票金额",
      key: "billMoney",
      tooltip: true,
      minWidth: 60
    },
    {
      title: "订单号",
      key: "orderNo",
      tooltip: true,
      ellipsis: true,
      minWidth: 60,
      render: (h, params) => {
        let num = params.row.routeUuid || null;
        let orderNo = params.row.orderNo;
        //  1 -> 个人   2 -> 企业
        let typeEnt = params.row.typeEnt;
        return h(
          "a",
          {
            on: {
              click: () => {
                if (num === null) {
                  that.$Message.warning("routeUuid不得为空");
                  return;
                }
                if (typeEnt === 1) {
                  that.$router.push({
                    name: "order-detail",
                    params: { id: num }
                  });
                } else if (typeEnt === 2) {
                  // that.$router.push({
                  //   path: "/companyCenter/orderManager/orderdetail",
                  //   query: {
                  //     id: num,
                  //     applyNo: params.row.applyNo
                  //   }
                  // });
                  that.$router.pushToAnotherModule("/m2-web-companyLines", {
                    path: "/companyCenter/orderManager/orderdetail",
                    query: {
                      id: num,
                      applyNo: params.row.applyNo
                    }
                  })
                }
                that.invoiceDetail && (that.invoiceDetail = false);
              }
            }
          },
          orderNo
        );
      }
    }
  ];
};
