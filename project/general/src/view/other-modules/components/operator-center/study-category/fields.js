export const recStatusList = [
  { label: "下架", value: "0" },
  { label: "上架", value: "1" }
]

export const inputList = [
  {
    name: "text-input",
    bind_key: "cateName",
    placeholder: "请输入分类标题",
    value: "",
    title: "分类标题",
    titleWidth: 100
  }
];

export const tableTitle = that => {
  return [
    {
      title: "序号",
      type: "index",
      width: 60,
      align: "center"
    },
    {
      title: "学习分类",
      key: "cateName",
      ellipsis: true,
      minWidth: 100
    },
    {
      title: "排序",
      key: "sortOrder",
      ellipsis: true,
      minWidth: 100
    },
    {
      title: "上架状态",
      key: "recStatus",
      ellipsis: true,
      minWidth: 100,
      render: (h, params) => {
        let f = recStatusList.find(it => it.value - params.row.recStatus === 0);
        return h("span", f ? f.label : "");
      }
    },
    {
      title: "操作",
      key: "action",
      width: 220,
      render: (h, params) => {
        const row = params.row;
        const { recStatus } = row;
        const isInit = recStatus - 0 === 0; // 下架
        const isOn = recStatus - 1 === 0; // 上架
        const buttonDesc = isInit ? "上架" : isOn ? "下架" : "";
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "primary",
                size: "small"
              },
              style: {
                "margin-right": "10px"
              },
              attrs: {
                ghost: "ghost"
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "study-category-edit"
                }
              ],
              on: {
                click: () => {
                  that.edit(params.row);
                }
              }
            },
            "编辑"
          ),
          h(
            "Button",
            {
              props: {
                type: "primary",
                size: "small"
              },
              style: {
                "margin-right": "10px"
              },
              attrs: {
                ghost: "ghost"
              },
              directives: [
                {
                  name: "hasAuth",
                  value: isInit ? "study-category-seton" : isOn ? "study-category-setoff" : ""
                }
              ],
              on: {
                click: () => {
                  that.isShelf(params.row);
                }
              }
            },
            `${buttonDesc}`
          )
        ]);
      }
    }    
  ]
}