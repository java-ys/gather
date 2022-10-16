// 业务线类型
export const getServiceTypeName = (i) => {
  let map = {
    4: '快享',
    2: '专享',
    1: '出租车',
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
        title: '反馈时间',
        minWidth: 160,
        key: 'createTime',
        render: (h, params) => {
          return h('div', _this.$moment(params.row.createTime).format("YYYY-MM-DD HH:mm:ss"))
        }
      },


      {
        title: '业务标签',
        minWidth: 200,
        key: 'businessTagName'

      },
      {
        title: '问题标签',
        minWidth: 200,
        key: 'problemTagName'
      },
      {
        title: '问题描述',
        minWidth: 200,
        key: 'description'
      },

      {
        title: '问题照片',
        key: 'imageUrls',
        tooltip: true,
        width: 200,
        render: (h, params) => {
          let arr = params.row.imageUrls.map(item => {
            return h(
              'img', {
                style: {
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  marginRight: '10px',
                  display: item ? 'block' : 'none',
                  cursor: 'pointer'
                },
                attrs: {
                  src: item
                },
                on: {
                  click() {
                    _this.lookImg(item);
                  }
                }

              }
            )
          })
          return h('div', {
            style: {
              display: 'flex',
            }
          }, arr)
        }
      },
      {
        title: '反馈人',
        minWidth: 100,
        key: 'passengerName',
        render: (h, params) => {
          return h('div', params.row.passengerName || '---')
        }
      }, {
        title: '反馈手机号',
        minWidth: 100,
        render: (h, params) => {
          return h('Tooltip', {
            props: {
              content: params.row.passengerMobileAll || params.row.passengerMobile
            },
            style: {
              cursor: 'pointer'
            }
          }, params.row.passengerMobile)
        }
      }, {
        title: '版本号',
        minWidth: 160,
        key: 'appVersion'
      }
    ];
  }
}
