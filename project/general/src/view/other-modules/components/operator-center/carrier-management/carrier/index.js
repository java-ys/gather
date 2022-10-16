import { deleteCarrier } from "_o/api/operator-carrier"
import { mapToList } from "@/libs/util.js";

const isMonitorAuthMap = {
  1: "是",
  0: "否"
}

export const agentModeMap = {
  "1": "A模式",
  "2": "UP模式",
  "3": "P模式",
  // "88": "巡网出租车",
}
export const agentModeDataList = mapToList(agentModeMap, "string")

export const returnFields = (that) => {
  return {
    current: 1,
    pageSize: 10,
    total: 0,
    parColumns: [
      {
        title: "运营商名称",
        key: "name",
        tooltip: true,
        minWidth: 120
      },
      {
        title: "所属机构",
        key: "organName",
        tooltip: true,
        minWidth: 150
      },
      {
        title: "运营区域",
        key: "cityName",
        tooltip: true,
        minWidth: 90
      },
      {
        title: "区县",
        key: "areaCodeNameMap",
        tooltip: true,
        minWidth: 90,
        render: (h, {row}) => {
          let codeMap = row.areaCodeNameMap;
          let str = Object.keys(codeMap || {}).map(k => (`${codeMap[k]}`)).join(",")
          return (<span>{str}</span>)
        }
      },
      {
        title: "运营模式",
        key: "agentModeList",
        tooltip: true,
        minWidth: 140,
        render: (h, { row }) => {
          return h("span", row.agentModeList.map(item => agentModeMap[item]).join("、"))
        }
      },
      {
        title: "所属省",
        key: "provinceName",
        tooltip: true,
        minWidth: 90
      },
      {
        title: "联系电话",
        key: "contactNumber",
        width: 200,
        tooltip: true,
        minWidth: 100,
        render: (h, params) => {
          let concatStr = ""
          // let [mobileList, allMobile] = [null, []]
          let mobileList;
          let allMobile = [];
          if (params.row.mobileList && Array.isArray(params.row.mobileList)) {
            mobileList = [...params.row.mobileList]
            for (let i = 0; i < mobileList.length; i++) {
              if (!mobileList[i].number) {
                mobileList.splice(i, 1)
              } else {
                let mobile = mobileList[i].area + "-" + mobileList[i].number;
                allMobile.push(mobile)
              }
            }
            if (allMobile.length > 0) concatStr = allMobile.join(",")
          }
          return h("div", concatStr)
          /* let concatStr = ''
                        let mobileList = JSON.parse(JSON.stringify(params.row.mobileList))
                        let length = 0
                        if(mobileList !== null && typeof(mobileList) !== 'undefined'){
                            length = mobileList.length
                        }
                        for(let i = 0; i < length; i++){
                            if(mobileList[i].number === ''){
                                mobileList.splice(i, 1)
                                length --
                                i --
                            }
                        }
                        if(mobileList !== null && typeof(mobileList) !== 'undefined'){
                            length = mobileList.length
                        }
                        for(let i = 0; i < length; i++){
                            let mobile = ''
                            if(i < mobileList.length - 1){
                                mobile = mobileList[i].area + '-' + mobileList[i].number + '，'
                            } else {
                                mobile = mobileList[i].area + '-' + mobileList[i].number
                            }
                            concatStr += mobile
                        }
                        return h('div', concatStr) */
        }
      },
      {
        title: "允许登录监控大屏",
        key: "provinceName",
        tooltip: true,
        minWidth: 100,
        render(h, params) {
          let text = isMonitorAuthMap[params.row.monitorAdmitted]
          return h("div", text)
        },
      },
      {
        title: "状态",
        key: "enableSwitch",
        tooltip: true,
        minWidth: 100,
        render(h, { row }) {
          return h("div", row.enableSwitch === 1 ? "启用" : row.enableSwitch === 0?"停用":'')
        },
      },
      {
        title: "操作",
        key: "action",
        width: 190,
        fixed: "right",
        render: (h, params) => {
          return h("div", [
                        	h("Button", {
              props: {
                type: "info",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: "hasAuth",
                value: "carrier-detail"
              }],
              style: {
                marginRight: "15px"
              },
              on: {
                click: () => {
                  sessionStorage.removeItem("activeTab")
                  that.$router.push({
                                        	name: "carrier-detail",
                                        	query: {
                                        		uuid: params.row.uuid
                                        	}
                  })
                }
              }
            }, "详情"),
            h("Button", {
              style: {
                marginRight: "15px",
              },
              props: {
                type: "warning",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: "hasAuth",
                value: "carrier-edit"
              }],
              on: {
                click: () => {
                  that.isPop = true
                  that.title = "编辑运营商"
                  that.updateType = "edit"
                  that.uuid = params.row.uuid
                }
              }
            }, "编辑"),
            h("Button", {

              props: {
                type: "warning",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: "hasAuth",
                value: "carrier-state"
              }],
              on: {
                click: () => {
                  that.updateEnableState(params.row)
                }
              }
            }, params.row.enableSwitch === 1 ? "停用" : "启用"),
            /* h('Button', {
                                props: {
                                    type: "error",
                                    ghost: true,
                                    size: "small"
                                },
                                on: {
                                    click: () => {
                                        that.$Modal.confirm({
                                            title: '提示',
                                            content: '<p>确认删除该运营商？</p>',
                                            cancelText: '取消',
                                            onOk: () => {
                                                deleteCarrier({uuid: params.row.uuid}).then(res => {
                                                    if(res.data.success) {
                                                        that.$Message.success('删除成功')
                                                        that.getTableList()
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                            }, '删除') */
          ])
        }
      }
    ]
  }
}



export const inputList = [
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ["provinceId", "cityId"], // 返回数据的key名
    placeholder: "请选择省/市",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    titleWidth: 100,
    title: "运营区域省/市：" // 展示的字段名
  },
  {
    name: "drop-input",
    bind_key: "areaCodeList",
    placeholder: "请选择",
    value: [],
    title: "区县：",
    multiple: true,
    filterable: true,
    dropList:[]
  },
  {
    name: "text-input", // 文本输入框名
    bind_key: "name", // 返回数据的key名
    placeholder: "请输入运营商名或者账户名",
    value: "", // 用于数据绑定
    title: "运营商："
  },
  {
    name: "text-input", // 文本输入框名
    bind_key: "contactNumber", // 返回数据的key名
    placeholder: "请输入联系电话",
    value: "", // 用于数据绑定
    title: "联系电话："
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "enableSwitch", // 返回数据的key名
    placeholder: "请选择",
    value: 1, // 用于数据绑定
    title: "状态：",
    dropList:[
        {
            value: 1,
            label: "启用"
        },
        {
            value: 0,
            label: "停用"
        },
    ]
  }
]
