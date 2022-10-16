import { checkHasBtn } from "@/libs/util";

// 经纬度和时间段
const updateCoordsAndTimeRange = obj => {
  if (obj.railType === 20) {
    const extAttr = obj.extAttr
      ? JSON.parse(obj.extAttr)
      : {
          centerPoints: [
            {
              lng: "",
              lat: ""
            }
          ],
          effectTimes: [{}]
        };
    obj.navCoords = [];
    obj.timeRanges = [];
    extAttr.centerPoints.forEach(item => {
      obj.navCoords.push(item);
    });
    extAttr.effectTimes.forEach(item => {
      obj.timeRanges.push({
        effectiveTime: item.startTime ? [item.startTime, item.endTime] : null
      });
    });
  } else if (obj.railType === 22) {
    const extAttr = obj.extAttr ? JSON.parse(obj.extAttr) : "";
    const { useLevelTypeList, voiceDoc } = extAttr;
    obj.useLevelTypeList = useLevelTypeList;
    obj.voiceDoc = voiceDoc;
  } else {
    obj.navCoords = [
      {
        lng: "",
        lat: ""
      }
    ];
    obj.timeRanges = [
      {
        effectiveTime: null
      }
    ];
    obj.useLevelTypeList = [];
    obj.voiceDoc = "";
  }
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
        title: "城市",
        key: "cityName",
        minWidth: 100,
        tooltip: true
      },

      {
        title: "创建时间",
        key: "createTime",
        minWidth: 160,
        tooltip: true
      },
      {
        title: "创建人",
        key: "creator",
        minWidth: 100,
        tooltip: true
      },

      {
        title: "操作时间",
        key: "updateTime",
        minWidth: 160,
        tooltip: true
      },
      {
        title: "操作人",
        key: "updater",
        minWidth: 100,
        tooltip: true
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 260,
        render: (h, params) => {
          const paramData = params.row;
          const { uuid } = paramData;
          let t = {
            style: !checkHasBtn("externalFee_control-copy") ? {display: 'none'} : {}
          }
          // ！！！！！指令设置权限会存在样式问题
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
                style: {
                  display: !checkHasBtn("externalFee_control-edit") ? "none" : "inline-block"
                },

                on: {
                  click: () => {
                    that.title = '编辑附加费配置'
                    that.updateType = 2;
                    that.invalidEditor = false;
                    that.isPop = true;
                    that.uuid = uuid;
                    const params = {
                      uuid
                    };
                    that.getDetail(params);
                  }
                }
              },
              "编辑"
            ),
            (<Button {...t} type={'info'} class={'tableBtn'} ghost={true} size={'small'}
                     onClick={() => that.copy(params.row)}
            >复制</Button>),
            h(
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
                style: {
                  display: !checkHasBtn("externalFee_control-detail") ? "none" : "inline-block"
                },
                on: {
                  click: () => {
                    that.title = '附加费配置详情'
                    that.invalidEditor = that.isPop = true;
                    that.updateType = 3;
                    that.uuid = uuid;
                    const params = {
                      uuid
                    };
                    that.getDetail(params);
                  }
                }
              },
              "详情"
            ),
            h(
              "Button",
              {
                class: {
                  tableBtn: true
                },
                props: {
                  type: "error",
                  ghost: true,
                  size: "small"
                },
                style: {
                  display: !checkHasBtn("externalFee_control-delete") ? "none" : "inline-block"
                },
                on: {
                  click: () => {
                    that.uuid = uuid;
                    const params = {
                      uuid
                    };
                    that.deleteItem(params);
                  }
                }
              },
              "删除"
            )
          ]);
        }
      }
    ]
  };
};
export const inputList = [
  {
    name: "drop-input",
    bind_key: "cityCode",
    placeholder: "请选择城市",
    value: "",
    dropList: [],
    title: "城市：",
    filterable: true,
    changeOnSelect: true,
    trigger: "click",
    multiple: false
  }
];
