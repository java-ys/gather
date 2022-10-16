/*
 * @Author: NapierPLUS
 * @Date: 2021-07-16 15:16:03
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-11-05 14:47:26
 * @Description:
 */

import { findLastIndex } from "lodash";
// 录音列表内容
export const audioTableColumns = that => {
  return [
    {
      title: "音频名称",
      key: "recordName",
      minWidth: 100
    },
    {
      title: "时间段",
      key: "recordSection",
      minWidth: 100
    },
    {
      title: "操作",
      key: "action",
      render: (createElement, params) => {
        const {
          row: {
            recordUrl
          }
        } = params;
        return createElement("div", {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }
        }, [
          createElement("audio", {
            style: {
              flex: 1,
              marginRight: "20px",
              paddingTop: "5px",
              paddingBottom: "5px"
            },
            attrs: {
              controls: true
            }
          }, [
            createElement("source", {
              attrs: {
                src: recordUrl,
                type: "audio/ogg"
              }
            })
          ]),
          createElement("a", {
            attrs: {
              download: recordUrl,
              href: recordUrl
            },
            style: {
              background: "#2D8cF0",
              color: "#ffffff",
              width: "100px",
              height: "30px",
              display: "flex",
              borderRadius: "10px",
              justifyContent: "center",
              alignItems: "center",
            }
          }, "下载")
        ],)
      }
    }
  ]
}

// 录音列表内容
export const audioSiChengColumns = that => {
  return [
    {
      title: "呼出时间",
      key: "callTime",
      width: 160
    },
    {
      title: "主叫",
      key: "callingPhone",
      width: 120
    },
    {
      title: "被叫",
      key: "calledPhone",
      width: 120
    },
    {
      title: "接听时间",
      key: "startTime",
      width: 160
    },
    {
      title: "呼出结果",
      key: "getThrough",
      width: 100,
      render: (h, params) => {
        const { row: { getThrough } } = params;
        return <div>{(getThrough === 1) ? '接通' : '未接通'}</div>
      }
    },
    {
      title: "通话时长(秒)",
      key: "callDuration",
      width: 120,
    },
    {
      title: "播放",
      key: "action",
      render: (createElement, params) => {
        const {
          row: {
            recordUrl
          }
        } = params;
        return createElement("div", {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }
        }, [
          createElement("audio", {
            style: {
              flex: 1,
              marginRight: "20px",
              paddingTop: "5px",
              paddingBottom: "5px"
            },
            attrs: {
              controls: true
            }
          }, [
            createElement("source", {
              attrs: {
                src: recordUrl,
                type: "audio/ogg"
              }
            })
          ]),
          // createElement("a", {
          //   attrs: {
          //     download: recordUrl,
          //     href: recordUrl
          //   },
          //   style: {
          //     background: "#2D8cF0",
          //     color: "#ffffff",
          //     width: "100px",
          //     height: "30px",
          //     display: "flex",
          //     borderRadius: "10px",
          //     justifyContent: "center",
          //     alignItems: "center",
          //   }
          // }, "下载")
        ],)
      }
    }
  ]
}
// 表格列数据
export const tableColumns = _this => {
  return [
    {
      title: "报警ID",
      key: "uuid",
      minWidth: 150
    },
    {
      title: "报警时间",
      key: "warnTime",
      minWidth: 160,
    //   render(h, parmas) {
    //     let map = {
    //       0: "否",
    //       1: "是"
    //     };
    //     return h("span", {}, map[parmas.row.policied]);
    //   }
    },
    {
      title: "违规类型",
      key: "illegalType",
      width: 100
    },
    {
      title: "是否订单内",
      key: "inOrder",
      width: 100,
      render(h, params) {
        return h("span", {}, params.row.inOrder === 1 ? "是" : "否")
      }
    },
    {
      title: "订单编号",
      key: "routeNo",
      minWidth: 180,
      render(h, params) {
        return h(
          "a",
          {
            on: {
              click() {
                const { routePlanId,  expandBizLine, typeModule } = params.row;
                if (!routePlanId) {
                  _this.$Message.info("暂无订单信息");
                  return;
                }
                if (typeModule===1) {
                  _this.$Message.info("出租车订单，无法跳转");
                  return;
                }
                let name = "order-detail"; 
                // if(expandBizLine === 2){  // 包车
                //     name = "chartered-order-detail";
                // }else {
                //     name = "order-detail"; 
                // }
                _this.$router.push({
                  // path: `${url}/${routePlanId}`
                  name: name,
                  params: { id: routePlanId }
                });
              }
            }
          },
          params.row.routePlanNo
        );
      }
    },
    {
      title: "图片",
      key: "sensitiveWords",
      align: "center",
      //   tooltip: true，
      render: (h, params) => {
        return h(
          "Tooltip",
          {
            props: {
              placement: "left"
            },
            style: {
              whiteSpace: "normal",
              maxHeight: "600px",
              overflow: "auto",
              textAlign: "center",
              paddingTop: "8px"
            },
          }, [
            h("div", {
              style: {
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              },
            }, params.row.pictures && params.row.pictures.length > 0 ? "查看" : ""),
            h("div", {
              slot: "content",
              style: {
                padding: "0 10px",
                whiteSpace: "normal",
                overflow: "auto",
                textAlign: "left",
                zIndex: "99999",
                display: "flex",
              },
            }, params.row.pictures && params.row.pictures.length > 0 ? pictureRenderer(h, params.row.pictures, _this) : "无")
          ]
        );
      }
    },
    {
      title: '视频',
      key: 'videos',
      align: 'center',
      render: (h, params) => {
        console.log(params);
        return <div onClick={() => _this.showVideoModal(params.row.videos)}>{ params.row.videos && params.row.videos.length > 0 ? '查看' : '' }</div>
      }
    }
  ];
};

const pictureRenderer = (h, list = [], _this) => {
  let arr = []
  for (let item of list) {
    arr.push(h("img", {
      style: {
        padding: "0 10px",
        height: "100px",
        flex: "0 0 80px",
      },
      attrs: {
        src: item.value
      },
      props: {
        src: item.value
      },
      on: {
        click() {
          //   todo
          _this.showHoverPic(item.value)
        }
      }
    }, "查看"))
  }
  return arr
}

// 无责标签
export const judgeLabelMap = [
    {
      "illegalCode": 1,
      "illegalType": "正常工单",
      "checked":false
    },
    {
      "illegalCode": 2,
      "illegalType": "视频缺失",
      "checked":false
    }, {
      "illegalCode": 3,
      "illegalType": "图片或视频识别错误",
      "checked":false
    },
    {
      "illegalCode": 4,
      "illegalType": "无法判责",
      "checked":false
    }, {
      "illegalCode": 99,
      "illegalType": "其他",
      "checked":false
    }
  ]

  export const violationLevelMap = {
    1:"特大",
    2:"重大",
    3:"较大",
    4:"一般",
    5:"轻微",
    6:"警告教育"
}
