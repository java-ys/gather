import {
  timeFormat
} from '@/libs/util';
const getListObjItemValue = (list, val, keyName = "value", resKey = "label") => {
  const item =  list.find(it => it[keyName] === val) || {}
  return item[resKey] || ""
}
const statusList =
  [
    {
      label: '待上线',
      value: 1
    },
    {
      label: '已上线',
      value: 2
    },
    {
      label: '已下线',
      value: 3
    }
  ];

const auditStatusList =
  [
    {
      label: '待审核',
      value: 1
    },
    {
      label: '审核通过',
      value: 2
    },
    {
      label: '审核未通过',
      value: 3
    },
    {
      label: '审核中',
      value: 4
    }
  ];

export const productLineList = [
  {
    label: '快享',
    value: '4',
  },
  {
    label: '专享',
    value: '2'
  },
  {
    label: '企业用车',
    value: '13'
  },
  {
    label: '包车',
    value: '10'
  },
]

export let inputList = [
  {
    name: 'text-input',
    title: '策略名称',
    titleWidth: 90,
    value: '',
    bind_key: 'sfConfigName'
  },
  {
    name: 'cascader-input',
    title: '城市',
    titleWidth: 50,
    value: ['', ''],
    bind_key: ['provinceID', 'cityCode'],
    cascaderList: []
  },
  {
    name: 'drop-input',
    title: '业务线',
    titleWidth: 50,
    value: '',
    bind_key: 'productLine',
    dropList: []
  },
  {
    name: 'drop-input',
    title: '状态',
    titleWidth: 50,
    value: '',
    bind_key: 'status',
    dropList: statusList
  },
  // {
  //   name: 'drop-input',
  //   title: '审核状态',
  //   titleWidth: 90,
  //   value: '',
  //   bind_key: 'auditStatus',
  //   dropList: auditStatusList
  // },
  {
    name: 'date-time-input',
    bind_key: ['startTime', 'endTime'],
    placeholder: '请选择',
    value: '',
    title: '有效期：'
  },
];

export const tableColumns = _this => {
  return [
    {
      title: '策略名称',
      key: 'sfConfigName',
      minWidth: 80,
      fixed: 'left',
    },
    {
      title: '生效城市',
      key: 'cityName',
      tooltip: true,
      minWidth: 80
    },
    {
      title: '生效业务线',
      key: 'productLine',
      minWidth: 40,
      render: (h, { row }) => {
        let productLineListArr = row.productLine.split(',').map(it => Number(it))
        let textArr = []
        for(let item of productLineListArr){
          textArr.push(getListObjItemValue(_this.businessGradeList, item));
        }
        return h("div", textArr.join(','));
      }
    },
    {
      title: '触发节点',
      key: 'triggerNodeName',
      minWidth: 40,
      // render(h, params) {
      //   return <span>{new Date().toJSON().split('T')[0]}</span>
      // }
    },
    {
      title: '是否关联任务',
      key: 'taskFlag',
      minWidth: 5,
      render(h, { row }) {
        return <span>{row.taskFlag ? '是' : '否'}</span>
      }
    },
    {
      title: '状态',
      key: 'status',
      minWidth: 20,
      render(h, { row }) {
        const item = statusList.find(({ value }) => Number(value) === row.status) || { label: '' }
        return <span>{item.label}</span>
      }
    },
    {
      title: '有效期',
      key: 'startTime',
      minWidth: 80,
      render(h, { row }) {
        return <span>{`${_this.$moment(row.startTime).format("YYYY-MM-DD HH:mm:ss")}至${_this.$moment(row.endTime).format("YYYY-MM-DD HH:mm:ss")}`}</span>
      }
    },
    // {
    //   title: '审核状态',
    //   key: 'auditStatus',
    //   minWidth: 40,
    //   render(h, { row }) {
    //     const item = auditStatusList.find(({ value }) => Number(value) === row.auditStatus) || { label: '' }
    //     return <span>{item.label}</span>
    //   }
    // },
    {
      title: '创建人',
      key: 'creator',
      minWidth: 40
    },
    {
      title: '创建时间',
      key: 'createTime',
      minWidth: 40,
      render(h, { row }) {
        return <span>{_this.$moment(row.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
      }
    },
    {
      title: '最新提交时间',
      key: 'updateTime',
      minWidth: 40,
      render(h, { row }) {
        return <span>{_this.$moment(row.updateTime).format("YYYY-MM-DD HH:mm:ss")}</span>
      }
    },
    {
      title: '提交人',
      key: 'updater',
      minWidth: 40
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      render(h, params) {
        let row = params.row;



        const btnAttrs = {
          props: {
            type: 'primary',
            ghost: true,
            size: 'small',
          },
          style: { margin: '2.5px 2.5px' }
        }


        return (
          <fragment>
          { true && <Button onClick={() => _this.detail(row.id)} { ...btnAttrs } {... { directives: [ { name: 'hasAuth', value: 'strategy-detail' } ] } }>查看</Button> }
          { row.status == 1 && <Button onClick={() => _this.edit(row.id)} { ...btnAttrs } {... { directives: [ { name: 'hasAuth', value: 'strategy-edit' } ] } }>编辑</Button> }
          { row.status == 1 && <Button onClick={() => _this.onlineAndOffline({ id: row.id, operatorFlag: 2, operatorType: 1 })} { ...btnAttrs } {... { directives: [ { name: 'hasAuth', value: 'pay-up' } ] } }>上线</Button> }
          { row.status == 2 && <Button onClick={() => _this.onlineAndOffline({ id: row.id, operatorFlag: 3, operatorType: 1 })} { ...btnAttrs } {... { directives: [ { name: 'hasAuth', value: 'pay-down' } ] } }>下线</Button> }
          { true && <Button onClick={() => _this.goLog(params.row)} { ...btnAttrs } {... { directives: [ { name: 'hasAuth', value: 'query-log' } ] } }>操作记录</Button> }
        </fragment>
        )
      },
      minWidth: 150
    }
  ];
};

export const triggerTableColumns = _this => {
  return [
    {
      title: '有效期',
      key: 'updateTime',
      minWidth: 40,
      render(h, { row }) {
        if (!row.id) return <span>-</span>
        return <span>{`${_this.$moment(row.startTime).format("YYYY-MM-DD HH:mm:ss")}至${_this.$moment(row.endTime).format("YYYY-MM-DD HH:mm:ss")}`}</span>
      }
    },
    {
      title: '最新提交时间',
      key: 'updateTime',
      minWidth: 40,
      render(h, { row }) {
        if (!row.id) return <span>-</span>
        return <span>{row.updater}</span>
      }
    },
    {
      title: '提交人',
      key: 'updater',
      minWidth: 40,
      render(h, { row }) {
        if (!row.id) return <span>-</span>
        return <span>{row.updater}</span>
      }
    },
    {
      title: '状态',
      key: 'status',
      minWidth: 40,
      render(h, { row }) {
        if (!row.id) return <span>-</span>
        const item = statusList.find(({ value }) => Number(value) === row.status) || { label: '' }
        return <span>{item.label}</span>
      }
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      render(h, params) {
        let row = params.row;
        const noData = row.id === null
        // {... { directives: { name: 'hasAuth', value: 'atoup-review' } } }


        const btnAttrs = {
          props: {
            type: 'primary',
            ghost: true,
            size: 'small',
          },
          style: { margin: '2.5px 2.5px' }
        }
        return (
          <fragment>
            { !noData && <Button onClick={() => _this.detail()} { ...btnAttrs }>查看</Button> }
            { true && <Button onClick={() => _this.edit()} { ...btnAttrs }>编辑</Button> }
            { !noData && row.status === 1 && <Button onClick={() => _this.onlineAndOffline({ id: row.id, operatorFlag: 2, operatorType: 2 })} { ...btnAttrs }>上线</Button> }
            { !noData && row.status === 2 && <Button onClick={() => _this.onlineAndOffline({ id: row.id, operatorFlag: 3, operatorType: 2 })} { ...btnAttrs }>下线</Button> }
            { !noData && <Button onClick={() => _this.goLog(params.row)} { ...btnAttrs }>操作记录</Button> }
          </fragment>
        )
      },
      minWidth: 150
    }
  ];
};

// 操作日志
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
      key: 'operator'
    },
    {
      title: '操作类型',
      key: 'operateType',
      render(h, params) {
        let operateType = params.row.operateType;
        return h('span', {}, `${operateType}`);
      }
    },
    {
      title: '操作内容',
      key: 'operateContent'
    },
    {
      title: 'IP',
      key: "ipAddr"
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
