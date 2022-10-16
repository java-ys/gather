<!--
 * @description:
 * @author: Tom Dai
 * @date: 2020-02-17 21:16:01
 * @后台人员:
!-->
<template>
    <div>
        <SearchList
            :inputList="inputList"
            @on-search="search"
            @on-reset="search"
        ></SearchList>
        <Button
            type="primary"
            @click="addNew"
            v-hasAuth="'sim-config-addV'"
        >新建</Button>
        <VTable
            class="top15"
            :total="total"
            :current="current"
            :pageSize="pageSize"
            :parColumns="parColumns"
            :parTableData="tableData"
            @changePage="changePage"
            @changePageSize="changePageSize"
        >
        </VTable>
        <Modal
            v-model="addModal"
            :width="500"
            title="实名认证配置"
            :mask-closable="false"
        >
            <Form
                ref="addForm"
                :model="addData"
                :rules="ruleValidate"
                :label-width="120"
            >
                <FormItem
                    label="车辆："
                    prop="vin"
                >
                    <input
                        type="hidden"
                        v-model="addData.vin"
                    >
                    <Select
                        v-model="modelx"
                        filterable
                        remote
                        v-show="addModal"
                        :remote-method="remoteMethod1"
                        :loading="loading1"
                    >
                        <Option
                            v-for="(option, index) in options1"
                            @click.native="handelSelectVehicle(option)"
                            :value="option.value"
                            :key="index"
                        >{{option.label}}</Option>
                    </Select>
                </FormItem>

            </Form>
            <div slot="footer">
                <Button
                    type="text"
                    @click="addModal = false;formReset('addForm')"
                >取消</Button>
                <Button
                    type="primary"
                    @click="addSubmit('addForm')"
                >确认</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import VTable from '_a/v-table/v-table'
import { inputList2, returnFields2, ruleValidate } from '../fields'
import { getVehicleSimList, addVehicleSim, deleteVehicleSim, getvehiclesList } from '_o/api/sim-center'
export default {
  name: '',
  data () {
    return {
      ruleValidate,
      inputList: JSON.parse(JSON.stringify(inputList2)),
      total: 0,
      current: 1,
      pageSize: 10,
      parColumns: [],
      tableData: [],

      // 以下为新增部分，不用可删
      addModal: false,
      editModal: false,
      addData: {
        vin: '',
        carrierType:''
      },
      options1: [],
      modelx: '',
      loading1: false,
      teleList: [
        {
          value: '0',
          label: '联通'
        },
        {
          value: '1',
          label: '移动'
        }
      ],
      searchData: {},
      cascaderList: [],
      cityList: [],
      operatorList: [],
      carList: []
    }
  },
  components: {
    VTable
  },
  created () {
    Object.entries(returnFields2(this)).forEach(([key, value]) => {
      this.parColumns.push(value)
    })
  },
  mounted () {
    this.getTableList()
    // this.inputList[0].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
    this.inputList[0].cascaderList = JSON.parse(localStorage.getItem('pcOperatorList'))
    this.cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
    this.operatorList = JSON.parse(localStorage.getItem('pcOperatorList'))
    this.cityList = JSON.parse(localStorage.getItem('provinceCityList'))
  },
  methods: {
    search (data) {
      this.current = 1
      this.searchData = data
      this.getTableList()
    },
    getTableList () {
      let params = {
        pageSize: this.pageSize,
        currPage: this.current
      }
      this.searchData.carrier = this.searchData.carrier === "_all" ? '': this.searchData.carrier
      Object.assign(params, this.searchData)
      getVehicleSimList(params).then(res => {
        let data = res.data.data
        this.tableData = data && data.list || []
        this.total = data.totalCount || 0
        this.$store.commit("changeLoadingFlag", false);
      })
    },
    changePage (val) {
      this.current = val
      this.getTableList()
    },
    changePageSize (val) {
      this.pageSize = val
      this.getTableList()
    },
    // 获取详情
    getDetail (item) {
      //   this.editData = item
    },
    // 以下为新增部分fun，不用可删
    addNew () {
      this.addModal = true
      this.modelx = ''
    },
    formReset (name) {
      this.$refs[name].resetFields()
    },
    handlechangeSelect (val) {
      let str = val.join(',')
      this.addData.carrier = str
    },
    // 远程获取车辆信息
    remoteMethod1 (query) {
      let params = {
        plateNumKeyWord: query,
        currPage: 1,
        pageSize: 10
      }
      if (query !== '') {
        this.loading1 = true
        getvehiclesList(params).then((res) => {
          this.loading1 = false
          const list = res.data.data.list.map(item => {
            return {
              value: item.plateNum,
              label: item.plateNum + '(' + item.carrierName + ')',
              vin: item.vin,
              plateNum: item.plateNum,
              iccId: item.iccId,
              phoneNum: item.simCardNum,
              carrierType: item.carrierType,
              carrierName:item.carrierName
            }
          })
          this.options1 = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1)
        }, 200)
      } else {
        this.options1 = []
      }
    },
    handelSelectVehicle (item) {
      this.addData = item
    },
    handleDelete (uuid) {
      let params = { uuid: uuid }
      this.$Modal.confirm({
        title: '操作',
        content: '<p>确认要删除吗？</p>',
        onOk: () => {
          deleteVehicleSim(params).then(res => {
            this.getTableList()
            this.$Message.info('操作成功！')
          })
        },
        onCancel: () => {
          this.$Message.info('已取消')
        }
      })
    },
    addSubmit (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let that = this
          let data = {
            vin: this.addData.vin,
            plateNum: this.addData.plateNum,
            iccId: this.addData.iccId,
            phoneNum: this.addData.phoneNum,
            carrier: this.addData.carrierType,
            simAuthStatus: 1
          }
          addVehicleSim(data).then(res => {
            that.getTableList()
            that.$Message.success('操作成功！')
            that.addModal = false
            that.Message.success(res.data.msg)
            that.formReset(name)
          })
        }
      })
    }
  }
}
</script>
<style scoped lang='less'>
</style>
