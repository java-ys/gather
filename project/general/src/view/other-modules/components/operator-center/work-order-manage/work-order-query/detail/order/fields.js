let channelMap = {
  1: "APP移动端",
  2: "微信公众号",
  3: "电话叫车",
  4: "PC网站",
  5: "后台下单",
  6: "扬招",
  7: "高德",
  8: "微信小程序",
  9: "首约",
  10: "苏宁",
  11: "招商",
  12: "车巴达",
  13: "易企",
  14: "支付宝小程序",
  15: "平安",
  16: "旗妙",
  17: "同程",
  18: "凤凰有车",
  19: "H5",
  20: "阿里",
  21: "美团",
  22: "租租车",
  23: "东航",
  24: "分贝通",
  25: "广州悦行",
  26: "胜意科技",
  27: "掌上高铁",
  28: "销巴科技",
  29: "差旅壹号",
  30: "车城智行",
  31: "招行总部",
  32: "携程",
  33: "航旅纵横",
  34: "汽车之家",
  35: "差旅天下",
  36: "德邦",
  37: "华为",
  38: "招行总部（非外包）",
  39: "携程接送机",
  40: "易派客",
  41: "同程分销",
}

let orderType = {
  1: "实时",
  2: "预约"
}
let orderLine = {
  1: "出租车",
  2: "专车",
  4: "快车",
  6: "惠享",
  7: "自动驾驶",
}
export const columns = _this => {
  return [
    {
      title: "订单编号",
      key: "routeNo",
      width: 220,
      render: (h, {row}) => {
        return (<div><span style={"color: #2d8cf0; cursor: pointer;"} onClick={() => _this.toOrderDetail(row)}>{row.routeNo}</span></div>)
      }
    },
    {
      title: "订单类型",
      key: "typeTime",
      width: 120,
      render: (h, {row}) => {
        return (<span>{orderType[row.typeTime]}</span>)
      }
    },
    {
      title: "产品线",
      key: "typeModule",
      width: 120,
      render: (h, {row}) => {
        return (<span>{orderLine[row.typeModule]}</span>)
      }
    },
    {
      title: "订单来源",
      key: "source",
      width: 120,
      render: (h, {row}) => {
        return (<span>{channelMap[row.source]}</span>)
      }
    }, {
      title: "问题描述",
      key: "illegalMsg",
      minWidth: 220
    }, {
      title: "司乘通话录音",
      key: "",
      width: 160,
      render: (h, {row}) => {
        // routeNo 行程编号 routeId 行程id
        return (<div><span style={"color: #2d8cf0; cursor: pointer;"}
                           onClick={() => _this.scClick(row)}>查看</span></div>)
      }
    },
    {
      title: "行程中录音",
      key: "",
      width: 160,
      render: (h, {row}) => {
        return (<div><span style={"color: #2d8cf0; cursor: pointer;"}
                           onClick={() => _this.audioClick(row)}>查看</span></div>)
      }
    },
    {
      title: "视频",
      key: "",
      width: 120,
      render: (h, {row}) => {
        return (<div><span style={"color: #2d8cf0; cursor: pointer;"}
                           onClick={() => _this.videoClick(row)}>查看</span></div>)
      }
    },
    {
      title:"操作",
      key:"action",
      width: 140,
      render: (h, { row, index }) => {
        _this.tableData[index]._checked = row._checked = row.judgeResult - 1 === 0;
        let attr = {
          props: {
            disabled: !row.editFlag,
            value: row._checked
          },
          on: {
            input: function(val) {
              _this.tableData[index]._checked = attr.props.value = val;
            },
          }}; // 是否可编辑 bool  judgeResult 1 有责 2 无责
        return (<div><Checkbox  {...attr}>有责</Checkbox></div>)
      }
    }
    ]
};
