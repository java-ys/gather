// 状态列表
const statusList = [{label: '启用', value: 1}, {label: '停用', value: 2}];

// 产品线
export const lineList = [
  {label: '快享', value: '4'},
  {label: '专享', value: '2'},
  {label: '出租车', value: '1'},
  {label: '惠享', value: '6'},
  {label: '自动驾驶', value: '7'}
];

export const timesList = [{label: '单次', value: 1}, {label: '多次', value: 2}];

export const periodList = [
  {label: '每时', value: 1},
  {label: '每日', value: 2},
  {label: '每周', value: 3},
  {label: '每月', value: 4},
];

export const weekList = [
  {label: '周一', value: 1},
  {label: '周二', value: 2},
  {label: '周三', value: 3},
  {label: '周四', value: 4},
  {label: '周五', value: 5},
  {label: '周六', value: 6},
  {label: '周日', value: 0},
];

// 1-31号
export const dayList = Array.from ({length: 32}, (v, k) => ({
  label: k,
  value: k,
})).slice (1);
// 00 - 23
export const hourList = Array.from ({length: 24}, (v, k) => ({
  label: k < 10 ? `0${k}` : k,
  value: k,
}));

export const inputList = [
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'taskName', // 返回数据的key名
    placeholder: '请输入',
    value: '', // 用于数据绑定
    title: '任务名称：',
  },
  {
    name: 'drop-input',
    title: '状态：',
    bind_key: 'taskStatus',
    filterable: true,
    value: '',
    titleWidth: 60,
    inputWidth: 165,
    dropList: statusList,
  },
  // {
  //   name: 'cascader-input',
  //   bind_key: ['provinceCode', 'cityCodeList'],
  //   placeholder: '请选择城市',
  //   value: [],
  //   cascaderList: [],
  //   title: '城市：',
  //   changeOnSelect: false,
  //   titleWidth: 60,
  //   inputWidth: 165,
  // },
  {
    name: 'drop-input',
    title: '城市：',
    titleWidth: 70,
    value: '',
    multiple: true,
    bind_key: 'cityCodeList',
    dropList: [],
  },
  {
    name: 'drop-input',
    title: '产品线：',
    titleWidth: 70,
    value: '',
    multiple: true,
    bind_key: 'bizTypeList',
    dropList: lineList,
  },
  {
    name: 'text-input',
    bind_key: 'creator',
    placeholder: '请输入',
    value: '',
    title: '创建人：',
  },
];

export const tableColumns = _this => {
  return [
    {
      title: '序号',
      // type: 'index',
      width: 70,
      render (h, params) {
        return (
          <span>
            {(_this.current - 1) * _this.pageSize + params.index + 1}
          </span>
        );
      },
    },
    {
      title: '任务名称',
      key: 'taskName',
      minWidth: 200,
      render: (h, {row}) => {
        let attr = {
          style: {
            color: "#2d8cf0",
            cursor: "pointer"
          },
          on: {
            click: () => _this.showRow(row)
          }
        }
        return (
          <span {...attr}>
            {row.taskName}
          </span>
        );
      },
    },
    {
      title: '城市',
      key: 'cityCode',
      minWidth: 160,
      tooltip: true,
      render: (h, {row}) => {
        return (
          <span>
            {_this.getCityNameByCode (row.cityCode)}
          </span>
        );
      },
    },
    {
      title: '任务状态',
      key: 'taskStatus',
      minWidth: 100,
      render: (h, {row}) => {
        return (
          <span>
            {row.taskStatus - 1 === 0 ? "启用" : "停用"}
          </span>
        );
      },
    },
    {
      title: '创建时间',
      key: 'createTime',
      minWidth: 180,
    },
    {
      title: '创建人',
      key: 'creator',
      minWidth: 180,
    },
    {
      title: '操作时间',
      key: 'updateTime',
      minWidth: 180,
    },
    {
      title: '操作人',
      key: 'updater',
      minWidth: 120,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 200,
      key: 'operation',
      render: (h, {row}) => {
        let types = row.taskStatus - 1 === 0 ? "error" : "success"
        let t = {props: {type: types}}
        return (
          <Row type="flex">

            <Col>
              <Button
                type="info"
                ghost
                size="small"
                v-hasAuth="urge-collect-edit"
                onClick={() => _this.openEdit (row)}
              >
                编辑
              </Button>
            </Col>
            <Col offset="1">
              <Button
                type="warning"
                ghost
                size="small"
                v-hasAuth="urge-collect-copy"
                onClick={() => _this.openEdit (row, 2)}
              >
                复制
              </Button>
            </Col>
            <Col offset="1">
              <Button
                {...t}
                ghost
                size="small"
                v-hasAuth="urge-collect-active"
                onClick={() => _this.activate (row)}
              >
                {row.taskStatus - 1 === 0 ? '停用' : '启用'}
              </Button>
            </Col>
            {/* <Col offset="1">
              <Button
                type="primary"
                ghost
                size="small"
                v-hasAuth="work-order-config-crew-remove"
                onClick={() => _this.showRow (row)}
              >
                数据展示
              </Button>
            </Col> */}
          </Row>
        );
      },
    },
  ];
};
