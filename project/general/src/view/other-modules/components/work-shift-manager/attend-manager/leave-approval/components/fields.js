import { driverNameMobileList } from "_o/api/rest.js";

export let compensateList = {
  inputList (that) {
    return [
      {
        name: 'cascader-input', // 文本输入框名
        bind_key: ['cityCode', 'cityCode'], // 返回数据的key名
        placeholder: '请选择省/市',
        value: [], // 绑定返回数据
        cascaderList: [], // 级联列表
        title: '城市', // 展示的字段名
        changeOnSelect: false
      },
      {
        name: "drop-input",
        bind_key: "agentUuid", // 返回数据的key名
        placeholder: "请选择",
        value: "", // 用于数据绑定
        dropList: [],
        title: "运营商", // 展示的字段名
      },
      {
        name: "text-input",
        bind_key: "driverId",
        placeholder: '请填写',
        value: "",
        title: "司机ID",
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
        axiosFun: driverNameMobileList
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
        axiosFun: driverNameMobileList
      },
      {
        name: "drop-input",
        bind_key: "applySubType",
        placeholder: "请选择",
        value: "", // 用于数据绑定
        dropList: leaveType,
        title: "请假类型"
      },
      // {
      //   name: "text-input",
      //   bind_key: "shiftName",
      //   placeholder: "请填写",
      //   value: "",
      //   title: "请假天数：",
      //   titleWidth: 65
      // },
      // {
      //   name: "text-input",
      //   bind_key: "shiftName",
      //   placeholder: "请填写",
      //   value: "",
      //   title: "--",
      //   titleWidth: 20
      // },
      {
        name: "drop-input",
        bind_key: "applyStatus", // 返回数据的key名
        placeholder: "请选择",
        value: "", // 用于数据绑定
        dropList: that.attedType == 1 ? approvalType : that.attedType == 4 ? approvalTypeOtherCancel : approvalTypeOther, // 休息审批没有已销假
        title: "审批状态"
      },
      // {
      //   name: "text-input",
      //   bind_key: "shiftName",
      //   placeholder: "请填写",
      //   value: "",
      //   title: "当月累计请假：",
      //   titleWidth: 90
      // },
      // {
      //   name: "text-input",
      //   bind_key: "shiftName",
      //   placeholder: "请填写",
      //   value: "",
      //   title: "--",
      //   titleWidth: 20
      // },
      // {
      //   name: "date",
      //   bind_key: "leaveStartTime",
      //   placeholder: "",
      //   value: "",
      //   title: "请假开始时间：",
      //   titleWidth: 90
      // },
      {
        name: "date-input",
        bind_key: ["applyTimeStart", "applyTimeEnd"],
        placeholder: "请选择",
        value: "",
        title: "申请时间",
      }
    ]
  },
  pageData:{
    isShowAudit: false,
    pageData: {
      total: 0,
      currPage: 1,
      pageSize: 20
    },
    pageSizeOpts: [20, 50, 100],
    tableColumns: [],
    tableData: []
  },
  tableColumns (that) {
    return [
      {
        key: "city",
        title: "所属城市",
        minWidth: 100,
        align: "center"
      },
      {
        key: "agentName",
        title: "所属运营商",
        minWidth: 100,
        align: "center"
      },
      {
        key: "driverName",
        title: "司机姓名",
        minWidth: 100,
        align: "center"
      },
      {
        key: "driverTel",
        title: "司机手机号",
        minWidth: 140,
        align: "center"
      },
      {
        key: "driverId",
        title: "司机ID",
        minWidth: 100,
        align: "center",
        // render(h, params) {
        //   let statusMap = {
        //     1: '单班',
        //     2: '双班',
        //   }
        //   return h('div', statusMap[params.row.shiftType])
        // }
      },
      {
        key: "leaveType",
        title: "请假类型",
        minWidth: 100,
        align: "center"
      },
      {
        key: "startTime",
        title: "开始时间",
        minWidth: 120,
        align: "center",
        render(h, params) {
          return h('div', params.row.startTime.substring(0,10))
        }
      },
      {
        key: "endTime",
        title: "结束时间",
        minWidth: 120,
        align: "center",
        render(h, params) {
          return h('div', params.row.endTime.substring(0,10))
        }
      },
      {
        key: "applyTimes",
        title: "天数",
        minWidth: 120,
        align: "center"
      },
      {
        key: "monthCount",
        title: "当月累计请假",
        minWidth: 120,
        align: "center"
      },
      {
        key: "applyTime",
        title: "申请时间",
        minWidth: 180,
        align: "center"
      },
      {
        key: "approveStatus",
        title: "审批状态",
        minWidth: 100,
        align: "center",
        render: (h, params) => {
          let type = approveStatusList(params.row.approveStatus)
          return h(
            'div', type
          )
        }
      },
      {
        key: "reason",
        title: "销假原因",
        minWidth: 150,
        align: "center"
      },
      {
        key: "action",
        title: "操作",
        minWidth: 180,
        align: "center",
        fixed: "right",
        render: (h, params) => {
          let a = h(
            "a",
            {
              on: {
                click: () => {
                  that.detailShow = true
                  that.id = params.row.id
                }
              }
            },
            "详情"
          )
          // let b = h(
          //   "a",
          //   {
          //     on: {
          //       click: () => {
          //         that.isShow = true
          //         that.id = params.row.id
          //         that.approvalTitle = modelTitle(that.attedType)
          //       }
          //     }
          //   },
          //   "审批"
          // )
          // if(that.attedType != 2 && that.attedType !=3 && params.row.approveStatus == 1 && params.row.approveSubStatus == 1){
          //   return h("div", [a, b]);
          // }
          return h("div", [a]);
        }
      }
    ]
  },
  initTableColumns (that) {
    return [
      {
        type: "index",
        title: "序号",
        align: "left"
      },
      {
        title: "操作人",
        key: "operatorName",
        tooltip: true,
        align: "left"
      },
      {
        title: "UUID",
        key: "operatorUuid",
        tooltip: true,
        align: "left"
      },
      {
        title: "所属部门",
        key: "deptName",
        tooltip: true,
        align: "left"
      },
      {
        title: "IP",
        key: "operatorIp",
        tooltip: true,
        align: "left"
      },
      {
        title: "操作类型",
        key: "operateTypeDesc",
        tooltip: true,
        align: "left",
      },
      {
        title: "操作项",
        key: "operationItem",
        tooltip: true,
        align: "left",
      },
      {
        title: "操作后值",
        key: "operateResult",
        tooltip: true,
        align: "left",
        render(h, params) {
          let text = params.row.operateResult == true ? '成功' : '失败'
          return h('div', text)
        }
      },
      {
        title: "操作时间",
        key: "operateTime",
        tooltip: true,
        align: "left"
      }
    ];
  }
};

// 审批状态类型
export let approvalType = [
  {
    label: "待审批",
    value: 1
  },{
    label: "审批通过",
    value: 2
  },{
    label: "审批驳回",
    value: 3
  },{
    label: "撤销",
    value: 4
  },{
    label: "超时驳回",
    value: 5
  },{
    label: "已销假",
    value: 6
  }
]
export const approvalTypeOther = [
  {
    label: "待审批",
    value: 1
  },{
    label: "审批通过",
    value: 2
  },{
    label: "审批驳回",
    value: 3
  },{
    label: "撤销",
    value: 4
  },{
    label: "超时驳回",
    value: 5
  }
]
export const approvalTypeOtherCancel = [
  {
    label: "待审批",
    value: 1
  },{
    label: "审批通过",
    value: 2
  },{
    label: "审批驳回",
    value: 3
  },{
    label: "撤销",
    value: 4
  },{
    label: "超时驳回",
    value: 5
  },{
    label: "取消休息",
    value: 9
  }
]
// 审批状态匹配
export const approveStatusList = (i) => {
  switch(i){
    case 1:
      return "待审批"
      break;
    case 2:
      return "审批通过"
      break;
    case 3:
      return "审批驳回"
      break;
    case 4:
      return "撤销"
      break;
    case 5:
      return "超时驳回"
      break;
    case 6:
      return "已销假"
      break;
    case 7:
      return "司管待审批"
      break;
    case 8:
      return "城市团队待审批"
      break;
    case 9:
        return "取消休息"
        break;
  }
}

// 请假类型匹配
export const leaveTypeList = i => {
  switch(i){
    case 1:
      return "事假"
      break
    case 2:
      return "病假"
      break
    case 3:
      return "婚假"
      break
    case 4:
      return "丧假"
      break
    case 5:
      return "产假"
      break
    case 6:
      return "陪产假"
      break
    case 7:
      return "年休假"
      break
    case 8:
      return "事故假"
      break
  }
}

// 请假类型列表
export const leaveType = [
  {
    label: "事假",
    value: 1
  },
  {
    label: "病假",
    value: 2
  },
  {
    label: "婚假",
    value: 3
  },
  {
    label: "丧假",
    value: 4
  },
  {
    label: "产假",
    value: 5
  },
  {
    label: "陪产假",
    value: 6
  },
  {
    label: "年休假",
    value: 7
  },
  {
    label: "事故假",
    value: 8
  }
]
// tab请假类型匹配
export const modelTitle = i => {
  switch(i){
    case 1:
      return "请假审批"
      break
    case 2:
      return "销假审批"
      break
    case 3:
      return "补假审批"
      break
    case 4:
      return "休息审批"
      break
  }
}
