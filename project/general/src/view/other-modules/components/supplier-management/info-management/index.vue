<template>
  <div class="container1">
    <SearchList :inputList="inputList" @on-search='handleSearch' @on-reset="reset" @on-change="changeSupplierType"></SearchList>
    <Button type="primary" @click.stop="handleAdd" v-hasAuth="'info-management-add'">新增</Button>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="pushColumn"
      :parTableData="tableData"
      :pageSizeOpts="[10,20,30,40,50]"
      @changePage="changePage"
      @changePageSize="changePageSize"
      style="margin-top: 25px;">
    </VTable>
    <Modal v-model="detailModal" width="1200" :footer-hide="true" title="详情" @on-cancel="cancelDetail">
      <DetailTag :theInfo='detailInfo' :myCitys="myCityList"></DetailTag>
    </Modal>
    <Modal v-model="addModal" :title="titleName" width='1200' @on-cancel="cancelClick(1)">
      <AddTag ref="addTag" :theInfo='editInfo' :mode="mode"></AddTag>
      <div slot="footer">
        <Button type="text" size="large" @click="cancelClick">取消</Button>
        <Button type="primary" size="large" @click="saveClick">确定</Button>
      </div>
    </Modal>
    <Modal v-model="showDialog" @on-ok="okk" @on-cancel="cel" title="提示">
      <div style="font-size: 20px; color: #000c17">
        供应商信息尚未保存，确认取消？
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    queryPage,
    addAndEditSave,
    enableAndStop,
    getDetail,
    getSupplierName,
    getNameOrTel,
    cityList
  } from "_o/api/assetSupplier.js"
  import { fields } from "./fields.js"
  import DetailTag from "./components/detail.vue"
  import { cpLabelValue } from "@/libs/tools";
  import AddTag from "./components/add.vue"

  export default {
    components: {
      DetailTag,
      AddTag
    },
    data() {
      return {
        titleName: "新建",
        ...fields,
        detailModal: false,
        showDialog: false,
        detailInfo: {},
        editInfo: {},
        tableData: [], //存放list数据
        pushColumn: [
          {
            key: "uuid",
            title: "供应商ID",
            minWidth: 270,
            tooltip: true,
          },
          {
            key: "supplierCode",
            title: "供应商编码",
            minWidth: 160,
            tooltip: true,
          },
          {
            key: "supplierName",
            title: "供应商名称",
            minWidth: 160,
            tooltip: true,
          },
          {
            key: "supplierType",
            title: "供应商类型",
            minWidth: 160,
            tooltip: true,
            render: (j, params) => {
              let typeText = ""
              if (params.row.supplyType.length) {
                let typeNum = params.row.supplyType[0].supplierType
                if (typeNum === 0) {
                  typeText = "车辆供应商"
                } else if (typeNum === 1) {
                  typeText = "设备供应商"
                } else if (typeNum === 2) {
                  typeText = "能源供应商"
                } else if (typeNum === 3) {
                  typeText = "配件供应商"
                } else if (typeNum === 4) {
                  typeText = "地推供应商"
                } else if (typeNum === 5) {
                  typeText = "自动驾驶车辆供应商"
                }
              }
              return j("span", typeText)
            }
          },
          {
            key: "supplyMethod",
            title: "供应方式",
            minWidth: 160,
            tooltip: true,
            render: (j, params) => {
              let methodText = ""
              if (params.row.supplyType.length) {
                let typeNum = params.row.supplyType[0].supplierType
                if (params.row.supplyType[0].supplyMethod.length) {
                  let methodArr = params.row.supplyType[0].supplyMethod
                  if (typeNum === 0 || typeNum === 5) {
                    methodArr.forEach(item => {
                      if (item.supplierMethod === 0) {
                        methodText = methodText + "自购/"
                      } else if (item.supplierMethod === 1) {
                        methodText = methodText + "加盟/"
                      } else if (item.supplierMethod === 3) {
                        methodText = methodText + "裸车租赁/"
                      } else if (item.supplierMethod === 4) {
                        methodText = methodText + "大包租赁/"
                      }
                    })
                    methodText = methodText.substring(0, methodText.length - 1)
                  } else if (typeNum === 1) {
                    methodText = ""
                  } else if (typeNum === 2) {
                    methodArr.forEach(item => {
                      if (item.supplierMethod === 1) {
                        methodText = methodText + "桩企直连/"
                      } else if (item.supplierMethod === 2) {
                        methodText = methodText + "聚合平台/"
                      }
                    })
                    methodText = methodText.substring(0, methodText.length - 1)
                  } else if (typeNum === 3) {
                    methodArr.forEach(item => {
                      if (item.supplierMethod === 1) {
                        methodText = methodText + "普通采购/"
                      } else if (item.supplierMethod === 2) {
                        methodText = methodText + "寄售采购/"
                      } else if (item.supplierMethod === 3) {
                        methodText = methodText + "客户寄存/"
                      }
                    })
                    methodText = methodText.substring(0, methodText.length - 1)
                  } else if (typeNum === 4) {
                    methodArr.forEach(item => {
                      if (item.supplierMethod === 0) {
                        methodText = methodText + "线下推广/"
                      }
                    })
                    methodText = methodText.substring(0, methodText.length - 1)
                  }
                }
              }
              return j("span", methodText)
            }
          },
          {
            key: "srmSettlementMethod",
            title: "结算周期（日）",
            minWidth: 160,
            tooltip: true,
            render: (j, params) => {
              let method = params.row.srmSettlementMethod || []
              let period
              if (method.length) {
                period = method[0].period
              } else {
                period = ""
              }
              return j("span", period)
            }
          },
          {
            key: "cityUuid",
            title: "城市",
            minWidth: 160,
            tooltip: true,
            render: (j, params) => {
              let cityText = ""
              if (this.myCityList.length) {
                this.myCityList.forEach(item => {
                  item.cityDtoList.forEach(e => {
                    if (e.orgCode === params.row.cityUuid) {
                      cityText = e.orgName
                    }
                  })
                })
              }
              return j("span", cityText)
            }
          },
          {
            key: "linkName",
            title: "联系人",
            minWidth: 160,
            tooltip: true,
          },
          {
            key: "telephone",
            title: "联系人电话",
            minWidth: 160,
            tooltip: true,
          },
          {
            key: "enableFlag",
            title: "状态",
            minWidth: 160,
            tooltip: true,
            render: (j, params) => {
              return j("div", [
                j("span", {
                  style: {
                    display: (params.row.enableFlag == 1) ? "inline-block" : "none"
                  }
                }, "启用"),
                j("span", {
                  style: {
                    display: (params.row.enableFlag == 2) ? "inline-block" : "none"
                  }
                }, "停用")
              ])
            }
          },
          {
            key: "createTime",
            title: "创建时间",
            minWidth: 160,
            tooltip: true,
            render: (h, params) => {
              return <span>{this.$moment(params.row.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
            }
          },
          {
            key: "actions",
            title: "操作",
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
                    value: "info-management-detail"
                  }],
                  style: {
                    display: "inline-block"
                  },
                  on: {
                    click: () => {
                      let id = params.row.uuid
                      this.getDetail(id)
                      this.detailModal = true
                    }
                  }
                }, "详情"),
                h("Button", {
                  props: {
                    type: "info",
                    ghost: true,
                    size: "small"
                  },
                  directives: [{
                    name: "hasAuth",
                    value: "info-management-edit"
                  }],
                  style: {
                    marginLeft: "15px",
                    display: "inline-block"
                  },
                  on: {
                    click: () => {
                      let id = params.row.uuid
                      this.$refs.addTag.$refs.supplierForm.resetFields()
                      this.$refs.addTag.$refs.contactForm.resetFields()
                      this.$refs.addTag.$refs.contactForm1.resetFields()
                      this.$refs.addTag.$refs.businessForm.resetFields()
                      this.$refs.addTag.$refs.contractForm.resetFields()
                      this.$refs.addTag.$refs.accountForm.resetFields()
                      this.$refs.addTag.$refs.srmSettlementMethodForm.resetFields()
                      this.$refs.addTag.$refs.supplyTypeForm.resetFields()
                      this.getEditDetail(id)
                      this.titleName = "编辑"
                    }
                  }
                }, "编辑"),
                h("Button", {
                  props: {
                    type: "info",
                    ghost: true,
                    size: "small"
                  },
                  directives: [{
                    name: "hasAuth",
                    value: "info-management-open"
                  }],
                  style: {
                    marginLeft: "15px",
                    display: (params.row.enableFlag === 2) ? "inline-block" : "none"
                  },
                  on: {
                    click: () => {
                      this.clickEnableAndStop(params.row.uuid, 1)
                    }
                  }
                }, "启用"),
                h('Button', {
                  props: {
                    type: 'error',
                    ghost: true,
                    size:'small'
                  },
                  directives: [{
                    name: 'hasAuth',
                    value: 'info-management-stop'
                  }],
                  style: {
                    marginLeft: '15px',
                    display: (params.row.enableFlag === 1) ? "inline-block" : "none"
                  },
                  on: {
                    click: () => {
                      this.clickEnableAndStop(params.row.uuid, 2)
                    }
                  }
                },  '停用'),
              ])
            }
          },
        ],
        total: null,
        current: 1,
        isLoading: false,
        pageSize: 50,
        queryParams: {},
        selectList: [],
        addModal: false,
        mode: "",
        myCityList:[]
      };
    },
    mounted() {
      this.getCityList()
      this.getList()
      // this.inputList[1].remoteMethod = this.supplierNameList
      // this.inputList[2].remoteMethod = this.supplierCodeList
      // this.inputList[7].remoteMethod = this.nameList
      // this.inputList[8].remoteMethod = this.telList
    },
    methods: {
      supplierNameList: function(query) {
        if (query) {
          getSupplierName({supplierName: query}).then(res => {
            if (res.data.success) {
              this.inputList[1].remoteList = []
              for(let i = 0; i < res.data.data.length; i++){
                this.inputList[1].remoteList.push({
                  label: res.data.data[i].supplierName,
                  value: res.data.data[i].uuid
                })
              }
            }
          })
        }
      },
      supplierCodeList: function(query) {
        if (query) {
          getSupplierName({code: query}).then(res => {
            if (res.data.success) {
              this.inputList[2].remoteList = []
              for(let i = 0; i < res.data.data.length; i++){
                this.inputList[2].remoteList.push({
                  label: res.data.data[i].code,
                  value: res.data.data[i].code
                })
              }
            }
          })
        }
      },
      nameList(query) {
        if (query) {
          getNameOrTel({name: query}).then(res => {
            if (res.data.success) {
              this.inputList[7].remoteList = []
              for(let i = 0; i < res.data.data.length; i++){
                this.inputList[7].remoteList.push({
                  label: res.data.data[i].name,
                  value: res.data.data[i].name
                })
              }
            }
          })
        }
      },
      telList(query) {
        if (query) {
          getNameOrTel({telephone: query}).then(res => {
            if (res.data.success) {
              this.inputList[8].remoteList = []
              for(let i = 0; i < res.data.data.length; i++){
                this.inputList[8].remoteList.push({
                  label: res.data.data[i].telephone,
                  value: res.data.data[i].telephone
                })
              }
            }
          })
        }
      },
      changeSupplierType(value) {
        if (value === "车辆供应商0" || value === "自动驾驶车辆供应商5") {
          this.inputList[3].dropList = [
            {
              value: "自购0",
              label: "自购"
            },
            {
              value: "裸车租赁3",
              label: "裸车租赁"
            },
            {
              value: "大包租赁4",
              label: "大包租赁"
            },
            {
              value: "加盟1",
              label: "加盟"
            }
          ]
        } else if (value === "能源供应商2") {
          this.inputList[3].dropList = [
            {
              value: "桩企直连1",
              label: "桩企直连"
            },
            {
              value: "聚合平台2",
              label: "聚合平台"
            }
          ]
        } else if (value === "配件供应商3") {
          this.inputList[3].dropList = [
            {
              value: "普通采购1",
              label: "普通采购"
            },
            {
              value: "寄售采购2",
              label: "寄售采购"
            },
            {
              value: "客户寄存3",
              label: "客户寄存"
            }
          ]
        } else if (value === "地推4") {
          this.inputList[3].dropList = [
            {
              value: "地推0",
              label: "线下推广"
            }
          ]
        }
      },

      clickEnableAndStop(uuid, enableFlag) {
        enableAndStop({uuid: uuid, enableFlag: enableFlag}).then(res => {
          if (res.data.success) {
            this.$Message.success(res.data.msg)
            this.getList()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      },

      handleAdd() {
        this.$refs.addTag.$refs.supplierForm.resetFields()
        this.$refs.addTag.$refs.contactForm.resetFields()
        this.$refs.addTag.$refs.contactForm1.resetFields()
        this.$refs.addTag.$refs.businessForm.resetFields()
        this.$refs.addTag.$refs.contractForm.resetFields()
        this.$refs.addTag.$refs.accountForm.resetFields()
        this.$refs.addTag.$refs.srmSettlementMethodForm.resetFields()
        this.$refs.addTag.$refs.supplyTypeForm.resetFields()
        this.$refs.addTag.$refs.supplyTypeForm2 && this.$refs.addTag.$refs.supplyTypeForm2.resetFields()
        this.addModal = true
        this.titleName = "新增"
        this.mode = "add"
      },
      cancelDetail() {
        this.detailModal = false
        this.detailInfo = {}
      },
      okk() {
        this.mode = ""
        this.$refs.addTag.clear()
        this.showDialog = false
        this.addModal = false
      },
      cel() {
        this.showDialog = false
      },
      cancelClick(params) {
        if (params === 1) {
          this.mode = ""
          this.$refs.addTag.clear()
          this.editInfo = {}
          this.showDialog = false
          this.addModal = false
        } else {
          this.showDialog = true
        }
      },
      saveClick() {
        let supplierFormFlag,
          contactFormFlag,
          contactForm1Flag,
          businessFormFlag,
          contractFormFlag,
          srmSettlementMethodFormFlag,
          supplyTypeFormFlag,
          supplyTypeForm2Flag
        let params = {
          supplier:{},
          businessLicense: {
            bussImgList: []
          },
          contact: [{}],
          contract: [
            {
              contractImgList: []
            }
          ],
          account: [{
            accountImgList: []
          }],
          srmSettlementMethod: [],
          supplyType: [{
            supplyMethod: []
          }]
        }
        this.$refs.addTag.$refs.contactForm.validate((valid) => {
          if (valid) {
            contactFormFlag = 1
            params.contact[0].name = this.$refs.addTag.contactForm.name
          }
        })
        this.$refs.addTag.$refs.contactForm1.validate((valid) => {
          if (valid) {
            contactForm1Flag = 1
            params.contact[0].telephone = this.$refs.addTag.contactForm1.telephone
            params.contact[0].mainFlag = 1
          }
        })
        this.$refs.addTag.$refs.supplierForm.validate((valid) => {
          if (valid) {
            supplierFormFlag = 1
            let obj = this.$refs.addTag.supplierForm
            params.supplier = {
              name: obj.name,
              code: obj.code,
              cityUuid: obj.cityUuid[1],
              provinceUuid: obj.cityUuid[0],
              registeredCity: obj.registeredCity[1],
              address: obj.address,
              remark: obj.remark ? obj.remark: "",
            }
            if (this.mode === 'edit') {
              params.supplier.id = obj.id
            }
          }
        })
        this.$refs.addTag.$refs.businessForm.validate((valid) => {
          if (valid) {
            businessFormFlag = 1
            let obj1 = this.$refs.addTag.businessForm
            let imagList = []
            obj1.bussImgList.forEach(item => {
              imagList.push({
                attachment: item.uuid
              })
            })
            params.businessLicense = {
              ...obj1,
            }
            params.businessLicense.bussImgList = imagList
          }
        })
        this.$refs.addTag.$refs.contractForm.validate((valid) => {
          if (valid) {
            contractFormFlag = 1
            let obj2 = this.$refs.addTag.contractForm
            let imagList2 = []
            obj2.contractImgList.forEach(item => {
              imagList2.push({
                attachment: item.uuid
              })
            })
            params.contract[0] = {
              ...obj2
            }
            params.contract[0].contractImgList = imagList2
          }
        })
        this.$refs.addTag.$refs.srmSettlementMethodForm.validate((valid) => {
          if (valid) {
            srmSettlementMethodFormFlag = 1
            params.srmSettlementMethod.push(this.$refs.addTag.srmSettlementMethodForm)
          }
        })
        this.$refs.addTag.$refs.supplyTypeForm.validate((valid) => {
          if (valid) {
            supplyTypeFormFlag = 1
            let obj4 = this.$refs.addTag.supplyTypeForm
            const { refOrganId, oldSupplierType } = obj4
            const cityArray = this.$refs.addTag.cityArray
            const opAreaName = cityArray.filter(item => obj4.opAreaCodeList.indexOf(item.value) > -1).map(({ label }) => label).join(',')
            const opAreaCode = obj4.opAreaCodeList.join(',')
            params.supplyType[0].supplierType = obj4.supplierType
            if (obj4.supplierMethod.length) {
              let methodList = []
              obj4.supplierMethod.forEach(item => {
                methodList.push({
                  supplierMethod: item
                })
              })
              params.supplyType[0].supplyMethod = methodList
              params.supplyType[0].opAreaName = opAreaName
              params.supplyType[0].opAreaCode = opAreaCode
              params.supplyType[0].oldSupplierType = oldSupplierType
              params.supplyType[0].refOrganId = refOrganId
            }
          }
        })
        if (this.$refs.addTag.$refs.supplyTypeForm2) {
          this.$refs.addTag.$refs.supplyTypeForm2.validate((valid) => {
            if (valid) {
              supplyTypeForm2Flag = 1
            }
            let obj5 = this.$refs.addTag.supplierForm2
            const { isLogin, managerName, managerCardId, managerTel, managerEmail } = obj5

            if (isLogin == 1 || this.mode !== 'edit') {
              params.supplier = {
                ...params.supplier,
                isLogin,
                managerName,
                managerCardId,
                managerTel,
                managerEmail,
              }
            }
          })
        } else {
          supplyTypeForm2Flag = 1
        }
        if (supplierFormFlag &&contactFormFlag && contactForm1Flag && businessFormFlag && contractFormFlag && srmSettlementMethodFormFlag && supplyTypeFormFlag && supplyTypeForm2Flag) {
          let obj5 = this.$refs.addTag.accountForm
          params.account[0] = {
            ...obj5
          }
          if (obj5.accountImgList.length) {
            let imagList5 = []
            obj5.accountImgList.forEach(item => {
              imagList5.push({
                attachment: item.uuid
              })
            })
            params.account[0].accountImgList = imagList5
          }
          addAndEditSave(params).then(res => {
            if (res.data.success) {
              this.addModal = false
              this.$Message.success(res.data.msg)
              this.getList()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        } else {
          this.$Message.error('请填写必填或必传项,或填写错误项')
        }
      },
      //获取分页
      getList() {
        this.isLoading = true
        let data = {
          pageSize: Number(this.pageSize),
          currPage: Number(this.current)
        }

        if (this.queryParams) {
          data = Object.assign(this.queryParams, data)
        }
        queryPage(data).then(res => {
          if (res.data.success) {
            this.total = res.data.data.totalCount
            this.tableData = res.data.data.list
          }
        })
      },
      getCityList() {
        cityList({}).then(res => { //
          let list = res.data.data || []
          let params = {
            list: list,
            labelKey: "provinceName",
            valueKey: "provinceCode",
            children: "cityDtoList",
            sonLableKey: "orgName",
            sonValueKey: "orgCode",
            isDeep: true,
          }
          list = cpLabelValue(params)
          this.myCityList = list
          this.inputList[4].cascaderList = list
        });
      },
      reset() {
        this.queryParams = {}
        this.current = 1
        this.pageSize = 50
        this.getList()
      },
      // 搜索
      handleSearch(val) {
        val.supplierType && (val.supplierType = val.supplierType.substring(val.supplierType.length - 1))
        val.orgCode && (val.cityUuid = val.orgCode)
        val.supplierCode && (val.code = val.supplierCode)
        val.supplierMethod && (val.supplierMethod = val.supplierMethod.substring(val.supplierMethod.length - 1))
        val.enableFlag && (val.enableFlag = Number(val.enableFlag))
        val.createBeginDate && (val.createBeginDate = this.$moment(val.createBeginDate).format("YYYY-MM-DD HH:mm:ss"))
        val.createEndDate && (val.createEndDate = this.$moment(val.createEndDate).format("YYYY-MM-DD HH:mm:ss"))
        this.queryParams = val
        this.current = 1
        this.pageSize = 50
        this.getList()
      },
      changePageSize(val) {
        this.pageSize = val;
        this.getList()
      },
      changePage(val) {
        this.current = val
        this.getList()
      },
      //获取详情
      getDetail(id) {
        let data = { uuid: id }
        getDetail(data).then(res => {
          if (res.data.success) {
            this.detailInfo = res.data.data
          }
        })
      },
      getEditDetail(id) {
        let data = { uuid: id }
        getDetail(data).then(res => {
          if (res.data.success) {
            this.addModal = true
            this.mode = "edit"
            this.editInfo = res.data.data
          }
        })
      }
    },
  }
</script>
<style lang="less" scoped>

</style>
