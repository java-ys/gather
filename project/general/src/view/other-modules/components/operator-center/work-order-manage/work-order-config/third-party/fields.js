export const driverTypeMap = {
  10: "自营司机",
  20: "自营主司机",
  30: "自营副司机",
  40: "自营顶班司机",
  50: "UP司机",
  60: "UP主司机",
  70: "UP副司机",
  80: "UP顶班司机",
  90: "UP带车加盟司机",
}

export const tableTitle = (that) => {
  return [
    {
      title: "第三方平台",
      key: "sourceDesc",
      minWidth: 60
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 60,
      // render: (h, { row }) => {
      //   return (
      //     <span>{row.cityInfo.length > 0 ? row.cityInfo.map(city => city.orgName).join(",") : "/"}</span>
      //   )
      // }
    },
    {
      title: "状态",
      key: "stateDesc",
      minWidth: 60
    },
    {
      title: "操作",
      key: "operation",
      minWidth: 200,
      render: (h, { row }) => {
        return (
          <Row type="flex">
            <Col>
              <Button
                type="primary"
                ghost
                size="small"
                onClick={() => that.$refs.addModal.init(row.id, "detail")}
              >
                查看
              </Button>
            </Col>
            {
              row.state == 0 &&
              <Col offset="1">
                <Button
                  type="primary"
                  ghost
                  size="small"
                  onClick={() => that.enable(row.id)}
                >
                  启用
                </Button>
              </Col>
            }
            {
              row.state == 1 &&
              <Col offset="1">
                <Button
                  type="error"
                  ghost
                  size="small"
                  onClick={() => that.disable(row.id)}
                >
                  停用
                </Button>
              </Col>
            }
            {
              row.state == 0 &&
              <Col offset="1">
                <Button
                  type="primary"
                  ghost
                  size="small"
                  onClick={() => that.$refs.addModal.init(row.id, "edit")}
                >
                  编辑
                </Button>
              </Col>
            }
            {
              row.state == 0 &&
              <Col offset="1">
                <Button
                  type="error"
                  ghost
                  size="small"
                  onClick={() => that.delData(row)}
                >
                  删除
                </Button>
              </Col>
            }
          </Row>
        );
      }
    },
  ]
};
export const violationLevelMap = {
    1:"特大",
    2:"重大",
    3:"较大",
    4:"一般",
    5:"轻微",
    6:"警告教育"
}