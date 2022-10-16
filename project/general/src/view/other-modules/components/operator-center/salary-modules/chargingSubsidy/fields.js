/*
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-02-28 15:26:29
 * @LastEditors: wangp
 * @LastEditTime: 2020-06-10 15:56:13
 */
export const defaultData = {
  currPage: 1,
  total: 0,
  pageSize: 10,
  columns: [
    {
      prop: "driverNo",
      label: "司机ID",
      minWidth: "120"
    },
    {
      prop: "driverName",
      label: "姓名",
      minWidth: "120"
    },
    {
      prop: "mobile",
      label: "手机号",
      minWidth: "120"
    },
    {
      prop: "cityName",
      label: "所属城市",
      minWidth: "120"
    },
    {
      prop: "agentName",
      label: "所属运营商",
      minWidth: "120"
    },
    {
      prop: "subsidiesMonth",
      label: "补贴月份",
      minWidth: "120"
    },
    {
      prop: "computationTime",
      label: "计算时间",
      minWidth: "150"
    },
    {
      prop: "identityCard",
      label: "身份证号",
      minWidth: "140"
    },
    {
      prop: "status",
      label: "状态",
      minWidth: "100"
    },
    {
      prop: "subsidies",
      label: "能源补贴（元）",
      minWidth: "120"
    },
  ],
  tableData: [],
  statusMap: {
    0: "已计算",
    5: "已传司机能源账户"
  }
}
