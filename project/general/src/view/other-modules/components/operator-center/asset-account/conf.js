import {
  timeFormat
} from '@/libs/util';
const statusList = [{
  label: '初始',
  value: 1
},
{
  label: '启用中',
  value: 2
},
{
  label: '已终止',
  value: 3
}
];

// 司机类型
export const driverList = [
  {
    label: '全部',
    value: ""
  },
  {
    label: '乘推司',
    value: 1
  },
  {
    label: '司推司',
    value: 2
  }
  ];

// 乘推司/司推司搜索项
export let inputList = [{
  name: 'text-input',
  title: '资产公司名称',
  titleWidth: 90,
  value: '',
  bind_key: 'companyName',
  maxlength: 20,
}];

// 乘推司/司推司机列表项
export const tableColumns = _this => {
  return [
    {
      title: '资产公司名称',
      key: 'companyName',
      minWidth: 80,
      fixed: 'left',
    },
    {
      title: '所属机构',
      key: 'companyPname',
      tooltip: true,
      minWidth: 80
    },
    {
      title: '更新人',
      key: 'updaterName',
      minWidth: 40
    },
    {
      title: '更新时间',
      key: 'updateTime',
      minWidth: 80,
      // render(h, params) {
      //   return <span>{new Date().toJSON().split('T')[0]}</span>
      // }
    },
    {
      title: '操作',
      key: 'operation',
      render(h, params) {
        let data = params.row;
        return h(
          'div', {
            style: {
              margin: '0 5px'
            }
          },
          [
            h(
              'Button', {
                style: {
                  margin: '0 15px'
                },
                props: {
                  type: 'primary',
                  ghost: true,
                  size: 'small'
                },
                directives: [{
                  name: 'show',
                  value: true,
                  // value: data.status === 1
                },{
                  name: 'hasAuth',
                  value: 'account-edit'
                }],
                on: {
                  click() {
                    _this.editRow(params.row);
                  }
                }
              },
              '编辑'
            ),
            h(
              'Button', {
                style: {
                  margin: '0 15px'
                },
                props: {
                  type: 'primary',
                  ghost: true,
                  size: 'small'
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'account-detail'
                }],
                on: {
                  click() {
                    _this.showDetail(params.row);
                  }
                }
              },
              '详情'
            )
            // ,
            // h(
            //   'Button', {
            //     style: {
            //       display: 'none',
            //       margin: '0 0 0 15px'
            //     },
            //     props: {
            //       type: 'primary',
            //       ghost: true,
            //       size: 'small'
            //     },
            //     // directives: [{
            //     //   name: 'hasAuth',
            //     //   value: 'driver-configure-log'
            //     // }],
            //     on: {
            //       click() {
            //         _this.showRecord = true;
            //         _this.getModalTableData(params.row.id);
            //       }
            //     }
            //   },
            //   '操作记录'
            // )
          ]
        );
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
