<template>
  <div
    class="step2_wrap"
    ref="step2_ref"
  >
    <Form
      ref="adForm"
      class="top15 adForm"
      :model="addData"
      :label-width="120"
      :rules="ruleValidate"
    >
      <FormItem
        label="任务使用人群配置："
        class="task_step2_item"
      > </FormItem>
      <FormItem
        label="司机类型："
        prop="driverTypeList"
        :class="{ 'ivu-form-item-required': addData.driverTypeList && addData.driverTypeList.length > 0 && isDetail }"
      >
        <Select
          v-model="addData.driverTypeList"
          @on-change="driverTypeChange"
          :disabled="isDetail || addData.selectedDriverGroupList.length > 0"
          multiple
        >
          <Option
            v-for="item in driverTypeOptions"
            :disabled="item.value !== '全部' && addData.hasSelectAllDriverType"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="工资类型："
        prop="driverTagList"
        :class="{ 'ivu-form-item-required': addData.driverTagList && addData.driverTagList.length > 0 && isDetail }"
      >
        <Select
          v-model="addData.driverTagList"
          @on-change="salaryTypeChange"
          :disabled="isDetail || addData.selectedDriverGroupList.length > 0"
          multiple
        >
          <Option
            v-for="item in driverSalaryOptions"
            :disabled="item.value !== '全部' && addData.hasSelectAllSalary"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>
      </FormItem>
      <!-- 司机人群包 -->
      <selectDriverGroup
        :addData="addData"
        @handleDeleteDriverGroup="handleDeleteDriverGroup"
        @selectDriverGroup="selectDriverGroup"
        :disabled="(addData.driverTypeList && addData.driverTypeList.length > 0) || (addData.driverTagList && addData.driverTagList.length > 0) || (addData.taskType == 4 && addData.taskTriggerType ===3) "
        :isDetail="isDetail"
      ></selectDriverGroup>
      <!-- 奖金瓜分任务的触发类型 option 不一样-->
      <FormItem
        label="任务触发类型："
        prop="taskTriggerType"
        class="ivu-form-item-required"
        v-if="addData.taskType == 4"
      >
        <Select
          v-if="addData.taskType == 4"
          v-model="addData.taskTriggerType"
          :disabled="isDetail"
          @on-change="taskTriggerTypeChange"
        >
          <Option
            v-for="item in taskTriggerTypeRewardOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>
        <Select
          v-else
          v-model="addData.taskTriggerType"
          :disabled="isDetail"
        >
          <Option
            v-for="item in taskTriggerTypeOptions"
            :key="item.value"
            :value="item.value"
            :disabled="item.value === 2"
          >
            {{ item.label }}
          </Option>
        </Select>
      </FormItem>

      <FormItem
        v-if="addData.taskType == 4 && addData.taskTriggerType == 3"
        label="手动报名人数上限"
        prop="applyLimit"
        :rules="ruleValidate.applyLimit"
      >
        <InputNumber
          v-model="addData.applyLimit"
          placeholder="请输入手动报名人数上限"
          class="num_input"
          :disabled="isDetail"
          :min="1"
          :max="100000"
          style="width: 220px;"
        />
      </FormItem>
      <FormItem
        v-if="addData.taskType == 4 && addData.taskTriggerType == 3"
        label="手动报名有效期："
        prop="signUpTime"
        class="ivu-form-item-required"
      >
        <div class="line">
          <div class="left">
            <DatePicker
              type="datetime"
              class="search-input"
              v-model="addData.applyStartDate"
              ref="applyStartDate_ref"
              :format="'yyyy-MM-dd HH:mm:ss'"
              :disabled="isDetail"
              :options="options"
              :style="{ width: '220px' }"
              placeholder="请选择开始时间"
            >
            </DatePicker>
          </div>
          <div class="right">
            <DatePicker
              type="datetime"
              class="search-input"
              v-model="addData.applyEndDate"
              ref="applyEndDate_ref"
              :disabled="isDetail"
              :options="options"
              :format="'yyyy-MM-dd HH:mm:ss'"
              :style="{ width: '220px' }"
              placeholder="请选择结束时间"
            >
            </DatePicker>
          </div>
        </div>
      </FormItem>
<!--      <FormItem-->
<!--        label="是否实时任务："-->
<!--        prop="isRealtime"-->
<!--        class="ivu-form-item-required"-->
<!--      >-->
<!--        <RadioGroup-->
<!--          v-model="addData.isRealtime"-->
<!--          class="right15"-->
<!--          @on-change="realtimeChange"-->
<!--          :disabled="isDetail"-->
<!--        >-->
<!--          <Radio-->
<!--            v-for="item in realTimeOptions"-->
<!--            :key="item.value"-->
<!--            :value="item.value"-->
<!--            :label="item.value"-->
<!--            :disabled="item.value === 1"-->
<!--          >{{ item.label }}</Radio>-->
<!--        </RadioGroup>-->
<!--      </FormItem>-->
      <FormItem
        label="任务起止日期："
        class="task_step2_item"
      > </FormItem>
      <FormItem
        label="开始结束日期："
        prop="taskTime"
        class="ivu-form-item-required"
      >
        <div class="line">
          <div class="left">
            <DatePicker
              type="date"
              class="search-input"
              v-model="addData.startDate"
              ref="startTime_ref"
              :format="'yyyy-MM-dd'"
              :disabled="isDetail"
              :options="options"
              :style="{ width: '220px' }"
              @on-change="startDateChange"
              placeholder="请选择开始日期"
            >
            </DatePicker>
          </div>
          <div class="right">
            <DatePicker
              type="date"
              class="search-input"
              v-model="addData.endDate"
              ref="endTime_ref"
              :disabled="isDetail"
              :options="options"
              :format="'yyyy-MM-dd'"
              :style="{ width: '220px' }"
              @on-change="endDateChange"
              placeholder="请选择结束日期"
            >
            </DatePicker>
          </div>
        </div>
      </FormItem>
      <FormItem
        label="时段："
        class="time_period_item"
      ></FormItem>
      <!-- 时段配置 -->
      <timePeriod
        v-if="addData.taskType === 1 || addData.taskType === 3 || addData.taskType === 4"
        :addData="addData"
        @handleDeleteModule="handleDeleteModule"
        @handleAddModule="handleAddModule"
        @startTimeChange="startTimeChange"
        @endTimeChange="endTimeChange"
        :isDetail="isDetail"
      ></timePeriod>
      <FormItem label="" v-if="addData.taskType !== 4">
        <div
          class="cycle_wrap"
          :class="{
            dayWidth: addData.cycle === 1,
            weekWidth: addData.cycle === 2,
          }"
        >
          <div class="left">
            <div class="title">
              重置周期
            </div>
            <RadioGroup
              v-model="addData.cycle"
              class="right15"
              @on-change="cycleChange"
              :disabled="isDetail"
              vertical
            >
              <Radio
                v-for="item in cycleOptions"
                :key="item.value"
                :value="item.value"
                :label="item.value"
                :disabled="isDetail"
              >{{ item.label }}</Radio>
            </RadioGroup>
          </div>
          <div class="right">
            <FormItem
              label="每"
              v-if="addData.cycle === 1"
              :label-width="50"
              class="ivu-form-item-required"
              prop="day"
            >
              <InputNumber
                v-model="addData.day"
                placeholder="请输入"
                class="day_input"
                type="number"
                :min="1"
                :max="366"
                @on-change="dayChange"
                :disabled="isDetail"
              />
              <div class="unit">天</div>
            </FormItem>
            <FormItem
              class="week_period_wrap ivu-form-item-required"
              label="重复间隔为"
              v-if="addData.cycle === 2"
              prop="weekPeriod"
            >
              <InputNumber
                v-model="addData.weekPeriod"
                placeholder="请输入"
                class="weekPeriod_input"
                @on-change="weekPeriodChange"
                type="number"
                :min="1"
                :max="52"
                :disabled="isDetail"
              />
              <div class="unit">周后的：</div>
            </FormItem>
            <div class="week_wrap">
              <FormItem
                label=""
                v-if="addData.cycle === 2"
                prop="week"
                class="ivu-form-item-required"
              >
                <CheckboxGroup
                  v-model="addData.week"
                  class="right15"
                  @on-change="weekChange"
                  :disabled="isDetail"
                >
                  <Checkbox
                    v-for="item in weekOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.value"
                    :disabled="isDetail"
                  >{{ item.label }}</Checkbox>
                </CheckboxGroup>
              </FormItem>
            </div>
          </div>
        </div>
      </FormItem>
      <FormItem
        label="任务在司机APP端显示时间："
        prop="showTime"
        class="ivu-form-item-required"
        v-if="addData.taskType !== 4 || (addData.taskType == 4 && addData.taskTriggerType == 1)"
      >
            <DatePicker
              type="datetime"
              class="search-input"
              v-model="addData.showTime"
              ref="startTime_ref"
                :format="'yyyy-MM-dd HH:mm:ss'"
              :options="options"
              :style="{ width: '220px' }"
              placeholder="请选择任务在司机APP端显示时间"
              :disabled="isDetail"
            >
            </DatePicker>
      </FormItem>
      <!-- <FormItem
        label="通知终端："
        class="task_step2_item"
        prop="notifyType"
      >
        <CheckboxGroup
          v-model="addData.notifyType"
          class="right15"
          @on-change="notifyTypeChange"
          :disabled="isDetail"
        >
          <Checkbox
            v-for="item in notifyTypeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.value"
            :disabled="isDetail || item.value === 4"
          >{{ item.label }}
          </Checkbox>
        </CheckboxGroup>
      </FormItem> -->
      <!-- 语音播报配置 -->
      <!-- <step2broadcast
        v-if="addData.notifyType.indexOf(1) !== -1"
        :addData="addData"
        :isDetail="isDetail"
        @broadcastTypeChange="broadcastTypeChange"
      ></step2broadcast> -->
      <!-- 消息提醒配置 -->
      <!-- <message
        v-if="addData.notifyType.indexOf(2) !== -1"
        :addData="addData"
        :isDetail="isDetail"
      ></message> -->
      <!-- 公告配置 -->
      <!-- <notify
        v-if="addData.notifyType.indexOf(3) !== -1"
        :addData="addData"
        :isDetail="isDetail"
      ></notify> -->
      <!-- 短信配置 -->
      <!-- <sms
        v-if="addData.notifyType.indexOf(4) !== -1"
        :addData="addData"
        :isDetail="isDetail"
      ></sms> -->
      <FormItem class="btn_group">
        <Button
          type="primary"
          @click="goPrevious"
        >上一步</Button>
        <Button
          type="primary"
          @click="goNext"
        >下一步</Button>
        <Button
          class="cancel_btn"
          type="default"
          @click="cancel"
           v-if="!isDetail && !isCopy"
        >
          取消
        </Button>
        <Button
          class="cancel_btn"
          type="default"
          @click="cancel"
          v-if="isDetail"
        >
          确定
        </Button>
      </FormItem>
    </Form>
    <!-- 选择司机人群包 -->
    <driverGroup
      v-if="!isDetail && showDriverGroup"
      :list="addData.selectedDriverGroupList"
      :limitNumber="15"
      @close="handleCloseDriverGroup"
      @selectDown="selectDown"
    />
  </div>
</template>

<script>
import { queryDriverTypeList, queryDriverSalaryTypeList } from '_o/api/task-manager'
import {
  // driverTypeOptions,
  taskTriggerTypeOptions,
  taskTriggerTypeRewardOptions,
  realTimeOptions,
  weekOptions,
  cycleOptions,
  notifyTypeOptions,
  step2Rules
} from "../../../config/fields"
import selectDriverGroup from "../components/step2/selectDriverGroup.vue"
import timePeriod from "../components/step2/timePeriod.vue"
import step2broadcast from "../components/step2/broadcast.vue"
import message from "../components/step2/message.vue"
import notify from "../components/step2/notify.vue"
import sms from "../components/step2/sms.vue"
import driverGroup from "../../driverGroup/index.vue"

const TIME_FORMAT = 'yyyy-MM-dd'

export default {
  name: "step2",
  components: {
    driverGroup,
    selectDriverGroup,
    timePeriod,
    step2broadcast,
    message,
    notify,
    sms
  },
  props: {
    pageShow: {
      type: Boolean,
      default () {
        return false
      }
    },
    isEdit: {
      type: Boolean,
      default () {
        return false
      }
    },
    isDetail: {
      type: Boolean,
      default () {
        return false
      }
    },
    isCopy: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      driverTypeOptions: [],
      driverSalaryOptions: [],
      cycleOptions,
      notifyTypeOptions,
      weekOptions,
      taskTriggerTypeOptions,
      taskTriggerTypeRewardOptions,
      realTimeOptions,
      addData: {
        driverTypeList: [],
        tempDriverTypeList:[],// 选择全部的时候有用
        driverTagList: [], // 工资。服务端起的name也太随意了
        hasSelectAllSalary:false,
        hasSelectAllDriverType:false,
        applyLimit:null,
        taskType: 1,
        taskTriggerType: 1,
        selectedDriverGroupList: [
        ],
        isRealtime: 1,
        cycle: 1,
        notifyType: [1],
        timePeriodList: [
          {
            startTime: '00:00:00',
            endTime: '23:59:59'
          }
        ],
        startDate: new Date(new Date().getTime()),
        endDate: new Date(new Date().getTime()),
        showTime:"",
        message: {
          disableHour: null,
          disableMin: null,
          disableUrl: '',
          disableContent: '',
          url: '',
          hour: null,
          min: null,
          content: ''
        },
        notify: {},
        sms: {},
        day: 1,
        weekPeriod: 1,
        broadcast: {
          enableType: 1,
          disableType: 1,
          enableHour: 0,
          enableMin: 1,
          disableHour: null,
          disableMin: null,
        }
      },
      options: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      showDriverGroup: false,
      ruleValidate: step2Rules(this),
    }
  },
  created () {
    this.addData = {
      ...this.addData,
      ...this.$parent.$parent.$parent.getData()
    }
  },
  watch: {
    "showDriverGroup" (newValue) {
      console.log("newValue", newValue)
    },
    "addData.startDate": {
      handler(v) {
        if (this.isDetail) return;
        // 0-实时任务 1-非实时任务
        let isRealtime = this.checkIsRealtime(v);
        this.addData.isRealtime =  isRealtime ? 0 : 1;
        if (isRealtime) {
          this.addData.broadcast.enableHour = 0;
          this.addData.broadcast.enableMin = 1;
          this.addData.broadcast.disableHour = null;
          this.addData.broadcast.disableMin = null;
        }
      }
    }
  },
  mounted () {
    this.getDriverTypeList()
    this.getDriverSalaryTypeList()
  },
  methods: {
    broadcastTypeChange (value) {
      if (value === 2) {

      }
    },
    // 删除到达围栏的奖励模块
    handleDeleteModule (index) {
      this.addData.timePeriodList.splice(index, 1)
    },
    // 添加到达围栏的奖励模块
    handleAddModule () {
      this.addData.timePeriodList.push({
        startTime: '00:00:00',
        endTime: '23:59:59'
      })
    },
    startTimeChange (startTime, type, index) {
      console.log(startTime)
      this.addData.timePeriodList[index].startTime = startTime
    },
    endTimeChange (endTime, type, index) {
      console.log(endTime)
      this.addData.timePeriodList[index].endTime = endTime
    },
    async getDriverTypeList () {
      const res = await queryDriverTypeList()
      if (!res) {
        this.driverTypeOptions = []
        return false
      }
      if (res && res.data && res.data.code === 200 && res.data.success && res.data.data) {
        this.driverTypeOptions = res.data.data.map(item => ({
          value: Number(item.driverType),
          label: item.driverTypeDesc
        }))
        //选择全部的时候把这个给服务端。
        this.addData.tempDriverTypeList = res.data.data.map(item => Number(item.driverType))
        if (this.driverTypeOptions.length > 0) {
          this.driverTypeOptions.unshift({
            value: '全部',
            label: '全部'
          })
        }        
      } else {
        this.driverTypeOptions = []
      }
    },
    // 工资类别
    async getDriverSalaryTypeList () {
      const res = await queryDriverSalaryTypeList()
      if (!res) {
        this.driverSalaryOptions = []
        return false
      }
      if (res && res.data && res.data.code === 200 && res.data.success && res.data.data) {
        this.driverSalaryOptions = res.data.data.map(item => ({
          value: item.typeCode,
          label: item.typeDesc
        }))
        if (this.driverSalaryOptions.length > 0) {
            this.driverSalaryOptions.unshift({
              value: '全部',
              label: '全部'
            })
        }
      } else {
        this.driverSalaryOptions = []
      }
    },
    salaryTypeChange (value) {
      this.addData.driverTagList = value;
      if (value && value.length > 0 && value.includes('全部')) {
        this.addData.driverTagList = ['全部']
        this.addData.hasSelectAllSalary = true
      } else {
        this.addData.hasSelectAllSalary = false
      }
      if (value && value.length > 0){
        this.addData.selectedDriverGroupList = []
      }
    },
    // 司机人群包和司机类型不可同选
    driverTypeChange (value) {
      this.addData.driverTypeList = value;
      if (value && value.length > 0 && value.includes('全部')) {
        this.addData.driverTypeList = ['全部']
        this.addData.hasSelectAllDriverType = true
      } else {
        this.addData.hasSelectAllDriverType = false
      }
      if (value && value.length > 0 && value[0] > -1) {
        this.addData.selectedDriverGroupList = []
      } else { }
    },
    
    realtimeChange (...args) {
      console.log(args)
    },
    startDateChange (startDate, type) {
      console.log(startDate)
      this.addData.startDate = startDate
    },
    endDateChange (endDate, type) {
      console.log(endDate)
      this.addData.endDate = endDate
    },
    descChange () {

    },
    nameChange () {

    },
    notifyTypeChange () { },
    // 删除围栏
    handleDeleteDriverGroup (c) {
      this.addData.selectedDriverGroupList = this.addData.selectedDriverGroupList.filter(item => item.crowdCode !== c.crowdCode)
    },
    // 新增或者选择围栏
    selectDriverGroup () {
      this.showDriverGroup = true
    },
    // 选择围栏
    selectDown (list) {
      let selectCopy = JSON.parse(JSON.stringify(this.addData.selectedDriverGroupList));
      let selectHash = {};
      let addList = [];
      // 清空原来的选择
      this.addData.selectedDriverGroupList.splice(0, 15);
      // 记录原来的选择
      selectCopy.forEach((item, index) => {
        selectHash[item.crowdCode] = String(index);
      });
      // 判断如果原来也选了，放到相同的位置，没选加进去
      list.forEach(item => {
        let index = selectHash[item.crowdCode];
        if (index) {
          this.addData.selectedDriverGroupList.push(selectCopy[index]);
        } else {
          addList.push(item);
        }
      });
      this.addData.selectedDriverGroupList.push(...addList);

    },
    // 关闭围栏
    handleCloseDriverGroup () {
      this.showDriverGroup = false
    },
    // 下一步
    async goNext () {
      const valid = await this.$refs['adForm'].validate()
      if (!valid) {
        return false
      }
      if ((!this.addData.driverTypeList || this.addData.driverTypeList.length === 0)
        && (!this.addData.selectedDriverGroupList || this.addData.selectedDriverGroupList.length === 0)) {
          this.$Message.error('司机类型和司机人群包必选一个！')
        return false
      }
      // 历史任务。这个地方有点坑。服务端也没有返回历史任务的默认的 工资类别，懒得扯皮。此处做个特殊处理
      if (!this.isDetail && (this.addData.driverTypeList && this.addData.driverTypeList.length > 0)
        && (!this.addData.driverTagList || this.addData.driverTagList.length === 0)) {
        this.$Message.error('请选择工资类别')
        return false
      }


      // if (this.addData.notifyType.includes(1)) {
      //   if (this.addData.broadcast.enableType === 1 && !this.addData.broadcast.enableContent) {
      //     this.$Message.error('请输入任务启用播报内容')
      //     return false
      //   }


      //   if (this.addData.broadcast.enableType === 2 && !this.addData.broadcast.enabledBroadcastUrlName) {
      //     this.$Message.error('请上传任务启用语音播报')
      //     return false
      //   }

      //   if (this.addData.broadcast.disableType === 2 && !this.addData.broadcast.disableBroadcastUrlName) {
      //     this.$Message.error('请上传任务停用语音播报')
      //     return false
      //   }
      // }

      // if (this.addData.notifyType.includes(1) &&
      //   ((
      //     this.addData.broadcast.enableType === 1 &&
      //     (!this.addData.broadcast.enableContent && (this.addData.broadcast.enableHour !== null || this.addData.broadcast.enableMin !== null)
      //     )
      //   )
      //   || (
      //     this.addData.broadcast.enableType === 1 &&
      //     (this.addData.broadcast.enableContent && (this.addData.broadcast.enableHour === null || this.addData.broadcast.enableMin === null)
      //     )
      //   )
      //   || (
      //     this.addData.broadcast.enableType === 2 &&
      //     (!this.addData.broadcast.enabledBroadcastUrlName && (this.addData.broadcast.enableHour !== null || this.addData.broadcast.enableMin !== null)
      //     )
      //   ) || (
      //     this.addData.broadcast.enableType === 2 &&
      //     (this.addData.broadcast.enabledBroadcastUrlName && (this.addData.broadcast.enableHour === null || this.addData.broadcast.enableMin === null)
      //     )
      //   ))
      // ) {
      //   this.$Message.error('任务启用播报内容与任务启用播报提前通知时间必须同时存在')
      //   return false
      // }

      // if (this.addData.notifyType.includes(1) &&
      //   ((
      //     this.addData.broadcast.disableType === 1 &&
      //     (!this.addData.broadcast.disableContent && (this.addData.broadcast.disableHour !== null || this.addData.broadcast.disableMin !== null)
      //     )
      //   )
      //   || (
      //     this.addData.broadcast.disableType === 1 &&
      //     (this.addData.broadcast.disableContent && (this.addData.isRealtime ==1 && (this.addData.broadcast.disableHour === null || this.addData.broadcast.disableMin === null))
      //     )
      //   )
      //   || (
      //     this.addData.broadcast.disableType === 2 &&
      //     (!this.addData.broadcast.disableBroadcastUrlName && (this.addData.broadcast.disableHour !== null || this.addData.broadcast.disableMin !== null)
      //     )
      //   ) || (
      //     this.addData.broadcast.disableType === 2 &&
      //     (this.addData.broadcast.disableBroadcastUrlName && (this.addData.isRealtime ==1 && (this.addData.broadcast.disableHour === null || this.addData.broadcast.disableMin === null))
      //     )
      //   ))
      // ) {
      //   this.$Message.error('任务停用播报内容与任务停用播报提前通知时间必须同时存在')
      //   return false
      // }

      // if (this.addData.notifyType.includes(1)) {
      //   if (this.addData.broadcast.enableHour && this.addData.broadcast.enableMin) {
      //     if (+this.addData.broadcast.enableHour === 12 && +this.addData.broadcast.enableMin > 0) {
      //       this.$Message.error('语音播报任务启用提前通知时间最大12小时0分钟')
      //       return false
      //     }
      //   }
      //   if (this.addData.broadcast.disableHour && this.addData.broadcast.disableMin) {
      //     if (+this.addData.broadcast.disableHour === 2 && +this.addData.broadcast.disableMin > 0) {
      //       this.$Message.error('语音播报任务停用提前通知时间最大2小时0分钟')
      //       return false
      //     }
      //   }
      // }

      // if (this.addData.notifyType.includes(2) &&
      //   ((!this.addData.message.content && (this.addData.message.hour !== null || this.addData.message.min !== null)
      //   ) || (
      //     this.addData.message.content && (this.addData.isRealtime ==1 && (this.addData.message.hour === null || this.addData.message.min === null))
      //   ))
      // ) {
      //   this.$Message.error('任务启用消息内容与任务启用提前通知时间必须同时存在')
      //   return false
      // }

      // if (this.addData.notifyType.includes(2) &&
      //   ((!this.addData.message.disableContent && (this.addData.message.disableHour !== null || this.addData.message.disableMin !== null)
      //   ) || (
      //     this.addData.message.disableContent && (this.addData.isRealtime ==1 && (this.addData.message.disableHour === null || this.addData.message.disableMin === null))
      //   ))
      // ) {
      //   this.$Message.error('任务停用消息内容与任务停用提前通知时间必须同时存在')
      //   return false
      // }

      // if (this.addData.notifyType.includes(2)) {
      //   if (this.addData.message.hour && this.addData.message.min) {
      //     if (+this.addData.message.hour === 12 && +this.addData.message.min > 0) {
      //       this.$Message.error('消息提醒任务启用提前通知时间最大12小时0分钟')
      //       return false
      //     }
      //   }
      //   if (this.addData.message.disableHour && this.addData.message.disableMin) {
      //     if (+this.addData.message.disableHour === 2 && +this.addData.message.disableMin > 0) {
      //       this.$Message.error('消息提醒任务停用提前通知时间最大2小时0分钟')
      //       return false
      //     }
      //   }
      // }
      if (!this.compareTime(this.addData.startDate, this.addData.endDate)) {
        this.$Message.error('开始日期不能大于结束日期')
        return false
      }

      if (!this.compareTime(this.addData.startDate, this.addData.endDate)) {
        this.$Message.error('开始日期不能大于结束日期')
        return false
      }
      let baseTime = ''
      let isValid = true
      let currentDate = this.$moment(new Date()).format('YYYY-MM-DD')
      this.addData.timePeriodList.forEach((item, index) => {
        if (this.$moment(currentDate + ' ' + item.startTime + ':00').diff(this.$moment(currentDate + ' ' + item.endTime + ":00"), 'seconds') > 0) {
          this.$Message.error(`第${index + 1}开始时段不能大于第${index + 1}结束时段`)
          isValid = false
          return false
        }
      })

      if (!isValid) {
        return
      }

      this.addData.timePeriodList.forEach((item, index) => {
        if (!isValid) {
          return
        }
        if (this.addData.timePeriodList.length > 1 && index >= 1) {
          baseTime = this.addData.timePeriodList[index - 1].endTime
          if (this.$moment(currentDate + ' ' + item.startTime + ":00").diff(this.$moment(currentDate + ' ' + baseTime + ":00"), 'seconds') < 0) {
            this.$Message.error(`第${index + 1}开始时段不能小于第${index}的结束时段`)
            isValid = false
            return false
          }
        }
      })

      if ((this.addData.taskType !== 4 || (this.addData.taskType == 4 && this.addData.taskTriggerType == 1)) && !this.compareShowTime()) {
        this.$Message.error('司机APP端显示时间不能大于任务最早的开始时间')
        return false
      }
      if (this.addData.taskTriggerType === 3 && !this.compareSignUpTime()) {
        this.$Message.error('手动报名有效期的结束日期需小于任务开始日期')
        return false
      }
      if (isValid) {
        this.$emit('goNext', this.addData)
      }
    },
    // 取消
    cancel () {
      this.$emit('cancel')
    },
    getData () {
      return {
        ...this.addData
      }
    },
    // 上一步
    goPrevious () {
      this.$emit('goPrevious', this.addData)
    },
    cycleChange () {

    },
    dayChange () {

    },
    weekPeriodChange () {

    },
    weekChange () {

    },
    checkIsRealtime(v) {
      return this.$moment(v).format("YYYY-MM-DD") === this.$moment().format("YYYY-MM-DD");
    },
    compareTime(start, end) {
      let startTime = this.$moment(start).format("YYYY-MM-DD");
      let endTime = this.$moment(end).format("YYYY-MM-DD");
      return startTime <= endTime;
    },
    compareShowTime() {
      let startTime =this.$moment(this.addData.showTime).format("YYYY-MM-DD HH:mm:ss");
      let endTime = this.$moment(this.addData.startDate).format("YYYY-MM-DD") + ' ' + this.addData.timePeriodList[0].startTime;
      return startTime <= endTime;
    },
    compareSignUpTime() {
      // let startTime =this.$moment(this.addData.applyEndDate).format("YYYY-MM-DD HH:mm:ss");
      // let endTime = this.$moment(this.addData.startDate).format("YYYY-MM-DD") + ' ' + this.addData.timePeriodList[0].startTime;
      // return startTime <= endTime;
      let startTime =this.$moment(this.addData.applyEndDate).format("YYYY-MM-DD");
      let endTime = this.$moment(this.addData.startDate).format("YYYY-MM-DD");
      return startTime < endTime;
    },
    taskTriggerTypeChange(value){
      this.addData.taskTriggerType = value
      if(value === 3){
        //手动  则司机人群包不可选择
        this.addData.selectedDriverGroupList = []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.step2_wrap {
  margin-left: ~"calc(-38vw)";
  overflow-x: hidden;
  margin-top: 12px;
  width: ~"calc(100vw - 20% - 300px)";
  min-height: 60vh;
  .task_step2_item {
    /deep/ .ivu-form-item-label {
      font-size: 16px;
      width: 150px !important;
      white-space: nowrap;
    }
  }
  .time_period_item {
    /deep/ .ivu-form-item-label {
      font-size: 14px;
      // width: 150px !important;
      white-space: nowrap;
    }
  }
  .cycle_wrap {
    border: 1px solid #ddd;
    padding: 12px;
    width: 500px;
    height: 160px;
    border-radius: 2px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    /deep/ .ivu-form-item-error-tip {
      white-space: nowrap;
    }
    &.dayWidth {
      width: 500px;
    }
    &.weekWidth {
      width: 500px;
    }
    .left {
      flex: 0.1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      border-right: 1px solid #ddd;
    }
    .right {
      flex: 0.9;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
      flex-wrap: wrap;
      .week_wrap {
        width: 80%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
        .ivu-checkbox-group-item {
          padding-right: 10px;
        }
      }
      .week_period_wrap {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: nowrap;
        white-space: nowrap;
        margin-left: -120px;
        margin-bottom: 12px;
      }
      .unit {
        margin-left: 8px;
      }
    }
    /deep/ .ivu-form-item-content {
      // margin-left: 100px !important;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
    }
  }
  .adForm {
    /deep/ .line {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      // margin-top: 4px;
      .right {
        margin-left: 16px;
      }
      // margin-top: 4px;
      .item {
        margin-right: 16px;
        .name {
          font-size: 15px;
          // margin-right: 8px;
        }
        .delete {
          font-size: 16px;
          color: red;
          margin-left: 4px;
          font-weight: 600;
          cursor: pointer;
          width: 25px;
          height: 25px;
        }
      }
      .driverGroup_list {
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        margin-top: 4px;
      }
    }
    /deep/ .weekPeriod_input {
      input {
        width: 120px !important;
      }
    }
    /deep/ .day_input {
      input {
        width: 120px !important;
      }
    }
    /deep/ .ivu-input-wrapper {
      input {
        width: 220px;
      }
      textarea {
        width: 220px;
      }
    }
    // /deep/ .ivu-input-number{
    //   width: 220px;
    // }
    /deep/ .ivu-select {
      width: 220px;
    }
    /deep/ .operator {
      .ivu-input-wrapper {
        input {
          width: 100%;
        }
      }
    }
    .cancel_btn {
      margin-left: 8px;
    }
  }
  .btn_group {
    margin-top: 16px;
  }
}
</style>
