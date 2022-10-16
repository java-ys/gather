import {
  timeFormat
} from '@/libs/util';

// 默认搜索框title宽度
const titleWidth = 90;
const labelWidth = 110;

const statusList = [{
    label: '未开始',
    value: 3
  },
  {
    label: '启用中',
    value: 1
  },
  {
    label: '已终止',
    value: 2
  },
  {
    label: '已过期',
    value: 4
  }
];

export let inputList = [{
    name: 'text-input',
    title: '推荐奖励名称',
    titleWidth,
    value: '',
    bind_key: 'ruleName'
  },
  {
    name: 'text-input',
    title: '推荐奖励编码',
    titleWidth,
    value: '',
    bind_key: 'ruleCode'
  },
  {
    name: 'cascader-input',
    title: '省/市',
    titleWidth: 50,
    value: ['', ''],
    bind_key: ['provinceICode', 'cityCode'],
    cascaderList: []
  },
  {
    name: 'drop-input',
    title: '状态',
    titleWidth: 50,
    value: '',
    bind_key: 'ruleStatus',
    dropList: statusList
  }
];

export const tableColumns = _this => {
  return [{
      title: '序号',
      key: 'index',
      minWidth: 10,
      render(h, params) {
        return h('span', {}, (_this.tableConfig.current - 1) * _this.tableConfig.pageSize + params.index + 1);
      }
    },
    {
      title: '推荐奖励名称',
      key: 'ruleName',
      tooltip: true,
      minWidth: 80
    },
    {
      title: '推荐奖励编码',
      key: 'ruleCode',
      minWidth: 80
    },
    {
      title: '省/市',
      key: 'cityName',
      minWidth: 80,
      render(h, params) {
        return h('span', {}, `${params.row.provinceName}  ${params.row.cityName}`);
      }
    },
    {
      title: '奖励金额（元）',
      key: 'rewardAmount',
      minWidth: 40
    },
    {
      title: '有效时间',
      key: '',
      minWidth: 200,
      render(h, params) {
        let data = params.row;
        let startTime = data.validTime;
        let endTime = data.expireTime;
        return h('div', {}, `${timeFormat(startTime, 'yyyy-mm-dd')}至${timeFormat(endTime, 'yyyy-mm-dd')}`);
      }
    },
    {
      title: '推荐奖励配置状态',
      key: 'ruleStatus',
      minWidth: 50,
      render(h, params) {
        let data = params.row;
        let status;
        statusList.map(item => {
          if (item.value === data.ruleStatus) {
            status = item.label;
          }
        });
        return h('span', {}, status);
      }
    },
    {
      title: '操作',
      key: 'operation',
      render(h, params) {
        let data = params.row;
        let showDeadButton = data.ruleStatus === 1 || data.ruleStatus === 3 ? true : false;
        return h(
          'div', {
            style: {
              display: 'flex',
              justifyContent: 'space-around'
            }
          },
          [
            h(
              'Button', {
                props: {
                  type: 'primary',
                  ghost: true,
                  size: 'small'
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'passenger-recommand-driver-detail'
                }],
                on: {
                  click() {
                    _this.$router.push({
                      path: 'passenger-recommand-detail/' + params.row.ruleId
                    });
                  }
                }
              },
              '详情'
            ),
            h(
              'Button', {
                props: {
                  type: 'error',
                  ghost: true,
                  size: 'small'
                },
                directives: [{
                    name: 'show',
                    value: showDeadButton
                  },
                  {
                    name: 'hasAuth',
                    value: 'passenger-recommand-driver-dead'
                  }
                ],
                on: {
                  click() {
                    _this.$Modal.confirm({
                      title: '提示',
                      content: '是否终止该推荐奖励？',
                      onOk: () => {
                        _this.finishData(params.row);
                      }
                    });
                  }
                }
              },
              '终止'
            ),
            h(
              'Button', {
                props: {
                  type: 'primary',
                  ghost: true,
                  size: 'small'
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'passenger-recommand-driver-record'
                }],
                on: {
                  click() {
                    _this.showRecord = true;
                    _this.getModalTableData(params.row);
                  }
                }
              },
              '操作记录'
            )
          ]
        );
      },
      minWidth: 150
    }
  ];
};

export const modalTableColumns = _this => {
  return [{
      title: '序号',
      minWidth: 10,
      render(h, params) {
        return h('span', {}, (_this.modalTable.current - 1) * _this.modalTable.pageSize + params.index + 1);
      }
    },
    {
      title: '操作人',
      key: 'operatorName'
    },
    {
      title: '操作类型',
      key: 'operateType',
      render(h, params) {
        let data = params.row;
        let operateType = data.operateType == 1 ? '新建' : '终止';
        return h('span', {}, `${operateType}`);
      }
    },
    {
      title: '操作时间',
      key: 'operateTime',
      minWidth: 120,
      render(h, params) {
        return h('span', {}, `${timeFormat(params.row.operateTime, 'yyyy-mm-dd')}`);
      }
    }
  ];
};

/**
 * @description 详情页基本信息字段
 * @value data中basicInfo表单对应的字段
 * @render 对相应字段的具体处理
 */
export const basicInfoFields = [
  // [
  // 	{ title: '推荐奖励名称：', value: 'ruleName', span: 5, labelWidth: labelWidth },
  // 	{ title: '推荐奖励编码：', value: 'ruleCode', span: 6, labelWidth: labelWidth }
  // ],
  // [
  // 	{
  // 		title: '省/市：',
  // 		value: 'provinceName',
  // 		span: 5,
  // 		labelWidth: labelWidth,
  // 		render(value, data) {
  // 			let cityName = '';
  // 			if (value !== '全国') {
  // 				cityName = data.cityName;
  // 			}
  // 			return value + ' ' + cityName;
  // 		}
  // 	},
  // 	{
  // 		title: '有效时间：',
  // 		value: 'validTime',
  // 		span: 8,
  // 		labelWidth: labelWidth,
  // 		render: (value, data) => {
  // 			return `${value}  至  ${data.expireTime}`;
  // 		}
  // 	},
  // 	{
  // 		title: '奖励设置金额：',
  // 		value: 'rewardAmount',
  // 		span: 6,
  // 		labelWidth: labelWidth,
  // 		render(value) {
  // 			return value + '  元';
  // 		}
  // 	}
  // ],
  [{
      title: '被推荐司机：',
      value: 'talentCount',
      span: 5,
      labelWidth: labelWidth,
      render(value) {
        return value + '人';
      }
    },
    {
      title: '推荐人：',
      value: 'talentScoutCount',
      span: 4,
      labelWidth: labelWidth,
      render(value) {
        return value + '人';
      }
    },
    {
      title: '已发放总金额：',
      value: 'issuedRewardAmount',
      span: 4,
      labelWidth: labelWidth,
      render(value) {
        return value + '  元';
      }
    },
    {
      title: '未发放及已取消总金额：',
      value: 'unissuedRewardAmount',
      span: 6,
      labelWidth: 170,
      render(value) {
        return value + '  元';
      }
    }
  ]
];

export const basicInfoFields1 = [
  [
  	{ title: '推荐奖励名称：', value: 'ruleName', span: 5, labelWidth: labelWidth },
  	// { title: '推荐奖励编码：', value: 'ruleCode', span: 6, labelWidth: labelWidth }
  ],
  [
  	{
  		title: '省/市：',
  		value: 'provinceName',
  		span: 5,
  		labelWidth: labelWidth,
  		render(value, data) {
  			let cityName = '';
  			if (value !== '全国') {
  				cityName = data.cityName;
  			}
  			return value + ' ' + cityName;
  		}
  	},
  	{
  		title: '有效时间：',
  		value: 'validTime',
  		span: 8,
  		labelWidth: labelWidth,
  		render: (value, data) => {
  			return `${value}  至  ${data.expireTime}`;
  		}
  	},
  	// {
  	// 	title: '奖励设置金额：',
  	// 	value: 'rewardAmount',
  	// 	span: 6,
  	// 	labelWidth: labelWidth,
  	// 	render(value) {
  	// 		return value + '  元';
  	// 	}
  	// }
  ],
  // [{
  //     title: '被推荐司机：',
  //     value: 'talentCount',
  //     span: 5,
  //     labelWidth: labelWidth,
  //     render(value) {
  //       return value + '人';
  //     }
  //   },
  //   {
  //     title: '推荐人：',
  //     value: 'talentScoutCount',
  //     span: 4,
  //     labelWidth: labelWidth,
  //     render(value) {
  //       return value + '人';
  //     }
  //   },
  //   {
  //     title: '已发放总金额：',
  //     value: 'issuedRewardAmount',
  //     span: 4,
  //     labelWidth: labelWidth,
  //     render(value) {
  //       return value + '  元';
  //     }
  //   },
  //   {
  //     title: '未发放及已取消总金额：',
  //     value: 'unissuedRewardAmount',
  //     span: 6,
  //     labelWidth: 170,
  //     render(value) {
  //       return value + '  元';
  //     }
  //   }
  // ]
];
// 详情页搜索字段
export const detailInputList = [{
    name: 'text-input',
    title: '推荐人姓名',
    titleWidth,
    value: '',
    bind_key: 'name'
  },
  {
    name: 'text-input',
    title: '推荐人手机号',
    titleWidth,
    value: '',
    bind_key: 'mobile'
  },
  {
    name: 'text-input',
    title: '司机手机号',
    titleWidth,
    value: '',
    bind_key: 'driverMobile'
  },
  {
    name: 'text-input',
    title: '司机身份证号',
    titleWidth,
    value: '',
    bind_key: 'driverIdCard'
  },
  {
    name: 'drop-input',
    title: '奖励发放状态',
    titleWidth,
    value: '',
    bind_key: 'rewardStatus',
    dropList: [{
      label: '未发放',
      value: 0
    }, {
      label: '已发放',
      value: 1
    }, {
      label: '已取消',
      value: 2
    }]
  },
  {
    name: 'date-input',
    title: '奖励达成时间',
    titleWidth,
    value: ['', ''],
    bind_key: ['rewardValidTimeBegin', 'rewardValidTimeEnd'],
    placeholder: '请选择奖励达成时间'
  },
  {
    name: 'drop-input',
    title: '银行名称',
    titleWidth,
    value: '',
    bind_key: 'bankName',
    dropList: []
  },
  {
    name: "drop-input",
    bind_key: "rewardEvent",
    value: "",
    title: "奖励事件",
    dropList: [{
      label: '报名奖励',
      value: 0
    }, {
      label: '运营奖励',
      value: 1
    }],
    clearable: true,
    filterable: true
  },
  {
    name: "drop-input",
    bind_key: "rewardType",
    value: "",
    title: "奖励类型",
    dropList: [{
      label: '优惠券奖励',
      value: 0
    }, {
      label: '现金奖励',
      value: 1
    }],
    clearable: true,
    filterable: true
  }
];

// 详情页列表字段
export const detailTableColumns = _this => {
  return [{
      type: 'selection',
      width: 70,
      align: 'center',
      fixed: 'left'
    },
    {
      title: '序号',
      key: 'index',
      minWidth: 80,
      fixed: 'left',
      render(h, params) {
        return h('span', {}, (_this.current - 1) * _this.pageSize + params.index + 1);
      }
    },
    {
      title: '司机入职城市',
      key: 'driverCityName',
      minWidth: 120
    },
    {
      title: '奖励发放编码',
      key: 'rewardRuleCode',
      minWidth: 120
    },
    {
      title: '推荐人姓名',
      key: 'talentScoutName',
      minWidth: 100
    },
    {
      title: '推荐人手机号',
      key: 'talentScoutMobile',
      minWidth: 150
    },
    {
      title: '推荐人身份证号',
      key: 'talentScoutIdCard',
      minWidth: 180
    },
    {
      title: '奖励事件',
      key: 'rewardEventDesc',
      minWidth: 180,
      render(h,params){
        let text = params.row.rewardEvent == 0 ? '报名奖励' : '运营奖励';
        return h('span',text)
      }
    },
    {
      title: '奖励类型',
      key: 'rewardTypeDesc',
      minWidth: 180,
      render(h,params){
        console.log(params.row.rewardType )
        let text = params.row.rewardType == 0 ? '优惠券奖励' : '现金奖励';
        return h('span',text)
      }
    },
    {
      title: '现金金额（元）',
      key: 'rewardAmount',
      minWidth: 180,
      render(h,params){
        let text = params.row.rewardType == 0 ? '/': params.row.rewardAmount;
        return h('span',text)
      }
    },
    {
      title: '优惠券名称',
      key: 'couponName',
      minWidth: 180,
      render(h,params){
        let text = params.row.rewardType == 0 ? params.row.couponName : '/';
        return h('span',text)
      }
    },
    {
      title: '优惠券面值',
      key: 'couponValue',
      minWidth: 180,
      render(h,params){
        let text = params.row.rewardType == 0 ? params.row.couponValue : '/';
        return h('span',text)
      }
    },
    {
      title: '优惠券张数',
      key: 'couponNum',
      minWidth: 180,
      render(h,params){
        let text = params.row.rewardType == 0 ? params.row.couponNum : '/';
        return h('span',text)
      }
    },
    {
      title: '推荐人银行卡号',
      key: 'talentScoutBankAccount',
      minWidth: 180
    },
    {
      title: '银行名称',
      key: 'bankName',
      minWidth: 180
    },
    {
      title: '开户行所在城市',
      key: 'bankCityName',
      minWidth: 130
    },
    {
      title: '开户行名称',
      key: 'openingBank',
      minWidth: 180
    },
    {
      title: '被推荐司机',
      key: 'talentName',
      minWidth: 150
    },
    {
      title: '司机手机号',
      key: 'talentMobile',
      minWidth: 150
    },
    {
      title: '司机身份证号',
      key: 'talentIdCard',
      minWidth: 150
    },
    {
      title: '奖励达成时间',
      key: 'rewardValidTime',
      minWidth: 180,
      render(h, params) {
        return h('span', {}, `${timeFormat(params.row.rewardValidTime, 'yyyy-mm-dd')}`);
      }
    },
    {
      title: '奖励发放状态',
      key: 'rewardStatusDesc',
      minWidth: 100
    },
    {
      title: '操作',
      minWidth: 220,
      fixed: 'right',
      render(h, params) {
        let data = params.row;
        let status = data.rewardStatus;
        let buttonName;
        status === 1  ? (buttonName = '取消奖励') : (buttonName = '奖励');
        return h(
          'div', {
            style: {
              display: 'flex',
              justifyContent: 'space-around'
            }
          },
          [
            h(
              'Button', {
                props: {
                  type: 'primary',
                  ghost: true,
                  size: 'small'
                },
                style:{
                  display: params.row.rewardType == 1 ? '' : 'none'
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'passenger-recommand-driver-batch'
                }],
                on: {
                  click() {
                    _this.rewardOrCancle(data);
                  }
                }
              },
              buttonName
            ),
            h(
              'Button', {
                props: {
                  type: 'primary',
                  ghost: true,
                  size: 'small'
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'passenger-recommand-driver-detailRecord'
                }],
                on: {
                  click() {
                    _this.showRecord = true;
                    _this.$nextTick(() => {
                      _this.getModalTableData(data);
                    });
                  }
                }
              },
              '操作记录'
            )
          ]
        );
      }
    }
  ];
};

// 详情页操作记录列表字段
export const detailRecordColumns = _this => {
  return [{
      title: '序号',
      minWidth: 10,
      render: (h, params) => {
        let index = (_this.modalTable.current - 1) * _this.modalTable.pageSize + params.index + 1;
        return h('span', {}, index);
      }
    },
    {
      title: '操作人',
      key: 'operatorName'
    },
    {
      title: '操作类型',
      key: 'operateType',
      render(h, params) {
        let map = {
          1: '发放奖励',
          2: '取消奖励'
        };
        return h('span', {}, map[params.row.operateType]);
      }
    },
    {
      title: '操作时间',
      key: '',
      minWidth: 120,
      render(h, params) {
        return h('span', {}, timeFormat(params.row.operateTime, 'yyyy-mm-dd'));
      }
    }
  ];
};
