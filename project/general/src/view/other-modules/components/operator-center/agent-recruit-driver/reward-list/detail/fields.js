import { 
  driverOriginList,
  driverOriginMap 
} from "_o/components/operator-center/agent-recruit-driver/status-map"

export const inputList = [
  {
    name: 'cascader-input',
    title: '城市',
    placeholder: "请选择",
    value: [],
    bind_key: ['provinceICode', 'cityCode'],
    cascaderList: [],
    filterable:true,
    titleWidth:50,
  },
  {
    name: "drop-input", // 下拉  
    bind_key: "channelType",
    value: "",
    dropList: driverOriginList,
    title: "司机来源渠道",
    placeholder: "请选择",
    clearable: true,
    filterable:true,
    titleWidth:100,
  },
  {
    name: 'text-input',
    title: '推荐人姓名',
    placeholder: "请输入",
    value: '',
    bind_key: 'recommendName',
    titleWidth:90,
  },
  {
    name: 'text-input',
    title: '推荐人身份证号',
    placeholder: "请输入",
    value: '',
    bind_key: 'recommendIdCard',
    titleWidth: 110
  },
  {
    name: 'text-input',
    title: '被推荐司机姓名',
    placeholder: "请输入",
    value: '',
    bind_key: 'driverName',
    titleWidth: 100
  },
  {
    name: 'text-input',
    title: '被推荐司机身份证号',
    placeholder: "请输入",
    value: '',
    bind_key: 'driverIdCard',
    titleWidth: 130
  },
  {
    name: "date-input", // 日期选择
    bind_key: ["depositTimeStart", "depositTimeEnd"], // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "被推荐司机缴纳履约金日期", // 展示的字段名
    titleWidth: 160
  },
  {
    name: "date-input", // 日期选择
    bind_key: ["bindCarTimeStart", "bindCarTimeEnd"], // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "绑车日期", // 展示的字段名
  },
  {
    name: "date-input", // 日期选择
    bind_key: ["rewardValidTimeStart", "rewardValidTimeEnd"], // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "奖励达成时间", // 展示的字段名
    titleWidth: 100
  }
]
export const parColumns = (that) => {
  return [
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
      title: "城市",
      key: "cityName",
      tooltip: true,
      ellipsis: true,
      minWidth: 100
    },
    {
      title: "司机来源渠道",
      key: "channelType",
      tooltip: true,
      ellipsis: true,
      minWidth: 110,
      render: (h, {row}) => {
        return h("span", driverOriginMap[row.channelType]);
      }
    },
    {
      title: "推荐人姓名",
      key: "recommendName",
      tooltip: true,
      ellipsis: true,
      minWidth: 110
    },
    {
      title: "推荐人手机号",
      key: "recommendMobile",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    },
    {
      title: "推荐人身份证号",
      key: "recommendIdCard",
      tooltip: true,
      ellipsis: true,
      minWidth: 180
    },
    {
      title: "奖励达成时间",
      key: "rewardValidTime",
      tooltip: true,
      ellipsis: true,
      minWidth: 160
    },
    {
      title: "被推荐司机姓名",
      key: "driverName",
      tooltip: true,
      ellipsis: true,
      minWidth: 140
    },
    {
      title: "被推荐司机手机号",
      key: "driverMobile",
      tooltip: true,
      ellipsis: true,
      minWidth: 140
    },
    {
      title: "被推荐司机身份证号",
      key: "driverIdCard",
      tooltip: true,
      ellipsis: true,
      minWidth: 180
    },
    {
      title: "被推荐司机缴纳履约金日期",
      key: "depositTime",
      tooltip: true,
      ellipsis: true,
      minWidth: 190
    },
    {
      title: "绑车日期",
      key: "bindCarTime",
      tooltip: true,
      ellipsis: true,
      minWidth: 160
    },
    {
      title: "奖励金额(元)",
      key: "rewardAmountStr",
      tooltip: true,
      ellipsis: true,
      minWidth: 120
    }
  ]
}