/*
 * @Author: DK
 * @Date: 2019-08-08 10:10:59
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2020-11-02 14:13:14
 */
import { timeFormat } from "@/libs/util.js"
// 搜索条件数据
export const inputList = [
  {
    name: "text-input",
    bind_key: "insuranceId",
    title: "保单编号",
    titleWidth: 90,
    value: "",
  },
  {
    name: "text-input",
    title: "订单编号",
    bind_key: "routeNo",
    titleWidth: 90,
    value: "",
  },
  {
    name: "text-input",
    title: "乘车人姓名",
    bind_key: "actualPasNam",
    titleWidth: 90,
    value: "",
  },
  {
    name: "text-input",
    title: "乘车人手机号",
    bind_key: "actualPasMob",
    titleWidth: 90,
    value: "",
  },
  {
    name: "text-input",
    title: "下单人姓名",
    bind_key: "poerName",
    titleWidth: 90,
    value: "",
  },
  {
    name: "text-input",
    title: "下单人手机号",
    bind_key: "poerMob",
    titleWidth: 90,
    value: "",
  },
  {
    name: "text-input",
    title: "司机姓名",
    bind_key: "driverName",
    titleWidth: 90,
    value: "",
  },
  {
    name: "text-input",
    title: "司机手机号",
    bind_key: "driverMob",
    titleWidth: 90,
    value: "",
  },
  {
    name: "drop-input",
    title: "是否已投保",
    dropList: [
      { label: "是", value: 1 },
      { label: "否", value: 0 },
    ],
    bind_key: "policied",
    titleWidth: 90,
    value: "",
  },
  {
    name: "time-input",
    title: "保险起期",
    bind_key: "insurBegin",
    placeholder: "请选择保险起期",
    titleWidth: 90,
    value: "",
  }
]

// 表格列数据
export const tableColumns = (_this) => {
  return [
    {
      title: "订单编号",
      key: "routeNo",
      minWidth: 180,
      render(h, params) {
        return h("a", {
          on: {
            click() {
              // 个人订单
              if (params.row.typeEnt == 1) {
                _this.$router.push({
                  name: "order-detail",
                  params: { id: params.row.routeId }
                })
              } else {
                // 企业订单
                // _this.$router.push({
                //     path: '/companyCenter/orderManager/orderdetail',
                //     query: {
                //         id: params.row.routeId,
                //         applyNo: params.row.applyNo
                //     }
                // })
                _this.$router.pushToAnotherModule("/m2-web-companyLines", {
                  path: "/companyCenter/orderManager/orderdetail",
                  query: {
                    id: params.row.routeId,
                    applyNo: params.row.applyNo
                  }
                })
              }
            }
          }
        }, params.row.routeNo)
      }
    },
    {
      title: "保单编号",
      key: "insuranceId",
      minWidth: 180,
    },
    {
      title: "是否已投保",
      key: "policied",
      minWidth: 100,
      render(h, parmas) {
        let map = {
          0: "否",
          1: "是"
        }
        return h("span", {}, map[parmas.row.policied])
      }
    },
    {
      title: "乘车人姓名",
      key: "actualPasNam",
      width: 100,
    },
    {
      title: "乘车人手机号",
      key: "actualPasMob",
      minWidth: 120,
    },
    {
      title: "下单人姓名",
      key: "poerName",
      minWidth: 100,
    },
    {
      title: "下单人手机号",
      key: "poerMob",
      minWidth: 120,
    },
    {
      title: "司机姓名",
      key: "driverName",
      minWidth: 90,
    },
    {
      title: "司机手机号",
      key: "driverMob",
      minWidth: 120,
    },
    {
      title: "保险起期",
      key: "insurBegin",
      minWidth: 150,
      render(h, params) {
        return h("span", {}, timeFormat(params.row.insurBegin, "YYYY-MM-DD hh:mm:ss"))
      }
    },
    {
      title: "保险止期",
      key: "insurEnd",
      minWidth: 150,
      render(h, params) {
        return h("span", {}, timeFormat(params.row.insurEnd, "YYYY-MM-DD hh:mm:ss"))
      }
    },
    {
      title: "操作",
      width: 100,
      fixed: "right",
      render(h, params) {
        return h("div", {
          style: {
            display: "flex",
          }
        }, [
          h(
            "Button", {
              props: {
                type: "success",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: "hasAuth",
                value: "insurance-info-view"
              }],
              on: {
                click() {
                  _this.goDetail(params.row);
                }
              }
            },
            "查看保单"
          ),


        ]);
      }
    }
  ]
}
