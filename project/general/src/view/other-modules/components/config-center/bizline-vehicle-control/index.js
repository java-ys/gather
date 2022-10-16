
export const statusData = {
  0: "待启用",
  1: "启用"
};

export const businessTypeData = {
  4: "快享",
  2: "专享",
  1: "出租车"
};

export const returnFields = that => {
  return {
    current: 1,
    pageSize: 10,
    total: 0,
    parColumns: [
      {
        title: "序号",
        key: "num",
        tooltip: true,
        width: 70,
        fixed: "left",
        render: (h, params) => {
          return h(
            "div",
            that.pageSize * (that.current - 1) + params.index + 1
          );
        }
      },
      {
        title: "行政区域类型",
        key: "levelType",
        minWidth: 150,
        tooltip: true,
        render: (h, params) => {
          if (params.row.levelType === 1) return h("span", "市级")
          if (params.row.levelType === 2) return h("span", "区县级")
        }
      },
      {
        title: "城市",
        key: "city",
        minWidth: 150,
        tooltip: true,
        render: (h, params) => {
          let cityName = params.row.cityName;
          return h("div", cityName);
        }
      },
      {
        title: "区县",
        key: "areaName",
        minWidth: 150,
        tooltip: true,
        render: (h, params) => {
          let areaName = params.row.areaName;
          return h("div", areaName);
        }
      },
      {
        title: "业务线名称",
        key: "businessType",
        tooltip: true,
        minWidth: 150,
        render: (h, { row }) => {
          let rowGradeObj = that.businessGradeList.find(it => Number(it.value) === row.expandBizLine) || {}
          return h("span", rowGradeObj.label || "")
        }
      },
      {
        title: "车型等级",
        key: "carTypes",
        tooltip: true,
        minWidth: 200,
        render: (h, params) => {
          let text = "";
          let { row: { bizTypeList }} = params;
          let carList = [...bizTypeList.map(it => {
            let list = it.levels.map(item => `${it.bizTypeName}-${item.vehicleName}`)
            return list
          }).flat()]
          text = carList.join(",")
          return h("div", text);
        }
      },
      {
        title: "车型组",
        tooltip: true,
        minWidth: 200,
        render: (h, { row }) => {
          let text = "";
          let { webGroupVehicleDtoList } = row;
          text = webGroupVehicleDtoList.map(it => it.groupName).join("，")
          return h("div", text);
        }
      },
      {
        title: "状态",
        key: "openStatus",
        tooltip: true,
        minWidth: 150,
        render: (h, params) => {
          let statusTitle = statusData[params.row.openStatus] || "暂无";
          return h("div", statusTitle);
        }
      },
      {
        title: "更新时间",
        key: "updateTime",
        minWidth: 170,
        tooltip: true
      },
      {
        title: "更新人",
        key: "updator",
        minWidth: 150,
        tooltip: true
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        minWidth: 210,
        render: (h, params) => {
          let paramDatas = params.row;
          const { openStatus } = paramDatas;
          const canStart = openStatus === 0; // 启用
          return h("div", [
            h(
              "Button",
              {
                class: {
                  tableBtn: true
                },
                props: {
                  type: "warning",
                  ghost: true,
                  size: "small"
                },
                directives: [
                  {
                    name: "hasAuth",
                    value: "bizline-vehicle-edit"
                  }
                ],
                on: {
                  click: () => {
                    that.title = "编辑业务线与车型等级关系";
                    that.updateType = "edit";
                    let paramData = JSON.parse(JSON.stringify(paramDatas))
                    paramData.carrierArea = [paramData.provinceCode, paramData.cityCode]
                    let originList = paramData.bizTypeList.map(it => {
                      let list = it.levels.map(item => {
                        return {
                          ...item,
                          bizType: it.bizType,
                          bizTypeName: it.bizTypeName,
                          vehicleLevel: `${paramData.expandBizLine}#${it.bizType}#${item.vehicleLevel}`
                        }
                      })
                      return list
                    })
                    paramData.carTypes = [...originList.flat().filter(it => (!it.partTimeList || !it.partTimeList.length)).map(it => it.vehicleLevel)]
                    let PartTimeList = [...originList.flat().filter(it => it.partTimeList && it.partTimeList.length)]
                    paramData.partTimeBizList = PartTimeList.map(it => {
                      const partTimePickerList = it.partTimeList.map(itt => {
                        return {
                          value: [itt.split("-")[0], itt.split("-")[1]],
                        }
                      })
                      return {
                        ...it,
                        partTimePickerList,
                        carTypes: [it.vehicleLevel]
                      }
                    })
                    let webGroupVehicleDtoList  = paramData.webGroupVehicleDtoList
                    paramData.partTimeBizGroupList = webGroupVehicleDtoList.map(it => {
                      const partTimePickerList = it.partTimeList.map(itt => {
                        return {
                          value: [itt.split("-")[0], itt.split("-")[1]],
                        }
                      })
                      return {
                        ...it,
                        partTimePickerList,
                      }
                    })
                    paramData.carGroups = webGroupVehicleDtoList.map(it => it.groupID)
                    paramData.areaCodes = paramData.areaCode.split(",") || []
                    that.$refs.addForm.$refs.formValidate.resetFields();
                    that.floatParams = paramData;
                    that.$refs.addForm.changeExpandBizLine(paramData.expandBizLine)
                    that.$refs.addForm.queryArea(paramData.cityCode)
                    that.isPop = true;
                    that.invalidEditor = false;
                  }
                }
              },
              "编辑"
            ),
            h(
              "Button",
              {
                class: {
                  tableBtn: true
                },
                props: {
                  type: "warning",
                  ghost: true,
                  size: "small"
                },
                directives: [
                  {
                    name: "hasAuth",
                    value: "bizline-vehicle-copy"
                  }
                ],
                on: {
                  click: () => {
                    that.title = "新增业务线与车型等级关系";
                    that.updateType = "add";
                    let paramData = JSON.parse(JSON.stringify(paramDatas))
                    paramData.carrierArea = [paramData.provinceCode, paramData.cityCode]

                    that.$refs.addForm.changeExpandBizLine(paramData.expandBizLine)
                    that.$refs.addForm.queryArea(paramData.cityCode)
                    let originList = paramData.bizTypeList.map(it => {
                      let list = it.levels.map(item => {
                        return {
                          ...item,
                          bizType: it.bizType,
                          bizTypeName: it.bizTypeName,
                          vehicleLevel: `${paramData.expandBizLine}#${it.bizType}#${item.vehicleLevel}`
                        }
                      })
                      return list
                    })
                    paramData.carTypes = [...originList.flat().filter(it => (!it.partTimeList || !it.partTimeList.length)).map(it => it.vehicleLevel)]
                    let PartTimeList = [...originList.flat().filter(it => it.partTimeList && it.partTimeList.length)]
                    paramData.partTimeBizList = PartTimeList.map(it => {
                      const partTimePickerList = it.partTimeList.map(itt => {
                        return {
                          value: [itt.split("-")[0], itt.split("-")[1]],
                        }
                      })
                      return {
                        ...it,
                        partTimePickerList,
                        carTypes: [it.vehicleLevel]
                      }
                    })
                    let webGroupVehicleDtoList  = paramData.webGroupVehicleDtoList
                    paramData.partTimeBizGroupList = webGroupVehicleDtoList.map(it => {
                      const partTimePickerList = it.partTimeList.map(itt => {
                        return {
                          value: [itt.split("-")[0], itt.split("-")[1]],
                        }
                      })
                      return {
                        ...it,
                        partTimePickerList,
                      }
                    })
                    that.$refs.addForm.$refs.formValidate.resetFields();
                    paramData.carGroups = webGroupVehicleDtoList.map(it => it.groupID)
                    paramData.areaCodes = paramData.areaCode.split(",") || []
                    that.floatParams = paramData;
                    that.isPop = true;
                    that.invalidEditor = false;
                  }
                }
              },
              "复制"
            ),
            h(
              "Button",
              {
                class: {
                  tableBtn: true
                },
                props: {
                  type: "warning",
                  ghost: true,
                  size: "small"
                },
                directives: [
                  {
                    name: "hasAuth",
                    value: "dynamic-premium-detail"
                  }
                ],
                on: {
                  click: () => {
                    that.title = "业务线与车型等级关系详情";
                    that.updateType = "view";
                    let paramData = JSON.parse(JSON.stringify(paramDatas))
                    paramData.carrierArea = [paramData.provinceCode, paramData.cityCode]

                    that.$refs.addForm.changeExpandBizLine(paramData.expandBizLine)
                    that.$refs.addForm.queryArea(paramData.cityCode)
                    let originList = paramData.bizTypeList.map(it => {
                      let list = it.levels.map(item => {
                        return {
                          ...item,
                          bizType: it.bizType,
                          bizTypeName: it.bizTypeName,
                          vehicleLevel: `${paramData.expandBizLine}#${it.bizType}#${item.vehicleLevel}`
                        }
                      })
                      return list
                    })
                    paramData.carTypes = [...originList.flat().filter(it => (!it.partTimeList || !it.partTimeList.length)).map(it => it.vehicleLevel)]
                    let PartTimeList = [...originList.flat().filter(it => it.partTimeList && it.partTimeList.length)]
                    paramData.partTimeBizList = PartTimeList.map(it => {
                      const partTimePickerList = it.partTimeList.map(itt => {
                        return {
                          value: [itt.split("-")[0], itt.split("-")[1]],
                        }
                      })
                      return {
                        ...it,
                        partTimePickerList,
                        carTypes: [it.vehicleLevel]
                      }
                    })
                    let webGroupVehicleDtoList  = paramData.webGroupVehicleDtoList
                    paramData.partTimeBizGroupList = webGroupVehicleDtoList.map(it => {
                      const partTimePickerList = it.partTimeList.map(itt => {
                        return {
                          value: [itt.split("-")[0], itt.split("-")[1]],
                        }
                      })
                      return {
                        ...it,
                        partTimePickerList,
                      }
                    })
                    paramData.carGroups = webGroupVehicleDtoList.map(it => it.groupID)
                    paramData.areaCodes = paramData.areaCode.split(",") || []
                    that.$nextTick(() => {
                      console.log(that.floatParams)
                      that.$refs.addForm.$refs.formValidate.resetFields();
                      that.floatParams = paramData;
                      that.isPop = true;
                    })
                    that.invalidEditor = false;
                  }
                }
              },
              "详情"
            ),
            canStart
              ? h(
                "Button",
                {
                  class: {
                    tableBtn: true
                  },
                  props: {
                    type: "success",
                    ghost: true,
                    size: "small"
                  },
                  directives: [{
                    name: "hasAuth",
                    value: "bizline-vehicle-status"
                  }],
                  on: {
                    click: () => {
                      that.rowActive(paramDatas)
                    }
                  }
                },
                "启用"
              ) : ""
          ]);
        }
      }
    ]
  };
};
export const inputList = [
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ["provinceCode", "cityCode"], // 返回数据的key名
    placeholder: "请选择城市",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: "城市："
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "expandBizLine", // 返回数据的key名
    placeholder: "请选择产品线",
    value: "", // 绑定返回数据
    dropList: [], // 级联列表
    title: "业务线："
  }
];
