import { typeTimeMap } from "_g/config/status-map"

export const statusMap = {
  1: "生效中",
  0: "未开始",
  "-1": "已失效",
  3: "已废弃",
  "-2": "已失效",
}

export const columns = (that) => {
  return [
    {
      title: "序号",
      minWidth: 80,
      tooltip: true,
      key: "xxx",
      slot: "index"
    },
    {
      title: "版本号",
      minWidth: 160,
      tooltip: true,
      key: "version"
    },
    {
      title: "业务线",
      minWidth: 160,
      tooltip: true,
      key: "expandBizLine",
      render: (h, params) => {
        const { row: { expandBizLine }} = params
        let rowGradeObj =
          that.businessGradeList.find((it) => Number(it.value) === expandBizLine) || {};
        return h("span", rowGradeObj.label || "");
      }
    },
    {
      title: "行政区域",
      minWidth: 100,
      tooltip: true,
      key: "cityName",
      render: (h, params) => {
        return h("span", Number(params.row.areaType) === 2 ? params.row.areaName : params.row.cityName)
      }
    },
    {
      title: "行政区类型",
      minWidth: 100,
      tooltip: true,
      key: "areaType",
      render: (h, params) => {
        return h("span", Number(params.row.areaType) === 2 ? "区县级" : "市级")
      }
    },
    {
      title: "生效时间",
      minWidth: 160,
      tooltip: true,
      key: "effectiveTime"
    },
    {
      title: "适用时段",
      minWidth: 130,
      tooltip: true,
      key: "workRestDayType",
      render: (h, params) => {
        return h("span", Number(params.row.workRestDayType) === 1 ? "工作日" : Number(params.row.workRestDayType) === 2 ? "休息日" : "工作日、休息日")
      }
    },
    {
      title: "产品线",
      minWidth: 160,
      tooltip: true,
      key: "businessType",
      render: (h, params) => {
        const { row: { businessType }} = params
        const { productKeyValue } = that.businessGradeName
        return h("span", productKeyValue[businessType] || "暂无")
      }
    },
    {
      title: "车型等级",
      minWidth: 160,
      tooltip: true,
      key: "carLevel",
      render: (h, params) => {
        const { row: { businessType, carLevel }} = params
        const { productCarKeyValue } = that.businessGradeName
        return h("span", productCarKeyValue[`${businessType}#${carLevel}`] || "暂无")
      }
    },
    {
      title: "订单类型",
      minWidth: 160,
      tooltip: true,
      key: "typeTime",
      render: (h, params) => {
        return h("span", typeTimeMap[params.row.typeTime] + "订单")
      }
    },
    {
      title: "状态",
      minWidth: 160,
      tooltip: true,
      key: "status",
      render: (h, params) => {
        return h("span", statusMap[params.row.status])
      }
    },
    // {
    //   title: "策略名称",
    //   minWidth: 160,
    //   tooltip: true,
    //   key: ""
    // },
    {
      title: "操作",
      minWidth: 240,
      fixed: "right",
      tooltip: true,
      key: "action",
      slot: "action"
    }
  ]
}
