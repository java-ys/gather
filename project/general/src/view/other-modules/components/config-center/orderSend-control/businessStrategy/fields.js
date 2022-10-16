import { mapToList } from "@/libs/util.js";

export const statusData = {
  1: "已启用",
  0: "已停用",
}
export const statusDataList = mapToList(statusData);

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

// 列表数据

export const columns = _this => {
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
    render(h, params) {
      const provinceName = getProvinceNameByCityUuid(
        params.row.cityCode,
        params.row.cityName,
        _this.provinceCityList
      )
      const provinceNameAndCityName = `${provinceName}${params.row.cityName}`
      return h("div", {}, provinceNameAndCityName)
    }
  },
  {
    title: "区县",
    minWidth: 80,
    key: "areaName",
    render(h, params) {
      return h("div", {}, params.row.areaName || "-")
    }
  },
  {
    title: "状态",
    minWidth: 80,
    key: "ruleStatus",
    render(h, params) {
      return h("div", {}, statusData[params.row.ruleStatus] || "-")
    }
  },
  {
    title: "操作人",
    minWidth: 100,
    key: "updater"
  },
  {
    title: "更新时间",
    minWidth: 160,
    key: "updateTime",
    render: (h, params) => {
      return h("div", _this.$moment(params.row.updateTime).format("YYYY-MM-DD HH:mm:ss"))
    }
  },

  {
    title: "操作",
    width: 220,
    fixed: "right",
    render(h, params) {
      const isEnable = params.row.ruleStatus - 0 === 0;
      const isStop = params.row.ruleStatus - 1 === 0;
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
                _this.goDetail(params.row.id, true);
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
              value: "business_strategy_edit"
            }],
            on: {
              click() {
                _this.goDetail(params.row.id, false);
              }
            }
          },
          "编辑"
        ),
        isEnable ?
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
                value: "business_strategy_open"
              }],
              on: {
                click() {
                  _this.changeStatus(params.row);
                }
              }
            },
            "启用"
          ) : "",
        isStop ?
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
                value: "business_strategy_stop"
              }],
              on: {
                click() {
                  _this.changeStatus(params.row);
                }
              }
            },
            "停用"
          ) : ""
      ]);
    }
  }
  ];
}

// 生成策略时段 todo
export const getPeriods = (that) => {
  const bizList = that.bizTypeList.length > 0 ? JSON.parse(JSON.stringify(that.bizTypeList)) : [];
  return {
    id: Math.random().toString().slice(2),
    periods: [],
    biz: bizList,
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
