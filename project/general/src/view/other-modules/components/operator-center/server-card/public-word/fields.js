export const parColumns = that => {
  return [
    {
      title: '序号',
      type: "index",
      width: 70,
      align: "center"
    },
    {
      title: "服务资质",
      key: "qualificationContent",
      minWidth: 180,
    },
    {
      title: "宣传文案配置",
      key: "publicityDesc",
      minWidth: 420,
      render: (h, { row }) => {
        let content = row.publicityDesc
        if(content){
          content = content.replace( /\n/ig, ' ' )
          if (content.length > 80){
            content = content.slice( 0, 58 )+'...'
          }
        }
        return h("div", content);
      }
    },
    {
      title: "操作",
      key: "action",
      tooltip: true,
      fixed: "right",
      width: 120,
      slot: "action"
    }
  ];
};
