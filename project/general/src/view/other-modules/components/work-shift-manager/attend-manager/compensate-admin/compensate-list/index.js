import {
  driverNameMobileService,
  vinPlateService
} from '_o/api/m2-driver-api/common';

// 状态列表
const statusList = [
  {

    value: 1,
    label: "待审批"
  },
  {
    value: 2,
    label: "审批通过"
  },
  {
    value: 3,
    label: "审批驳回"
  },
  {
    value: 4,
    label: "撤销"
  },
  {
    value: 5,
    label: "超时驳回"
  }
  // ,
  // {
  //   value: 6,
  //   label: "已销假"
  // },
  // {
  //   value: 7,
  //   label: "司管待审批"
  // },
  // {
  //   value: 8,
  //   label: "城市团队待审批"
  // }
];

export const compensateList = {
  inputList: [{
      name: "cascader-input",
      bind_key: ["provinceCode", "cityCode"], // 返回数据的key名
      placeholder: "请选择城市",
      value: [], // 绑定返回数据
      cascaderList: [], // 级联列表
      title: "城市：", // 展示的字段名
      changeOnSelect: false,
      titleWidth: 60,
      inputWidth: 165
    },
    {
      name: "drop-input",
      title: "运营商",
      dropList: [],
      bind_key: "agentUuid",
      value: "",
      titleWidth: 60,
      inputWidth: 165
    },
    {
      name: "remote-multi-scroll", //下拉
      bind_key: "driverUuidList",
      dataKey: "uuid", // key的变量名
      dataLabel: "name", // label 的变量名
      queryName: "driverName", // 入参名
      placeholder: "请输入司机姓名",
      value: "",
      title: "司机姓名",
      isHide: false,
      inputWidth: 165,
      params: {
        queryType: 2
      }, // 1.手机号 2.司机姓名
      axiosFun: driverNameMobileService
    },
    {
      name: "remote-multi-scroll", //下拉
      bind_key: "driverMobileList",
      dataKey: "mobile", // key的变量名
      dataLabel: "mobile", // label 的变量名
      queryName: "mobile", // 入参名
      placeholder: "请输入手机号",
      value: "",
      title: "手机号",
      isHide: false,
      inputWidth: 165,
      params: {
        queryType: 1
      }, // 1.手机号 2.司机姓名
      axiosFun: driverNameMobileService
    },
    {
      name: "remote-multi-scroll", //下拉
      bind_key: "vinList",
      dataKey: "vin", // key的变量名
      dataLabel: "plateNum", // label 的变量名
      queryName: "plateNum", // 入参名
      placeholder: "请输入车牌号",
      value: "",
      title: "车牌号",
      isHide: false,
      inputWidth: 165,
      params: {
        queryType: 2
      }, // 1.车架号 2.车牌号
      axiosFun: vinPlateService
    },
    {
      _uuid: "halt",
      name: "cascader-input",
      bind_key: ["type1", "outageCategoryId"],
      value: [],
      titleWidth: 60,
      title: "停运类型",
      inputWidth: 165,
      cascaderList: []
    },
    {
      name: "date-time-input",
      bind_key: ['applyTimeStart', 'applyTimeEnd'],
      placement: "left-end",
      value: "",
      titleWidth: 60,
      title: "申请时间",
      inputWidth: 165
    },
    {
      name: "drop-input",
      bind_key: "applyStatus",
      value: "",
      titleWidth: 60,
      title: "状态",
      inputWidth: 165,
      dropList: statusList
    }
  ],
  columns(_this) {
    return [{
        title: "城市",
        key: "city",
        tooltip: true,
        minWidth: 100
      },
      {
        title: "运营商",
        key: "agentName",
        tooltip: true,
        minWidth: 150
      },
      {
        title: "司机姓名",
        key: "driverName",
        tooltip: true,
        minWidth: 100
      },
      {
        title: "手机号",
        key: "driverTel",
        tooltip: true,
        minWidth: 140
      },
      {
        title: "车牌号",
        key: "plateNum",
        tooltip: true,
        minWidth: 120
      },
      {
        title: "停运类型",
        key: "leaveType",
        tooltip: true,
        minWidth: 85,
      },
      {
        title: "申请时间",
        key: "applyTime",
        tooltip: true,
        minWidth: 190
      },
      {
        title: "补偿时段",
        tooltip: true,
        minWidth: 320,
        render: (h, params) => {
          const {
            row
          } = params
          return h("span", `${row.startTime} - ${row.endTime}`);
        }
      },
      {
        title: "补偿时长(小时)",
        key: "applyTimes",
        tooltip: true,
        minWidth: 130
      },
      {
        title: "状态",
        // key: "applyStatus",
        tooltip: true,
        minWidth: 100,
        render: (h, params) => {
          const {
            row
          } = params
          const {
            approveStatus
          } = row
          const fd = statusList.find(it => it.value - approveStatus === 0)
          return h("span", fd ? `${fd.label}` : '-');
        }
      },
      {
        title: "申请备注",
        key: "reason",
        tooltip: true,
        minWidth: 200
      },
      {
        title: "操作",
        key: "action",
        width: 150,
        fixed: "right",
        // 只有审批通过才显示取消按钮
        render: (h, params) => {
          const {
            row
          } = params;
          const {
            approveStatus
          } = row
          if (approveStatus === 9999) {
            return h("div", [
              h(
                "a", {
                  on: {
                    click() {
                      _this.detailModalShow = true;
                      _this.viewDetail(params.row);
                    }
                  }
                },
                "详情"
              ),
              h(
                "a", {
                  style: {
                    marginLeft: "10px",
                    display: Number(params.row.itemid) === 1 ? "none" : "inline-block"
                  },

                  on: {
                    click() {
                      _this.detailModalShow = true;
                      _this.viewCancel(params.row);
                    }
                  }
                },
                "取消"
              )
            ]);
          } else {
            return h("div", [
              h(
                "a", {
                  on: {
                    click() {
                      _this.detailModalShow = true;
                      _this.viewDetail(params.row);
                    }
                  }
                },
                "详情"
              )
            ]);

          }

        }
      }
    ];
  }
};

// 日志列表
// 日志表格
// export const initTableColumns = that => {
//   return [{
//       type: "index",
//       title: "序号",
//       align: "left"
//     },
//     {
//       title: "操作人",
//       key: "operatorName",
//       tooltip: true,
//       align: "left"
//     },
//     {
//       title: "UUID",
//       key: "operatorUuid",
//       tooltip: true,
//       align: "left"
//     },
//     {
//       title: "所属部门",
//       key: "deptName",
//       tooltip: true,
//       align: "left"
//     },
//     {
//       title: "IP",
//       key: "operatorIp",
//       tooltip: true,
//       align: "left"
//     },
//     {
//       title: "操作类型",
//       key: "operateTypeDesc",
//       tooltip: true,
//       align: "left",
//     },
//     {
//       title: "操作项",
//       key: "operationItem",
//       tooltip: true,
//       align: "left",
//     },
//     {
//       title: "操作后值",
//       key: "operateResult",
//       tooltip: true,
//       align: "left",
//       render(h, params) {
//         let text = params.row.operateResult == true ? '成功' : '失败'
//         return h('div', text)
//       }
//     },
//     {
//       title: "操作时间",
//       key: "operateTime",
//       tooltip: true,
//       align: "left"
//     }
//   ];
// };


export const pageData = {
  total: 0,
  currPage: 1,
  pageSize: 10,
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],
  tableData: []
};
