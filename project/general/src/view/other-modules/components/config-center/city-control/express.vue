<!--开通城市内容页面-->
<template>
  <div class="container_box">
    <searchList :inputList="inputList" @on-search="queryList" @on-reset="handelReset"></searchList>
    <Button
      v-hasAuth="'city_control-add'"
      type="primary"
      @click="showAddModel"
    >
      新增城市
    </Button>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="cityColumns"
      :parTableData="cityData"
      style="margin-top: 20px;"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </VTable>
    <div class="addModal">
      <Modal v-model="addModal" title="新增城市" :mask-closable="false">
        <Form :model="addCityForm" :label-width="80">
          <FormItem label="当前业务:">
            <span v-if="tabName == 2">专享</span>
            <span v-if="tabName == 4">快享</span>
            <span v-if="tabName == 1">出租车</span>
            <span v-if="tabName == 3">包车</span>
            <span v-if="tabName == 5">顺风车</span>
          </FormItem>
          <FormItem label="选择城市:">
            <al-cascader
              ref="alCascader"
              v-model="selectedCityL"
              level="1"
              style="width:190px"
            />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button v-lazy-click="handleSaveCity" type="primary">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import { cpTranslate } from "@/libs/tools"
import {
  getModelsLeveList,
  getPackageModelsLeveList,
  addCity,
  turnoffCity,
  turnOnCity,
  checkedCityStatus,
  packageOpenCityStatus,
  packageOpenCityAdd,
  getCharterCities
} from "_o/api/configData.js"
import { getProvinceCityList, getProvinceCityAllList } from "_g/api/common.js"
import { typeModuleMap } from "_g/config/status-map"

export default {
  name: "express",
  props: {
    tabName: String
  },
  data() {
    return {
      typeModuleMap,
      inputList: [
        {
          name: "cascader-input", // 文本输入框名
          bind_key: ["provinceID", "cityID"], // 返回数据的key名
          placeholder: "请选择省/市",
          value: [], // 绑定返回数据
          cascaderList: [], // 级联列表
          title: "省 / 市：", // 展示的字段名
          changeOnSelect: true
        }
      ],
      selectedCityL: [],
      addModal: false,    // 弹出开通城市弹窗
      addCityForm: {},
      cityColumns: this.tabName == 3 ?
        [
          {
            title: "城市名",
            minWidth: 160,
            key: "city"
          },
          {
            title: "所属省份",
            minWidth: 160,
            key: "province"
          },
          {
            title: "开通状态",
            key: "status",
            minWidth: 160,
            render: (h, params) => {
              if (params.row.status == 0) return h("span", "未开通")
              if (params.row.status == 1) return h("span", "已开通")
            }
          },
          {
            title: "更新时间",
            key: "updateTime",
            minWidth: 160,
            render: (h, params) => {
              let x = params.row.updateTime
              x = this.$moment(x).format("YYYY-MM-DD HH:mm:ss")
              return h("span", x)
            }
          },
          {
            title: "操作人",
            key: "updater",
            minWidth: 160,
            render: (h, params) => {
              if (!params.row.updater) return h("span", params.row.creator)
              else return h("span", params.row.updater)
            }
          },
          {
            title: "操作",
            key: "action",
            fixed: "right",
            width: 350,
            render: (h, params) => {
              return h("div"), [
                h("Button", {
                  props: {
                    type: "error",
                    ghost: true,
                    size: "small"
                  },
                  directives: [{
                    name: "hasAuth",
                    value: "city_control-update"
                  }],
                  style: {
                    display: params.row.status === 1 ? "inline-block" : "none"
                  },
                  on: {
                    click: () => {
                      let info = params.row
                      this.closeStra(info)
                    }
                  }
                }, "关闭"),
                h("Button", {
                  props: {
                    type: "success",
                    ghost: true,
                    size: "small"
                  },
                  directives: [{
                    name: "hasAuth",
                    value: "city_control-update"
                  }],
                  style: {
                    display: params.row.status === 0 ? "inline-block" : "none"
                  },
                  on: {
                    click: () => {
                      let info = params.row
                      // let data = {
                      //  cityUuid: params.row.cityUuid,
                      //  typeModule: Number(this.tabName)
                      // }
                      // checkedCityStatus(data).then(res => {
                      //  this.openStra(info)
                      // })
                      this.openStra(info)
                    }
                  }
                }, "开启"),
                h("Button", {
                  props: {
                    type: "primary",
                    ghost: true,
                    size: "small"
                  },
                  directives: [{
                    name: "hasAuth",
                    value: "city_control-discount"
                  }],
                  style: {
                    marginLeft: "15px"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "city_package_control",
                        query: {
                          tabType: "1",
                          city: params.row.city,
                          province: params.row.province,
                          status: params.row.status,
                          businessType: params.row.businessType,
                          uuid: params.row.uuid,
                          cityId: params.row.cityId,
                          cityUuid: params.row.cityUuid
                        }
                      })
                    }
                  }
                }, "乘客套餐管理"),
                h("Button", {
                  props: {
                    type: "primary",
                    ghost: true,
                    size: "small"
                  },
                  directives: [{
                    name: "hasAuth",
                    value: "city_control-discount"
                  }],
                  style: {
                    marginLeft: "15px"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "city_package_control",
                        query: {
                          tabType: "2",
                          city: params.row.city,
                          province: params.row.province,
                          status: params.row.status,
                          businessType: params.row.businessType,
                          uuid: params.row.uuid,
                          cityId: params.row.cityId,
                          cityUuid: params.row.cityUuid
                        }
                      })
                    }
                  }
                }, "司机包车定价管理"),
                h("Button", {
                  props: {
                    type: "info",
                    ghost: true,
                    size: "small"
                  },
                  directives: [{
                    name: "hasAuth",
                    value: ""
                    // value: 'city_control-realName'
                  }],
                  style: {
                    marginLeft: "15px"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "city_control_operation",
                        query: {
                          tabType: "4",
                          city: params.row.city,
                          province: params.row.province,
                          status: params.row.status,
                          businessType: 6,
                          uuid: params.row.uuid,
                          cityId: params.row.cityId,
                          cityUuid: params.row.cityUuid
                        }
                      })
                    }
                  }
                }, "实名认证策略")
              ]
            }
          },
        ] :
        [
          {
            title: "城市名",
            minWidth: 160,
            key: "city"
          },
          {
            title: "所属省份",
            minWidth: 160,
            key: "province"
          },
          {
            title: "开通状态",
            key: "status",
            minWidth: 160,
            render: (h, params) => {
              if (params.row.status == 0) return h("span", "未开通")
              if (params.row.status == 1) return h("span", "已开通")
            }
          },
          {
            title: "更新时间",
            key: "updateTime",
            minWidth: 160,
            render: (h, params) => {
              let x = params.row.updateTime
              x = this.$moment(x).format("YYYY-MM-DD HH:mm:ss")
              return h("span", x)
            }
          },
          {
            title: "操作",
            key: "action",
            fixed: "right",
            width: 520,
            render: (h, params) => {
              return h("div", [
                h("Button", {
                  props: {
                    type: "error",
                    ghost: true,
                    size: "small"
                  },
                  directives: [{
                    name: "hasAuth",
                    value: "city_control-update"
                  }],
                  style: {
                    display: params.row.status === 1 ? "inline-block" : "none"
                  },
                  on: {
                    click: () => {
                      let info = params.row
                      if (this.tabName == 4 || this.tabName == 2) {
                        this.closeStra(info)
                      } else {
                        this.$Modal.info({
                          title: "该功能正在开发中",
                          content: "<p>当前仅支持快享</p>"
                        });
                      }
                    }
                  }
                }, "关闭"),
                h("Button", {
                  props: {
                    type: "success",
                    ghost: true,
                    size: "small"
                  },
                  directives: [{
                    name: "hasAuth",
                    value: "city_control-update"
                  }],
                  style: {
                    display: params.row.status === 0 ? "inline-block" : "none"
                  },
                  on: {
                    click: () => {
                      let info = params.row
                      let data = {
                        cityUuid: params.row.cityUuid,
                        typeModule: Number(this.tabName)
                      }
                      if (this.tabName == 4 || this.tabName == 2) {
                        checkedCityStatus(data).then(res => {
                          this.openStra(info)
                        })
                      } else {
                        this.$Modal.info({
                          title: "该功能正在开发中",
                          content: "<p>当前仅支持快享</p>"
                        });
                      }
                    }
                  }
                }, "开启"),
                this.tabName == 1 ? [
                  h("Button", {
                    props: {
                      type: "success",
                      ghost: true,
                      size: "small"
                    },
                    directives: [{
                      name: "hasAuth",
                      value: "city_control-priceStrategy"
                    }],
                    style: {
                      marginLeft: "15px",
                      display: this.tabName != 5 || this.tabName != 4 ? "line-block" : "none"
                    },
                    on: {
                      click: () => {
                        this.$router.push({
                          name: "city_control_operation",
                          query: {
                            tabType: "1",
                            city: params.row.city,
                            province: params.row.province,
                            status: params.row.status,
                            businessType: params.row.businessType,
                            uuid: params.row.uuid,
                            cityId: params.row.cityId,
                            cityUuid: params.row.cityUuid
                          }
                        })
                      }
                    },
                  }, "定价策略")
                ] : [
                  h("Button", {
                    props: {
                      type: "success",
                      ghost: true,
                      size: "small"
                    },
                    directives: [{
                      name: "hasAuth",
                      value: "city_control-priceStrategy"
                    }],
                    style: {
                      marginLeft: "15px",
                      display: this.tabName != 5 || this.tabName != 4 ? "line-block" : "none"
                    },
                    on: {
                      click: () => {
                        this.$router.push({
                          name: "city_control_operation",
                          query: {
                            tabType: "7",
                            consumerType: "1",
                            city: params.row.city,
                            province: params.row.province,
                            status: params.row.status,
                            businessType: params.row.businessType,
                            uuid: params.row.uuid,
                            cityId: params.row.cityId,
                            cityUuid: params.row.cityUuid
                          }
                        })
                      }
                    },
                  }, "乘客定价策略"),
                  h("Button", {
                    props: {
                      type: "success",
                      ghost: true,
                      size: "small"
                    },
                    directives: [{
                      name: "hasAuth",
                      value: "city_control-priceStrategy"
                    }],
                    style: {
                      marginLeft: "15px",
                      display: this.tabName != 5 || this.tabName != 4 ? "line-block" : "none"
                    },
                    on: {
                      click: () => {
                        this.$router.push({
                          name: "city_control_operation",
                          query: {
                            tabType: "9",
                            consumerType: "2",
                            city: params.row.city,
                            province: params.row.province,
                            status: params.row.status,
                            businessType: params.row.businessType,
                            uuid: params.row.uuid,
                            cityId: params.row.cityId,
                            cityUuid: params.row.cityUuid
                          }
                        })
                      }
                    },
                  }, "司机定价策略"),
                  h("Button", {
                    props: {
                      type: "success",
                      ghost: true,
                      size: "small"
                    },
                    directives: [{
                      name: "hasAuth",
                      value: "city_control-priceStrategy"
                    }],
                    style: {
                      marginLeft: "15px",
                    },
                    on: {
                      click: () => {
                        this.$router.push({
                          name: "city_control_operation",
                          query: {
                            tabType: "10",
                            city: params.row.city,
                            province: params.row.province,
                            status: params.row.status,
                            businessType: params.row.businessType,
                            uuid: params.row.uuid,
                            cityId: params.row.cityId,
                            cityUuid: params.row.cityUuid
                          }
                        })
                      }
                    }
                  }, "跨城费策略")],
                h("Button", {
                  props: {
                    type: "warning",
                    ghost: true,
                    size: "small"
                  },
                  directives: [{
                    name: "hasAuth",
                    value: "city_control-badStrategy"
                  }],
                  style: {
                    marginLeft: "15px",
                    display: this.tabName != 5 || this.tabName != 4 ? "line-block" : "none"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "city_control_operation",
                        query: {
                          tabType: "2",
                          city: params.row.city,
                          province: params.row.province,
                          status: params.row.status,
                          businessType: params.row.businessType,
                          uuid: params.row.uuid,
                          cityId: params.row.cityId,
                          cityUuid: params.row.cityUuid
                        }
                      })
                    }
                  }
                }, "坏账策略"),
                h("Button", {
                  props: {
                    type: "primary",
                    ghost: true,
                    size: "small"
                  },
                  directives: [{
                    name: "hasAuth",
                    value: "city_control-discount"
                  }],
                  style: {
                    marginLeft: "15px",
                    display: this.tabName != 5 || this.tabName != 4 ? "line-block" : "none"
                  },
                  on: {
                    click: () => {
                      if (params.row.businessType == 4 || params.row.businessType == 2) {
                        this.$router.push({
                          name: "base-discount",
                          query: {
                            businessType: params.row.businessType,
                            cityId: params.row.cityId,
                          }
                        })
                      }
                    }
                  }
                }, "基础折扣"),
                h("Button", {
                  props: {
                    type: "info",
                    ghost: true,
                    size: "small"
                  },
                  directives: [{
                    name: "hasAuth",
                    value: ""
                    // value: 'city_control-realName'
                  }],
                  style: {
                    marginLeft: "15px"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "city_control_operation",
                        query: {
                          tabType: "4",
                          city: params.row.city,
                          province: params.row.province,
                          status: params.row.status,
                          businessType: params.row.businessType,
                          uuid: params.row.uuid,
                          cityId: params.row.cityId,
                          cityUuid: params.row.cityUuid
                        }
                      })
                    }
                  }
                }, "实名认证策略"),
                h("Button", { // 异地车辆派单策略
                  props: {
                    type: "warning",
                    ghost: true,
                    size: "small"
                  },
                  directives: [{
                    name: "hasAuth",
                    value: "distancevehicle-setting"
                  }],
                  style: {
                    marginLeft: "15px",
                    color: "#ff00ff",
                    border: "1px solid #ff00ff"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "city_control_operation",
                        query: {
                          tabType: "8",
                          city: params.row.city,
                          province: params.row.province,
                          status: params.row.status,
                          businessType: params.row.businessType,
                          uuid: params.row.uuid,
                          cityId: params.row.cityId,
                          cityUuid: params.row.cityUuid
                        }
                      })
                    }
                  }
                }, "异地车辆策略"),
              ])
            }
          },
        ],
      cityData: [],
      totalCount: "",
      pageSize: 10,
      current: 1,
      total: null
    }
  },
  created() {
    this.getList()
    this.getSavedCity()
    // this.inputList[0].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
  },
  methods: {
    showAddModel() {
      this.selectedCityL = [] // 清空绑定的数据
      this.$refs.alCascader.select = [] // 清空页面上的展示数据
      this.addModal = true
    },
    handleSaveCity() { // 开通城市
      if (this.selectedCityL.length === 0) {
        this.$Message.warning("请选择城市")
      } else if (this.selectedCityL.length === 1) {
        this.$Message.warning("暂时无法开通台湾省")
      } else {
        if (this.tabName == 3) {
          let data = {
            cityID: this.selectedCityL[1].code,
            productLine: 2
          }
          this.$Modal.confirm({
            title: "开通城市",
            content: "确认开通" + this.selectedCityL[1].name + "的包车业务吗",
            onOk: () => {
              packageOpenCityAdd(data).then(res => {
                this.$Message.success("开通成功！")
                this.getList()
                this.getSavedCity()
                this.addModal = false
              })
            }
          })
        } else {
          let data = {
            cityID: this.selectedCityL[1].code,
            typeModule: Number(this.tabName)
          }
          this.$Modal.confirm({
            title: "开通城市",
            content: "确认开通" + this.selectedCityL[1].name + "的" + this.typeModuleMap[this.tabName] + "业务吗",
            onOk: () => {
              addCity(data).then(res => {
                this.$Message.success("开通成功！")
                this.getList()
                this.getSavedCity()
                this.addModal = false
              })
            }
          })
        }
      }
    },
    handelReset() { // 重置
      this.current = 1
      this.getList()
    },
    getList() { // 获取分页List
      let ty = Number(this.tabName)
      this.$store.commit("changeLoadingFlag", true)
      if (ty == 3) {
        let data = { currPage: this.current, pageSize: this.pageSize }
        getPackageModelsLeveList(data).then(res => {
          this.cityData = res.data.data.list
          this.total = res.data.data.totalCount
          this.$store.commit("changeLoadingFlag", false)
        })
      } else {
        let data = { typeModule: ty, currPage: this.current, pageSize: this.pageSize }
        getModelsLeveList(data).then(res => {
          this.cityData = res.data.data.list
          this.total = res.data.data.totalCount
          this.$store.commit("changeLoadingFlag", false)
        })
      }
    },
    getSavedCity() {
      if (this.tabName == 3) {
        getCharterCities().then(res => {
          let list = cpTranslate(res.data.data)
          this.inputList[0].cascaderList = list
        })
      } else {
        getProvinceCityAllList().then(res => {
          let list = cpTranslate(res.data.data)
          this.inputList[0].cascaderList = list
        })
      }
    },
    queryList(res) {
      if (this.tabName == 3) {
        let data = {
          provinceID: res.provinceID,
          cityID: res.cityID,
          currPage: this.current,
          pageSize: this.pageSize
        }
        getPackageModelsLeveList(data).then(res => {
          this.cityData = res.data.data.list
          this.total = res.data.data.totalCount
          this.$store.commit("changeLoadingFlag", false)
        })
      } else {
        let data = {
          typeModule: Number(this.tabName),
          provinceID: res.provinceID,
          cityID: res.cityID,
          currPage: this.current,
          pageSize: this.pageSize
        }
        this.$store.commit("changeLoadingFlag", true)
        getModelsLeveList(data).then(res => {
          this.cityData = res.data.data.list
          this.total = res.data.data.totalCount
          this.$store.commit("changeLoadingFlag", false)
        })
      }
    },
    changePageSize(val) {
      this.pageSize = val
      this.getList()
    },
    changePage(val) {
      this.current = val
      this.getList()
    },
    closeStra(info) {
      if (this.tabName == 3) {
        let data = {
          uuid: info.uuid,
          statusKey: 0,
          operator: info.operator ? info.creator : info.updater
        }
        this.$Modal.confirm({
          title: "提示",
          content: "<p>确认关闭此城市的业务？</p>",
          onOk: () => {
            packageOpenCityStatus(data).then(res => {
              this.$Message.success("关闭成功")
              this.getList()
              this.getSavedCity()
            })
          }
        })
      } else {
        let data = {
          cityUuid: info.cityUuid,
          typeModule: Number(this.tabName)
        }
        this.$Modal.confirm({
          title: "提示",
          content: "<p>确认关闭此城市的业务？</p>",
          onOk: () => {
            turnoffCity(data).then(res => {
              this.$Message.success("关闭成功")
              this.getList()
              this.getSavedCity()
            })
          }
        })
      }
    },
    openStra(info) {
      if (this.tabName == 3) {
        let data = {
          uuid: info.uuid,
          statusKey: 1,
          operator: info.updater ? info.updater : info.creator
        }
        this.$Modal.confirm({
          title: "提示",
          content: "<p>确认开启此城市？</p>",
          onOk: () => {
            packageOpenCityStatus(data).then(res => {
              this.$Message.success("开启成功")
              this.getList()
              this.getSavedCity()
            })
          }
        })
      } else {
        let data = {
          cityUuid: info.cityUuid,
          typeModule: Number(this.tabName)
        }
        this.$Modal.confirm({
          title: "提示",
          content: "<p>确认开启此城市？</p>",
          onOk: () => {
            turnOnCity(data).then(res => {
              this.$Message.success("开启成功")
              this.getList()
              this.getSavedCity()
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="less">
	.container_box {
		.mid {
			vertical-align: middle;
		}

		.fl-lt {
			float: left;
		}

		.fakeA {
			color: blueviolet
		}
	}
</style>

