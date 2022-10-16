export const isDynamicMap = {
  1: "是",
  0: "否"
}


// 详情时间校验
export const validatorTimeDetail = (rule, value, callback) => {
  let date = value;
  if (!date[0] && !date[1]) {
    callback(new Error("必选"));
  } else {
    if (JSON.stringify(date[0]) === JSON.stringify(date[1])) {
      callback(new Error("结束时间要大于开始时间"));
    } else {
      callback();
    }
  }
}
// 状态 0：下线，1：上线 ，2：下线待审核，3：废弃， 4：上线待审核，5：废弃待审核

export const getCrowStateName = (state)=>{
  let name = ""
  if(state===0){
    name = "下线"
  }
  if(state===1){
    name = "上线"
  }
  if(state===2){
    name = "下线待审核"
  }
  if(state===3){
    name = "废弃"
  }
  if(state===4){
    name = "上线待审核"
  }
  if(state===5){
    name = "废弃待审核"
  }
  return name

}
// 列表数据
export const listColumns = {
  // 列表页
  columns(_this) {
    return [{
      title: "序号",
      width: 80,
      render(h, params) {
        return h("span", {}, (_this.current - 1) * _this.pageSize + params.index + 1);
      }
    },
    {
      title: "城市",
      minWidth: 80,
      key: "provinceCity",
      render(h,params){
        const provinceName = getProvinceNameByCityUuid(
          params.row.cityCode,
          params.row.cityName,
          _this.provinceCityList
        )
        const provinceNameAndCityName = `${provinceName}${params.row.cityName}`
        return h("div",{},provinceNameAndCityName)
      }
    },
    {
      title: "策略名称",
      minWidth: 80,
      render(h,params){
        return h("div",{},params.row.ruleName)
      }
    },
    {
      title: "更新时间",
      minWidth: 160,
      key: "effectiveTime",
      render: (h, params) => {
        return h("div", _this.$moment(params.row.updateTime).format("YYYY-MM-DD HH:mm:ss"))
      }
    },
    {
      title: "操作人",
      minWidth: 100,
      key: "updater"
    },
    {
      title: "操作",
      width: 220,
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
              on: {
                click() {
                  _this.goDetail(params.row, true);
                }
              }
            },
            "详情"
          ),
          h(
            "Button", {
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: "hasAuth",
                value: "driver_group_dispatch_edit"
              }],
              on: {
                click() {
                  _this.goDetail(params.row, false);
                }
              }
            },
            "编辑"
          ),
          h(
            "Button", {
              props: {
                type: "error",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: "hasAuth",
                value: "driver_group_dispatch_del"
              }],
              on: {
                click() {
                  _this.deleteData(params.row.uuid);
                }
              }
            },
            "删除"
          ),
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
              on: {
                click() {
                  _this.goViewDetail(params.row);
                }
              }
            },
            "预览"
          ),
        ]);
      }
    }
    ];
  },
  // 新增，编辑弹窗
  driverColumn(_this,index,flag,detailFlag) {
    return [
    {
      title: "司机群名称",
      key: "crowdName",
      minWidth: 160,
      tooltip: true,
    },
    {
      title: "司机群编码",
      key: "crowdCode",
      minWidth: 220,
      tooltip: true,
    },
    {
      title: "状态",
      key: "crowdState",
      minWidth: 220,
      tooltip: true,
      render: (h, params) => {
        return h("span",{}, getCrowStateName(params.row.crowdState))
      }
    },
    {
      title: "是否动态更新",
      key: "isDynamic",
      minWidth: 120,
      tooltip: true,
      render: (h, params) => {
        return h("span", isDynamicMap[params.row.isDynamic] || "否")
      }
    },
    {
      title: "司机群人数",
      key: "userNum",
      minWidth: 120,
      tooltip: true,
    },
    {
      title: "操作",
      width: 80,
      key: "action",
      render(h, params) {
        return h("div", {
          style: {
            display: "flex",          
          }
        }, [
          h(
            "Button", {
              props: {
                type: "error",
                ghost: true,
                size: "small",
                disabled: detailFlag? true: false
              },
              class: {
                tableBtn: true
              },
              on: {
                click() {               
                  _this.deleteDriverGroup(params.row._index,index,flag);
                }
              }
            },
            "删除"
          )
        ]);
      }
    }
    ];
  }
}

// 生成策略时段
export const getPeriods = () => {
  return {
    id: Math.random().toString().slice(2),
    periods: [],
    coefficient: 0.1,
  }
}

// 查询省份名
export const getProvinceNameByCityUuid = (cityUuid, cityName, list) => {
  let provinceName = "";
  list.forEach(item => {
    if (item.children) {
      item.children.forEach(it => {
        if (it.value === cityUuid) {
          provinceName = it.province;
        }
      });
    }
  });
  return provinceName === cityName ? "" : provinceName + " / ";
}

// 查询省份i
export const getProvinceIdByCityUuid = (cityUuid, list) => {
  let provinceId = "";
  list.forEach(item => {
    if (item.children) {
      item.children.forEach(it => {
        if (it.value === cityUuid) {
          provinceId = item.value;
        }
      });
    }
  });
  return provinceId;
}
