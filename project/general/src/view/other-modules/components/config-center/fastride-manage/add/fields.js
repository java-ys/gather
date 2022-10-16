export const numToArray = n => Array.from({ length: n }).map((item, index) => index);
import { mapToList, timeFormat } from "@/libs/util.js";

export const weekMap = {
  1: "周一",
  2: "周二",
  3: "周三",
  4: "周四",
  5: "周五",
  6: "周六",
  7: "周日",
}
export const weekList = mapToList(weekMap)

// 选择新用户群-画像系统
export const userGroupColumnsNew = (that) => {
  return [
    {
      title: "序号",
      type: "index",
      width: 60
    },
    {
      title: "用户群名称",
      key: "userGroupName",
      tooltip: true,
      ellipsis: true
    },
    {
      title: "用户群编码",
      key: "userGroupCode",
      tooltip: true,
      ellipsis: true
    },
    // {
    //   title: "是否动态更新",
    //   key: "dynamicUpdate",
    //   width: 120,
    //   render: (h, params) => {
    //     return h("div", params.row.dynamicUpdate === 1 ? "是" : "否");
    //   }
    // },
    // {
    //   title: "用户群人数",
    //   key: "userGroupCount",
    //   width: 120,
    // },
    {
      title: "操作",
      key: "action",
      width: 80,
      render: (h, params) => {
        let a = h(
          "Button",
          {
            props: {
              type: "text",
              size: "small"
            },
            style: {
              color: "#57a3f3"
            },
            on: {
              click: () => {
                setTimeout(() => {
                  console.log(that.isDetail)
                  console.log("delindex", that.delGroupIndex)
                  that.addForm.groupDtoList[that.delGroupIndex].userGroupArray.splice(params.index, 1);
                }, 0);

              }
            }
          },
          "删除"
        )
        if (!that.isDetail) {
          return h("div", [a]);
        }
      }
    }
  ];
};

// 校验策略生效日期
const validatorTime = (rule, value, callback) => {
  let date = value;
  if (!date[0] && !date[1]) {
    callback(new Error("请选择"));
  }
  let startTime = new Date(timeFormat(value[0], "yyyy-mm-dd")).getTime();
  let endTime = new Date(timeFormat(value[1], "yyyy-mm-dd")).getTime()
  if (startTime >= endTime) {
    callback(new Error("开始时间必须小于结束时间"));
  } else {
    callback();
  }
}
// 校验策略名称
const validatorName = (rule, value, callback) => {
  if (!value) {
    callback(new Error("名称不能为空"));
  }
  else if (value.indexOf(" ") > -1) {
    callback(new Error("不能输入空格"));
  }
  else {
    callback();
  }
}

export const validateRules = {
  ruleName: [{ required: true, validator: validatorName, trigger: "change" }],
  cityCode: [{ required: true, message: "请选择", trigger: "change" }],
  dateTimeValue: [{ required: true, validator: validatorTime, trigger: "change" }],
  expandBizLine: [{ required: true, type: "number", message: "请选择", trigger: "change" }],
};