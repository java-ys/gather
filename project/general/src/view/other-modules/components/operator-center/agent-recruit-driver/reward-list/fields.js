
import { 
  rewardStatusMap,
  rewardStatusList,
  driverOriginList
} from "_o/components/operator-center/agent-recruit-driver/status-map"

export const inputList = [
  {
    name: 'remote-scroll',//下拉
    bind_key: 'agentName',
    dataKey: "agentName",
    dataLabel: "agentName",
    queryName: "agentName",
    placeholder: "请输入",
    value: '',
    title: '运营商名称',
    isHide: false,
    titleWidth: 80
  },
  {
    name: "drop-input", // 下拉
    bind_key: "channelType",
    value: "",
    dropList: driverOriginList,
    title: "司机来源渠道",
    placeholder: "请选择",
    clearable: true,
    titleWidth: 100
  },
  {
    name: "date-input", // 日期选择
    bind_key: ["rewardPeriodTimeStart", "rewardPeriodTimeEnd"], // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "奖励活动周期", // 展示的字段名
    titleWidth: 100
  },
  {
    name: "drop-input", // 下拉
    bind_key: "rewardStatus",
    value: "",
    dropList: rewardStatusList,
    title: "奖励状态",
    placeholder: "请选择",
    clearable: true,
  },
  {
    name: "date-input", // 日期选择
    bind_key: ["rewardTimeStart", "rewardTimeEnd"], // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "奖励日期" // 展示的字段名
  }
]
export const parColumns = (that) => {
  return [
    {
			title: '选择',
			type: 'selection',
			width: 50
		},
    {
      title: '序号',
      type: 'index',
      width: 67,
      align: 'center',
      render(h, params) {
        return h('span', {}, (_this.tableConfig.current - 1) * _this.tableConfig.pageSize + params.index + 1);
      }
    },
    {
      title: "奖励发放编码",
      key: "rewardCode",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "运营商",
      key: "agentName",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "司机来源渠道",
      key: "channelTypeName",
      tooltip: true,
      ellipsis: true,
      minWidth: 140,
    },
    {
      title: "奖励形式",
      key: "rewardTypeName",
      tooltip: true,
      ellipsis: true,
      minWidth: 140
    },
    {
      title: "奖励总金额(元)",
      key: "rewardAmountStr",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "奖励活动周期",
      key: "effectiveTime",
      minWidth: 190
    },
    {
      title: "奖励状态",
      key: "rewardStatus",
      tooltip: true,
      ellipsis: true,
      minWidth: 100,
      render: (h, {row}) => {
        return h("span", rewardStatusMap[row.rewardStatus]);
      }
    },
    {
      title: "奖励日期",
      key: "rewardTime",
      width: 160
    },
    {
      title: "操作",
      key: "action",
      tooltip: true,
      fixed: "right",
      width: 250,
      slot: "action",
    }
  ]
}