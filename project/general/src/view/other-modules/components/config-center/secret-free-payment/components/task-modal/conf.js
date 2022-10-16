let typeList = [
  {
    value: "1",
    label: "导入类"
  },
  {
    value: "2",
    label: "条件类"
  }
];
let inputList = [
  {
    name: "text-input",
    bind_key: "taskName",
    placeholder: "请输入名称",
    value: "",
    title: "任务名称：",
    titleWidth: 80,
    inputWidth: 150
  },
  {
    name: "text-input",
    bind_key: "taskPlanCode",
    placeholder: "任务编号",
    value: "",
    title: "任务编号：",
    titleWidth: 80,
    inputWidth: 150
  },
];

// tableb表头信息
export let parColumns = (_this) => [
  {
    title: "ID",
    key: "taskId",
    ellipsis: true,
    tooltip: true,
    minWidth: 120
  },
  {
    title: "任务名称",
    key: "taskName",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "任务简介",
    key: "taskDes",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "适用城市",
    key: "city",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "开始时间",
    key: "startTime",
    ellipsis: true,
    tooltip: true,
    minWidth: 100,
    render(h, { row }) {
      return <span>{_this.$moment(row.startTime).format("YYYY-MM-DD HH:mm:ss")}</span>
    }
  },
  {
    title: "结束时间",
    key: "endTime",
    ellipsis: true,
    tooltip: true,
    minWidth: 100,
    render(h, { row }) {
      return <span>{_this.$moment(row.endTime).format("YYYY-MM-DD HH:mm:ss")}</span>
    }
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    render(h, params) {
      const { row } = params
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
          { true && <Button onClick={() => _this.selectRow(row)} { ...btnAttrs }>选择</Button> }
        </fragment>
      )
    },
    minWidth: 50
  }
];

export const cacheData = {
  inputList,
  pageObj: {
    total: 100,
    current: 1,
    pageSize: 10
  },
  searchData: {},
  tableData: [],
  selectedList: []
};
