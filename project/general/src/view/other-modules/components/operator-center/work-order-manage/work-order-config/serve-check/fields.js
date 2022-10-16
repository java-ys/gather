export const tableColumn = _this => [
  {
    title: "检核分类",
    key: "categoryFourthName",
    minWidth: 60
  },
  {
    title: "检核城市",
    key: "cityCodeList",
    tooltip: true,
    render: (h, { row }) => {
      // let cityStr = ""
      // row.cityCodeList.forEach(item => {
      //   _this.cityList.forEach(city => {
      //     console.log(item, city)
      //     if (item === city.value) {
      //       cityStr += city.label + ","
      //     }
      //   })
      // })

      let str1 = "" // tooltip显示
      let str2 = "" // table显示
      let rangeValue = row.cityCodeList
      if (rangeValue.length > 3) {
        rangeValue.forEach((item, index) => {
          _this.cityList.forEach(itemm => {
            if (item === itemm.value) {
              str1 += itemm.label + ","
              if (index < 3) {
                str2 += itemm.label + ","
              }
            }
          })
        })
        str1 = str1.substring(0, str1.length - 1)
        str2 = str2.substring(0, str2.length - 1) + "..."
      } else {
        rangeValue.forEach(item => {
          _this.cityList.forEach(itemm => {
            if (item === itemm.value) {
              str1 += itemm.label + ","
              str2 += itemm.label + ","
            }
          })
        })
        str1 = str1.substring(0, str1.length - 1)
        str2 = str2.substring(0, str2.length - 1)
      }
      // return (
      //   <div>{ cityStr.substring(0, cityStr.length - 1) }</div>
      // )
      return h("Tooltip", {
        props: {
          placement: "bottom"
        }
      }, [
        str2, // table表格显示
        h("span", {
          slot: "content",
          style: {
            whiteSpace: "normal",
            wordBreak: "break-all"
          }
        }, str1) // Tooltip 显示
      ])
    }
  },
  {
    title: "司机范围",
    key: "driverRange",
    tooltip: true,
    render: (h, { row }) => {
      const { rangeType, rangeValue } = row.driverRange
      let str1 = "" // tooltip显示
      let str2 = "" // table显示
      if (rangeType === 1) {
        if (rangeValue.length > 3) {
          rangeValue.forEach((item, index) => {
            _this.agentList.forEach(itemm => {
              if (item === itemm.agentUuid) {
                str1 += itemm.agentName + ","
                if (index < 3) {
                  str2 += itemm.agentName + ","
                }
              }
            })
          })
          str1 = str1.substring(0, str1.length - 1)
          str2 = str2.substring(0, str2.length - 1) + "..."
        } else {
          rangeValue.forEach(item => {
            _this.agentList.forEach(itemm => {
              if (item === itemm.agentUuid) {
                str1 += itemm.agentName + ","
                str2 += itemm.agentName + ","
              }
            })
          })
          str1 = str1.substring(0, str1.length - 1)
          str2 = str2.substring(0, str2.length - 1)
        }
      } else if (rangeType === 2) {
        if (rangeValue.length > 3) {
          rangeValue.forEach((item, index) => {
            driverTypes.forEach(itemm => {
              if (item === itemm.value) {
                str1 += itemm.label + ","
                if (index < 3) {
                  str2 += itemm.label + ","
                }
              }
            })
          })
          str1 = str1.substring(0, str1.length - 1)
          str2 = str2.substring(0, str2.length - 1) + "..."
        } else {
          rangeValue.forEach(item => {
            driverTypes.forEach(itemm => {
              if (item === itemm.value) {
                str1 += itemm.label + ","
                str2 += itemm.label + ","
              }
            })
          })
          str1 = str1.substring(0, str1.length - 1)
          str2 = str2.substring(0, str2.length - 1)
        }
      }
      // return (
      //   <div>{ str.substring(0, str.length - 1) }</div>
      // )
      return h("Tooltip", {
        props: {
          placement: "bottom"
        }
      }, [
        str2, // table表格显示
        h("span", {
          slot: "content",
          style: {
            whiteSpace: "normal",
            wordBreak: "break-all"
          }
        }, str1) // Tooltip 显示
      ])
    }
  },
  {
    title: "操作",
    key: "actions",
    width: 130,
    fixed: "right",
    render: (h, { row }) => {
      const status = !!row.openCheckConfig
      if (!status) {
        return (
          <Row type="flex">
            <Col>
              <Button
                v-if="status"
                type="success"
                ghost
                size="small"
                v-hasAuth="serve-check-enable"
                onClick={() => _this.onChangeStatus(row)}
              >
                开启
              </Button>
            </Col>
            <Col offset="1">
              <Button
                type="primary"
                ghost
                size="small"
                v-hasAuth="serve-check-edit"
                onClick={() => _this.onDetailModal(row)}
              >
                编辑
              </Button>
            </Col>
          </Row>
        );
      } else {
        return (
          <Row type="flex">
            <Col>
              <Button
                v-if="!status"
                type="error"
                ghost
                size="small"
                v-hasAuth="serve-check-disable"
                onClick={() => _this.onChangeStatus(row)}
              >
                关闭
              </Button>
            </Col>
            <Col offset="1">
              <Button
                type="primary"
                ghost
                size="small"
                v-hasAuth="serve-check-edit"
                onClick={() => _this.onDetailModal(row)}
              >
                编辑
              </Button>
            </Col>
          </Row>
        );
      }
    }
  }
];



// 司机类型
export const driverTypes = [
  {
    label: "自营司机",
    value: "10",
  },
  {
    label: "自营-主司机",
    value: "20",
  },
  {
    label: "自营-副司机",
    value: "30",
  },
  {
    label: "自营-顶班司机",
    value: "40",
  },
  {
    label: "UP司机",
    value: "50",
  },
  {
    label: "UP-主司机",
    value: "60",
  },
  {
    label: "UP-副司机",
    value: "70",
  },
  {
    label: "UP-顶班司机",
    value: "80",
  },
  {
    label: "UP-带车加盟",
    value: "90",
  },
];
// 检核分类
export const checkTypes = [
  {
    label: "核对手机尾号",
    value: "J00011",
  },
  {
    label: "下车提醒",
    value: "J00012",
  },
  {
    label: "目的地确认",
    value: "J00013",
  }
]

// 取消类型
export const cancelTypes = [
  {
    label: "乘客无责取消",
    value: 0,
  },
  {
    label: "乘客政策免费取消",
    value: 1,
  },
  {
    label: "乘客使用免费次数取消",
    value: 2,
  },
  {
    label: "乘客付费取消",
    value: 3,
  },
  {
    label: "超时自动取消",
    value: 4,
  },
  {
    label: "客服关闭订单",
    value: 5,
  },
];

// 取消原因
export const cancelReasons = [
  {
    label: "暂不需要用车",
    value: 0,
  },
  {
    label: "临时改变行程",
    value: 1,
  },
  {
    label: "等待时间太迟",
    value: 2,
  },
  {
    label: "司机不愿意来",
    value: 3,
  },
  {
    label: "其他",
    value: 4,
  },
];

// 订单状态
export const orderStatus = [
  {
    label: "待评价",
    value: 0,
  },
  {
    label: "待付款",
    value: 1,
  }
  // ,
  // {
  //   label: '已完成',
  //   value: 2,
  // },
];
// 星级评价
export const levelList = [
  {
    label: "一星",
    value: 1,
  },
  {
    label: "二星",
    value: 2,
  },
  {
    label: "三星",
    value: 3,
  },
  {
    label: "四星",
    value: 4,
  },
  {
    label: "五星",
    value: 5,
  },
];

export const freeze = (o = {}) => {
  return Object.freeze(o);
};
