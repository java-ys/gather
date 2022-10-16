import { searchConfig, statusList } from "./config";
import { freeze } from "@/mixins/base";
import {deepCopy} from '@/libs/tools'
import { listToMap, timeFormat } from "@/libs/util";
import {getDirectives} from "@/mixins/base"


export const inputList = searchConfig.map((it) => {
  let { key, type, meta = {}, value, title } = it;
  if (type === "drop-input") {
    meta.filterable = true;
    if (!meta.dropList) meta.dropList = [];
  }
  return {
    titleWidth: 85,
    name: type,
    bind_key: key,
    value: value,
    title,
    ...meta,
  };
});

export const tableColumns = (_this) => {
  return [
    {
      type: "selection",
      width: 60,
      align: "center"
    },
    // {
    //   title: "序号",
    //   // type: 'index',
    //   width: 70,
    //   render(h, params) {
    //     return (
    //       <span>{(_this.current - 1) * _this.pageSize + params.index + 1}</span>
    //     );
    //   },
    // },
    {
      title: "策略编码",
      key: "ruleCode",
      minWidth: 200,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 100,
      render: (h, {row}) => {
        if(row.cityCode === '0'){
          return (<span>全国</span>)
        }else{
          return (<span>{row.cityName}</span>)
        }
      }
    },
    {
      title: "策略名称",
      key: "ruleName",
      minWidth: 200,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "策略起止日期",
      // key: "effectiveTime",
      minWidth: 290,
      render(h, params) {
        return h("span", {}, params.row.effectiveTime +"~"+params.row.failureTime);
      }
    },
    // {
    //   title: "司机类型",
    //   key: "status",
    //   minWidth: 100,
    //   render: (h, {row}) => {
    //     let r = listToMap(statusList)
    //     return (<span>{r[row.status]}</span>)
    //   }
    // },
    // {
    //   title: "司机工资类别",
    //   key: "ruleName",
    //   minWidth: 200,
    //   ellipsis: true,
    //   tooltip: true,
    // },
    {
      title: "业务线",
      key: "expandBizLine",
      minWidth: 180,
      render: (h, {row}) => {
        let r = listToMap(_this.businessGradeList)
        // console.log(row.expandBizLine)
        if(row.expandBizLine === 0){
          return (<span>全部</span>)
        }else{
          return (<span>{r[row.expandBizLine]}</span>)
        }
      }
    },
    {
      title: "产品线",
      key: "bizType",
      minWidth: 180,
      render: (h, {row}) => {
        let r = listToMap(_this.bizTypeList)
        if(row.bizType === 0){
          return (<span>全部</span>)
        }else{
          return (<span>{r[row.bizType]}</span>)
        }
      }
    },
    // {
    //   title: "车型",
    //   key: "vehicleLevel",
    //   minWidth: 180,
    //   render: (h, {row}) => {
    //     let r = _this.businessGradeName.productCarKeyValue
    //     return (<span>{r[row.vehicleLevel]}</span>)
    //   }
    // },
    {
      title: "策略状态",
      key: "status",
      minWidth: 100,
      render: (h, {row}) => {
        let r = listToMap(statusList)
        return (<span>{r[row.status]}</span>)
      }
    },
    {
      title: "审批通过时间",
      key: "approvalPassTime",
      minWidth: 180,
    },
    {
      title: "备注",
      key: "remark",
      minWidth: 180,
    },
    {
      title: "操作人",
      key: "updater",
      minWidth: 120,
    },
    {
      title: "操作时间",
      key: "updateTime",
      minWidth: 180,
    },
    {
      title: "操作",
      fixed: "right",
      width: 250,
      key: "operation",
      render: (h, { row }) => {
        // let types = row.status - 1 === 0 ? "error" : "success";
        // let t = { props: { type: types } };
        let isTaxi = row.bizType - 1 === 0; // 出租车只能查看详情
        let isApprove = `${row.status}` === '0'|| `${row.status}` === '4'; // 提交审批 初始 审核驳回
        let isActive = `${row.status}` === '1' ; // 生效中  可停用
        let isEdit = `${row.status}` === '0'||`${row.status}` === '4'; // 编辑 初始 审批驳回
        let isDel = `${row.status}` === '0'; //  删除 初始
        let isAward = `${row.status}` === '1'|| `${row.status}` === '-3'|| `${row.status}` === '-2'; // 奖励明细 生效中 已停用 已过期
        return (
          <Row type="flex">
            {/* <Col offset="1"> */}
            <Col>
              <Button
                type="info"
                ghost
                size="small"
                {...getDirectives('price-complete-detail')}
                onClick={() => _this.showRow(row)}
              >
                详情
              </Button>
            </Col>
            {
            isAward ?
            <Col offset="1">
              <Button
                type="success"
                ghost
                size="small"
                {...getDirectives('driver-award-detail')}
                onClick={() => _this.getModalTableData(row.uuid)}
              >
                奖励明细
              </Button>
            </Col>
            : null
            }
            {
            isEdit ?
            <Col offset="1">
              <Button
                type="warning"
                ghost
                size="small"
                {...getDirectives('price-complete-edit')}
                // onClick={() => _this.edit(row, 2)}
                onClick={() => _this.edit(row, 2)}
              >
                编辑
              </Button>
            </Col>
            : null
            }
            {/* {
            isApprove ?
            <Col offset="1">
              <Button
                type="success"
                ghost
                size="small"
                // {...getDirectives('price-passenger-detail')}
                onClick={() => _this.passSubmit(row, 2)}
              >
                提交审批
              </Button>
            </Col>
            : null
            } */}

            {
            isActive  ?
            <Col offset="1">
              <Button
                ghost
                type="error"
                size="small"
                {...getDirectives('price-complete-block')}
                onClick={() => _this.activate(row, -3)}
              >
                停用
              </Button>
            </Col>
            : null
            }

            {
            isDel ?
            <Col offset="1">
              <Button
                type="error"
                ghost
                size="small"
                {...getDirectives('price-complete-delete')}
                onClick={() => _this.delActivate(row, -1)}
              >
                删除
              </Button>
            </Col>
            : null
            }
          </Row>
        );
      },
    },
  ];
};

// 业务线
// 8 9 10 13 6 屏蔽拼车、接送机、峰必达业务线 企业用车
export const extraLine = (v) => {
  // return ["6", "8", "9", "10", "13"].includes(`${v}`);
};

// 产品线
// 屏蔽出租车
export const extraBiz = v => {
  return ["1"].includes(`${v}`);
}

// 校验策略生效日期
const validatorTime = (rule, value, callback) => {
  let date = value;
  if (!date[0] && !date[1]) {
    callback(new Error("请选择"));
  }
  let startTime = new Date(timeFormat(value[0], "yyyy-mm-dd")).getTime();
  let endTime = new Date(timeFormat(value[1], "yyyy-mm-dd")).getTime()
  if (startTime >= endTime) {
    callback(new Error("开始时间必须小于结束时间"));
  } else {
    callback();
  }
}
export const formRules = freeze({
  ruleName: [{ required: true, message: "请输入策略名称" }],
  cityCode: [{ required: true, message: "请选择城市" }],
  expandBizLine: [{ required: true, message: "请选择业务线" }],
  bizType: [{ required: true, message: "请选择产品线" }],
  vehicleLevel: [{ required: true, message: "请选择车型" }],
  typeTime: [{ required: true, message: "请选择订单类型" }],
  typeTimes: [{ required: true, message: "请选择订单类型" }],
  workRestDayType: [{ required: true, message: "请选择工作日休息日" }],
  timeRange: [{ required: true, validator: validatorTime, trigger: "change" }],
})


export const defaultInner = {
  discountRate: null, // 里程from
  startCapacity: null, // 里程to
  endCapacity: null, // 系数
}

export const defaultCenter = {
  resRateFrom: null, // 接起率from
  resRateTo: null, // 接起率to
  minNum: null,  // 最低呼叫数
  discountDetails: [
    deepCopy(defaultInner)
  ]
}

export const defaultOuter = {
  period: [], // 时段
  acceptItemDetails: [
    deepCopy(defaultCenter)
  ],
}

// 补偿明细
export const modalTableColumns = that => {
  return [
    {
      title: '序号',
      minWidth: 70,
      render(h, params) {
        return h('span', {}, (that.currents - 1) * that.pageSizes + params.index + 1);
      }
    },
    {
      title: '订单号',
      key: 'routeNo',
      minWidth: 180,
      render: (h, {row}) => {
        let attr = {
          style: {
            color: "#2d8cf0",
            cursor: "pointer"
          },
          on: {
            click: () => that.showOrder(row)
          }
        }
        return (
          <span {...attr}>
            {row.routeNo}
          </span>
        );
      },
    },
    {
      title: '完单时间',
      key: 'finishTime',
      minWidth: 160,
      render(h, params) {
        return h('span', {}, `${timeFormat(params.row.finishTime, 'yyyy-mm-dd')}`);
      }
    },
    {
      title: '流水补足金额（元）',
      minWidth: 150,
      key: 'replenishFare',
      render(h, params) {
        // return h('span', {}, params.row.replenishFare);
        return h("span", params.row.replenishFare?params.row.replenishFare:"");
      }
    },
    {
      title: '城市',
      minWidth: 80,
      key: 'cityName'
    },
    {
      title: "业务线",
      key: "expandBizLine",
      minWidth: 90,
      render: (h, {row}) => {
        let r = listToMap(that.businessGradeList)
        // console.log(row.expandBizLine)
        if(row.expandBizLine === 0){
          return (<span>全部</span>)
        }else{
          return (<span>{r[row.expandBizLine]}</span>)
        }
      }
    },
    {
      title: '司机姓名',
      minWidth: 90,
      key: 'driverName'
    },
    {
      title: '司机ID',
      minWidth: 270,
      key: "driverUuid"
    },
  ];
};

