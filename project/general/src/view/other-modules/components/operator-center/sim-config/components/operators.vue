<!--
 * @description:
 * @author: Tom Dai
 * @date: 2020-02-17 21:16:01
 * @后台人员:
!-->
<template>
  <div>
    <SearchList :inputList="inputList" @on-search="search" @on-reset="search"></SearchList>
    <Button type="primary" @click="addNew" v-hasAuth="'sim-config-addA'">新建</Button>
    <VTable
      class="top15"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
       @changePage="changePage"
       @changePageSize="changePageSize">
     </VTable>
     <Modal v-model="addModal" :width="500" title="实名认证配置" :mask-closable="false" @on-cancel="formReset('addForm')">
       <Form ref="addForm" :model="addData" :rules="ruleValidate" :label-width="120" v-if="addModal">
          <FormItem label="城市-运营商：" prop="agentUuid">
			  <input type="hidden" v-model="addData.cityCode">
            <input type="hidden" v-model="addData.agentUuid">
           <Cascader
            :data="operatorList"
             @on-change='handlechangeAgent'
             filterable
             class="width200">
           </Cascader>
         </FormItem>
         <FormItem label="电信运营商：" prop="carrier">
             <input type="hidden" v-model="addData.carrier">
             <Select v-model="addData.carrierList"
			        v-if="addModal"
             @on-change='handlechangeSelect'
             multiple style="width:200px">
                 <Option v-for="item in teleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
             </Select>
         </FormItem>
       </Form>
       <div slot="footer">
         <Button type="text" @click="addModal = false;formReset('addForm')">取消</Button>
         <Button type="primary" @click="addSubmit('addForm')">确认</Button>
       </div>
     </Modal>
     <Modal v-model="editModal" :width="500" title="实名认证配置" :mask-closable="false" >
       <Form ref="editData" :model="editData" :rules="ruleValidate" :label-width="120">
          <FormItem label="城市-运营商：" prop="agentUuid">
            <input type="hidden" v-model="editData.agentUuid">
			      <input type="hidden" v-model="editData.cityCode">
           <Cascader
           v-if="editModal"
            :data="operatorList"
             @on-change='handlechangeAgent1'
             :value="[editData.provinceCode,editData.cityCode,editData.agentUuid]"
              disabled
             filterable
             class="width200">
           </Cascader>
         </FormItem>
         <FormItem label="电信运营商：" prop="carrier" >
             <input type="hidden" v-model="editData.carrier">
             <Select 
             v-if="editModal"
             :value="editData.carriershow"
             @on-change='handlechangeSelect1'
             multiple style="width:200px">
                 <Option v-for="item in teleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
             </Select>
         </FormItem>
       </Form>
       <div slot="footer">
         <Button type="text" @click="editModal = false;formReset('editData')">取消</Button>
         <Button type="primary" @click="editSubmit('editData')">确认</Button>
       </div>
     </Modal>
  </div>
</template>
<script>
import VTable from '_a/v-table/v-table'
import { inputList, returnFields, ruleValidate } from '../fields'
import { getOperatorSimList, addOperatorSim, deleteOperatorSim,editOperatorSim } from '_o/api/sim-center'
export default {
  name: '',
  data () {
    return {
      ruleValidate,
      inputList: JSON.parse(JSON.stringify(inputList)),
      total: 0,
      current: 1,
      pageSize: 10,
      parColumns: [],
      tableData: [],
      // 以下为新增部分，不用可删
      addModal: false,
      editModal: false,
      addData: {
        cityCode: '',
        agentUuid: '',
        carrier: ''
      },
      editData: {
        cityCode: '',
        agentUuid: '',
        carrier: '',
        carrierShow: ''
      },
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
      operatorList: []
    }
  },
  components: {
    VTable
  },
  created () {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
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
      getOperatorSimList(params).then(res => {
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
	  this.editData = item
	  this.editModal = true
    //   this.editData = item
    },
    // 以下为新增部分fun，不用可删
    addNew () {
      this.addModal = true
    },
    formReset (name) {
	  this.addData =
	  {
	    cityCode: '',
	    agentUuid: '',
	    carrier: ''
	  }

	  this.$refs[name].resetFields()
    },
    handlechangeSelect (val) {
      let str = val.join(',')
      this.addData.carrier = str
    },
    handlechangeCity (val) {
      this.addData.cityCode = val[1]
    },
    handlechangeAgent (val) {
      this.addData.cityCode = val[1]
      this.addData.agentUuid = val[2]
    },
    handlechangeSelect1 (val) {
      let str = val.join(',')
      this.editData.carrier = str
    },
    handlechangeCity1 (val) {
      this.editData.cityCode = val[1]
    },
    handlechangeAgent1 (val) {
      this.editData.agentUuid = val[2]
    },
    handleDelete (uuid) {
      let params = { uuid: uuid }
      this.$Modal.confirm({
        title: '操作',
        content: '<p>确认要删除吗？</p>',
        onOk: () => {
        	deleteOperatorSim(params).then(res => {
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
            agentUuid: this.addData.agentUuid,
            cityCode: this.addData.cityCode,
            carrier: this.addData.carrier
          }
          addOperatorSim(data).then(res => {
			  this.$refs[name].resetFields()
            that.getTableList()
            that.$Message.success('操作成功！')
            that.addModal = false
            that.formReset(name)
          })
        }
      })
    },
    //编辑
    editSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let that = this
          let data = {
            agentUuid: this.editData.agentUuid,
            cityCode: this.editData.cityCode,
            carrier: this.editData.carrier,
            uuid: this.editData.uuid
          }
          editOperatorSim(data).then(res => {
			  this.$refs[name].resetFields()
            that.getTableList()
            that.$Message.success('操作成功！')
            that.editModal = false
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
