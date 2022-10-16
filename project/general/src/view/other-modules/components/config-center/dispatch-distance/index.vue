<!--
 * @description: 配置管理-派单距离管理
 * @author: wuxuan
 * @date: 2019-11-23 14:21:24
!-->
<template>
  <div>
    <search :cityList="cityList" @search="search" @reset="search"></search>
    <Button v-hasAuth="'dispatch-distance-add'" type="primary" @click="addNew">新建</Button>
    <m2-table
      class="top15"
      :total="total"
      :isLoading="isLoading"
      :current="current"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
      <template slot="action" slot-scope="params">
        <Button
          v-hasAuth="'dispatch-distance-edit'"
          ghost
          type="warning"
          size="small"
          class="tableBtn"
          @click="editForm(params.data.row)"
        >
          编辑
        </Button>
        <Button
          v-hasAuth="'dispatch-distance-detail'"
          ghost
          type="info"
          size="small"
          class="tableBtn"
          @click="detailForm(params.data.row)"
        >
          详情
        </Button>
        <Button
          v-hasAuth="'dispatch-distance-switch'"
          ghost
          type="warning"
          size="small"
          class="tableBtn"
          @click="updateStatus(params.data.row)"
        >
          {{params.data.row.status !== 1 ? '停用' : '启用'}}
        </Button>
        <Button
          v-hasAuth="'dispatch-distance-copy'"
          ghost
          type="warning"
          size="small"
          class="tableBtn"
          @click="copyForm(params.data.row)"
        >
          复制
        </Button>
        <!-- <Button
          v-if="params.data.row.scopeType !== 1"
          v-hasAuth="'dispatch-distance-delete'"
          ghost
          type="error"
          size="small"
          @click="deleteFun(params.data.row)"
        >
          删除
        </Button> -->
      </template>
    </m2-table>
    <Modal v-model="addModal" :width="600" :title="modalTitle" :mask-closable="false" @on-cancel="formReset">
      <Form ref="addForm" :model="addData" :rules="ruleValidate" :label-width="190">
        <FormItem label="城市：" prop="codeList">
          <span v-if="!isCityEdit" class="width200">{{addData.provinceAndCityName}}</span>
          <Cascader
            v-else
            v-model="addData.codeList"
            :data="cityList"
            class="width200"
            placeholder="请选择城市"
            :clearable="false"
            @on-change="handleCityChange"
          ></Cascader>
        </FormItem>
        <FormItem v-if="!isCityEdit" label="区县：">
          <span class="width200">{{addData.areaName}}</span>
        </FormItem>
        <FormItem v-if="isCityEdit" label="区县：">
          <Select
            v-model="addData.areaCodeList"
            style="width: 200px"
            placeholder="请选择区县"
            multiple
          >
            <Option
              v-for="item in areaList"
              :key="item.value"
              :value="item.value"
            >
              {{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="业务线：" prop="expandBizLine">
          <span v-if="!isCityEdit" class="width200">{{getBusinessName(addData.expandBizLine)}}</span>
          <Select v-else v-model="addData.expandBizLine" placeholder="请选择业务线" class="width200" @on-change="changeBusiness">
            <Option v-for="item in businessGradeList" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="范围类型：" prop="scopeType">
          <span v-if="!isCityEdit" class="width200">{{scopeTypeMap[addData.scopeType]}}</span>
          <Select v-else v-model="addData.scopeType" placeholder="请选择范围类型" class="width200" @on-change="changeScopeType">
            <Option v-for="item in scopeTypeList" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="产品线：" prop="businessType">
          <Select v-if="addData.scopeType !== fenceTypeValue" v-model="addData.businessType" placeholder="请选择产品线" class="width200" :disabled="!isCityEdit" @on-change="changeProduct"  :multiple="addData.scopeType!==fenceTypeValue">
            <Option
                  v-for="item in productLines"
                  :key="item.vehicleLevel"
                  :value="item.vehicleLevel"
                >
                  {{ item.bizTypeName }}-{{ item.vehicleName }}
                </Option>
          </Select>
          <Select v-if="addData.scopeType === fenceTypeValue" v-model="addData.businessType" placeholder="请选择产品线" class="width200" :disabled="!isCityEdit" @on-change="changeProduct" :multiple="addData.scopeType!==fenceTypeValue">
            <Option
                  v-for="item in bizTypeLists"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
          </Select>
        </FormItem>
        <FormItem v-if="addData.businessType && addData.scopeType === fenceTypeValue" label="车型等级：" prop="carLevel">
          <Select
            v-model="addData.carLevel"
            placeholder="请选择车型等级"
            class="width200"
            :disabled="!isCityEdit"
            multiple
          >
            <Option
              v-for="item in carLevelList"
              :key="item.vehicleLevel"
              :value="item.vehicleLevel"
              multiple
            >
              {{item.vehicleName}}
            </Option>
          </Select>
        </FormItem>
        <!-- 范围类型为范围类，由此选项 -->
        <FormItem v-if="addData.scopeType === fenceTypeValue" label="电子围栏：" prop="fenceUuid">
          <span v-if="!isCityEdit" class="width200">{{addData.fenceName}}</span>
          <Select v-else v-model="addData.fenceUuid" placeholder="请选择电子围栏" class="width200">
            <Option v-for="item in fenceList" :key="item.uuid" :disabled="item.disabled" :value="item.uuid">{{item.name}}</Option>
          </Select>
        </FormItem>
        <!-- 时段范围 -->
        <Form
          v-for="(item,index) in addData.timeRangeDtoList"
          :ref="'timeScope' + index"
          :key="index"
          :model="item"
          :rules="timeScopeRules"
          :label-width="190"
          class="rel-box"
        >
          <FormItem :label="'时段' + (index + 1) + ' ：'" prop="time">
            <span v-if="!isAdd" class="width200">{{item.startTime + '-' + item.endTime}}</span>
            <TimePicker
              v-if="isAdd"
              v-model="item.time"
              class="right30"
              :editable="false"
              type="timerange"
              placeholder="请选择时段"
              style="width: 200px"
              @on-change="timeChange(index)"
            >
            </TimePicker>
          </FormItem>
          <FormItem label="范围：" prop="scope">
            <span v-if="!isAdd">{{item.scope}}</span>
            <InputNumber
              v-if="isAdd"
              v-model="item.scope"
              style="width: 200px"
              :min="0.1"
              :max="15"
              :step="0.1"
              placeholder="请输入范围"
              @on-blur="FormatNumber(true,item.scope,index)"
            ></InputNumber> 公里
          </FormItem>
          <FormItem v-if="isAdd || item.enableRideTime === true" class="no-left">
            <Checkbox v-model="item.enableRideTime" :disabled="!isAdd" @on-change="item.rideTime = null">启用接乘时长限制</Checkbox>
          </FormItem>
          <FormItem v-if="item.enableRideTime" label="接乘时长限制：" prop="rideTime">
            <span v-if="!isAdd" class="width200">{{item.rideTime}}分钟内</span>
            <Select
              v-else
              v-model="item.rideTime"
              placeholder="请选择"
              class="width200"
            >
              <Option v-for="item in 30" :key="item" :value="item">{{item}}分钟内</Option>
            </Select>
          </FormItem>
          <Icon v-if="index > 0 && isAdd" class="remove-icon" type="ios-remove-circle-outline" @click="removeTime(index)" />
        </Form>
        <Button v-if="isAdd && addData.timeRangeDtoList && addData.timeRangeDtoList.length < 5" type="primary" size="small" style="margin:0 0 20px 190px;" @click="addTimeItem">添加时段</Button>
      </Form>
      <div slot="footer">
        <Button type="text" @click="addCancel">取消</Button>
        <Button type="primary" @click="addSubmit('addForm')">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import { dataObj, returnFields } from "./fields"
import { cpTranslate } from "@/libs/tools"
import { tool, tips } from "./mixin";
import {
  axiosQueryDispatchInfoPage,
  axiosInsertDispatchInfo,
  axiosUpdateDispatchInfo,
  axiosDeleteDispatchInfo,
  axiosGetDispatchFenceList,
  getCitys,
  getAreaInfoByCityCode,
  axiosdispatchDistanceUpdateSatatus
} from "_o/api/configData.js"
import { hasTimesection } from "@/libs/tools.js"
import { mapState, mapGetters } from "vuex"
import search from "./search.vue"

const cachedProvinceListKey = "_setedProvinceCityList";
const _fenceTypeValue = 2 // 范围类型为围栏类的value值
const _dispatchRailType = 5 // 围栏类型为派单围栏的枚举value

export default {
  name: "dispatch-distance",
  components: {
    m2Table,
    search
  },
  mixins: [tool, tips],
  data() {
    const timeValidat = (rule, value, callback) => {
      let res = value.every(item => {
        return item
      })
      if (!res) {
        callback(new Error("请选择时间"));
      } else if (value[0] == value[1]) {
        callback(new Error("开始时段不可等于结束时段"))
      } else {
        // 时间交叉
        let list = this.addData.timeRangeDtoList
        let num = 0
        for (let i = 0; i < list.length; i++) {
          if (!hasTimesection(value, list[i].time)) {
            num++
          }
        }
        if (num > 1) {
          callback(new Error("时段不可交叉"))
        } else {
          callback()
        }
      }
    }
    return {
      ...JSON.parse(JSON.stringify(dataObj)),
      tableData: [],
      parColumns: [],
      // 以下为新增部分，不用可删
      addModal: false,
      isAdd: true, // 是否为新增，true：新增，false
      isCityEdit: true, // 城市是否可以编辑
      addData: dataObj.formatData,
      cityList: [],
      fenceList: [],
      fenceTypeValue: _fenceTypeValue, // 范围类型为围栏类的value值
      timeScopeRules: {
        time: [
          { required: true, type: "array", message: "请选择时间", trigger: "blur" },
          { required: true, validator: timeValidat, trigger: "change" }
        ],
        scope: [
          { required: true, type: "number", message: "请填写范围", trigger: "blur" }
        ],
        rideTime: [
          { required: true, type: "number", message: "请选择接乘时长限制", trigger: "change" }
        ]
      },
      modalTitle: "新建",
      areaList: [],
      productLines: [], // 产品线
      bizTypeLists: []
    }
  },
  computed: {
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList,
      bizTypeList: (state) => state.common.bizTypeList
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    }),
  },
  watch: {
    addModal(val) {
      if (val && this.isCityEdit) {
        this.productLines = []
        this.modalTitle === '新建' && this.formReset()
      }
      this.$refs["addForm"] && this.$refs["addForm"].resetFields()
    }
  },
  created() {
    this.parColumns.length === 0 &&
      Object.entries(returnFields(this)).forEach(([key, value]) => {
        this.parColumns.push(value);
      });
  },
  mounted() {
    this.getTableList()
    this.getCityList()
  },
  methods: {
    // 获取已配置省市
    async getCityList() {
      let dataP = [];
      const [err, data] = await this.toResult(getCitys());
      if (err) dataP = [];
      dataP = cpTranslate(data);
      this.cityList = dataP;
    },
    // 根据围栏类型，产品线，省市，获取电子围栏列表
    async getFenceList() {
      const [provinceCode, cityCode] = this.addData.codeList
      this.addData.cityCode = cityCode
      this.addData.provinceCode = provinceCode

      this.addData.fenceUuid = ""
      // 非围栏类不用管
      if (this.addData.scopeType !== this.fenceTypeValue) {
        return false
      }
      // 围栏类先判断请求条件是否齐全了
      let list = []
      if (!this.addData.cityCode) {
        list = [{
          name: "请先选择城市",
          uuid: "0",
          disabled: true,
        }]
      } else if (!this.addData.businessType) {
        list = [{
          name: "请先选择产品线",
          uuid: "0",
          disabled: true,
        }]
      } else {
        let params = {
          cityCode: this.addData.cityCode,
          businessType: this.addData.scopeType === this.fenceTypeValue ? this.addData.businessType : this.addData.businessType.split("#")[1]
        }
        const [err, data] = await this.toResult(axiosGetDispatchFenceList(params));
        if (err) list = []
        else list = data

      }
      this.fenceList = list
    },
    timeChange(index) {
      let time = this.addData.timeRangeDtoList[index].time
      this.addData.timeRangeDtoList[index].startTime = time[0]
      this.addData.timeRangeDtoList[index].endTime = time[1]
    },
    FormatNumber(isList, VauleNumber, index, fixNum = 1) {
      if (VauleNumber) {
        let newVal = parseFloat(VauleNumber.toFixed(fixNum))
        if (isList) this.addData.timeRangeDtoList[index].scope = newVal
      }
    },
    addTimeItem() {
      this.addData.timeRangeDtoList.push({
        scope: null,
        time: "",
        enableRideTime: false,
        rideTime: null
      })
    },
    removeTime(index) {
      this.addData.timeRangeDtoList.splice(index, 1)
    },
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.getTableList();
    },
    getTableList() {
      let params = {
        pageSize: this.pageSize,
        currPage: this.current,
        ...this.searchData
      }
      this.isLoading = true
      axiosQueryDispatchInfoPage(params).then(res => {
        let data = res.data.data
        this.tableData = data && data.list || []
        this.total = data.totalCount || 0
        this.isLoading = false
      })
    },
    changePage(val) {
      this.current = val
      this.getTableList()
    },
    changePageSize(val) {
      this.pageSize = val
      this.getTableList()
    },
    // 以下为新增部分fun，不用可删
    addNew() {
      this.modalTitle = "新建"
      this.isAdd = true
      this.isCityEdit = true
      this.addData = dataObj.formatData
      this.addModal = true
    },
    editForm(data) {
      this.modalTitle = "编辑"
      this.isAdd = true
      this.isCityEdit = false
      let obj = JSON.parse(JSON.stringify(data))
      obj.codeList = [data.provinceCode, data.cityCode]
      obj.timeRangeDtoList.forEach(item => {
        item.time = [item.startTime, item.endTime]
      })
      this.changeBusiness(data.expandBizLine,true)
      this.changeProduct(data.businessType,true)
      let params = {
        cityCode: obj.cityCode,
        businessType: obj.businessType
      }
      axiosGetDispatchFenceList(params).then(res => {
        this.fenceList = res.data.data || []
        this.fenceList.push({
          uuid: this.addData.fenceUuid,
          name: this.addData.fenceName
        })
          const product = this.bizTypeLists.find(v =>  v.value == data.businessType)
          this.$nextTick(() => {
            this.getAreaByCityCode(obj.cityCode)
            this.carLevelList = product ? product.levels : []
            if(data.scopeType !== this.fenceTypeValue) {
              obj.businessType = `${obj.expandBizLine}#${obj.businessType}#${obj.carLevel[0]}`
            }
            this.addData = { ...obj }
            this.addModal = true
          })
      })
    },
    detailForm(data) {
      this.modalTitle = "详情"
      this.isAdd = false
      this.isCityEdit = false
      // 更新下拉
      this.changeBusiness(data.expandBizLine,true)
      this.changeProduct(data.businessType,true)
      let params = JSON.parse(JSON.stringify(data))
      const product = this.bizTypeLists.find(v => v.value === data.businessType)
      const {expandBizLine,businessType,carLevel} = params
      const carLevels = carLevel[0]
      this.carLevelList = product ? product.levels : []
      if(params.scopeType !== this.fenceTypeValue) {
        params.businessType = `${expandBizLine}#${businessType}#${carLevels}`
      }
      this.$nextTick(()=>{
        this.$set(this,'addData',params)
        this.addModal = true
      })

    },
    deleteFun(data) {
      this.tips(`确认要删除该派单距离管理策略么？`, {
        onOk: async () => {
          const [err, res] = await this.toResult(axiosDeleteDispatchInfo({ uuid: data.uuid }));
          if (err) return;
          this.getTableList();
          this.$Message.success("删除成功!");
        }
      });
    },
    formReset(name) {
      this.$set(this,'addData',JSON.parse(JSON.stringify(this.formatData)))
      this.$refs["timeScope0"] && this.$refs["timeScope0"][0].resetFields()
    },
    addCancel(){
      this.formReset()
      this.addModal = false
    },
    validateTime(list) {
      let message = "时段必须组成完整的00:00:00至23:59:59"
      let isStart = false
      let isEnd = false
      let startHash = {}
      let endHash = {}
      list.forEach(item => {
        if (item.startTime == "00:00:00") {
          isStart = true
        }
        if (item.endTime == "23:59:59") {
          isEnd = true
        }
        startHash[item.startTime] = item.startTime
        endHash[item.endTime] = item.endTime
      })
      if (!isStart || !isEnd) {
        this.$Message.warning(message)
        return false
      }
      if (list.length === 1) {
        return true
      }
      let isFull = true
      list.forEach((item, index) => {
        let startTime = item.startTime
        if (startTime != "00:00:00") {
          if (!endHash[startTime]) {
            isFull = false
          }
        }
      })
      if (isFull) {
        return true
      } else {
        this.$Message.warning(message)
        return false
      }
    },
    addSubmit(name) {
      if (!this.isAdd) {
        this.formReset()
        this.addModal = false
        return false
      }
      let [isSuccessForm, isSuccessList] = [false, true]
      let timeRangeDtoList = this.addData.timeRangeDtoList
      this.$refs[name].validate().then(status => {
        isSuccessForm = status
        return new Promise((resolve) => { resolve() })
      }).then(() => {
        timeRangeDtoList.forEach((item, index) => {
          let key = "timeScope" + index
          this.$refs[key][0].validate().then(status => {
            if (!status) {
              isSuccessList = false
            }
          });
        })
        return new Promise((resolve) => { resolve() })
      }).then(() => {
        if (isSuccessForm && isSuccessList) {
          let isFullTime = this.validateTime(timeRangeDtoList)
          if (!isFullTime) {
            return false
          }
          let params = { ...this.addData }
          delete params.codeList
          if(params.scopeType !== this.fenceTypeValue) {
             params.businessCarlevels = params.businessType.map(it =>{
              const arr = it.split('#')
              return {
                productLine: Number(arr[1]),
                carLevel:Number(arr[2])
              }
            })
          } else {
            params.businessCarlevels = params.carLevel.map(it =>{
              return {
                productLine: Number(params.businessType),
                carLevel:Number(it)
              }
            })
          }
          delete params.businessType
          delete params.carLevel
          let axiosFun = this.isCityEdit ? axiosInsertDispatchInfo : axiosUpdateDispatchInfo
          axiosFun(params).then(res => {
            let msg = this.isCityEdit ? "新建成功" : "编辑成功"
            this.$Message.success(msg);
            this.formReset()
            this.addModal = false
            this.getTableList();
          }).catch(e => {
            this.$Message.warning(e.msg);
          })
        }
      })
    },
    // 城市变更
    handleCityChange(val) {
      const cityCode = val[1]
      this.getAreaByCityCode(cityCode)
      this.getFenceList()
    },
    // 获取区县
    async getAreaByCityCode(val) {
      const res = await getAreaInfoByCityCode({ cityCode: val })
      if (res.data.success) {
        // 清空已选值
        this.addData.areaCodeList = []
        const list = res.data.data.map(it => {
          return {
            label: it.orgName,
            value: it.orgCode
          };
        })
        this.$nextTick(() => {
          this.areaList = list
        })
      }
    },
    changeBusiness(val,isRow){
        if(val){
        let tempArr = this.businessGradeList.find(it=> it.value === val).children
        this.productLines = [...tempArr.map(it => {
            let list = it.levels.map(item =>{
                return {
                    ...item,
                    bizType: it.bizType,
                    bizTypeName:it.bizTypeName,
                    vehicleLevel: `${val}#${it.bizType}#${item.vehicleLevel}`,
                }
            })
            return list
        }).flat()]
        this.bizTypeLists = tempArr
        if(!isRow){
          this.addData.businessType = this.addData.scopeType !==  this.fenceTypeValue ? [] : ""
          this.addData.carLevel = [];
          this.carLevelList = []
        }
      }
    },
    // 选择产品线
    changeProduct(val,isRow) {
      // 更新车型
      const product = this.bizTypeList.find(v => v.bizType === val)
      !isRow ? this.addData.carLevel = [] : "";
      this.$nextTick(() => {
        this.carLevelList = product ? product.levels : []
        this.getFenceList()
      })
    },
    getBusinessName(val) {
      const { businessKeyValue } = this.businessGradeName
      return businessKeyValue[val] || ""
    },
    changeScopeType() {
      this.addData.businessType = this.addData.scopeType !==  this.fenceTypeValue ? [] : ""
    },
    updateStatus({uuid,status}) {
      this.$Modal.confirm({
        title: `是否确认${status === 0 ? "停用" : "启用"}该策略？`,
        onOk: () => {
          axiosdispatchDistanceUpdateSatatus({ uuid,status: status === 0 ? 1: 0 }).then((res) => {
            if(res.data.success){
              this.$Message.success(`${status === 0 ? "停用" : "启用"}成功`);
            } else{
              this.$Message.success(res.data.msg);
            }
            this.search({});
          });
        },
      });
    },
    copyForm(row) {
      this.modalTitle = "复制"
      this.isAdd = true
      this.isCityEdit = true
      //复制内容为范围类型、时段、距离、接驾时长
      const {scopeType, timeRangeDtoList} = row
      let data = {
        ...dataObj.formatData,
        scopeType,
        timeRangeDtoList:timeRangeDtoList.map(it=>{
          return {
            ...it,
            time:[it.startTime,it.endTime]
          }
        })
      }
      this.$set(this, "addData", data)
      this.addModal = true
    },
    getProductName(val) {
      const { productKeyValue } = this.businessGradeName
      return productKeyValue[val] || ""
    }
  }
}
</script>
<style scoped lang='less'>
.rel-box{
  position: relative;
  border: 1px dashed #ddd;
  padding-top:10px;
  margin-bottom:5px;
}
.remove-icon{
  position: absolute;
  right:100px;
  top:50px;
  font-size: 20px;
  color:#e61f10;
  font-weight: bold;
  cursor: pointer;
}
.no-left{
  /deep/ .ivu-form-item-content{
    margin-left: 130px !important;
  }
}
</style>
