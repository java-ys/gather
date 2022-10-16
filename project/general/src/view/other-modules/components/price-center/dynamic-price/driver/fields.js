import { listToMap } from "@/libs/util";
import { statusList } from "_o/components/price-center/dynamic-price/config";
import { getDirectives } from "@/mixins/base";

export const driver_special_params = { consumerType: 2 }; //  司机特殊入参

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
      title: "版本号",
      key: "version",
      minWidth: 200,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "策略名称",
      key: "ruleName",
      minWidth: 200,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 100,
    },
    {
      title: "区县",
      key: "areaName",
      minWidth: 120,
    },
    {
      title: "业务线",
      key: "expandBizLine",
      minWidth: 180,
      render: (h, {row}) => {
        let r = listToMap(_this.businessGradeList)
        return (<span>{r[row.expandBizLine]}</span>)
      }
    },
    {
      title: "产品线",
      key: "bizType",
      minWidth: 180,
      render: (h, {row}) => {
        let r = listToMap(_this.bizTypeList)
        return (<span>{r[row.bizType]}</span>)
      }
    },
    {
      title: "车型",
      key: "vehicleLevel",
      minWidth: 180,
      render: (h, {row}) => {
        let r = _this.businessGradeName.productCarKeyValue
        return (<span>{r[`${row.bizType}#${row.vehicleLevel}`]}</span>)
      }
    },
    {
      title: "状态",
      key: "status",
      minWidth: 100,
      render: (h, {row}) => {
        let r = listToMap(statusList)
        return (<span>{r[row.status]}</span>)
      }
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
      width: 300,
      key: "operation",
      render: (h, { row }) => {
        // let types = row.status - 1 === 0 ? "error" : "success";
        // let t = { props: { type: types } };
        let isCanDelete = `${row.status}` === '0'; // 待生效可删除
        let isActive = `${row.status}` === '1'; // 生效中  可停用
        return (
          <Row type="flex">
            <Col>
              <Button
                type="info"
                ghost
                size="small"
                {...getDirectives('price-driver-detail')}
                onClick={() => _this.showRow(row)}
              >
                详情
              </Button>
            </Col>
            <Col offset="1">
              <Button
                type="warning"
                ghost
                size="small"
                {...getDirectives('price-driver-copy')}
                onClick={() => _this.edit(row, 2)}
              >
                复制
              </Button>
            </Col>
            {isActive ? <Col offset="1">
              <Button
                ghost
                type="error"
                size="small"
                {...getDirectives('price-driver-block')}
                onClick={() => _this.activate(row, -2)}
              >
                停用
              </Button>
            </Col> : null }
            {isCanDelete ? <Col offset="1">
              <Button
                type="error"
                ghost
                size="small"
                {...getDirectives('price-driver-delete')}
                onClick={() => _this.activate(row, -1)}
              >
                删除
              </Button>
            </Col> : null }
          </Row>
        );
      },
    },
  ];
};
