export const inputList = [
  {
    name: "drop-input",
    title: "类目名称：",
    filterable: true,
    titleWidth: 60,
    value: "",
    bind_key: "pubMenuName",
    dropList: []
  }
];

export const tableColumns = _this => {
  return [
    {
      title: "类目名称",
      key: "pubMenuName",
      tooltip: true,
      minWidth: 160
    },
    {
      title: "创建人",
      key: "creator",
      minWidth: 120
    },
    {
      title: "创建时间",
      key: "createTime",
      minWidth: 200
    },
    {
      title: "最近操作人",
      key: "updater",
      minWidth: 100
    },
    {
      title: "最近操作时间",
      key: "updateTime",
      minWidth: 200
    },
    {
      title: "操作",
      fixed: "right",
      width: 140,
      key: "operation",
      render: (h, { row }) => {
        let types = row.taskStatus - 1 === 0 ? "error" : "success";
        let t = { props: { type: types } };
        return (
          <Row type="flex">
            <Col offset="1">
              <Button
                type="primary"
                ghost
                size="small"
                {...getDirectives("passenger-cat-detail")}
                onClick={() => _this.openRow(row)}
              >
                详情
              </Button>
            </Col>
            <Col offset="1">
              <Button
                ghost
                size="small"
                {...getDirectives("passenger-cat-edit")}
                type="info"
                onClick={() => _this.edit(row)}
              >
                编辑
              </Button>
            </Col>
          </Row>
        );
      }
    }
  ];
};

function getDirectives(value, directivesList = []) {
  if (!value) return {};
  return {
    directives: [...directivesList, { name: "hasAuth", value }]
  };
}
