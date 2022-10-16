<template>
  <div class="step3_wrap">
    <Form
      ref="adForm"
      class="top15 adForm"
      :model="addData"
      :rules="ruleValidate"
      :label-width="130"
    >
      <!-- 第三步 -->
      <!-- 调度任务 -->
      <step3Dispatch
        v-if="addData.taskType === 1"
        :addData="addData"
        @handleDeleteModule="handleDeleteModule"
        @handleAddModule="handleAddModule"
        @handleDeleteAward="handleDeleteAward"
        @addSetUp="addSetUp"
        @setUp="setUp"
        :isDetail="isDetail"
        @orderSourceChange="orderSourceChange"
        @checkAllGroupChange="checkAllGroupChange"
        @taskStandardChange="taskStandardChange"
      ></step3Dispatch>
      <!-- 第三步 -->
      <!-- 学习任务 -->
      <step3Study
        v-if="addData.taskType === 2"
        :addData="addData"
        :isDetail="isDetail"
      ></step3Study>
      <!-- 第三步 -->
      <!-- 激励任务 -->
      <step3Encourage
        v-if="addData.taskType === 3"
        :addData="addData"
        @handleDeleteModule="handleDeleteModule"
        @handleAddModule="handleAddModule"
        @handleDeleteAward="handleDeleteAward"
        @addSetUp="addSetUp"
        @setUp="setUp"
        :isDetail="isDetail"
        :ruleValidate="ruleValidate"
      ></step3Encourage>
       <step4Bonus
        v-if="addData.taskType === 4"
        :addData="addData"
        :isDetail="isDetail"
        :ruleValidate="ruleValidate"
      ></step4Bonus>
      <!-- 奖励包 -->

      <set-up-rewards
        :show="showAward"
        :time="[addData.startDate, addData.endDate]"
        :selectedList="selectedSetUpList"
        @setRewards="setRewards"
        @close="closeSetUp"
        :isDetail="isDetail"
        v-if="!isDetail"
        :canAddDIANBU="canAddDIANBU"
      ></set-up-rewards>
      <!-- footer -->
      <FormItem>
        <Button
          type="primary"
          @click="goPrevious"
        >上一步</Button>
        <Button
          type="primary"
          @click="goNext"
          v-if="!isDetail"
        > 提交 </Button>
        <Button
          type="default"
          @click="goList"
          v-if="isDetail"
        > 确定 </Button>
        <Button
          class="cancel_btn"
          type="default"
          @click="cancel"
          v-if="!isDetail && !isCopy"
        >
          取消
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import step3Dispatch from "../components/step3/dispatch.vue"
import step3Study from "../components/step3/study.vue"
import step3Encourage from "../components/step3/encourage.vue"
import step4Bonus from "../components/step3/bonus.vue"
import setUpRewards from "../../set-up-rewards/index.vue"
import {
  step3Rules
} from "../../../config/fields"

export default {
  name: "step3",
  components: {
    step3Dispatch,
    step3Encourage,
    step3Study,
    setUpRewards,
    step4Bonus
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
      selectedSetUpList: [],
      moduleIndex: 0,
      parentIndex: '',
      childIndex: '',
      // 显示选择奖励
      showAward: false,
      addData: {
        orderFlowConfig: 1,
        // 任务类型-调度任务
        taskType: 1,
        // 任务指标-到达且接单
        taskStandard: null,
        taskStandardList:[],
        rewardTotalAmount:0,
        // 奖励列表
        setRewardList: [],
        // 流水金额，流水金额模块
        flowAwardList: [{
          shareStartAmount: null,
          shareProportion: null
        }],
        awardCalculate: '',
        //是否每单都给奖励
        eachOrderReward:0,
        hasSelectAllOrderSource: false,
        onlineDurations:[
          {
            startTimeInterval: '00:00:00',
            endTimeInterval: '23:59:59'
          }
        ],
        onlineDaysConfig:{
          oneDayDuration:0,
          enableHour:0,
          enableMin:0,
          enableSec:0,
          onlineDaysDurations:[
            {
              startTimeInterval: '00:00:00',
              endTimeInterval: '23:59:59'
            }
          ]
        }
      },
      ruleValidate: step3Rules(this),
      // 奖励类型是否可以选择电补
      canAddDIANBU: true
    }
  },
  creatd () {
  },
  watch: {
  },
  computed: {
  },
  mounted () {
    // 优先取最新的值
    this.addData = {
      ...this.addData,
      ...this.$parent.$parent.$parent.getData()
    }
    if(!this.addData.rewardTotalAmount){
      this.addData.rewardTotalAmount = ''
    }
    // 如果奖励没有值，那么根据条件来判断奖励类型
    // 如果奖励没有值，那么根据条件来判断奖励类型
    if (!this.addData.setRewardList ||
      this.addData.setRewardList.length === 0) {
      if (this.addData.taskType === 1
        && this.addData.taskStandard === 7) {
        // 调度任务-到达围栏且接单指标
        this.addData = {
          ...this.addData,
          setRewardList: [{
            parentRewardList: [],
            prefixProp: 'completeCount',
            prefixName: '完单数：',
            hasBindPrefix: true,
            'completeCount': null
          }]
        }
      } 
      else if(this.addData.taskType === 3){
        this.addData = {
          ...this.addData,
          eachOrderReward:0,
          setRewardList: [{
            parentRewardList: [],
            completeCount: null,
            onlineDays: null,
            onlineDuration: null,
            shareProportion: null,
            shareStartAmount: null
          }]
        }
      } else if(this.addData.taskType === 4){
        this.addData = {
          ...this.addData,
          setRewardList: [{
            completeCount: null,
            shareStartAmount: null
          }]
        }
      }
       else {
        this.addData = {
          ...this.addData,
          setRewardList: [{
            parentRewardList: [],
            prefixProp: '',
            prefixName: '',
            hasBindPrefix: false
          }]
        }
      }
    }
    // 流水奖励
    if (this.addData.flowAwardList.length === 0) {
      if (this.addData.taskType === 3
        && this.addData.taskStandard === 5
        && this.addData.awardCalculate === 4) {
        // 流水分成奖
        this.addData.awardMax = null
        this.addData = {
          ...this.addData,
          flowAwardList: [{
            shareStartAmount: null,
            shareProportion: null
          }]
        }
      }
    }
  },
  methods: {
    orderSourceChange (value) {
      this.addData.orderSourceList = value;
      if (value && value.length > 0 && value.includes(34)) {
        this.addData.orderSourceList = [34]
        this.addData.hasSelectAllOrderSource = true
      } else {
        this.addData.hasSelectAllOrderSource = false
      }
    },
    // 下一步
    async goNext () {
      let isValid = true
      const valid = await this.$refs['adForm'].validate()
      if (!valid) {
        return
      } 
      // 除了到达围栏，校验产品线
      if (!(this.addData.taskType === 1 && this.addData.taskStandard === 6)) {
        if (!this.addData.businessLineList ||
          this.addData.businessLineList.length === 0) {
          isValid = false
          this.$Message.error('请选择产品线')
          return
        }
      }

      if (!isValid) {
        return
      }


      // 如果是激励任务。任务指标不可只选择在线时长、在线天数；
      if(this.addData.taskStandardList.length==1 && (this.addData.taskStandardList.includes(64)||this.addData.taskStandardList.includes(128))){
        if(this.addData.taskStandardList.includes(64)){
          this.$Message.error(`任务指标不可只选择在线时长`)
          isValid = false
          return false
        }
        if(this.addData.taskStandardList.includes(128)){
          this.$Message.error(`任务指标不可只选择在线天数`)
          isValid = false
          return false
        }
      }
      
      let baseTime = ''
      let currentDate = this.$moment(new Date()).format('YYYY-MM-DD')
      // 如果是激励任务。任务指标选中了 在线时长
      if(this.addData.taskType === 3 && this.addData.taskStandardList.includes(64)){
        this.addData.onlineDurations.forEach((item, index) => {
          if (this.$moment(currentDate + ' ' + item.startTimeInterval + ':00').diff(this.$moment(currentDate + ' ' + item.endTimeInterval + ":00"), 'seconds') > 0) {
            this.$Message.error(`在线时长定义 第${index + 1}开始时段不能大于第${index + 1}结束时段`)
            isValid = false
            return false
          }
        })
        this.addData.onlineDurations.forEach((item, index) => {
          if (!isValid) {
            return
          }
          if (this.addData.onlineDurations.length > 1 && index >= 1) {
            baseTime = this.addData.onlineDurations[index - 1].endTimeInterval
            if (this.$moment(currentDate + ' ' + item.startTimeInterval + ":00").diff(this.$moment(currentDate + ' ' + baseTime + ":00"), 'seconds') < 0) {
              this.$Message.error(`在线时长定义 第${index + 1}开始时段不能小于第${index}的结束时段`)
              isValid = false
              return false
            }
          }
        })
        // 配置的时段需在任务生效时间内；
        if (this.$moment(currentDate + ' ' +  this.addData.onlineDurations[0].startTimeInterval + ':00').diff(this.$moment(currentDate + ' ' + this.addData.timePeriodList[0].startTime + ":00"), 'seconds') < 0) {
          this.$Message.error(`在线时长定义配置的开始时段需在任务生效时间内`)
          isValid = false
          return false
        }
         if (this.$moment(currentDate + ' ' +  this.addData.onlineDurations[this.addData.onlineDurations.length-1].endTimeInterval + ':00').diff(this.$moment(currentDate + ' ' + this.addData.timePeriodList[this.addData.timePeriodList.length-1].endTime + ":00"), 'seconds') > 0) {
          this.$Message.error(`在线时长定义配置的结束时段需在任务生效时间内`)
          isValid = false
          return false
        }
      }

      if (!isValid) {
        return
      }
      // 如果是激励任务。任务指标选中了 在线天数
      if(this.addData.taskType === 3 && this.addData.taskStandardList.includes(128)){
        this.addData.onlineDaysConfig.onlineDaysDurations.forEach((item, index) => {
          if (this.$moment(currentDate + ' ' + item.startTimeInterval + ':00').diff(this.$moment(currentDate + ' ' + item.endTimeInterval + ":00"), 'seconds') > 0) {
            this.$Message.error(`在线1天定义 第${index + 1}开始时段不能大于第${index + 1}结束时段`)
            isValid = false
            return false
          }
        })
        this.addData.onlineDaysConfig.onlineDaysDurations.forEach((item, index) => {
          if (!isValid) {
            return
          }
          if (this.addData.onlineDaysConfig.onlineDaysDurations.length > 1 && index >= 1) {
            baseTime = this.addData.onlineDaysConfig.onlineDaysDurations[index - 1].endTimeInterval
            if (this.$moment(currentDate + ' ' + item.startTimeInterval + ":00").diff(this.$moment(currentDate + ' ' + baseTime + ":00"), 'seconds') < 0) {
              this.$Message.error(`在线1天定义 第${index + 1}开始时段不能小于第${index}的结束时段`)
              isValid = false
              return false
            }
          }
        })
         // 配置的时段需在任务生效时间内；
        if (this.$moment(currentDate + ' ' +  this.addData.onlineDaysConfig.onlineDaysDurations[0].startTimeInterval + ':00').diff(this.$moment(currentDate + ' ' + this.addData.timePeriodList[0].startTime + ":00"), 'seconds') < 0) {
          this.$Message.error(`在线1天定义配置的开始时段需在任务生效时间内`)
          isValid = false
          return false
        }
         if (this.$moment(currentDate + ' ' +  this.addData.onlineDaysConfig.onlineDaysDurations[this.addData.onlineDaysConfig.onlineDaysDurations.length-1].endTimeInterval + ':00').diff(this.$moment(currentDate + ' ' + this.addData.timePeriodList[this.addData.timePeriodList.length-1].endTime + ":00"), 'seconds') > 0) {
          this.$Message.error(`在线1天定义配置的结束时段需在任务生效时间内`)
          isValid = false
          return false
        }
      }

      if (!isValid) {
        return
      }

      if (!((this.addData.taskType === 1 && this.addData.taskStandard === 6) || (this.addData.taskType === 4))) {
        if (!this.addData.businessLineList ||
          this.addData.businessLineList.length === 0) {
          isValid = false
          this.$Message.error('请选择产品线')
          return
        }

        if (!this.addData.awardCalculate) {
          isValid = false
          this.$Message.error('请选择奖励计算方式')
          return
        }
      }

      if (!isValid) {
        return
      }

      // 去除流水分成，其余的都需要奖励类型 5 任务指标完单。4 奖励分成流水
      if (!((this.addData.taskType === 3 && this.addData.awardCalculate === 4)||(this.addData.taskType === 4))) {
        this.addData.setRewardList.forEach((item, index) => {
          if (item.hasBindPrefix) {
            if (item[item.prefixProp] === null || item[item.prefixProp] === "" || item[item.prefixProp] === undefined) {
              isValid = false
              this.$Message.error(`针对第${index + 1}奖励，请设置${item.prefixName.replace(/[:：]/g, '')}`)
              return
            }
          }
          if (!item.parentRewardList
            || item.parentRewardList.length === 0
            || (item.parentRewardList.length === 1 && item.parentRewardList[0].subRewardList.length === 0)) {
            isValid = false
            this.$Message.error(`针对第${index + 1}奖励，请设置至少一条奖励类型`)
            return
          }
        })
      }

      if (!isValid) {
        return
      }

      // 校验完单不能完全一致
      if ((this.addData.taskType === 3 && this.addData.taskStandardList.includes(16)) ||
        (this.addData.taskType === 1 && this.addData.taskStandard === 7)) {
        let baseCount = ''
        this.addData.setRewardList.forEach((item, index) => {
          if (String(item.completeCount).indexOf('.') > -1) {
            isValid = false
            this.$Message.error(`第${index + 1}条完单数不能输入小数`)
            return
          }
          if (item.completeCount && index >= 1 && this.addData.setRewardList.length > 1) {
            baseCount = this.addData.setRewardList[index - 1].completeCount
            if (+item.completeCount < +baseCount) {
              isValid = false
              this.$Message.error(`第${index + 1}条完单数不能小于第${index}条完单数`)
              return
            }
            if (+item.completeCount === +baseCount) {
              isValid = false
              this.$Message.error(`第${index + 1}条完单数不能等于第${index}条完单数`)
              return
            }
          }
        })
      }

      if (!isValid) {
        return
      }

      // 流水分成奖
      // 校验流水金额不能一致
      if (this.addData.taskType === 3 && this.addData.taskStandardList.includes(32)) {
        // // 流水固定奖
        // if (this.addData.awardCalculate === 3) {
        //   let baseCount = ''
        //   this.addData.setRewardList.forEach((item, index) => {
        //     if (!item.shareStartAmount
        //       || item.shareStartAmount < 0.01
        //       || item.shareStartAmount > 100000
        //       || (String(item.shareStartAmount).indexOf('.') > -1
        //         && String(item.shareStartAmount).split('.')[1].length > 2)) {
        //       isValid = false
        //       this.$Message.error(`第${index + 1}条流水金额只能输入0.01-100000之间的数，如是小数，只能保留两位`)
        //       return
        //     }
        //     if (item.shareStartAmount && index >= 1 && this.addData.setRewardList.length > 1) {
        //       baseCount = this.addData.setRewardList[index - 1].shareStartAmount
        //       if (+item.shareStartAmount < +baseCount) {
        //         isValid = false
        //         this.$Message.error(`第${index + 1}条流水金额不能小于第${index}条流水金额`)
        //         return
        //       }
        //       if (+item.shareStartAmount === +baseCount) {
        //         isValid = false
        //         this.$Message.error(`第${index + 1}条流水金额不能等于第${index}条流水金额`)
        //         return
        //       }
        //     }
        //   })
        // }

        // 流水分成奖
        if (this.addData.awardCalculate === 4) {
          let baseCount = ''
          let basePercent = ''
          this.addData.setRewardList.forEach((item, index) => {
            if (item.shareStartAmount && index >= 1 && this.addData.setRewardList.length > 1) {
              baseCount = this.addData.setRewardList[index - 1].shareStartAmount
              if (+item.shareStartAmount < +baseCount) {
                isValid = false
                this.$Message.error(`第${index + 1}条流水金额不能小于第${index}条流水金额`)
                return
              }
              if (+item.shareStartAmount === +baseCount) {
                isValid = false
                this.$Message.error(`第${index + 1}条流水金额不能等于第${index}条流水金额`)
                return
              }
            }
            if (!item.shareProportion
              || item.shareProportion < 0.01
              || item.shareProportion > 100
              || (String(item.shareProportion).indexOf('.') > -1
                && String(item.shareProportion).split('.')[1].length > 2)) {
              isValid = false
              this.$Message.error(`第${index + 1}条流水分成只能输入0.01-100之间的数，如是小数，只能保留两位`)
              return
            }
            if (!item.shareStartAmount
              || item.shareStartAmount < 0.01
              || item.shareStartAmount > 100000
              || (String(item.shareStartAmount).indexOf('.') > -1
                && String(item.shareStartAmount).split('.')[1].length > 2)) {
              isValid = false
              this.$Message.error(`第${index + 1}条流水金额只能输入0.01-100000之间的数，如是小数，只能保留两位`)
              return
            }
          })
        }
      }

      if (!isValid) {
        return
      }

      // 手动校验产品线
      // bug  需要解决
      // const valid = await this.$refs['adForm'].validateField('businessLineList')
      if (isValid) {
        this.$emit('submit', this.addData)
      }
    },
    // 回到列表
    goList () {
      this.$emit('goList', this.addData)
    },
    // 取消
    cancel () {
      this.$emit('cancel')
    },
    // 上一步
    goPrevious () {
      this.$emit('goPrevious', this.addData)
    },
    // 删除奖励模块
    handleDeleteModule (index) {
      this.addData.setRewardList.splice(index, 1)
    },
    // 添加奖励模块
    handleAddModule () {
      this.addData.setRewardList.push({
        ...this.judgeAward()
      })
    },
    // 删除某一个奖励
    handleDeleteAward (index, ci, cci) {
      if (this.addData.setRewardList[index].parentRewardList[ci].subRewardList.length === 1) {
        this.addData.setRewardList[index].parentRewardList[ci].subRewardList = []
        this.addData.setRewardList[index].parentRewardList.splice(ci, 1)
      } else {
        let subRewardList = this.addData.setRewardList[index].parentRewardList[ci].subRewardList.filter((item, i) => i !== cci)
        this.addData.setRewardList[index].parentRewardList[ci].subRewardList = subRewardList
      }
    },
    awardCalculateChange (value) {
      if (value === 3) {
        // 清空流水
      }
    },
    judgeAward () {
      if (this.addData.taskType === 1 && this.addData.taskStandard === 7) {
        // 调度任务-到达围栏且接单指标
        return {
          parentRewardList: [],
          prefixProp: 'completeCount',
          prefixName: '完单数：',
          hasBindPrefix: true,
          'completeCount': null
        }
      }  else if (this.addData.taskType === 1 && this.addData.taskStandard === 6) {
        // 调度任务-到达围栏
        return {
          parentRewardList: [],
        }
      } else if (this.addData.taskType === 3) {
        // 激励任务
        return {
           parentRewardList: [],
            completeCount: null,
            onlineDays: null,
            onlineDuration: null,
            shareProportion: null,
            shareStartAmount: null
        }
      } else {
        return {
          parentRewardList: [],
          prefixProp: '',
          prefixName: '',
          hasBindPrefix: false
        }
      }
    },
    // 选择奖励
    setRewards (list) {
      if (this.moduleIndex !== '') {
        this.addData.setRewardList[this.moduleIndex].parentRewardList = JSON.parse(JSON.stringify(list))
      }
      this.showAward = false
    },
    // 新增奖励
    addSetUp (index, ci) {
      // 到达围栏且接单不可以选择电补
      this.canAddDIANBU = this.addData.taskStandard !== 7
      this.showAward = true
      this.moduleIndex = index
      this.parentIndex = ci
      this.selectedSetUpList = this.addData.setRewardList[index].parentRewardList
    },
    // 选择奖励、设置奖励
    setUp (index) {
      this.moduleIndex = index
      this.selectedSetUpList = []
      this.showAward = true
      // 到达围栏且接单不可以选择电补
      this.canAddDIANBU = this.addData.taskStandard !== 7
    },
    // 关闭奖励类型
    closeSetUp () {
      this.showAward = false
    },
    // 单选
    checkAllGroupChange (data) {
      console.log("data", data)
      this.addData.carStatus = data
    },
     // 任务指标切换
    taskStandardChange () {
      // 指标切换，奖励计算方式清空
      this.addData.awardCalculate = ''
      this.switchTask()
    },
    // 切换类型或者指标时
    // 老的需要根据任务类型和任务指标切换的数据就丢失了
    switchTask () {
      if (this.addData.taskType === 1
        && this.addData.taskStandard === 7) {
        // 调度任务-到达围栏且接单指标
        this.addData = {
          ...this.addData,
          setRewardList: [{
            parentRewardList: [],
            prefixProp: 'completeCount',
            prefixName: '完单数：',
            hasBindPrefix: true,
            'completeCount': null
          }]
        }
      } else if (this.addData.taskType === 3
        && this.addData.taskStandard === 5
        && this.addData.awardCalculate === 3) {
        // 流水固定奖
        this.addData = {
          ...this.addData,
          setRewardList: [{
            parentRewardList: [],
            prefixProp: 'shareStartAmount',
            prefixName: '流水金额：',
            hasBindPrefix: true,
            'shareStartAmount': null
          }]
        }
      } else if (this.addData.taskType === 3
        && this.addData.taskStandard === 5
        && this.addData.awardCalculate === 4) {
        // 流水分成奖
        this.addData.awardMax = null
        this.addData = {
          ...this.addData,
          flowAwardList: [{
            shareStartAmount: null,
            shareProportion: null
          }]
        }
      } else if (this.addData.taskType === 3
        && this.addData.taskStandard === 4) {
        // 激励任务-完单指标
        this.addData = {
          ...this.addData,
          setRewardList: [{
            parentRewardList: [],
            prefixProp: 'completeCount',
            prefixName: '完单数：',
            hasBindPrefix: true,
            'completeCount': null
          }]
        }
      } else if (this.addData.taskType === 1
        && this.addData.taskStandard === 6) {
        // 到达围栏
        this.addData = {
          ...this.addData,
          setRewardList: [{
            parentRewardList: [],
          }]
        }
      } else {
        this.addData = {
          ...this.addData,
          setRewardList: []
        }
      }
    },
  }
}
</script>

<style lang="less" scoped>
.step3_wrap {
  transform: translateX(~"calc(-80vw + 360px)");
  overflow-x: hidden;
  margin-top: 12px;
  width: ~"calc(100vw - 20% - 300px)";
  min-height: 60vh;
  .adForm {
    .line {
      display: flex;
      justify-content: flex-start;
      // margin-top: 4px;
      .item {
        margin-right: 4px;
        .name {
          font-size: 15px;
        }
        .delete {
          font-size: 16px;
          color: red;
          margin-left: 4px;
          font-weight: 600;
          cursor: pointer;
          width: 20px;
          height: 20px;
        }
      }
      .fence_list {
        display: flex;
        justify-content: flex-start;
        margin-top: 4px;
      }
    }
    /deep/ .ivu-input-wrapper {
      input {
        width: 220px;
      }
    }
    /deep/ .ivu-input-number{
      width: 220px;
    }
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
}
</style>
