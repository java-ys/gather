
export const fields = {
    inputList: [
      {
        name: 'text-input',
        bind_key: 'strategyName', //接口字段
        placeholder: '请输入',
        value: '',
        title: '策略名称：'
      },
      {
        name: 'drop-input',
        bind_key: 'businessLine',
        placeholder: '请选择',
        value: '',
        dropList: [{
            value: '2',
            label: '专享'
          },
          {
            value: '4',
            label: '快享'
          },
        ],
        title: '产品线：'
      },
      {
        name: 'drop-input', 
        bind_key: 'cityCode', 
        placeholder: '请选择',
        value: '', 
        dropList: [], 
        title: '城市：',
        filterable:true,
      },
      {
        name: 'drop-input',
        bind_key: 'routeNode',
        placeholder: '请选择',
        value: '',
        dropList: [{
            value: '1',
            label: '司机接单'
          },
          {
            value: '2',
            label: '司机即将到达起点'
          },
          {
            value: '3',
            label: '乘客上车后'
          },
          {
            value: '4',
            label: '即将到达目的地'
          },
          {
            value: '5',
            label: '支付费用后'
          },
        ],
        title: '提醒节点：',
        inputWidth: 220
      },
      {
        name: 'drop-input',
        bind_key: 'effectStatus',
        placeholder: '请选择',
        value: '',
        dropList: [
          {
            value: '0',
            label: '未开始'
          },
          {
            value: '1',
            label: '已生效'
          },
          {
            value: '2',
            label: '已失效'
          },
        ],
        title: '生效状态：'
      },
      {
        name: "date-time-input", // 日期选择
        bind_key: ["startTime", "endTime"], // 返回数据的key名
        placeholder: "请输入",
        value: "", // 用于数据绑定
        title: "生效时间", // 展示的字段名
        format: "yyyy-MM-dd HH:mm:ss",
      }
    ]
  }