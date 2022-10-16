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
    titleWidth: 70,
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
      title: "序号",
      // type: 'index',
      width: 70,
      render(h, params) {
        return (
          <span>{(_this.current - 1) * _this.pageSize + params.index + 1}</span>
        );
      },
    },
    {
      title: "版本号",
      key: "version",
      minWidth: 200,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "策略名称",
      key: "ruleName",
      minWidth: 200,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 100,
    },
    {
      title: "区县",
      key: "areaName",
      minWidth: 120,
    },
    {
      title: "业务线",
      key: "expandBizLine",
      minWidth: 180,
      render: (h, {row}) => {
        let r = listToMap(_this.businessGradeList)
        return (<span>{r[row.expandBizLine]}</span>)
      }
    },
    {
      title: "产品线",
      key: "bizType",
      minWidth: 180,
      render: (h, {row}) => {
        let r = listToMap(_this.bizTypeList)
        return (<span>{r[row.bizType]}</span>)
      }
    },
    {
      title: "车型",
      key: "vehicleLevel",
      minWidth: 180,
      render: (h, {row}) => {
        let r = _this.businessGradeName.productCarKeyValue
        return (<span>{r[`${row.bizType}#${row.vehicleLevel}`]}</span>)
      }
    },
    {
      title: "状态",
      key: "status",
      minWidth: 100,
      render: (h, {row}) => {
        let r = listToMap(statusList)
        return (<span>{r[row.status]}</span>)
      }
    },
    {
      title: "更新时间",
      key: "updateTime",
      minWidth: 180,
    },
    {
      title: "操作人",
      key: "updater",
      minWidth: 120,
    },
    {
      title: "操作",
      fixed: "right",
      width: 300,
      key: "operation",
      render: (h, { row }) => {
        // let types = row.status - 1 === 0 ? "error" : "success";
        // let t = { props: { type: types } };
        let isCanDelete = `${row.status}` === '0'; // 待生效可删除
        let isActive = `${row.status}` === '1'; // 生效中  可停用
        return (
          <Row type="flex">
            <Col>
              <Button
                type="info"
                ghost
                size="small"
                {...getDirectives('price-passenger-detail')}
                onClick={() => _this.showRow(row)}
              >
                详情
              </Button>
            </Col>
            <Col offset="1">
              <Button
                type="warning"
                ghost
                size="small"
                {...getDirectives('price-passenger-copy')}
                onClick={() => _this.edit(row, 2)}
              >
                复制
              </Button>
            </Col>
            {isActive ? <Col offset="1">
              <Button
                ghost
                type="error"
                size="small"
                {...getDirectives('price-passenger-block')}
                onClick={() => _this.activate(row, -2)}
              >
                停用
              </Button>
            </Col> : null }
            {isCanDelete ? <Col offset="1">
              <Button
                type="error"
                ghost
                size="small"
                {...getDirectives('price-passenger-delete')}
                onClick={() => _this.activate(row, -1)}
              >
                删除
              </Button>
            </Col> : null }
          </Row>
        );
      },
    },
  ];
};

// 业务线
// 8 9 10 13 6 屏蔽拼车、接送机、峰必达业务线 企业用车
export const extraLine = (v) => {
  return ["6", "8", "9", "10", "13"].includes(`${v}`);
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
  defaultDiscountDetails: [{...defaultInner}]
}
