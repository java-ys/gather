export const pushInputList = [
    {
        name: 'text-input',
        bind_key: 'noticeTitle',
        placeholder: '请填写',
        value: '',
        title: '司机ID：'
    },
    {
        name: 'text-input',
        bind_key: 'noticeTitle',
        placeholder: '请填写',
        value: '',
        title: '司机姓名：'
    },
    {
        name: 'cascader-input',
        bind_key: ['provinceCode', 'cityCode','agentUuid'],
        placeholder: '请填写',
        changeOnSelect:true,
        cascaderList: [],
        value: [],
        inputWidth: '200',
        titleWidth: 100,
        title: '城市-运营商：'
    },
    {
        name: 'drop-input',
        bind_key: 'carrier',
        inputWidth: '200',
        placeholder: '请选择',
        dropList: [
          {
            value: '_all',
            label: '全部'
          },
          {
            value: '0',
            label: '联通'
          },
          {
            value: '1',
            label: '移动'
          }
        ],
        value: 1,
        title: '所属司管：',
        clearable: true,
      },
      {
        name: 'text-input',
        bind_key: 'noticeTitle',
        placeholder: '请填写',
        value: '',
        title: '手机号：'
    },
    {
        name: 'drop-input',
        bind_key: 'carrier',
        inputWidth: '200',
        placeholder: '请选择',
        dropList: [
          {
            value: '0',
            label: '已读'
          },
          {
            value: '1',
            label: '未读'
          }
        ],
        value: 1,
        title: '读取状态：',
        clearable: true,
    },
    {
        name: 'date-input', // 文本输入框名
        bind_key: ['statDay', 'statDayEnd'], // 返回数据的key名
        placeholder: '请选择读取时间',
        value: '', // 用于数据绑定
        title: '读取时间：'
      },
]