import moment from "moment"

const TIME_FORMAT = "YYYY-MM-DD HH:mm:ss"

const DAY_TIME_FORMAT = 'YYYY-MM-DD'
export const driveTypeMap = {
  "0":"",
  "10":"自营司机",
  "20":"自营-主司机",
  "30":"自营-副司机",
  "40":"自营-顶班司机",
  "50":"UP司机",
  "60":"UP-主司机",                            
  "70":"UP-副司机",
  "80":"UP-顶班司机"
}
// 表格标题
export const tableTitle = (that) => {
  return [{
      title: "自然周",
      key: "weeks",
      tooltip: true,
      width:190,
      render(h, params) {
        return h("div", that.beginTimeDesc);
      }
    },
    {
      title: "城市",
      key: "cityCode",
      tooltip: true,
    },
    {
      title: "司机ID",
      key: "driverUuid",
      
    },
    {
      title: "司机姓名",
      key: "driverName",
      tooltip: true,
      
    },
    {
      title: "司机手机号",
      key: "driverPhone",
      
      tooltip: true,
    },
    {
      title: "司机类型",
      key: "driverType",
      tooltip: true,
      
      render(h, params) {
        return h("div", driveTypeMap[params.row.driverType]);
      }
    },
    {
      title: "确认入职日期",
      key: "driverTime",
      tooltip: true,
      width: 180,
    },
    {
      title: "是否新入职",
      key: "newDriver",
      tooltip: true,
      
      render(h, params) {
        return h("div", params.row.newDriver== 1 ? "是" : "否");
      }
    },
    // {
    //   title: "周流水（元）",
    //   key: "weekFlow",
    //   tooltip: true,
    //   
    // },
    // {
    //   title: "周完单数（单）",
    //   key: "weekOrderNum",
    //   tooltip: true,
    //   
    // },
    {
      title: "任务奖励总计-现金",
      key: "weekReward",
      tooltip: true,
      
    },
    // {
    //   title: "任务奖励总计-T币",
    //   key: "weekIntegral",
    //   tooltip: true,
      
    // },
    {
      title: "任务奖励详情",
      key: "operate",
      width: 110,
      fixed:'right',
      render: (h, params) => {
        return h("div", {
          class: {
            'operate': true
          }
        }, [
          h("Button", {
            props: {
              type: "primary",
              size: "small"
            },
            directives: [{
              name: "hasAuth",
              value: "driver-reward-details"
            }],
            on: {
              click: () => {
                that.goDetail(params.row)
              }
            }
          }, "详情"),
        ])
      }
    }
  ]
}
export const subTableTitle = (that) => {
  return [{
      title: "任务名称",
      key: "taskName",
      tooltip: true,
    },
    {
      title: "任务奖励-现金",
      key: "reward",
      tooltip: true,
    },
    // {
    //   title: "任务奖励-T币",
    //   key: "integral",
    //   tooltip: true,
    // },
    {
      title: "任务完单数（单）",
      key: "orderNum",
      tooltip: true,
    },
    {
      title: "任务流水（元）",
      key: "orderFlow",
      tooltip: true,
    }
  ]
}
// 列表数据
export const listPageData = {
  queryParams: {}, // 查询条件obj
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOpts: [20, 30, 50, 100],
  tableColumns: [],
  tableData: [],
  tableColumnsChecked: Object.keys(tableTitle)
}