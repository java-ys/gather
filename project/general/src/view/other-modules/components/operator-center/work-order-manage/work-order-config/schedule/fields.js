export const APPID = "520315b4d7524001a27a3bde5d052c51";

export const formsRules = _this => {
  return {
    test: [
      {
        required: true,
        type: "string",
        message: "请选择",
        trigger: "change",
        validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error("请选择"));
          } else {
            callback();
          }
        }
      }
    ],
    weeks: [
      {
        required: true,
        type: "array",
        message: "请选择",
        trigger: "change",
        validator: (rule, value, callback) => {
          if (!value.length) {
            callback(new Error("请选择"));
          } else {
            callback();
          }
        }
      }
    ]
  };
};
