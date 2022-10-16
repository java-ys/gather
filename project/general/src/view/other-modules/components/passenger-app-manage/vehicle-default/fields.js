import { statusList, statusMap } from "./config";
export const inputList = [
  {
    name: "drop-input",
    title: "城市：",
    titleWidth: 70,
    inputWidth: 300,
    value: "",
    filterable: true,
    multiple: true,
    bind_key: "cityCodes",
    dropList: [],
  },
  {
    name: "drop-input",
    title: "状态：",
    bind_key: "status",
    filterable: true,
    value: "",
    titleWidth: 60,
    inputWidth: 220,
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
      title: "名称",
      key: "strategyName",
      minWidth: 200,
    },
    {
      title: "城市",
      key: "cityCode",
      minWidth: 160,
      tooltip: true,
      render: (h, { row }) => {
        return <span>{_this.getCityNameByCode(row.cityCode)}</span>;
      },
    },
    {
      title: "生效日期",
      key: "effectiveTime",
      minWidth: 180,
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
      title: "操作",
      fixed: "right",
      width: 260,
      key: "operation",
      render: (h, { row }) => {
        let { status } = row;
        let isNation = `${row.cityCode}` === '0'; // 全国
        // 停用（生效中+未生效的策略有此状态），停用后状态变成已失效；
        // 全国的数据，无停用操作，只有编辑+查看。
        let blockUp = status - (-2) === 0; // 已失效
        let invalid = `${status}` === "0"; // 未生效
        let valid = status - 1 === 0; // 生效中
        let types = row.status - 1 === 0 ? "error" : "success";
        let t = { props: { type: types } };
        return (
          <Row type="flex">
            {!blockUp ? <Col style={'margin-right: 8px'}>
              <Button
                type="success"
                ghost
                size="small"
                onClick={() => _this.openEdit(row)}
              >
                编辑
              </Button>
            </Col> : null }
            {!isNation ? <Col style={'margin-right: 8px'}>
              <Button
                type="info"
                ghost
                size="small"
                onClick={() => _this.openEdit(row, 2)}
              >
                复制
              </Button>
            </Col> : null }
            {(invalid || valid) && !isNation ? (
              <Col style={'margin-right: 8px'}>
                <Button
                  type={"error"}
                  ghost
                  size="small"
                  onClick={() => _this.activate(row)}
                >
                  停用
                </Button>
              </Col>
            ) : null}
            <Col>
              <Button
                type="primary"
                ghost
                size="small"
                onClick={() => _this.showRow(row)}
              >
                查看
              </Button>
            </Col>
          </Row>
        );
      },
    },
  ];
};
