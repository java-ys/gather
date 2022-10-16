
<template>
  <div class="add-form_wrap">
    <Steps :current="current">
      <Step title="第一步">
        <step1
          v-if="current === 0"
          @goNext="goNext"
          @cancel="cancel"
          :isDetail="isDetail"
          :isEdit="isEdit"
          :pageShow="step1Show"
          :isCopy="isCopy"
        ></step1>
      </Step>
      <Step title="第二步">
        <step2
          v-if="current === 1"
          @goNext="goNext"
          @goPrevious="goPrevious"
          :isDetail="isDetail"
          @cancel="cancel"
          :isEdit="isEdit"
          :pageShow="step2Show"
          :isCopy="isCopy"
        ></step2>
      </Step>
      <Step title="第三步">
        <step3
          v-if="current === 2"
          @goPrevious="goPrevious"
          :isDetail="isDetail"
          @cancel="cancel"
          @submit="submit"
          :isEdit="isEdit"
          :pageShow="step3Show"
          @goList="goList"
          :isCopy="isCopy"
        ></step3>
      </Step>
    </Steps>
  </div>
</template>

<script>
import {
  saveManageTask,
  queryTaskDetail,
  updateManageTask
} from "_o/api/task-manager";
import { businessLineMap,orderFlowHitRuleOptions } from './config/fields'
import step1 from "./components/step/step1/step1"
import step2 from "./components/step/step2/step2"
import step3 from "./components/step/step3/step3"

export default {
  components: {
    step1,
    step2,
    step3
  },
  data () {
    return {
      query: this.$route.query,
      current: -1,
      isDetail: false,
      isLoading: false,
      formData: {},
      submitData: {},
      isEdit: false,
      step1Show: false,
      step2Show: false,
      step3Show: false,
      needRefresh: false,
      isCopy: false
    }
  },
  created () {
    if (this.query.step) {
      this.current = +this.query.step
    }
    this.isCopy = (+this.query.cc) === 1
    this.isDetail = String(this.query.isDetail) === '1'
    this.isEdit = String(this.query.isEdit) === '1'
    this.copyTaskInfo = this.query.taskInfo && JSON.parse(decodeURIComponent(this.query.taskInfo))
    // 新增时，直接进入第一步
    if (!this.isDetail && !this.isEdit && !this.isCopy) {
      this.current = 0
    }
  },
  watch: {
  },
  mounted () {
    if (this.isDetail || this.isEdit || this.isCopy) {
      this.detailAxios()
    }
  },
  methods: {
    // 获取第一步&第二步&第三步的集合数据
    getData () {
      return {
        ...this.formData
      }
    },
    goList (data) {
      this.$router.push({
        name: 'task-deploy',
        query: {}
      })
    },
    goNext (data) {
      this.current = this.current + 1
      this.formData = {
        ...this.formData,
        ...data
      }
      console.log('this.formData', this.formData)
    },
    goPrevious (data) {
      this.current = this.current - 1
      this.formData = {
        ...this.formData,
        ...data
      }
      console.log('this.formData', this.formData)
    },
    cancel () {
      this.$router.push({
        name: 'task-deploy',
        query: {}
      })
    },
    submit (data) {
      this.formData = {
        ...this.formData,
        ...data
      }
      this.constructSubmitData()
      this.submitAxios()
      console.log('this.formData', this.formData)
    },
    async submitAxios () {
      let requestUrl = ''
      let params = {}
      let message = ''
      if (this.isEdit) {
        requestUrl = updateManageTask
        params = {
          basicUuid: this.query.uuid
        }
        message = '编辑'
      } else if (this.isCopy) {
        requestUrl = saveManageTask
        message = '复制'
      } else {
        requestUrl = saveManageTask
        message = '新增'
      }
      const res = await requestUrl({
        ...this.submitData,
        ...params
      })
      if (!res) {
        return false
      }
      if (res && res.data && res.data.code === 200 && res.data.success) {
        this.$Message.success(message + '成功')
        this.$router.push({
          name: 'task-deploy',
        })
      }
    },
    async detailAxios () {
      const res = await queryTaskDetail({
        basicUuid: this.query.uuid
      })
      if (!res) {
        return false
      }
      if (res && res.data && res.data.code === 200 && res.data.success && res.data.data) {
        this.$Message.success('查询成功')
        this.generateMappingData(res.data.data)
        this.current = 0
      }
    },
    generateMappingData (detailData) {
      this.formData = {
        setRewardList: []
      }
      // 取出公用的
      const {
        cityCode,
        cityUuid,
        agentUuidList,
        taskType,
        taskName,
        taskRemark,
        taskDescribe,
        taskStatus,
        showTime,
        triggerType: taskTriggerType,
        indexType,
        indexTypes,
        compositeMode,
        taskStartDate: startDate,
        taskEndDate: endDate,
        applyStartDate,
        applyEndDate,
        applyLimit,
        rewardTotalAmount
      } = detailData
      this.formData = {
        ...this.formData,
        compositeMode,
        cityCode,
        cityUuid,
        agentUuidList,
        taskType,
        taskName,
        taskRemark,
        taskDescribe,
        taskStatus,
        taskTriggerType,
        taskStandard:indexType,
        taskStandardList:indexTypes||[],
        startDate,
        endDate,
        showTime,
        broadcast: {},
        sms: {},
        message: {},
        notify: {},
        applyStartDate,
        applyEndDate,
        applyLimit,
        rewardTotalAmount,
        businessLineList: detailData.rewardRuleObj.productTypeList
      }
      // 指标任务 在线天数
      if (compositeMode == 1 && indexTypes.includes(128) &&  detailData.ruleObj.onlineDaysConfig){
         let onlineDaysConfig = detailData.ruleObj.onlineDaysConfig //在线天数配置
         if (onlineDaysConfig.oneDayDuration) {
            onlineDaysConfig = {...onlineDaysConfig, ...{
              enableHour:this.$moment.duration(Number(onlineDaysConfig.oneDayDuration)).hours(),
              enableMin:this.$moment.duration(Number(onlineDaysConfig.oneDayDuration)).minutes(),
              enableSec:this.$moment.duration(Number(onlineDaysConfig.oneDayDuration)).seconds()
            }}
          } else {
            onlineDaysConfig = {...onlineDaysConfig, ...{
              enableHour:0,
              enableMin:0,
              enableSec:0,
            }}
          }
        this.formData.onlineDaysConfig = onlineDaysConfig
      }
      //指标任务  在线时长
      if (compositeMode == 1 && indexTypes.includes(64) &&  detailData.ruleObj.onlineDurations){
          let onlineDurations = detailData.ruleObj.onlineDurations //在线时长配置
          this.formData.onlineDurations = onlineDurations
      }
      this.formData = {
        ...this.formData,
        driverTypeList: detailData.ruleObj.driverTypeList,
        driverTagList: detailData.ruleObj.driverTagList,
        isRealtime: detailData.ruleObj.realTask,
        selectedDriverGroupList: detailData.ruleObj.crowdList,
        orderFlowHitRule:detailData.ruleObj.orderFlowHitRule?detailData.ruleObj.orderFlowHitRule :orderFlowHitRuleOptions[0].value // 历史数据 为null默认为 接单时间
      }

      // 任务类型为调度任务、激励任务时，包含开始日期、结束日期、时段、重置周期；
      // 任务类型为学习任务，包含开始日期、结束日期
      //if (this.formData.taskType === 1 || this.formData.taskType === 3) {
        this.formData = {
          ...this.formData,
          timePeriodList: detailData.ruleObj.timeIntervalList.map((item, index) => ({
            startTime: item.startTimeInterval.length > 5 ?  item.startTimeInterval :  item.startTimeInterval + ':00',
            endTime: item.endTimeInterval > 5 ?  item.endTimeInterval :  item.endTimeInterval + ':00'
          })),
          cycle: detailData.ruleObj.resetPeriodType,
          day: detailData.ruleObj.dayCount,
          weekPeriod: detailData.ruleObj.weekInterval,
          week: detailData.ruleObj.specificWeekList
        }
      //}

      // 终端类型
      // this.formData = {
      //   ...this.formData,
      //   notifyType: detailData.noticeTerminalObj.noticeTerminalTypeList
      // }

      // if (detailData.noticeTerminalObj && detailData.noticeTerminalObj.noticeTerminalTypeList) {
      //   // 语音播报
      //   if (detailData.noticeTerminalObj.noticeTerminalTypeList.includes(1)) {
      //     this.formData = {
      //       ...this.formData,
      //       broadcast: {
      //         ...this.formData.broadcast,
      //         enableType: detailData.noticeTerminalObj.enabledBroadcastType,
      //         enableContent: detailData.noticeTerminalObj.enabledBroadcastDesc,
      //         enabledBroadcastUrl: detailData.noticeTerminalObj.enabledBroadcastUrl,
      //         enabledBroadcastUrlName: detailData.noticeTerminalObj.enabledBroadcastUrlName,
      //         enableHour: detailData.noticeTerminalObj.enabledBroadcastHour,
      //         enableMin: detailData.noticeTerminalObj.enabledBroadcastMin,
      //         disableType: detailData.noticeTerminalObj.disableBroadcastType,
      //         disableContent: detailData.noticeTerminalObj.disableBroadcastDesc,
      //         disableBroadcastUrl: detailData.noticeTerminalObj.disableBroadcastUrl,
      //         disableBroadcastUrlName: detailData.noticeTerminalObj.disableBroadcastUrlName,
      //         disableHour: detailData.noticeTerminalObj.disableBroadcastHour,
      //         disableMin: detailData.noticeTerminalObj.disableBroadcastMin
      //       }
      //     }
      //   } else {
      //     this.formData = {
      //       ...this.formData,
      //       broadcast: {
      //         enableType: 1,
      //         disableType: 1,
      //         enableHour: 0,
      //         enableMin: 1,
      //         disableHour: null,
      //         disableMin: null,
      //         enableContent: '',
      //         enabledBroadcastUrl: '',
      //         enabledBroadcastUrlName: '',
      //         disableContent: '',
      //         disableBroadcastUrl: '',
      //         disableBroadcastUrlName: '',
      //       }
      //     }
      //   }
      //   if (detailData.noticeTerminalObj.noticeTerminalTypeList.includes(2)) {
      //     // 消息提醒
      //     this.formData = {
      //       ...this.formData,
      //       message: {
      //         ...this.formData.message,
      //         content: detailData.noticeTerminalObj.enabledMessageDesc,
      //         url: detailData.noticeTerminalObj.enabledMessageUrl,
      //         hour: detailData.noticeTerminalObj.enabledMessageHour,
      //         min: detailData.noticeTerminalObj.enabledMessageMin,
      //         disableContent: detailData.noticeTerminalObj.disableMessageDesc,
      //         disableUrl: detailData.noticeTerminalObj.disableMessageUrl,
      //         disableHour: detailData.noticeTerminalObj.disableMessageHour,
      //         disableMin: detailData.noticeTerminalObj.disableMessageMin,
      //       }
      //     }
      //   } else {
      //     this.formData = {
      //       ...this.formData,
      //       message: {
      //         content: '',
      //         url: '',
      //         hour: null,
      //         min: null,
      //         disableContent: '',
      //         disableUrl: '',
      //         disableHour: null,
      //         disableMin: null,
      //       }
      //     }
      //   }
      //   if (detailData.noticeTerminalObj.noticeTerminalTypeList.includes(3)) {
      //     // 公告
      //     this.formData = {
      //       ...this.formData,
      //       notify: {
      //         ...this.formData.notify,
      //         noticeLocationType: 1,
      //         title: detailData.noticeTerminalObj.noticeTitle,
      //         url: detailData.noticeTerminalObj.noticeUrl,
      //       }
      //     }
      //   } else {
      //     this.formData = {
      //       ...this.formData,
      //       notify: {
      //         noticeLocationType: 1,
      //         title: '',
      //         url: '',
      //       }
      //     }
      //   }
      // }

      // 调度任务并且到达围栏且接单
      // 激励任务
      if (((this.formData.taskType === 1 && this.formData.taskStandard === 7)
        || this.formData.taskType === 3)) {
        this.formData = {
          ...this.formData,
          businessLineList: detailData.rewardRuleObj.productTypeList
        }
      }

      // 调度任务，到达围栏没有奖励计算方式
      if (!(this.formData.taskType === 1 && this.formData.taskStandard === 6)) {
        this.formData = {
          ...this.formData,
          awardCalculate: detailData.rewardRuleObj.calculationType,
        }
      }

      // 调度任务并且到达围栏且接单
      if (this.formData.taskType === 1 && this.formData.taskStandard === 7) {
        this.formData = {
          ...this.formData,
          orderSourceList: detailData.rewardRuleObj.orderSourceTypeList,
        }
        if (this.formData.orderSourceList && this.formData.orderSourceList.length === 1 && this.formData.orderSourceList.includes(34)) {
          this.formData = {
            ...this.formData,
            hasSelectAllOrderSource: true
          }
        }
      }

      // 激励任务
      // 流水分成
      if (this.formData.taskType === 3 && this.formData.awardCalculate === 4) {
        this.formData = {
          ...this.formData,
          awardMax: detailData.rewardRuleObj.rewardLimt,
          orderFlowConfig: detailData.rewardRuleObj.orderFlowConfig || 1
        }
      }

      // 调度任务
      if (this.formData.taskType === 1) {
        // 到达围栏
        if (this.formData.taskStandard === 6) {
          this.formData = {
            ...this.formData,
            carStatus: detailData.indexObj.vihecleStatusList || [],
            selectedList: {
              fence: detailData.indexObj.electronicFenceList || []
            }
          }
        } else if (this.formData.taskStandard === 7) {
          // 到达围栏且接单
          this.formData = {
            ...this.formData,
            selectedList: {
              fence: detailData.indexObj.electronicFenceList || []
            }
          }
        }
      }
      if (this.formData.taskType === 1 &&
        this.formData.taskStandard === 7) {
        // 到达围栏且接单
        detailData.rewardRuleObj.setRewardList.forEach((item, index) => {
          this.formData.setRewardList.push({
            prefixProp: 'completeCount',
            prefixName: '完单数：',
            hasBindPrefix: true,
            completeCount: item.completeCount,
            parentRewardList: item.parentRewardList
          })
        })
      } else if (this.formData.taskType === 1 &&
        this.formData.taskStandard === 6) {
        // 到达围栏
        detailData.rewardRuleObj.setRewardList.forEach((item, index) => {
          this.formData.setRewardList.push({
            parentRewardList: item.parentRewardList
          })
        })
      }

      // 如果是奖励任务
      if (this.formData.taskType === 3){
        //  处理下在线时长。从毫秒转为小时 
        if(compositeMode == 1 && indexTypes.includes(64)) {
          detailData.rewardRuleObj.setRewardList.forEach((item, index) => {
            if(item.onlineDuration){
              item.onlineDuration = Number(item.onlineDuration/1000/60/60)
            }
          })
        }
        this.formData.eachOrderReward = detailData.rewardRuleObj.eachOrderReward || 0  
        this.formData.setRewardList = [ ...detailData.rewardRuleObj.setRewardList]
      }

      // 如果是奖励瓜分任务
      if (this.formData.taskType === 4){
        this.formData.setRewardList = [ ...detailData.rewardRuleObj.setRewardList]
      }

      this.padAward()

      console.log('-----------mapping data---------', this.formData)
    },
    clearTaskReward () {
      if (this.formData.taskType === 1
        && this.formData.taskStandard === 7) {
        // 调度任务-到达围栏且接单指标
        this.formData = {
          ...this.formData,
          setRewardList: [{
            parentRewardList: [],
            prefixProp: 'completeCount',
            prefixName: '完单数：',
            hasBindPrefix: true,
            'completeCount': null
          }]
        }
      } else if (this.formData.taskType === 1
        && this.formData.taskStandard === 6) {
        // 到达围栏
        this.formData = {
          ...this.formData,
          setRewardList: [{
            parentRewardList: [],
          }]
        }
      } else if (this.formData.taskType === 3){
        this.formData = {
          ...this.formData,
          // eachOrderReward:0,
          setRewardList: [{
            parentRewardList: [],
            completeCount: null,
            onlineDays: null,
            onlineDuration: null,
            shareProportion: null,
            shareStartAmount: null
          }]
        }
      } else {
        this.formData = {
          ...this.formData,
          setRewardList: []
        }
      }
    },
    // 如果是复制的任务，删除奖励中心配置的奖励，针对流水分成奖励，不删除
    padAward () {
      if (+this.query.cc === 1) {
        this.clearTaskReward()
        this.formData = {
          ...this.formData,
          ...this.copyTaskInfo
        }
      }
    },
    constructSubmitData () {
      this.submitData = {}
      // 取出公用的
      const {
        cityCode,
        cityUuid,
        agentUuidList,
        taskType,
        taskName,
        taskRemark,
        taskDescribe,
        // taskStatus
        taskTriggerType: triggerType,
        taskStandard,
        taskStandardList,
        startDate: taskStartDate,
        endDate: taskEndDate,
        orderFlowHitRule,
        driverTagList,
        showTime,
        onlineDaysConfig, //在线天数配置
        onlineDurations,//在线时长配置
        applyStartDate,
        applyEndDate,
        applyLimit,
        rewardTotalAmount
      } = this.formData
      // 任务指标是在线天数
      let compositeMode = taskType == 3 ? 1 : 0
      //如果是激励任务。 任务指标为[]类型，其他为字符串 为了便于开发。两种情况分两个字段。。
      // indexType:taskStandard,
      // indexTypes:taskStandardList,
      this.submitData = {
        ...this.submitData,
        cityCode,
        cityUuid,
        // 全部运营商，agentUuidList 传空
        agentUuidList: this.formData.hasSelectAllAgent ? [] : agentUuidList,
        taskType,
        taskName,
        taskRemark,
        taskDescribe,
        // taskStatus
        triggerType,
        compositeMode,
        indexType:taskStandard,
        indexTypes:taskStandardList,
        showTime: this.$moment(showTime).format('YYYY-MM-DD HH:mm:ss'),
        taskStartDate: this.$moment(taskStartDate).format('YYYY-MM-DD'),
        taskEndDate: this.$moment(taskEndDate).format('YYYY-MM-DD'),
        rewardTotalAmount,
        taskDetailUrl: 'test',
        ruleObj: {
          realTask: this.formData.isRealtime,
          timeIntervalList: this.formData.timePeriodList.map((item, index) => ({
            startTimeInterval: item.startTime,
            endTimeInterval: item.endTime
          })),
          resetPeriodType: this.formData.cycle,
          dayCount: this.formData.day,
          weekInterval: this.formData.weekPeriod,
          specificWeekList: this.formData.week,
          orderFlowHitRule,
          driverTagList:this.formData.hasSelectAllSalary ? [] : driverTagList, // driverTagList 传空
        },
        rewardRuleObj: {
          calculationType: this.formData.awardCalculate,
          orderSourceTypeList: this.formData.orderSourceList,
          productTypeList: this.formData.businessLineList,
          rewardLimt: this.formData.awardMax,
          setRewardList: []
        }
      }
      // 如果是奖励瓜分任务 且 是手动报名 不要showTime字段
      if(this.formData.taskType == 4 && this.formData.taskTriggerType == 3){
        delete this.submitData.showTime
      }

      if(compositeMode && taskStandardList.includes(128)){
          onlineDaysConfig.oneDayDuration = Number(onlineDaysConfig.enableHour * 60*60*1000 + onlineDaysConfig.enableMin * 60 * 1000 + onlineDaysConfig.enableSec * 1000)
          this.submitData.ruleObj.onlineDaysConfig = onlineDaysConfig
      }
      // 任务指标是在线时长
      if(compositeMode && taskStandardList.includes(64)){
          this.submitData.ruleObj.onlineDurations = onlineDurations
      }

      // 选择全部运营商
      if (this.formData.hasSelectAllAgent) {
        this.submitData = {
          ...this.submitData,
          choseAllAgent: 1
        }
      }
      // 选择全部工资
      if (this.formData.hasSelectAllSalary) {
        this.submitData = {
          ...this.submitData,
          choseAllSalaryType: 1
        }
      }
      // this.submitData = {
      //   ...this.submitData,
      //   noticeTerminalObj: {
      //     ...this.submitData.noticeTerminalObj,
      //     // noticeTerminalTypeList: this.formData.notifyType,
      //   }
      // }

      // if (this.formData.notifyType.includes(1)) {
      //   this.submitData = {
      //     ...this.submitData,
      //     noticeTerminalObj: {
      //       ...this.submitData.noticeTerminalObj,
      //       enabledBroadcastType: this.formData.broadcast.enableType,
      //       enabledBroadcastHour: this.formData.broadcast.enableHour,
      //       enabledBroadcastMin: this.formData.broadcast.enableMin,
      //       disableBroadcastType: this.formData.broadcast.disableType,
      //       disableBroadcastHour: this.formData.broadcast.disableHour,
      //       disableBroadcastMin: this.formData.broadcast.disableMin,
      //     }
      //   }
      //   // 文字录入
      //   if (this.formData.broadcast.enableType === 1) {
      //     this.submitData = {
      //       ...this.submitData,
      //       noticeTerminalObj: {
      //         ...this.submitData.noticeTerminalObj,
      //         enabledBroadcastDesc: this.formData.broadcast.enableContent,
      //       }
      //     }
      //   } else if (this.formData.broadcast.enableType === 2) {
      //     // 语音播报
      //     this.submitData = {
      //       ...this.submitData,
      //       noticeTerminalObj: {
      //         ...this.submitData.noticeTerminalObj,
      //         enabledBroadcastUrl: this.formData.broadcast.enabledBroadcastUrl,
      //         enabledBroadcastUrlName: this.formData.broadcast.enabledBroadcastUrlName,
      //       }
      //     }
      //   }
      //   // 文字录入
      //   if (this.formData.broadcast.disableType === 1) {
      //     this.submitData = {
      //       ...this.submitData,
      //       noticeTerminalObj: {
      //         ...this.submitData.noticeTerminalObj,
      //         disableBroadcastDesc: this.formData.broadcast.disableContent,
      //       }
      //     }
      //   } else if (this.formData.broadcast.disableType === 2) {
      //     // 语音播报
      //     this.submitData = {
      //       ...this.submitData,
      //       noticeTerminalObj: {
      //         ...this.submitData.noticeTerminalObj,
      //         disableBroadcastUrl: this.formData.broadcast.disableBroadcastUrl,
      //         disableBroadcastUrlName: this.formData.broadcast.disableBroadcastUrlName,
      //       }
      //     }
      //   }
      // }

      // if (this.formData.notifyType.includes(2)) {
      //   this.submitData = {
      //     ...this.submitData,
      //     noticeTerminalObj: {
      //       ...this.submitData.noticeTerminalObj,
      //       enabledMessageDesc: this.formData.message.content,
      //       enabledMessageUrl: this.formData.message.url,
      //       enabledMessageHour: this.formData.message.hour,
      //       enabledMessageMin: this.formData.message.min,
      //       disableMessageDesc: this.formData.message.disableContent,
      //       disableMessageUrl: this.formData.message.disableUrl,
      //       disableMessageHour: this.formData.message.disableHour,
      //       disableMessageMin: this.formData.message.disableMin,
      //     }
      //   }
      // }
      // if (this.formData.notifyType.includes(3)) {
      //   this.submitData = {
      //     ...this.submitData,
      //     noticeTerminalObj: {
      //       ...this.submitData.noticeTerminalObj,
      //       noticeLocationType: 1,
      //       noticeTitle: this.formData.notify.title,
      //       noticeUrl: this.formData.notify.url,
      //     }
      //   }
      // }

      // 选择了司机类型
      if (this.formData.driverTypeList.length > 0) {
        this.submitData = {
          ...this.submitData,
          ruleObj: {
            ...this.submitData.ruleObj,
            driverTypeList: this.formData.hasSelectAllDriverType ? this.formData.tempDriverTypeList : this.formData.driverTypeList,
          }
        }
      } else if (this.formData.selectedDriverGroupList.length > 0) {
        // 选择了司机人群包
        this.submitData = {
          ...this.submitData,
          ruleObj: {
            ...this.submitData.ruleObj,
            crowdList: this.formData.selectedDriverGroupList.map(item => ({
              crowdCode: item.crowdCode,
              crowdName: item.crowdName,
            })),
          }
        }
      }
      //

      // 调度任务
      if (this.formData.taskType === 1) {
        // 到达围栏
        if (this.formData.taskStandard === 6) {
          this.submitData = {
            ...this.submitData,
            indexObj: {
              vihecleStatusList: this.formData.carStatus,
              electronicFenceList: this.formData.selectedList.fence || []
            },
          }
          // 到达围栏，删除calculationType传值
          delete this.submitData.rewardRuleObj.calculationType
        } else if (this.formData.taskStandard === 7) {
          // 到达围栏且接单
          this.submitData = {
            ...this.submitData,
            indexObj: {
              electronicFenceList: this.formData.selectedList.fence || []
            },
            rewardRuleObj: {
              ...this.submitData.rewardRuleObj,
              calculationType: this.formData.awardCalculate,
              orderSourceTypeList: this.formData.orderSourceList,
              productTypeList: this.formData.businessLineList,
            }
          }
        }
        this.submitData = {
          ...this.submitData,
          rewardRuleObj: {
            ...this.submitData.rewardRuleObj,
          }
        }
        // 到达围栏且接单
        if (this.formData.taskType === 1 && this.formData.taskStandard === 7) {
          this.formData.setRewardList.forEach((item, index) => {
            this.submitData.rewardRuleObj.setRewardList.push({
              completeCount: item.completeCount,
              parentRewardList: item.parentRewardList
            })
          })
        } else if (this.formData.taskType === 1 && this.formData.taskStandard === 6) {
          // 到达围栏
          this.formData.setRewardList.forEach((item, index) => {
            this.submitData.rewardRuleObj.setRewardList.push({
              parentRewardList: item.parentRewardList
            })
          })
        }
      }

      // 学习任务
      if (this.formData.taskType === 2) {

      }
      // 激励任务
      if (this.formData.taskType === 3) {
        // 激励流水分成任务配置方式
        let orderFlowConfig = {};
        let setRewardList = []
        let isHasOrder = taskStandardList.includes(16)
        let isHasFlow = taskStandardList.includes(32)
        let isHasOnlineHour = taskStandardList.includes(64)
        let isHasOnlineDay = taskStandardList.includes(128)
        this.formData.setRewardList.forEach((item, index) => {
          let obj = {}
          //任务指标 - 完单
          if(isHasOrder){
            obj.completeCount = item.completeCount
          }
          //任务指标 - 流水
          if(isHasFlow){
            obj.shareStartAmount = parseFloat(item.shareStartAmount)
          }
          //任务指标 -在线时长
          if(isHasOnlineHour){
            obj.onlineDuration = parseFloat(item.onlineDuration) * 60 * 60 * 1000
          }
          //任务指标 -在线天数
          if(isHasOnlineDay){
            obj.onlineDays = parseFloat(item.onlineDays)
          }
          // 奖励模式  流水分成奖
          if(this.formData.awardCalculate === 4 ){
            obj.shareProportion = parseFloat(item.shareProportion)
            
          } else {
             obj.parentRewardList = item.parentRewardList
          }
          setRewardList.push(obj)
        })

        // 奖励方式：叠加奖 任务指标只有完单。
        if (this.formData.awardCalculate === 1 &&this.formData.taskStandardList.length == 1 && isHasOrder) {
          this.submitData.rewardRuleObj.eachOrderReward = this.formData.eachOrderReward
        }

        //奖励计算方式：流水分成奖
        if(this.formData.awardCalculate === 4 ) {
          // 奖励配置类型
          orderFlowConfig = {
            orderFlowConfig: this.formData.orderFlowConfig
          }
        }

        this.submitData = {
          ...this.submitData,
          rewardRuleObj: {
            ...this.submitData.rewardRuleObj,
            setRewardList,
            ...orderFlowConfig
          }
        }
      }

      // 奖励瓜分任务
      if (this.formData.taskType === 4) {
        if(this.formData.taskTriggerType === 3){
          this.submitData.applyStartDate = this.$moment(applyStartDate).format('YYYY-MM-DD HH:mm:ss')
          this.submitData.applyEndDate = this.$moment(applyEndDate).format('YYYY-MM-DD HH:mm:ss')
          this.submitData.applyLimit = applyLimit
        }
        let setRewardList =[]
        this.formData.setRewardList.forEach((item, index) => {
          let obj = {}
          //任务指标 - 完单
          if(this.formData.taskStandard == 4){
            obj.completeCount = item.completeCount
          }
          //任务指标 - 流水
          if(this.formData.taskStandard == 5){
            obj.shareStartAmount = parseFloat(item.shareStartAmount)
          }
          setRewardList.push(obj)
        })
        this.submitData = {
          ...this.submitData,
          rewardRuleObj: {
            ...this.submitData.rewardRuleObj,
            setRewardList:[...setRewardList],
          }
        }
      }
    },
  }
}
</script>

<style lang="less" scoped>
.add-form_wrap {
  display: block;
  /deep/ .ivu-steps {
    font-size: 0;
    line-height: 1.5;
    margin-top: 12px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-left: 20%;
    width: ~"calc(100vw - 20% - 300px)";
  }
}
</style>
