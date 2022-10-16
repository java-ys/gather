export const compensateList = {
  inputList: [{
      name: "drop-input",
      bind_key: "director",
      value: "",
      dropList: [],
      title: "司管",
      changeOnSelect: true,
      titleWidth: 60,
      inputWidth: 165,
    },
    {
      name: "text-input",
      bind_key: "driverName",
      value: "",
      titleWidth: 60,
      title: "司机姓名",
      inputWidth: 165,
    },
    {
      name: "text-input",
      bind_key: "name",
      value: "",
      titleWidth: 60,
      title: "手机号",
      inputWidth: 165,
    },
    {
      name: "text-input",
      bind_key: "licensePlate",
      value: "",
      titleWidth: 60,
      title: "车牌号",
      inputWidth: 165,
    },
    {
      name: "cascader-input",
      bind_key: ["a", "b", "c"],
      value: [],
      titleWidth: 60,
      title: "停运类型",
      inputWidth: 165,
      cascaderList: [{
          value: 1,
          label: "车辆故障",
          children: [{
              value: 'gugong',
              label: '故宫'
            },
            {
              value: 'tiantan',
              label: '天坛'
            },
            {
              value: 'wangfujing',
              label: '王府井'
            }
          ]
        },
        {
          value: 2,
          label: "车机故障"
        },
        {
          value: 3,
          label: "次责事故"
        },
        {
          value: 4,
          label: "无责事故"
        }
      ],
    },
    {
      name: "time-input",
      bind_key: "applyTime",
      value: "",
      titleWidth: 60,
      title: "申请时间",
      inputWidth: 165,
    },
    {
      name: "section-input",
      bind_key: "duration",
      value: "",
      titleWidth: 60,
      title: "补偿时长",
      inputWidth: 72,
    },
    {
      name: "drop-input",
      bind_key: "state",
      value: "",
      titleWidth: 60,
      title: "状态",
      inputWidth: 165,
      dropList: [{
        value: 1,
        label: "待审批"
      }, {
        value: 2,
        label: "审批通过"
      }, {
        value: 3,
        label: "审批驳回"
      }, {
        value: 4,
        label: "取消"
      }, ],
    },
  ],
  columns(_this) {
    return [{
        title: '司机姓名',
        key: 'driverName',
        tooltip: true,
        minWidth: 100
      },
      {
        title: '手机号',
        key: 'phoneNum',
        tooltip: true,
        minWidth: 120
      },
      {
        title: '车牌号',
        key: 'licensePlate',
        tooltip: true,
        minWidth: 120
      },
      {
        title: '司管',
        key: 'director',
        tooltip: true,
        minWidth: 120
      },
      {
        title: '停运类型',
        key: 'subtype',
        tooltip: true,
        minWidth: 120
      },
      {
        title: '子类型',
        key: 'status',
        tooltip: true,
        minWidth: 100
      },
      {
        title: '停运日期',
        key: 'apply',
        tooltip: true,
        minWidth: 180
      },
      {
        title: '补偿时段',
        key: 'interval',
        tooltip: true,
        minWidth: 260
      },
      {
        title: '补偿时长(小时)',
        key: 'duration',
        tooltip: true,
        minWidth: 100,
        render(h, params) {
          console.log('我就是想看看zhegeH', params.row)
          // return h('div',{},)
         let res =   params.row.interval.split('-');
         let startTime = new Date(res[0]).getTime();
         let endTime = new Date(res[1]).getTime();
         console.log('s',startTime,'----','e',endTime)
         let durationTime = endTime -startTime;
         let hours = Math.floor(durationTime / 1000 / 60 / 60); //毫秒数换成小时

 
          return h("div",{ style:{color:'pink'}},`經過計算的duration${hours}`)
        }
      },
      {
        title: '状态',
        key: 'state',
        tooltip: true,
        minWidth: 100
      },
      {
        title: '备注',
        key: 'approval',
        tooltip: true,
        minWidth: 100
      },
      {
        title: '操作',
        key: 'action',
        height: "20",
        width: 150,
        fixed: 'right',
        render: (h, params) => {
          return h(
            'div', [
              h('a', {
                on: {
                  click() {
                    _this.detailModalShow = true
                    _this.viewDetail(params.row)
                  }
                }
              }, '详情'),
              h('a', {
                style: {
                  marginLeft: '10px',
                  display: Number(params.row.itemid) === 1 ? "none" : "inline-block",
                },

                on: {
                  click() {
                    _this.detailModalShow = true
                    _this.viewCancel(params.row)
                  }

                }
              }, '审批'),
            ]
          )
        }
      }
    ];
  }
};



export const pageData = {
  isShowAudit: false,
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],
  tableData: [{
    cityName: "南京",
    cityCode: "南京通有领行科技有限公司",
    driverName: "张三",
    mobilePhone: "18115188999",
    licensePlate: "苏AD88888",
    status: "故障",
    subtype: "车机故障",
    apply: "2019/12/2 10:11",
    interval: "2019/12/2 10:00 - 2019/12/2 14:00",
    duration: "4",
    state: "待审批",
    itemid: 1,
    approval: "",
  }, {
    cityName: "南京",
    cityCode: "南京通有领行科技有限公司",
    driverName: "张三",
    mobilePhone: "18115188999",
    licensePlate: "",
    status: "故障",
    subtype: "次责事故",
    apply: "2019/12/2 10:11",
    interval: "2019/12/2 10:00 - 2019/12/2 14:00",
    duration: "4",
    state: "审批通过",
    approval: "",
    itemid: 2,
  }]
}
