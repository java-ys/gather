// 业务线类型
export const getServiceTypeName = (i) => {
  let map = {
    4: '快享',
    2: '专享',
    1: '出租车',
  }
  return map[i];
}
// 状态
export const getStatusName = (i) => {
  let map = {
    0: '未启用',
    2: '未启用',
    1: '已启用',
  }
  return map[i];
}
// 用户群状态
export const getGroupStatusName = (i) => {
  let map = {
    0: '下线',
    1: '上线',
    2: '下线待审核',
    3: '废弃',
    4: '上线待审核',
    5: '废弃待审核',
  }
  return map[i];
}
// 校验日期
export const validatorTime = (rule, value, callback) => {
  let date = value;
  if (!date) {
    callback(new Error("必选"));
  }
  let timestamp = new Date(date).getTime();
  if (timestamp < Date.now()) {
    callback(new Error("生效时间不得小于当前时间"));
  } else {
    callback();
  }
}
export const getStatusDisapatch = (val)=>{
  console.log(typeof val,"val",val);
  return val?"是":"否"
};

export const getStatusDisapatchNames = (absolutelyDispatch,nearbyDispatch)=>{
  const arrnames = []
  if(absolutelyDispatch){
    arrnames.push(absolutelyDispatch)
  }
  if(nearbyDispatch){
    arrnames.push(nearbyDispatch)
  }
  return arrnames.join("、")
};

// 列表数据
export const listColumns = {
  columns(_this) {
    return [{
        title: '序号',
        width: 80,
        render(h, params) {
          return h('span', {}, (_this.current - 1) * _this.pageSize + params.index + 1);
        }
      },
      {
        title: '城市',
        minWidth: 100,
        key: 'cityName'
      },
      // {
      //   title: '产品线',
      //   minWidth: 200,
      //   render: (h, params) => {
      //     return h('div', getServiceTypeName(params.row.productLine))
      //   }
      // }, 
      {
        title: '状态',
        minWidth: 100,
        render: (h, params) => {
          return h('div', getStatusName(params.row.useStatus))
        }
      },
      {
        title: '策略类型',
        minWidth: 150,
        render: (h, params) => {
          return h('div', "用户群绝对优先派单策略")
        }
        // render: (h, params) => {
        //   return h('div', getStatusDisapatchNames(params.row.absolutelyDispatch,params.row.nearbyDispatch))
        // }
      },
      
      {
        title: '更新时间',
        minWidth: 160,
        render: (h, params) => {
          return h('div', _this.$moment(params.row.updateTime).format("YYYY-MM-DD HH:mm:ss"))
        }
      },
      {
        title: '操作人',
        minWidth: 100,
        key: 'updater'
      },
      {
        title: '操作',
        width: 220,
        fixed: 'right',
        render(h, params) {
          return h('div', {
            style: {
              display: 'flex',
            }
          }, [
            h(
              'Button', {
                props: {
                  type: 'success',
                  ghost: true,
                  size: 'small'
                },
                class: {
                  tableBtn: true
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'userPreference_control-detail'
                }],
                on: {
                  click() {
                    _this.goDetail(params.row);
                  }
                }
              },
              '详情'
            ),
            h(
              'Button', {
                props: {
                  type: 'primary',
                  ghost: true,
                  size: 'small'
                },
                class: {
                  tableBtn: true
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'userPreference_control-edit'
                }],
                on: {
                  click() {
                    _this.goEdit(params.row);
                  }
                }
              },
              '编辑'
            ),
            h(
              'Button', {
                props: {
                  type: params.row.useStatus === 1 ? 'error' : 'success',
                  ghost: true,
                  size: 'small'
                },
                class: {
                  tableBtn: true
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'userPreference_control-enable'
                }],
                on: {
                  click() {
                    _this.updateStatus(params.row);
                  }
                }
              },
              params.row.useStatus === 1 ? '停用' : '启用'
            ),

          ]);
        }
      }
    ];
  }
}
// 用户群列表数据
export const userColumns = {
  columns(_this) {
    return [{
        title: '用户群名称',
        minWidth: 200,
        key: 'groupName'
      },
      {
        title: '状态',
        minWidth: 100,
        render: (h, params) => {
          return h('div', getGroupStatusName(params.row.crowdState))
        }
      },
      {
        title: '启用绝对优先派单',
        minWidth: 100,
        render: (h, params) => {
          return h('div', getStatusDisapatch(params.row.absolutelyDispatch))
        }
      },
      {
        title: '启用就近派单策略',
        minWidth: 100,
        render: (h, params) => {
          return h('div', getStatusDisapatch(params.row.nearbyDispatch))
        }
      },
      {
        title: '操作',
        width: 150,
        render(h, params) {
          return h('div', {
            style: {
              display: 'flex',
            }
          }, [

            h(
              'Button', {
                props: {
                  type: 'primary',
                  ghost: true,
                  size: 'small'
                },
                class: {
                  tableBtn: true
                },
                on: {
                  click() {
                    _this.goEdit(params.row);
                  }
                }
              },
              '编辑'
            ),
            h(
              'Button', {
                props: {
                  type: 'error',
                  ghost: true,
                  size: 'small'
                },
                class: {
                  tableBtn: true
                },
                on: {
                  click() {
                    _this.deleteItem(params.row);
                  }
                }
              },
              '移除'
            ),

          ]);
        }
      }
    ];
  }
}
// 用户群列表数据
export const userDetailColumns = {
  columns(_this) {
    return [{
        title: '用户群名称',
        minWidth: 200,
        key: 'groupName'
      },
      {
        title: '状态',
        minWidth: 100,
        render: (h, params) => {
          return h('div', getGroupStatusName(params.row.crowdState))
        }
      },
      {
        title: '启用绝对优先派单',
        minWidth: 150,
        render: (h, params) => {
          return h('div', getStatusDisapatch(params.row.absolutelyDispatch))
        }
      },
      {
        title: '启用就近派单策略',
        minWidth: 150,
        render: (h, params) => {
          return h('div', getStatusDisapatch(params.row.nearbyDispatch))
        }
      },
    ];
  }
}


// 根据城市查询省份i
export const getProvinceIdByCityUuid = (cityCode, list) => {
  let provinceId = "";
  debugger
  list.forEach(item => {
    if (item.children) {
      item.children.forEach(it => {
        if (it.cityID === cityCode) {
          provinceId = item.cityID;
        }
      });
    }
  });
  return provinceId;
}
// 查询省份名
export const getProvinceNameByCityUuid = (cityUuid, cityName, list) => {
  let provinceName = "";
  list.forEach(item => {
    if (item.children) {
      item.children.forEach(it => {
        if (it.cityUuid === cityUuid) {
          provinceName = it.province;
        }
      });
    }
  });
  return provinceName === cityName ? "" : provinceName + " / ";
}