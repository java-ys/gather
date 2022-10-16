import {
  timeFormat,
  listToMap
} from '@/libs/util';

// 默认搜索框title宽度
const titleWidth = 90;

const statusList = [
  {
    label: '未开始',
    value: 2
  },
  {
    label: '启用中',
    value: 1
  },
  {
    label: '已终止',
    value: 3
  },
  {
    label: '已结束',
    value: 4
  }
]
const statusMap = listToMap(statusList)


export let inputList = [{
    name: 'text-input',
    title: '推荐奖励名称',
    titleWidth,
    value: '',
    bind_key: 'ruleName',
    placeholder: "请输入"
  },
  {
    name: 'cascader-input', // 文本输入框名
    bind_key: ['provinceICode', 'cityCode'], // 返回数据的key名
    placeholder: '请选择',
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    titleWidth: 50,
    title: '省/市：', // 展示的字段名
    filterable:true
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
      width: 70,
      render(h, params) {
        return h('span', {}, (_this.tableConfig.current - 1) * _this.tableConfig.pageSize + params.index + 1);
      }
    },
    {
      title: '推荐奖励名称',
      key: 'ruleName',
      tooltip: true,
      minWidth: 140
    },
    {
      title: '推荐奖励编码',
      key: 'ruleCode',
      minWidth: 140
    },
    {
      title: '省/市',
      key: 'cityName',
      minWidth: 150,
      render(h, params) {
        return h('span', {}, `${params.row.provinceName}  ${params.row.cityName}`);
      }
    },
    {
      title: '有效时间',
      key: '',
      minWidth: 270,
      render(h, {row}) {
        let startTime = row.validTime;
        let endTime = row.expireTime;
        return h('div', `${_this.$moment(startTime).format("YYYY-MM-DD")} 至 ${_this.$moment(endTime).format("YYYY-MM-DD")}`);
      }
    },
    {
      title: '状态',
      key: 'ruleStatus',
      minWidth: 90,
      render(h, {row}) {
        return h('span', statusMap[row.ruleStatus]);
      }
    },
    {
      title: '操作',
      fixed:"right",
      width:220,
      key: 'operation',
      render(h, params) {
        let data = params.row;
        let showDeadButton = data.ruleStatus === 1 || data.ruleStatus === 2 ? true : false;
        return h('div', [
          h(
            'Button', {
              props: {
                type: 'primary',
                ghost: true,
                size: 'small'
              },
              class:{
                tableBtn: true
              },
              directives: [{
                name: 'hasAuth',
                value: 'agent-recruit-detail'
              }],
              on: {
                click() {
                  _this.showDetail = true;
                  _this.detailInfo = data
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
              class:{
                tableBtn: true
              },
              directives: [
                {
                  name: 'show',
                  value: showDeadButton
                },
                {
                  name: 'hasAuth',
                  value: 'agent-recruit-stop'
                }
              ],
              on: {
                click() {
                  _this.$Modal.confirm({
                    title: '提示',
                    content: '是否确认终止该推荐奖励？',
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
                type: 'success',
                ghost: true,
                size: 'small'
              },
              directives: [{
                name: 'hasAuth',
                value: 'agent-recruit-history'
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
        ]);
      },
      minWidth: 150
    }
  ];
};

export const modalTableColumns = _this => {
  return [{
      title: '序号',
      width: 70,
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
      width: 160,
      render(h, params) {
        return h('span', {}, `${timeFormat(params.row.operateTime, 'yyyy-mm-dd')}`);
      }
    }
  ];
};
