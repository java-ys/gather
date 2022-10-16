/* 消息模板管理 */
export const returnFieldsManage = that => {
  return {
    uuid: {
      title: "ID",
      key: "uuid",
      type: "index",
      tooltip: true
    },
    protocolName: {
      title: "模板标题",
      key: "title"
    },
    protocolVersion: {
      title: "模板内容",
      key: "value"
    },
    updateRule: {
      title: "添加时间",
      key: "createTime"
    },
    action: {
      title: "操作",
      key: "action",
      width: 200,
      fixed: "right",
      render: (h, params) => {
        return h("div", {}, [
          h(
            "a",
            {
              style: {
                color: "#ff8533"
              },
              on: {
                click: () => {
                  let item = params.row;
                  that.edit_form.title = item.title;
                  that.edit_form.content = item.value;
                  that.edit_form.uuid = item.uuid;
                  that.edit_modal = true;
                }
              }
            },
            "详情"
          ),
          h(
            "a",
            {
              style: {
                marginLeft: "15px",
                color: "#ff8533"
              },
              on: {
                click: () => {
                  let id = params.row.uuid;
                  that.handleDelete(id);
                }
              }
            },
            "删除"
          )
        ]);
      }
    }
  };
};
