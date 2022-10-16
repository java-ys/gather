import { yyyyMMDDHHmmss } from "./utils";
import ButtonCell from "./components/ButtonsCell"

export const ORDER_ASSIGNABLES_TYPES = [
  {
    value: "-1",
    label: "特享单"
  }, {
    value: "-2",
    label: "三方特价单"
  }
]

/** 特快订单类型 */
export const ORDER_FAST_TYPES = [
  {
    value: "12",
    label: "速享单"
  }
]

/** 司机接单来源类型 */
export const DRIVER_ORDER_TYPES = [
  {
    value: "1",
    label: "三方渠道单"
  }
]

const listToMapFnGenerator = (valueKey, textKey) => list => {
  const obj = {}
  list.forEach(item => {
    obj[item[valueKey]] = item[textKey]
  })

  return obj;
}

/** 策略状态--启用 */
export const STATUS__ACTIVATED = 1;
/** 策略状态--停用 */
export const STATUS__DEACTIVATED = 0;
export const STATUS_LIST = [{
  value: STATUS__ACTIVATED,
  label: "已启用",
}, {
  value: STATUS__DEACTIVATED,
  label: "已停用"
}]

/** 策略状态映射对象 */
export const STATUS_MAPPINGS = listToMapFnGenerator("value", "label")(STATUS_LIST)

export const tableCols = ({
  getProductLineText,
  getCarLevelText
}) => [
  {
    title: "序号",
    key: "id",
    tooltip: true,
    minWidth: 150
  },
  {
    title: "规则名称",
    key: "ruleName",
    tooltip: true,
    minWidth: 150
  },
  {
    title: "城市",
    key: "cityName",
    tooltip: true,
    minWidth: 150
  },
  {
    title: "产品线",
    key: "productLineCode",
    tooltip: true,
    minWidth: 150,
    render(h, params) {
      return <span>{getProductLineText(params.row.productLineCode)}</span>
    }
  },
  {
    title: "车型等级",
    key: "defaultCarLevelCode",
    tooltip: true,
    minWidth: 150,
    render(h, params) {
      return <span>{getCarLevelText(params.row.defaultCarLevelCode)}</span>
    }
  },
  {
    title: "状态",
    key: "status",
    tooltip: true,
    minWidth: 150,
    render: (h, params) => {
      return <span>{STATUS_MAPPINGS[params.row.statusFlag]}</span>
    }
  },
  {
    title: "更新时间",
    key: "updateTime",
    tooltip: true,
    minWidth: 160,
    render: (h, params) => {
      return <span>{yyyyMMDDHHmmss(params.row.updateTime)}</span>
    }
  },
  {
    title: "操作人",
    key: "updater",
    tooltip: true,
    minWidth: 150,
  },
  {
    title: "操作",
    key: "action",
    tooltip: true,
    minWidth: 300,
    render: (h, params) => {
      return <ButtonCell row={params.row} />
    }
  }
]
