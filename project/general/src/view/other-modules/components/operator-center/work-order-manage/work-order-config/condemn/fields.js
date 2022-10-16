/*
 * @Author: NapierPLUS
 * @Date: 2021-08-12 14:38:29
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-09-26 17:48:03
 * @Description:
 */
export const APPID = "520315b4d7524001a27a3bde5d052c51";

export const formsRules = _this => {
  return {
    citys: [
      { required: true, message: '城市不能为空', trigger: 'change', type: 'array' }
    ],
    state: [
      { required: true, message: '不能为空', trigger: 'change' }
    ],
    driverType: [
      { required: true, message: '司机类型不能为空', trigger: 'change', type: 'array' }
    ],
    bizNodes: [
      { required: true, message: '判责节点不能为空', trigger: 'change', type: 'array' }
    ],
    judge: {
      target: {
        type: [
          { required: true, message: '工单类型不能为空', trigger: 'change' }
        ],
        rules: [
          { required: true, message: '不能为空', trigger: 'change', type: 'array' }
        ],
      },
      illegal: [
        { required: true, message: '判责标准不能为空', trigger: 'change', type: 'array' }
      ],
      bizNodes: [
        { required: true, message: '判责节点不能为空', trigger: 'change', type: 'array' }
      ],
    },
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

export const violationLevelMap = {
    1:"特大",
    2:"重大",
    3:"较大",
    4:"一般",
    5:"轻微",
    6:"警告教育"
}

export const punishTypesMap = {
  1: "金额",
  2: "服务分",
  3: "课程学习",
  4: "警告",
}
