import { pushChannelMap } from "../../fields";
import { renderTel } from "../fields";
// 填空题答案统计数据
export const blankColumns = {
  columns(_this) {
    return [
      {
        type: "index",
        title: "序号",
        key: "configCode",
        align: "center"
      },
      {
        title: "手机号",
        key: "mobileNo",
        align: "center",
        render: (h, params) => {
          return h("div", renderTel(params.row.mobileNo))
        }
      },
      {
        title: "提交问卷时间",
        key: "submitTime",
        align: "center",
        render: (h, params) => {
          return h("div", _this.$moment(params.row.submitTime).format("YYYY/MM/DD HH:mm:ss"))
        }
      },
      {
        title: "答案文本",
        key: "answer",
        align: "center"
      },
      {
        title: "操作",
        align: "center",
        render(h, params) {
          return h("div", {
            style: {
              display: "flex",
            }
          }, [
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
                  value: "nps_send-answerDetail"
                }],
                on: {
                  click() {
                    _this.handleCheckAnswers(params.row)
                  }
                }
              },
              "查看答卷"
            )
          ]);
        }
      }
    ];
  }
}

// 答题详细统计数据
export const totalColumns = {
  columnsTotal(_this) {
    return [
      {
        type: "index",
        title: "序号",
        key: "configCode",
        align: "center"
      },
      {
        title: "手机号",
        key: "mobileNo",
        align: "center",
        render: (h, params) => {
          return h("div", renderTel(params.row.mobileNo))
        }
      },
      {
        title: "提交问卷时间",
        key: "submitTime",
        align: "center",
        render: (h, params) => {
          return h("div", _this.$moment(params.row.submitTime).format("YYYY/MM/DD HH:mm:ss"))
        }
      },
      {
        title: "来源",
        key: "channel",
        align: "center",
        render: (h, params) => {
          return h("div", pushChannelMap[params.row.channel])
        }
      },
      {
        title: "操作",
        align: "center",
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
                  size: "small"
                },
                class: {
                  tableBtn: true
                },
                directives: [{
                  name: "hasAuth",
                  value: "nps_send-deleteAnswer"
                }],
                on: {
                  click() {
                    _this.handleDelete(params.row.answerSnapshotId)
                  }
                }
              },
              "删除"
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
                  value: "nps_send-answerDetail"
                }],
                on: {
                  click() {
                    _this.handleCheckAnswers(params.row)
                  }
                }
              },
              "查看答卷"
            )
          ]);
        }
      }
    ];
  }
}
