import { listToMap } from "@/libs/util";

const statusList = [
  { label: "待生效", value: 0 },
  { label: "生效中", value: 1 },
  { label: "已失效", value: -2 },
];

export const statusMap = listToMap(statusList);

export const inputList = [
  {
    name: "text-input",
    bind_key: "ruleName",
    placeholder: "请输入",
    titleWidth: 60,
    value: "",
    title: "策略名称：",
  },
  {
    name: "drop-input",
    title: "城市：",
    titleWidth: 60,
    value: "",
    filterable: true,
    bind_key: "cityCode",
    dropList: [],
  },
  {
    name: "drop-input",
    title: "区县：",
    titleWidth: 60,
    value: "",
    filterable: true,
    bind_key: "areaCode",
    dropList: [],
  },
  {
    name: "drop-input",
    title: "业务线：",
    titleWidth: 60,
    value: "",
    filterable: true,
    bind_key: "expandBizLine",
    dropList: [],
  },
  {
    name: "drop-input",
    title: "状态：",
    bind_key: "status",
    filterable: true,
    value: "",
    titleWidth: 60,
    dropList: statusList,
  },
];

export const tableColumns = (_this) => {
  return [
    {
      title: "序号",
      // type: 'index',
      width: 70,
      render(h, params) {
        return (
          <span>{(_this.current - 1) * _this.pageSize + params.index + 1}</span>
        );
      },
    },
    {
      title: "策略名称",
      key: "ruleName",
      minWidth: 200,
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 160,
      tooltip: true,
    },
    {
      title: "区县",
      key: "areaName",
      minWidth: 180,
    },
    {
      title: "业务线",
      key: "expandBizLine",
      minWidth: 180,
      render: (h, { row }) => {
        return <span>{listToMap(_this.businessGradeList || [])[row.expandBizLine]}</span>;
      },
    },
    {
      title: "状态",
      key: "status",
      minWidth: 100,
      render: (h, { row }) => {
        return <span>{statusMap[row.status]}</span>;
      },
    },
    {
      title: "更新时间",
      key: "updateTime",
      minWidth: 180,
    },
    {
      title: "操作人",
      key: "updater",
      minWidth: 120,
    },
    {
      title: "操作",
      fixed: "right",
      width: 200,
      key: "operation",
      render: (h, { row }) => {
        let isCanDelete = `${row.status}` === '0' // 仅待生效策略可删除
        let isCanBlock = row.status - 1 === 0; // 仅生效中策略展示该按钮
        // let t = { props: { type: types } };
        // v-hasAuth="'urge-collect-edit'"
        return (
          <Row type="flex">
            <Col>
              <Button
                type="info"
                ghost
                size="small"
                onClick={() => _this.openDetail(row)}
              >
                详情
              </Button>
            </Col>
            <Col offset="1">
              <Button
                type="warning"
                ghost
                size="small"
                onClick={() => _this.copyEdit(row, 2)}
              >
                复制
              </Button>
            </Col>
            {isCanBlock ? <Col offset="1">
              <Button
                type={'error'}
                ghost
                size="small"
                onClick={() => _this.activate(row)}
              >
                停用
              </Button>
            </Col> : null }
            {isCanDelete ? <Col offset="1">
              <Button
                type="error"
                ghost
                size="small"
                onClick={() => _this.deleteRow (row)}
              >
                删除
              </Button>
            </Col> : null}
          </Row>
        );
      },
    },
  ];
};

// 业务线枚举值，屏蔽拼车、接送机、峰必达、智享、高德特惠业务线 包车 第三方服务
export const excludeLine = (v) => {
  return ![8, 9, 10, 13, 15, 2, 18].includes(+v)
}
