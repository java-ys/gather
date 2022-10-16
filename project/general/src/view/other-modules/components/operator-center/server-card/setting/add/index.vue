<template>
  <div class="server-add new-ue">
    <Card class="server-card">
      <Form
        ref="addForm"
        :model="addData"
        :rules="ruleValidate"
        :label-width="150"
      >
        <div class="class-tit bottom20">服务卡基本信息</div>
        <Row>
          <Col span="8">
          <FormItem
            label="服务卡名称："
            prop="scName"
          >
            <span v-if="!isAdd">{{addData.scName}}</span>
            <Input
              v-else
              class="width200"
              v-model="addData.scName"
              :maxlength="20"
              placeholder="请输入策略名称"
            />
            <span class="counter" v-if="isAdd">( {{ addData.scName ? addData.scName.length:0 }}/20 )</span>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem
            class="height-form"
            label="服务卡生效城市："
            prop="cityCodeList"
          >
            <span v-if="!isAdd" style="display:inline-block;width:320px;">{{ addData.cityName }}</span>
            <Select
              v-else
              v-model="addData.cityCodeList"
              filterable
              multiple
              clearable
              placeholder="请选择城市"
              style="width:320px;"
              @on-change="v=>{mutexValid(v,'cityCodeList')}"
            >
              <Option :value="allValue">全部</Option>
              <Option
                v-for="item in cityList"
                :key="item.value"
                :value="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem
            label="产品线："
            prop="businessLineList"
          >
            <span v-if="!isAdd">{{ businessName }}</span>
            <Select
              v-else
              v-model="addData.businessLineList"
              filterable
              multiple
              clearable
              placeholder="请选择产品线"
              class="width300"
              @on-change="v=>{mutexValid(v,'businessLineList')}"
            >
              <Option :value="allValue">全部</Option>
              <Option
                v-for="item in businessLineInfo.list"
                :key="item.value"
                :value="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem
            label="夜间生效时段："
            prop="startTimeNep"
          >
            <span v-if="!isAdd">{{timeComputed}}</span>
            <div v-else>
              <TimePicker
                type="time"
                placeholder="开始时间"
                :disabled-hours="[7,8,9,10,11,12,13,14,15,16,17,18,19,20]"
                v-model="addData.startTimeNep"
                :editable="false"
                format="HH:mm"
                style="width: 100px"
                @on-change="validItem('addForm','startTimeNep')"
              ></TimePicker>
              <span class="inline-box margin5"> - </span>
              <FormItem
                prop="endTimeNep"
                class="inline-box"
              >
                <TimePicker
                  type="time"
                  placeholder="结束时间"
                  v-model="addData.endTimeNep"
                  :disabled-hours="[7,8,9,10,11,12,13,14,15,16,17,18,19,20]"
                  :editable="false"
                  format="HH:mm"
                  style="width: 100px"
                  @on-change="validItem('addForm','endTimeNep')"
                ></TimePicker>
              </FormItem>
            </div>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem
            label="服务卡生效日期："
            prop="effectDate"
          >
            <span v-if="!isAdd">{{addData.startTimeEtsc}} —— {{addData.endTimeEtsc}}</span>
            <DatePicker
              v-else
              type="daterange"
              v-model="addData.effectDate"
              placeholder="请选择生效日期"
              :editable="false"
              separator=" —— "
              class="width300"
              :options="dateOptions"
              @on-change="validItem('addForm','effectDate')"
            >
            </DatePicker>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem
            label="是否影响上线："
            prop="onlineStatus"
          >
            <RadioGroup
              v-model="addData.onlineStatus"
              :disabled="!isAdd"
            >
              <Radio
                :label="1"
                :disabled="!isAdd"
              >
                是
              </Radio>
              <Radio
                :label="0"
                :disabled="!isAdd"
              >
                否
              </Radio>
            </RadioGroup>
          </FormItem>
          </Col>
        </Row>
        <div class="class-tit bottom20">
          服务卡接单资质项目
          <Button
            v-if="isDetail && addData.scStatus<2"
            type="primary"
            class="right-btn"
            @click="isEdit = true"
          >编辑</Button>
        </div>
        <div class="check-list">
          <Form
            ref="checkForm"
            :model="qualificationObj"
            :rules="ruleValidate"
            :label-width="150"
          >
            <div class="bottom25">
              <Checkbox
                v-model="qualificationObj.isQualified"
                :disabled="isDetail"
              ></Checkbox>
              背景审查合格
            </div>
            <div class="bottom25">
              <Checkbox
                v-model="qualificationObj.entryDaysFlag"
                :disabled="isDetail"
                @on-change="qualificationObj.entryDays=null"
              ></Checkbox>
              入职满
              <span
                v-if="!qualificationObj.entryDaysFlag"
                class="input-dis"
              >请输入</span>
              <FormItem
                v-else
                prop="entryDays"
                class="inline-item"
              >
                <InputNumber
                  v-model="qualificationObj.entryDays"
                  :precision="0"
                  :min="1"
                  :disabled="isDetail"
                  placeholder="请输入"
                  style="width:90px;"
                ></InputNumber>
              </FormItem>
              天
            </div>
            <div class="bottom25">
              <Checkbox
                v-model="qualificationObj.isCompliance"
                :disabled="isDetail"
              ></Checkbox>
              双证合规(网络预约出租汽车驾驶员证+网络预约出租汽车运输证)
            </div>
            <div class="bottom25">
              <Checkbox
                v-model="qualificationObj.safetyComplaintsFlag"
                :disabled="isDetail"
                @on-change="qualificationObj.safetyComplaints=null"
              >
              </Checkbox>
              <span
                v-if="!qualificationObj.safetyComplaintsFlag"
                class="input-dis"
              >请输入</span>
              <FormItem
                v-else
                prop="safetyComplaints"
                class="inline-item"
              >
                <InputNumber
                  v-model="qualificationObj.safetyComplaints"
                  :precision="0"
                  :min="1"
                  :disabled="!qualificationObj.safetyComplaintsFlag || isDetail"
                  placeholder="请输入"
                  style="width:90px;"
                ></InputNumber>
              </FormItem>
              个月内无安全投诉
            </div>
          </Form>
          <Form
            ref="accidentForm"
            :model="qualificationObj.accidentObj"
            :rules="ruleValidate"
            :label-width="150"
          >
            <div class="bottom25">
              <Checkbox
                v-model="qualificationObj.accidentFlag"
                :disabled="isDetail"
                @on-change="clearObjAndCount('accidentObj')"
              >
              </Checkbox>
              <span
                v-if="!qualificationObj.accidentFlag"
                class="input-dis"
              >请输入</span>
              <FormItem
                v-else
                prop="monthCount"
                class="inline-item"
              >
                <InputNumber
                  v-model="qualificationObj.accidentObj.monthCount"
                  :precision="0"
                  :min="1"
                  :disabled="!qualificationObj.accidentFlag || isDetail"
                  placeholder="请输入"
                  style="width:90px;"
                ></InputNumber>
              </FormItem>
              个月内无人伤事故
              <Button
                v-if="!isDetail"
                :disabled="!qualificationObj.accidentFlag"
                type="primary"
                class="left15"
                @click.stop="openModal('accidentModal')"
              >+添加事故类别</Button>
              <div class="height0">
                <FormItem
                  v-if="qualificationObj.accidentFlag"
                  class="inline-item empty-item left-ac height0-form"
                  prop="accidentCategory"
                ></FormItem>
              </div>
            </div>
            <div
              v-for="(it,index) in qualificationObj.accidentObj.accidentCategory"
              :key="it.key"
              class="task-item"
              :class="{'leftbox':!isAdd&&!isEdit}"
            >
              <Icon
                v-if="isAdd||isEdit"
                class="remove-icon"
                type="md-remove-circle"
                @click="qualificationObj.accidentObj.accidentCategory.splice(index,1)"
              />
              <span class="task-title">{{it.desc}}</span>
            </div>
          </Form>
          <Form
            ref="countForm"
            :model="qualificationObj.accidentObjAndCount"
            :rules="ruleValidate"
            :label-width="150"
          >
            <div class="bottom25">
              <Checkbox
                v-model="qualificationObj.accidentObjAndCountFlag"
                :disabled="isDetail"
                @on-change="clearObjAndCount('accidentObjAndCount')"
              ></Checkbox>
              <span
                v-if="!qualificationObj.accidentObjAndCountFlag"
                class="input-dis"
              >请输入</span>
              <FormItem
                v-else
                prop="monthCount"
                class="inline-item"
              >
                <InputNumber
                  v-model="qualificationObj.accidentObjAndCount.monthCount"
                  :precision="0"
                  :min="1"
                  :disabled="isDetail"
                  placeholder="请输入"
                  style="width:90px;"
                ></InputNumber>
              </FormItem>
              个月内事故数{{'<'}}
                <span
                v-if="!qualificationObj.accidentObjAndCountFlag"
                class="input-dis"
              >请输入</span>
                <FormItem
                  v-else
                  prop="accidentCount"
                  class="inline-item"
                >
                  <InputNumber
                    v-model="qualificationObj.accidentObjAndCount.accidentCount"
                    :precision="0"
                    :min="1"
                    :disabled="isDetail"
                    placeholder="请输入"
                    style="width:90px;"
                  ></InputNumber>
                </FormItem>
                次
                <Button
                  v-if="!isDetail"
                  :disabled="!qualificationObj.accidentObjAndCountFlag"
                  type="primary"
                  class="left15"
                  @click.stop="openModal('accidentTimesModal')"
                >+添加事故类别</Button>
                <div class="height0">
                  <FormItem
                    v-if="qualificationObj.accidentObjAndCountFlag"
                    class="inline-item empty-item height0-form"
                    prop="accidentCategory"
                  ></FormItem>
                </div>
            </div>
            <!-- 事故类别列表 -->
            <div
              v-for="(it,index) in qualificationObj.accidentObjAndCount.accidentCategory"
              :key="it.key"
              class="task-item"
              :class="{'leftbox':!isAdd&&!isEdit}"
            >
              <Icon
                v-if="isAdd||isEdit"
                class="remove-icon"
                type="md-remove-circle"
                @click="qualificationObj.accidentObjAndCount.accidentCategory.splice(index,1)"
              />
              <span class="task-title">{{it.desc}}</span>
            </div>
          </Form>
        </div>

        <div class="class-tit bottom20 top30">服务卡安全学习任务配置</div>
        <!-- 学习任务 -->
        <div class="left15 task-list">
          <p>学习任务：</p>
          <div v-if="!isAdd && !addData.scStudyConfigReq.studyTasks.length" class="no-data">暂无</div>
          <div v-else>
            <div
              v-for="(study,index) in addData.scStudyConfigReq.studyTasks"
              :key="study.uuid"
              class="task-item"
            >
              <Icon
                v-if="isAdd"
                class="remove-icon"
                type="md-remove-circle"
                @click="removeItem(index,'studyTasks')"
              />
              <span class="task-title">{{study.learningTaskName}}</span>
            </div>
          </div>
          <Button
            v-if="isAdd"
            type="primary"
            class="top15"
            @click="studyModal = true"
          >+添加学习任务</Button>
        </div>
        <!-- 考试任务 -->
        <div class="top30 left15 task-list">
          <p>考试任务：</p>
          <div v-if="!isAdd && !addData.scStudyConfigReq.examTasks.length" class="no-data">暂无</div>
          <div v-else>
            <div
              v-for="(study,index) in addData.scStudyConfigReq.examTasks"
              :key="study.uuid"
              class="task-item"
            >
              <Icon
                v-if="isAdd"
                class="remove-icon"
                type="md-remove-circle"
                @click="removeItem(index,'examTasks')"
              />
              <span class="task-title">{{study.examTaskName}}</span>
            </div>
          </div>
          <Button
            v-if="isAdd"
            type="primary"
            class="top15"
            @click="taskModal = true"
          >+添加考试任务</Button>
        </div>
      </Form>
      <div class="dash-line"></div>
      <div class="footer-box">
        <Button
          v-if="handleType!==3||isEdit"
          size="large"
          class="right15"
          @click="formReset('addForm')"
        >取消</Button>
        <Button
          type="primary"
          size="large"
          :loading="addLoading"
          @click="addSubmit('addForm')"
        >
          <span v-if="!addLoading">完成</span>
          <span v-else>提交中</span>
        </Button>

      </div>
    </Card>
    <accident-modal
      :show="accidentModal"
      :list="qualificationObj.accidentObj.accidentCategory"
      @close="accidentModal = false"
      @getAccident="getAccident"
    ></accident-modal>
    <accident-modal
      :show="accidentTimesModal"
      :list="qualificationObj.accidentObjAndCount.accidentCategory"
      @close="accidentTimesModal = false"
      @getAccident="getTimesAccident"
    ></accident-modal>
    <study-modal
      :show="studyModal"
      :list="addData.scStudyConfigReq.studyTasks"
      @close="studyModal = false"
      @selectDown="studySelectDown"
    ></study-modal>
    <task-modal
      :show="taskModal"
      :list="addData.scStudyConfigReq.examTasks"
      @close="taskModal = false"
      @selectDown="taskSelectDown"
    ></task-modal>
  </div>
</template>
<script>
import accidentModal from './accident-modal.vue'
import studyModal from './study-modal/index.vue'
import taskModal from './task-modal/index.vue'
import { orderTypeMap } from "_g/config/status-map";
import { getAppointedCityList } from '_g/api/common.js'
import { hasTimesection } from "@/libs/tools.js";
import {
  handleTypeMap,
  ruleValidate,
} from "./fields";
import {
  businessLineInfo,
  businessLine
} from "../fields";
import {
  axiosRecordSave,
  axiosRecordUpdat,
  axiosRecordDetail
} from "_o/api/operator-center/server-card";

const qArr = [
  'isQualified',
  'entryDaysFlag',
  'isCompliance',
  'safetyComplaintsFlag',
  'accidentFlag',
  'accidentObjAndCountFlag',
]
export default {
  name: "channel-price-add",
  data () {
    return {
      ruleValidate,
      orderTypeMap,
      handleTypeMap,
      businessLineInfo,
      handleType: Number(this.$route.query.type),
      uuid: this.$route.params.uuid,
      addData: {
        scName: '',
        cityCodeList: [],
        businessLineList: [],
        startTimeNep: '',
        endTimeNep: '',
        effectDate: [],
        onlineStatus: 0,
        scStudyConfigReq: {
          studyTasks: [],
          examTasks: []
        }
      },
      qualificationObj: {
        isQualified: false,
        entryDaysFlag: false,
        entryDays: null,
        isCompliance: false,
        safetyComplaintsFlag: false,
        safetyComplaints: null,
        accidentFlag: false,
        accidentObj: {
          monthCount: null,
          accidentCategory: []
        },
        accidentObjAndCountFlag: false,
        accidentObjAndCount: {
          monthCount: null,
          accidentCount: null,
          accidentCategory: []
        }
      },
      allValue: '111111',//城市和产品线全部的枚举
      cityList: [],
      addLoading: false,
      dateOptions: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      accidentModal: false,
      accidentTimesModal: false,
      studyModal: false,
      taskModal: false,
      isEdit: this.$route.query.type==='2'
    };
  },
  components: {
    accidentModal,
    studyModal,
    taskModal
  },
  // 根据新增，编辑，详情类型，修改meta信息
  beforeRouteEnter (to, from, next) {
    let uuid = to.params.uuid;
    let type = Number(to.query.type);
    to.meta.title = handleTypeMap[type].title
    to.meta.closeAlert = handleTypeMap[type].closeAlert
    next();
  },
  // 路由更新
  beforeRouteUpdate (to, from, next) {
    this.handleType = Number(to.query.type)
    this.uuid = to.params.uuid || ''
    if (this.uuid) {
      this.getDetailInfo(to.params.uuid);
    }
    next();
  },
  computed: {
    // 是否是详情
    isDetail () {
      return this.handleType === 3 && !this.isEdit;
    },
    // 是否是新增
    isAdd () {
      return this.handleType === 1 && !this.isEdit;
    },
    // 夜间生效时段
    timeComputed () {
      if (this.isAdd) return false
      let startTime = this.addData.startTimeNep
      let endTime = this.addData.endTimeNep
      let msg = ''
      let start = new Date(`2000-01-10 ${startTime}:00`)
      let end = new Date(`2000-01-10 ${endTime}:00`)
      start >= end && (msg = '次日')
      return `${startTime} - ${msg}${endTime}`
    },
    businessName(){
      if(this.isAdd){
        return ''
      }else{
        let arr = this.addData.businessLineList
        if(arr.length===0||!arr.join('')){
          return '暂无'
        }else{
          if(arr[0]===this.allValue){
            return '全部'
          }else{
            return this.addData.businessLineList.map(b=>businessLineInfo.map[b]).join(',')
          }
        }
      }
    }
  },
  mounted () {
    this.getCityList()
    this.getDetailInfo(this.uuid);
  },
  methods: {
    // 获取详情
    getDetailInfo (uuid) {
      // 没有uuid，说明是新增
      if (!uuid) {
        return false
      }
      axiosRecordDetail({
        recordUuid: uuid
      }).then(res => {
        let data = res.data.data || {}
        data.cityCodeList = data.cityCode.split(',')
        data.businessLineList = data.plType.split(',')
        data.effectDate = [data.startTimeEtsc, data.endTimeEtsc]

        let qObj = data.qualificationObj
        if (qObj.accidentObj.accidentCategory) {
          qObj.accidentObj.accidentCategory = qObj.accidentObj.accidentCategory.map(v => {
            return {
              desc: v.desc.join(' > ')
            }
          })
        }
        if (qObj.accidentObjAndCount.accidentCategory) {
          qObj.accidentObjAndCount.accidentCategory = qObj.accidentObjAndCount.accidentCategory.map(v => {
            return {
              desc: v.desc.join(' > ')
            }
          })
        }

        this.qualificationObj = qObj
        this.addData = data
      })
    },
    // 新增&编辑-提交校验&数据组装
    async addSubmit (name) {
      if (this.isDetail && !this.isEdit) {
        this.formReset();
        return false;
      }
      // addForm表单校验
      let addFormValid = await this.$refs[name].validate()
      let checkFormValid = await this.validEmptyForm('checkForm')
      let accidentFormValid = await this.validEmptyForm('accidentForm')
      let countFormValid = await this.validEmptyForm('countForm')

      // 服务卡接单资质项目  至少选中一个
      let isQualitSuccess = qArr.some(k => this.qualificationObj[k])
      !isQualitSuccess && this.$Message.error('请至少选择一个服务卡接单资质项目')

      // 时段校验
      if(this.isAdd){
        let start = new Date(`2000-01-10 ${this.addData.startTimeNep}:00`).getTime()
        let end = new Date(`2000-01-10 ${this.addData.endTimeNep}:00`).getTime()
        let endStart = new Date(`2000-01-10 06:00:00`).getTime()
        let midStart = new Date(`2000-01-10 07:00:00`).getTime()
        if(start===end){
          this.$Message.error('夜间生效时段开始时间不能等于结束时间')
          return false
        }else if(start<endStart && start > end){
          // 开始时间小于6点，结束时间大于开始时间
          this.$Message.error('夜间生效时段仅支持21:00到6:00')
          return false
        }else if((start>endStart && start < midStart) || (end>endStart && end < midStart)){
          // 开始时间或者结束时间在6-7点之间
          this.$Message.error('夜间生效时段仅支持21:00到6:00')
          return false
        }else if( start>midStart && end>midStart && start>end ){
          // 开始时间在21点之后，结束时间也在21点之后，且开始时间大于结束时间
          this.$Message.error('夜间生效时段仅支持21:00到6:00')
          return false
        }else if( start<midStart && end>midStart ){
          // 开始时间小于6点，结束时间大于21点
          this.$Message.error('夜间生效时段仅支持21:00到6:00')
          return false
        }
      }
      // 校验通过，数据组装
      if (addFormValid && checkFormValid && accidentFormValid && countFormValid && isQualitSuccess) {
        // 数据格式重写
        let that = this;
        let params = JSON.parse(JSON.stringify(this.addData))
        if (this.handleType === '2' || this.isEdit) params.recordUuid = this.uuid;

        // 3.有效时间数组拆分成startTime和endTime
        params.startTimeEtsc = this.$moment(params.effectDate[0]).format("YYYY-MM-DD")
        params.endTimeEtsc = this.$moment(params.effectDate[1]).format("YYYY-MM-DD")
        delete params.effectDate

        // 城市
        params.cityCode = params.cityCodeList.join(',')
        delete params.cityCodeList

        // 产品线
        params.plType = params.businessLineList.join(',')
        delete params.businessLineList

        // 事故类别
        let qObj = this.qualificationObj
        // 个月内无人伤事故
        let qAcc = qObj.accidentObj
        // 个月内事故数<次
        let qAcObj = qObj.accidentObjAndCount
        qAcc.accidentCategory = qAcc.accidentCategory.map(v => {
          return {
            desc: v.desc.split(' > ')
          }
        })
        qAcObj.accidentCategory = qAcObj.accidentCategory.map(v => {
          return {
            desc: v.desc.split(' > ')
          }
        })

        params.qualificationObj = qObj
        
        this.axiosSubmit(params)
      }
    },
    async validEmptyForm (name) {
      let res = true
      if (this.$refs[name].fields.length) {
        res = await this.$refs[name].validate()
      }
      return res
    },
    // 发送保存请求
    axiosSubmit (params) {
      let axiosFun = this.isAdd ? axiosRecordSave : axiosRecordUpdat
      this.addLoading = true
      axiosFun(params).then(res => {
        this.addLoading = false
        this.$Message.success(`${this.isAdd?'新增':'编辑'}成功！`);
        this.$route.meta.closeAlert = false;
        this.formReset()
      }).catch(err => {
        this.addLoading = false
      })
    },
    // 选择学习任务回调
    studySelectDown (selectedList) {
      this.$set(this.addData.scStudyConfigReq, 'studyTasks', selectedList)
    },
    // 选择考试任务回调
    taskSelectDown (selectedList) {
      this.$set(this.addData.scStudyConfigReq, 'examTasks', selectedList)
    },
    // X个月内无人伤事故---添加事故类别
    getAccident (list) {
      this.$set(this.qualificationObj.accidentObj, 'accidentCategory', list)
      this.validItem('accidentForm', 'accidentCategory')
    },
    // X个月内事故数<Y次---添加事故类别
    getTimesAccident (list) {
      this.$set(this.qualificationObj.accidentObjAndCount, 'accidentCategory', list)
      this.validItem('countForm', 'accidentCategory')
    },
    // 删除学习/司机任务
    removeItem (index, key) {
      this.addData.scStudyConfigReq[key].splice(index, 1)
    },
    // 根据产品线获取城市列表
    getCityList () {
      if(!this.isAdd){
        return
      }
      getAppointedCityList({businessLineList:businessLine}).then(res => {
        let resData = res.data.data || {};
        let list = resData.openAreaConfigDtoList || []
        let transformData = list.map(item => {
          return {
            label: item.city,
            value: item.cityId
          }
        })
        this.cityList = transformData
      })
    },
    validItem (formName, name) {
      this.$refs[formName].validateField(name);
    },

    // isReload：是否重新加载列表页面数据
    formReset () {
      this.$refs["addForm"].resetFields();
      this.$refs["checkForm"].resetFields();
      this.$refs["accidentForm"].resetFields();
      this.$refs["countForm"].resetFields();
      this.$store.commit("setChangeTab", this.$route);
      this.$router.push("/opCenter/server-card/setting");
    },
    // 城市切换时触发，全国所有城市和其他互斥
    mutexValid (val, key) {
      let length = val.length;
      if (val[length - 1] === this.allValue) {
        this.$set(this.addData, key, [this.allValue])
      } else {
        val.forEach((v, k) => {
          if (v === this.allValue) val.splice(k, 1);
        });
        this.$set(this.addData, key, val)
      }
    },
    clearObjAndCount (key) {
      let item = this.qualificationObj[key]
      item.monthCount = null
      item.accidentCount = null
      item.accidentCategory.splice(0, item.accidentCategory.length)
    },
    openModal(key){
      console.log('openModal',key)
      this[key] = true
    }
  }
};
</script>
<style lang="less" scoped>
.bottom20 {
  margin-bottom: 20px;
}
.bottom25 {
  margin-bottom: 25px;
}
.margin5 {
  margin: 0 5px;
}
.server-add {
  overflow: auto;
  .server-card {
    min-width: 1150px;
  }
}
.check-list {
  padding-left: 20px;
  /deep/ .ivu-checkbox-wrapper {
    font-size: 14px;
    margin-right: 10px;
  }
}
.footer-box {
  margin-top: 20px;
  text-align: right;
}
.dash-line {
  border-bottom: 1px solid #ddd;
  margin: 30px auto 20px auto;
}
.remove-icon {
  font-size: 22px;
  color: #e61f10;
  font-weight: bold;
  cursor: pointer;
  margin-right: 5px;
}
.task-item {
  margin: 10px 0;
}
.task-title {
  display: inline-block;
  padding: 5px 15px;
  border: 1px solid #ddd;
}
.right-btn {
  float: right;
  margin-right: 100px;
  padding-left: 30px;
  padding-right: 30px;
}
.inline-item {
  display: inline-block;
  margin-bottom: 0;
  vertical-align: middle;
}
.input-dis {
  display: inline-block;
  width: 90px;
  height: 32px;
  line-height: 32px;
  cursor: not-allowed;
  border: 1px solid #dcdee2;
  color: #d4d6da;
  background: #f3f3f3;
  padding-left: 7px;
  font-size: 12px;
  position: relative;
  top: 2px;
  margin: 0 0 2px 0;
}
.empty-item {
  width: 100px;
  margin-left: 445px;
  /deep/ .ivu-form-item-content {
    height: 1px !important;
  }
}
.height0 {
  height: 0px;
  position: relative;
  top: -14px;
  .left-ac {
    margin-left: 254px;
  }
}
.leftbox{
  margin-left:30px;
}
.no-data{
  color:#aaa;
  padding: 10px 0 0 15px;
}
</style>
