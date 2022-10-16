/**
 * @Desc: config
 * @Author: zhangke
 * @CreateTime: 2020/12/18 13:45
 */
// 列表页，搜索条件校验规则
export const searchRule = {}
// 添加，编辑，查看规则
export const addRule = {
  schemaName: [
    {
      required: true,
      message: "请输入方案名称",
    }
  ],
  level: [
    {
      required: true,
      message: "请选择品牌车型车系"
    }
  ],
  cityUuid: [
    {
      required: true,
      message: "请选择城市"
    }
  ],
  stage: [
    {
      required: true,
      message: "请选择租期"
    }
  ],
  monthlyRent: [
    {
      required: true,
      message: "请输入月租"
    }
  ],
  deposit: [
    {
      required: true,
      message: "请输入押金"
    }
  ],
  invalidDate: [
    {
      required: true,
      message: "请选择失效日期"
    }
  ],

}
export const StateMap = {
  0: "待上架",
  2: "已上架",  
  5: "已下架",
  3: "已失效"
};
export const StateOptionMap = [{
  value: "0",
  label: "待上架"
}, {
  value: "2",
  label: "已上架"
}, {
  value: "5",
  label: "已下架"
}, {
  value: "3",
  label: "已失效"
}]
export const CarAgeMap = {
  1: "1年以内",
  2: "1-3年",
  3: "3年以上"
};
export const MileageMap = {
  1: "1万公里以内",
  2: "1-10万公里",
  3: "10-30万公里",
  4: "30万公里以上"
};
export const tableColumns = (_this) => [
  {
    title: "序号",
    key: "",
    type: "index",
    ellipsis: true,
    tooltip: true,
    minWidth: 70,
    align: "center"
  },
  {
    title: "方案编号",
    key: "schemaNo",
    ellipsis: true,
    tooltip: true,
    minWidth: 140
  },
  {
    title: "方案名称",
    key: "schemaName",
    ellipsis: true,
    tooltip: true,
    minWidth: 220
  },
  {
    title: "资产公司",
    key: "companyName",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "租赁城市",
    key: "cityName",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "品牌车系车型",
    key: "carBrand",
    ellipsis: true,
    tooltip: true,
    minWidth: 260,
    render(h, { row }) {
      return h("span", `${row.carBrand}-${row.carSeries}-${row.carLevel}`);
    }
  },
  {
    title: "车型代码",
    key: "carCode",
    ellipsis: true,
    tooltip: true,
    minWidth: 200
  },
  {
    title: "期数",
    key: "stage",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "月租（元）",
    key: "actualMonthlyRent",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "押金（元）",
    key: "deposit",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "有效期",
    key: "invalidDate",
    ellipsis: true,
    tooltip: true,
    minWidth: 130,
    renderHeader: h => {
      return h("div", [
        h(
          "span",
          {
            style: {
              fontSize: "12px",
              marginRight: "5px"
            }
          },
          "有效期"
        ),
        // h(
        //   "Tooltip",
        //   {
        //     attrs: {
        //       content: "对应日期内租赁方案自动变更为失效",
        //       placement: "top",
        //       transfer: true
        //     }
        //   },
        //   [
        //     h("Icon", {
        //       class: {
        //         "set-action": true
        //       },
        //       style: {
        //         fontSize: "14px"
        //       },
        //       attrs: {
        //         type: "md-help-circle"
        //       }
        //     })
        //   ]
        // )
      ]);
    }
  },
  // {
  //   title: "租赁减免期数",
  //   key: "freeStage",
  //   minWidth: 130,
  //   renderHeader: h => {
  //     return h("div", [
  //       h(
  //         "span",
  //         {
  //           style: {
  //             fontSize: "12px",
  //             marginRight: "5px"
  //           }
  //         },
  //         "租赁减免期数"
  //       ),
  //       h(
  //         "Tooltip",
  //         {
  //           attrs: {
  //             content: "订单对应最后期数租金减免",
  //             placement: "top",
  //             transfer: true
  //           }
  //         },
  //         [
  //           h("Icon", {
  //             class: {
  //               "set-action": true
  //             },
  //             style: {
  //               fontSize: "14px"
  //             },
  //             attrs: {
  //               type: "md-help-circle"
  //             },
  //             on: {
  //               click() {
  //               }
  //             }
  //           })
  //         ]
  //       )
  //     ]);
  //   }
  // },
  {
    title: "车龄（年）",
    key: "carAge",
    ellipsis: true,
    tooltip: true,
    minWidth: 100,
    render(h, { row }) {
      return h("span", CarAgeMap[row.carAge] || "");
    }
  },
  {
    title: "里程（km）",
    key: "mileage",
    ellipsis: true,
    tooltip: true,
    minWidth: 110,
    render(h, { row }) {
      return h("span", MileageMap[row.mileage] || "");
    }
  },
  {
    title: "状态",
    key: "schemaState",
    ellipsis: true,
    tooltip: true,
    minWidth: 80,
    render(h, { row }) {
      return h("span", StateMap[row.schemaState] || "");
    }
  },
  {
    title: "操作人",
    key: "updaterName",
    ellipsis: true,
    tooltip: true,
    minWidth: 80
  },
  {
    title: "操作时间",
    key: "updateTime",
    ellipsis: true,
    tooltip: true,
    minWidth: 180
  },
  {
    title: "操作",
    key: "action",
    fixed: "right",
    width: 156,
    render(h, { row }) {
      return h("div", {
        "class": "project-edit-row"
      }, [
        h("a", {
          on: {
            click() {
              _this.modalShow = true;
              _this.modalTitle = "方案详情";
              _this.type = 3;
              _this.schemaId = row.schemaId;
            }
          },
          directives: [
            {name: 'hasAuth', value: 'lease-schema-detail'}
          ]
        }, "详情"),
        row.schemaState === 2 ? h("a", {
          on: {
            click() {
              _this.$Modal.warning({
                title: "是否下架该方案？",
                closable: true,
                onOk: () => {
                  _this.changeState(0, row.schemaId);
                }
              });
            }
          },
          directives: [
            {name: 'hasAuth', value: 'lease-schema-stopSale'}
          ]
        }, "下架") : "",
        row.schemaState === 0 ? h("a", {
          directives: [
            {name: 'hasAuth', value: 'lease-schema-sale'}
          ],
          on: {
            click() {
              _this.$Modal.warning({
                title: "是否上架该方案？",
                closable: true,
                onOk: () => {
                  _this.changeState(1, row.schemaId);
                }
              });
            }
          }
        }, "上架") : "",
      ])
    }
  }
]
