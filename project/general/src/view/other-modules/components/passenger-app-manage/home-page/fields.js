import {getDirectives} from "@/mixins/base"
// 终端列表
export const terminalList = [{label: 'APP', value: 0}, {label: '微信小程序', value: 1}];
export const terminalDesc = ["APP", "微信小程序"]
// 状态列表
export const statusList = [{label: '待生效', value: 0}, {label: '已生效', value: 1}, {label: '已失效', value: 2}];
export const statesDesc = ["待生效", '已生效', '已失效']
export const styleList = ["默认风格", "自定义风格1", "自定义风格2"];
export const themeId_to_index = {
  "3": "1",
  "1": "0",
  "2": "2",
}
export const inputList = [
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'strategyName', // 返回数据的key名
    placeholder: '请输入',
    value: '', // 用于数据绑定
    title: '策略名称：',
  },
  {
    name: 'drop-input',
    title: '选择终端：',
    bind_key: 'terminal',
    filterable: true,
    value: "",
    titleWidth: 60,
    inputWidth: 165,
    dropList: terminalList,
  },
  {
    name: 'drop-input',
    title: '选择菜单：',
    titleWidth: 70,
    value: '',
    bind_key: 'menu',
    dropList: [],
  },
  {
    name: 'drop-input',
    title: '状态：',
    titleWidth: 70,
    value: '',
    bind_key: 'configStatus',
    dropList: statusList,
  },
];

export const tableColumns = _this => {
  return [
    {
      title: '策略名称',
      key: 'strategyName',
      minWidth: 200,
    },
    {
      title: '终端',
      key: 'terminal',
      minWidth: 160,
      render: (h, {row}) => {
        let ll = row.terminal.split(",")
        let desc = ll.map(k => (terminalDesc[k])).join(", ");
        return (<span>{desc}</span>)
      }
    },
    {
      title: '菜单',
      key: 'menu',
      minWidth: 180,
      render: (h, {row}) => {
        let f = _this.allMenuList.find(it => `${it.value}` === `${row.menu}`)
        return (<span>{f ? f.label: ""}</span>)
      }
    },
    {
      title: '风格',
      key: 'style',
      minWidth: 180,
      render: (h, {row}) => {
        let style = {}
        try {
          style = JSON.parse(row.style)
        } catch {
          style = {}
        }
        return (<span>{styleList[themeId_to_index[style.themeId]]}</span>)
      }
    },
    // {
    //   title: '有效期',
    //   key: 'updateTime',
    //   width: 320,
    //   render: (h, {row}) => {
    //     return (
    //       <span>
    //         {row.startDate} - {row.endDate}
    //       </span>
    //     );
    //   },
    // },
    {
      title: '状态',
      key: 'configStatus',
      minWidth: 180,
      render: (h, {row}) => {
        return (
          <span>
            {statesDesc[row.configStatus]}
          </span>
        );
      },
    },
    {
      title: '操作人',
      key: 'creator',
      minWidth: 120,
    },
    {
      title: '操作时间',
      key: 'updateTime',
      minWidth: 180,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 200,
      key: 'operation',
      render: (h, {row}) => {
        // let types = row.taskStatus - 1 === 0 ? "error" : "success"
        // let t = {props: {type: types}}
        let canDelete = row.configStatus - 0 === 0;
        let canTakeDown = row.configStatus - 1 === 0
        return (
          <Row type="flex">
            <Col offset="1">
              <Button
                {...getDirectives('home-page-open')}
                ghost
                type="primary"
                size="small"
                onClick={() => _this.showRow (row)}
              >
                查看
              </Button>
            </Col>
            {canDelete ? <Col offset="1">
              <Button
                {...getDirectives('home-page-delete')}
                ghost
                type="error"
                size="small"
                onClick={() => _this.deleteRow (row)}
              >
                删除
              </Button>
            </Col> : null }
            {canDelete ? <Col offset="1">
              <Button
                {...getDirectives('home-page-up')}
                ghost
                type="success"
                size="small"
                onClick={() => _this.takeUp (row)}
              >
                上架
              </Button>
            </Col> : null }
            {canTakeDown ? <Col offset="1">
              <Button
                {...getDirectives('home-page-down')}
                ghost
                size="small"
                type="warning"
                onClick={() => _this.takeDown (row)}
              >
                下架
              </Button>
            </Col> : null }
          </Row>
        );
      },
    },
  ];
};


export const pageConfig = [
  {
    "themeId": "1",
    "pin":
      {
        "color": "#FF8533",
        "tipColor": "#662E08",
        "txtColor": "#FFFFFF",
        "adsorbColor": "#D34E1B"
      },
    "notFinish":
      {
        "image": "https://obs-m2propublic.m2cn.cn/common-app-api/images/95a6581e-75c5-40db-9496-69f695869f8b.png",
        "txtColor": "#FFFFFF"
      },
    "bgImage": "https://obs-m2propublic.m2cn.cn/common-app-api/images/bb157c9b-6eea-4e9f-820d-2e510b06da13.png",
    "notice":
      {
        "txtColor": "#777A84",
        "bigTxtColor": "#FF8533",
        "emptyImage": "https://obs-m2propublic.m2cn.cn/passenger-web-api/c_car.png",
        "defaultContent": "Hi~欢迎使用m2运营"
      },
    "start":
      {
        "color": "#4D5575",
        "bigColor": "#FF8533"
      },
    "end":
      {
        "bigColor": "#1D2232",
        "bgColor": "#0D006BF8"
      },
    "recommend":
      {
        "bgColor": "#4DFFE7D6",
        "borderColor": "#80FF8533",
        "txtColor": "#996220"
      },
    "common":
      {
        "txtColor": "#777A84",
        "separatorLine": "#D7D8DE"
      }
  },
  {
    "themeId": "3",
    "pin":
      {
        "color": "#FC4850",
        "tipColor": "#662E08",
        "txtColor": "#FFFFFF",
        "adsorbColor": "#D34E1B"
      },
    "notFinish":
      {
        "image": "https://obs-m2propublic.m2cn.cn/passenger-web-api/c_bg_03.png",
        "txtColor": "#FFFFFF"
      },
    "bgImage": "https://obs-m2propublic.m2cn.cn/passenger-web-api/c_bg_01.png",
    "addressBgImage": "https://obs-m2propublic.m2cn.cn/passenger-web-api/c_bg_02.png",
    "notice":
      {
        "txtColor": "#FFFFFF",
        "bigTxtColor": "#FF8533",
        "emptyImage": "https://obs-m2propublic.m2cn.cn/passenger-web-api/c_car.png",
        "arrowColor": "#FFFFFF",
        "defaultContent": "Hi~欢迎使用m2运营"
      },
    "start":
      {
        "color": "#4D5575",
        "bigColor": "#FF8533",
        "arrowColor": "#A5A7AD"
      },
    "end":
      {
        "bigColor": "#1D2232",
        "borderColor": "#0D006BF8",
        "bgColor": "#0D006BF8"
      },
    "recommend":
      {
        "bgColor": "#4DFFE7D6",
        "borderColor": "#80FF8533",
        "txtColor": "#996220",
        "iconColor": "#996220"
      },
    "common":
      {
        "txtColor": "#777A84",
        "iconColor": "#B3B5BA",
        "separatorLine": "#334D5575"
      }
  },
  {
    "themeId": "2",
    "pin":
      {
        "color": "#FCAE7A",
        "tipColor": "#99460F",
        "txtColor": "#642E06",
        "adsorbColor": "#3B425D"
      },
    "notFinish":
      {
        "image": "https://obs-m2propublic.m2cn.cn/passenger-web-api/b_bg_03.png",
        "txtColor": "#311602"
      },
    "bgImage": "https://obs-m2propublic.m2cn.cn/passenger-web-api/b_bg_01.png",
    "addressBgImage": "https://obs-m2propublic.m2cn.cn/passenger-web-api/b_bg_02.png",
    "notice":
      {
        "txtColor": "#32251D",
        "bigTxtColor": "#99460F",
        "emptyImage": "https://obs-m2propublic.m2cn.cn/passenger-web-api/b_car.png",
        "arrowColor": "#32251D",
        "defaultContent": "Hi~欢迎使用m2专享"
      },
    "start":
      {
        "color": "#FFEFE4",
        "bigColor": "#FFCEAD",
        "arrowColor": "#FFEFE4"
      },
    "end":
      {
        "bigColor": "#FFE7D6",
        "borderColor": "#E6FFCEAD",
        "bgColor": "#0DFFFFFF"
      },
    "recommend":
      {
        "bgColor": "#33FFE2CE",
        "borderColor": "#80FFB380",
        "txtColor": "#FFCEAD",
        "iconColor": "#FFCEAD"
      },
    "common":
      {
        "txtColor": "#FFE7D6",
        "iconColor": "#FFE7D6",
        "separatorLine": "#4DFFEFE4"
      }
  }
]
