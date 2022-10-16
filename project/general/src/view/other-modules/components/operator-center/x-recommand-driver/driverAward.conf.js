export const awardStatus = [
  {
    label: '初始',
    value: '0',
  },
  {
    label: '已奖励',
    value: '1',
  },
  {
    label: '已取消',
    value: '2',
  }
]

import {driverTypes} from './conf'

export const createInputList = ({citys, orgs}) => { 
  return [
    {
      name: 'cascader-input',
      title: "司机入职城市",
      titleWidth: 100,
      value: ['', ''],
      bind_key: ['provinceICode', 'cityCode'],
      cascaderList: citys
    },
    // {
    //   name: "drop-input",
    //   title: "所属组织",
    //   value: "",
    //   bind_key: "agentUuid",
    //   dropList: orgs,
    //   filterable: true
    // },
    {
      name: "text-input",
      title: "推荐人姓名",
      titleWidth: 100,
      value: "",
      bind_key: "name"
    },
    // {
    //   name: "text-input",
    //   title: "手机号",
    //   value: "",
    //   bind_key: "mobile"
    // },
    {
      name: "text-input",
      title: "推荐人身份证号",
      titleWidth: 140,
      value: "",
      bind_key: "identityCard"
    },
    {
      name: "drop-input",
      title: "奖励状态",
      value: "",
      bind_key: "rewardStatus",
      dropList: awardStatus
    },
    {
      name: 'date-input',
      title: '奖励日期',
      titleWidth: 100,
      value: ['', ''],
      bind_key: ['rewardTimeStart', 'rewardTimeEnd'],
      placeholder: '奖励日期'
    },
    {
      name: 'date-input',
      title: '奖励达成时间',
      titleWidth: 100,
      value: ['', ''],
      bind_key: ['rewardValidTimeStart', 'rewardValidTimeEnd'],
      placeholder: '奖励达成时间'
    },
    {
      name: 'drop-input',
      title: '奖励达成时司机类型',
      bind_key: 'inviteType',
      titleWidth: 140,
      placeholder: '奖励达成时司机类型',
      dropList: driverTypes
    }
  ]
}
export const tableColumns = _this => {
  return [{
    type: 'selection',
    width: 70,
    align: 'center',
    fixed: 'left'
  },
  {
    title: '司机ID',
    key: 'code',
    minWidth: 140
  },
  {
    title: '奖励发放编码',
    key: 'rewardCode',
    minWidth: 140
  },
  {
    title: '推荐人姓名',
    key: 'name',
    minWidth: 120
  },
  {
    title: '手机号',
    key: 'mobile',
    minWidth: 120
  },
  {
    title: '推荐人身份证号',
    key: 'identityCard',
    minWidth: 180
  },
  {
    title: '城市',
    key: 'cityName',
    align: 'center',
    minWidth: 140
  },
  {
    title: '奖励状态',
    key: 'rewardStatus',
    minWidth: 100,
    align: 'center',
    render(h, {row}) {
      let text = ''
      if(row.rewardStatus !== null && row.rewardStatus !== undefined) {
        text = awardStatus.filter(item => item.value == row.rewardStatus)[0].label
      }
      return h('span', {}, text)
    }
  },
  {
    title: '奖励日期',
    key: 'rewardTime',
    minWidth: 180
  },
  {
    title: '被推荐司机姓名',
    key: 'byName',
    minWidth: 180
  },
  {
    title: '被推荐司机手机号',
    key: 'byMobile',
    minWidth: 180
  },
  {
    title: '被推荐司机身份证号',
    key: 'byIdCard',
    minWidth: 180
  },
  {
    title: '奖励达成时间',
    key: 'rewardValidTime',
    minWidth: 200
  },
  {
    title: '奖励达成时司机类型：',
    key: 'inviteType',
    minWidth: 200,
    render(h, {row}){
      return h('div',{}, driverTypes.find(item => +row.inviteType === +item.value)?.label)
    }
  },
  {
    title: '奖励金额（元）',
    key: 'rewardAmount',
    align: 'center',
    minWidth: 140
  },
  {
    title: '操作',
    minWidth: 220,
    fixed: 'right',
    render(h, params) {
      let data = params.row;
      let status = +data.rewardStatus;
      let buttonName = status === 1  ?  '取消奖励' :  '奖励'
      let handleType = status === 1 ? 2 : 1
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
                value: 'x-driver-award'
              }],
              on: {
                click() {
                  _this.isReward(data, handleType);
                }
              }
            },
            buttonName
          ),
          h(
            'Button', 
            {
              props: {
                type: 'primary',
                ghost: true,
                size: 'small'
              },
              directives: [{
                name: 'hasAuth',
                value: 'x-driver-award-detail'
              }],
              on: {
                click() {
                  _this.getDetails(data.id)
                }
              }
            },
            '详情'
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
                value: 'x-driver-operateLog'
              }],
              on: {
                click() {
                  _this.getLogs(data.id, data.name)
                }
              }
            },
            '日志'
          )
        ]
      )
    }
  }
]
}