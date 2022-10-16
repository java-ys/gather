export const fields = {
  inputList: [
    {
      name: "drop-input",
      bind_key: "supplierType",
      placeholder: "请选择",
      value: "",
      dropList: [
        {
          value: "车辆供应商0",
          label: "车辆供应商"
        },
        {
          value: "能源供应商2",
          label: "能源供应商"
        },
        {
          value: "配件供应商3",
          label: "配件供应商"
        },
        {
          value: "地推4",
          label: "地推供应商"
        },
        {
          value: "自动驾驶车辆供应商5",
          label: "自动驾驶车辆供应商"
        },
      ],
      title: "供应商类型：",
      titleWidth: 72,
    },
    {
      name: "text-input", // 远程输入框
      bind_key: "supplierName", // 返回数据的key名
      placeholder: "请输入",
      value: "", // 用于数据绑定
      title: "供应商名称：", // 展示的字段名
      // remoteMethod: function () {
      //
      // }, // 远程输入框输入时触发方法
      titleWidth: 72,
      // remoteList: []
    },
    {
      name: "text-input", // 远程输入框
      bind_key: "supplierCode", // 返回数据的key名
      placeholder: "请输入",
      value: "", // 用于数据绑定
      title: "供应商编码：", // 展示的字段名
      // remoteMethod: function () {
      //
      // }, // 远程输入框输入时触发方法
      titleWidth: 72,
      // remoteList: []
    },
    {
      name: "drop-input",
      bind_key: "supplierMethod",
      placeholder: "请选择",
      value: "",
      dropList: [],  // 根据供应商类型动态切换dropList
      title: "供应方式：",
      titleWidth: 72
    },
    // {
    //   name: "drop-input",
    //   bind_key: "cityCode",
    //   placeholder: "请选择",
    //   value: "",
    //   dropList: [],  // 调用城市接口
    //   title: "城市：",
    //   filterable: true,
    // },
    {
      name: "cascader-input",
      bind_key: ["provinceCode", "orgCode"], // 返回数据的key名
      placeholder: "请选择城市",
      value: [], // 绑定返回数据
      cascaderList: [], // 级联列表
      title: "城市：", // 展示的字段名
      changeOnSelect: false,
      titleWidth: 72,
      // inputWidth: 165
    },
    {
      name: "drop-input",
      bind_key: "enableFlag",
      placeholder: "请选择",
      value: "",
      dropList: [{
        value: "1",
        label: "启用"
      },
        {
          value: "2",
          label: "停用"
        },
      ],
      titleWidth: 72,
      title: "状态："
    },
    // {
    //   name: "date-time-input", // 日期选择
    //   bind_key: ["createBeginDate", "createEndDate"], // 返回数据的key名
    //   placeholder: "请选择",
    //   value: "", // 用于数据绑定
    //   title: "创建时间", // 展示的字段名
    //   format: "yyyy-MM-dd HH:mm:ss",
    //   titleWidth: 72,
    //   inputWidth: 290
    // },
    {
      name: "text-input", // 远程输入框
      bind_key: "linkName", // 返回数据的key名
      placeholder: "请输入",
      value: "", // 用于数据绑定
      title: "联系人：", // 展示的字段名
      // remoteMethod: function () {
      //
      // }, // 远程输入框输入时触发方法
      titleWidth: 72,
      // remoteList: []
    },
    {
      name: "text-input", // 远程输入框
      bind_key: "telephone", // 返回数据的key名
      placeholder: "请输入",
      value: "", // 用于数据绑定
      title: "联系人电话：", // 展示的字段名
      // remoteMethod: function () {
      //
      // }, // 远程输入框输入时触发方法
      titleWidth: 72,
      // remoteList: []
    },
    {
      name: "date-time-input", // 日期选择
      bind_key: ["createBeginDate", "createEndDate"], // 返回数据的key名
      placeholder: "请选择",
      value: "", // 用于数据绑定
      title: "创建时间", // 展示的字段名
      format: "yyyy-MM-dd HH:mm:ss",
      titleWidth: 72,
      inputWidth: 290
    },
  ]
}
