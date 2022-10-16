<template>
  <div
    class="step1_wrap"
    ref="step1_ref"
  >
    <Form
      ref="adForm"
      class="top15 adForm"
      :model="addData"
      :label-width="120"
      :rules="ruleValidate"
    >
      <FormItem
        label="城市："
        prop="cityCode"
        class="ivu-form-item-required"
      >
        <Select
          v-model="addData.cityCode"
          placeholder="请选择"
          filterable
          @on-change="(value) => cityChange(value, true)"
          :disabled="isDetail"
        >
          <!-- eslint-disable -->
          <Option
            v-for="item in cityOptions"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}</Option>
          <!-- eslint-enable -->
        </Select>
      </FormItem>
      <FormItem
        label="运营商："
        prop="agentUuidList"
        class="operator ivu-form-item-required"
      >
        <Select
          v-model="addData.agentUuidList"
          multiple
          filterable
          @on-change="agentUuidChange"
          placeholder="请选择"
          :disabled="isDetail"
        >
          <!-- eslint-disable -->
          <Option
            v-for="item in agentOptions"
            :key="item.value"
            :value="item.value"
            :disabled="item.value !== '全部' && addData.hasSelectAllAgent"
          >{{ item.label }}</Option>
          <!-- eslint-enable -->
        </Select>
      </FormItem>
      <FormItem
        label="任务类型："
        prop="taskType"
        class="ivu-form-item-required"
      >
        <Select
          v-model="addData.taskType"
          @on-change="taskTypeChange"
          placeholder="请选择"
          :disabled="isDetail"
        >
          <Option
            v-for="item in taskTypeOptions"
            :key="item.value"
            :value="item.value"
            :disabled="item.value === 2"
          >
            {{ item.label }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="任务名称："
        prop="taskName"
        class="ivu-form-item-required"
      >
        <Input
          v-model="addData.taskName"
          placeholder="请输入任务名称"
          class="taskName_input"
          @on-change="nameChange"
          :width="220"
          :maxlength="20"
          :disabled="(isEdit && addData.taskStatus!=0) || isDetail || isCopy"
        />
      </FormItem>
      <FormItem
        label="备注："
        prop="taskRemark"
      >
        <Input
          v-model="addData.taskRemark"
          placeholder="请输入备注"
          class="taskName_input"
          @on-change="nameChange"
          :width="220"
          :maxlength="50"
          :disabled="isDetail"
        />
      </FormItem>
      <FormItem
        label="任务描述："
        prop="taskDescribe"
        class="ivu-form-item-required"
      >
        <!-- <Input
          v-model="addData.taskDescribe"
          placeholder="请输入任务描述"
          type="textarea"
          class="taskDesc_input"
          @on-change="descChange"
          :disabled="isDetail"
          :maxlength="2000"
        /> -->
        <u-editor
          ref="uEditor"
          v-model="addData.taskDescribe"
          :inputMax="maxLen"
          class="step-editor"
          :maximumWords="2000"
        ></u-editor>
      </FormItem>
      <!-- 第一步 -->
      <!-- 调度任务 -->
      <!-- 调度任务 -->
      <!-- 任务围栏 -->
      <FormItem
        v-if="addData.taskType === 1"
        label="任务围栏："
        prop="taskFence"
        class="ivu-form-item-required"
      >
        <div class="line">
          <Button
            v-if="addData.selectedList['fence'].length === 0"
            type="primary"
            @click="selectFence"
            :disabled="isDetail"
          >
            选择电子围栏
          </Button>
          <Button
            v-if="addData.selectedList['fence'].length > 0"
            type="primary"
            @click="selectFence"
            :disabled="isDetail"
          >
            新增电子围栏
          </Button>
        </div>
        <div
          v-if="addData.selectedList['fence'].length > 0"
          class="line"
        >
          <div class="fence_list">
            <div
              v-for="item in addData.selectedList['fence']"
              :key="item.uuid"
              class="item"
            >
              <span
                class="name"
                v-if="item.name"
              >{{ item.name }}</span>
              <span
                v-if="item.name && !isDetail"
                class="delete"
                @click="handleDeleteSelected(item, 'fence')"
              >X</span>
            </div>
          </div>
        </div>
      </FormItem>
      <!-- 此组件废弃。移动到 setp3 dispatch.vue了 2021-5-14 -->
      <!-- <step1Dispatch
        :addData="addData"
        @handleDeleteSelected="(item) => handleDeleteSelected(item, 'fence')"
        @selectFence="selectFence"
        @checkAllGroupChange="checkAllGroupChange"
        :isDetail="isDetail"
        @taskStandardChange="taskStandardChange"
      ></step1Dispatch> -->
      <!-- 第一步 -->
      <!-- 学习任务 -->
      <step1Study
        :addData="addData"
        @handleDeleteSelected="(item) => handleDeleteSelected(item, 'study')"
        @selectStudy="selectStudy"
        :isDetail="isDetail"
        @taskStandardChange="taskStandardChange"
      ></step1Study>
      <!-- 第一步 -->

      <!-- 此组件废弃。移动到 setp3 encourage.vue了 2021-5-14 -->
      <!-- 激励任务 -->
      <!-- <step1Encourage
        :addData="addData"
        :isDetail="isDetail"
        @taskStandardChange="taskStandardChange"
      ></step1Encourage> -->

      <!-- footer -->
      <FormItem>
        <Button
          type="primary"
          @click="goNext"
        > 下一步 </Button>
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
    <!-- 调度任务 -->
    <!-- 选择围栏 -->
    <fence
      v-if="!isDetail && showFence"
      :list="addData.selectedList['fence']"
      :limitNumber="15"
      :isDetail="isDetail"
      :cityCode="addData.cityCode"
      @close="showFence = false"
      @selectDown="(list) => selectDown(list, 'fence')"
    />
    <!-- 选择课程包 -->
    <!-- 学习任务 -->
    <study
      :isDetail="isDetail"
      v-if="!isDetail && showStudy"
      :list="addData.selectedList['study']"
      :limitNumber="15"
      @close="showStudy = false"
      @selectDown="(list) => selectDown(list, 'study')"
    />
  </div>
</template>

<script>
import { cpTranslate } from "@/libs/tools"
import SelectSort from "_a/select-sort/select-sort.vue";
import { queryAgentList, queryOpenCityList } from "_o/api/task-manager";
import {
  taskTypeOptions,
  taskStandardOptions,
  carStatusOptions,
  taskStandardForStudyOptions,
  step1Rules,
  orderFlowHitRuleOptions
} from "../../../config/fields"
import fence from "../../fence/fence.vue"
import step1Dispatch from "../components/step1/dispatch.vue"
import step1Study from "../components/step1/study.vue"
import step1Encourage from "../components/step1/encourage.vue"
import study from "../../study/index.vue"
import uEditor from "_a/u-editor/index.vue";

export default {
  name: "step1",
  components: {
    SelectSort,
    fence,
    step1Dispatch,
    step1Study,
    study,
    step1Encourage,
    uEditor
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
      maxLen: 2000,
      cityOptions: [],
      taskTypeOptions,
      carStatusOptions,
      taskStandardOptions,
      taskStandardForStudyOptions,
      cascaderCityList: [],
      agentOptions: [],
      queryAgentList,
      orderFlowHitRuleOptions,
      addData: {
        privinceCode: "",
        cityCode: "",
        agentUuidList: [],
        taskType: 1,
        taskStandard: 6,
        selectedList: {
          fence: [
          ],
          study: [
          ]
        },
        orderFlowHitRule:"",
      },
      hasSelectAllAgent: false,
      showFence: false,
      showStudy: false,
      isShowOperator: true,
      ruleValidate: step1Rules(this),
    }
  },
  created () {
    this.addData = {
      ...this.addData,
      ...this.$parent.$parent.$parent.getData(),
    }
    console.log(this.addData)
  },
  watch: {
  },
  mounted () {
    this.getCityList()
    this.cityChange()
  },
  methods: {
    descChange () {

    },
    nameChange () {

    },
    cityChange (cityCode, clear) {
      if (clear) {
        this.addData.agentUuidList = []
      }
      this.getAgentList()
    },
    // 获取运营商列表
    getAgentList () {
      queryAgentList({
        cityCode: this.addData.cityCode
      }).then(res => {
        if (res.data.code === 200 && res.data.success) {
          let data = res.data.data || []
          this.agentOptions = data.map(item => ({
            value: item.agentUuid,
            label: item.agentName
          }))
          if (this.agentOptions.length > 0) {
            this.agentOptions.unshift({
              value: '全部',
              label: '全部'
            })
          }
        }
      })
    },
    // 任务指标切换
    taskStandardChange () {
      // 指标切换，奖励计算方式清空
      this.addData.awardCalculate = ''
      this.switchTask()
    },
    // 任务类型切换
    taskTypeChange (value) {
      // 类型切换，任务指标清空
      this.addData.taskStandard = ''
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
    agentUuidChange (value) {
      this.addData.agentUuidList = value;
      if (value && value.length > 0 && value.includes('全部')) {
        this.addData.agentUuidList = ['全部']
        this.addData.hasSelectAllAgent = true
      } else {
        this.addData.hasSelectAllAgent = false
      }
    },
    // 单选
    checkAllGroupChange (data) {
      console.log("data", data)
      this.addData.carStatus = data
    },
    // 获取城市列表
    async getCityList () {
      const res = await queryOpenCityList({})
      if (!res) {
        this.cityOptions = []
        this.$Message.error("获取城市失败");
        return false
      }
      if (res.data && res.data.data && res.data.success) {
        this.cityOptions = res.data.data.map(item => ({
          value: item.cityId,
          label: item.city
        }))
      } else {
        this.cityOptions = []
        this.$Message.error(res.data.msg);
      }
    },
    // 删除围栏
    handleDeleteSelected (c, type) {
      this.addData.selectedList[type] = this.addData.selectedList[type].filter(item => item.uuid !== c.uuid)
    },
    // 新增或者选择围栏
    selectFence () {
      this.showFence = true
    },
    // 关闭围栏
    handleCloseFence () {
      this.showFence = false
    },
    // 选择围栏
    selectDown (list, type) {
      let selectCopy = JSON.parse(JSON.stringify(this.addData.selectedList[type]));
      let selectHash = {};
      let addList = [];
      // 清空原来的选择
      this.addData.selectedList[type].splice(0, 15);
      // 记录原来的选择
      selectCopy.forEach((item, index) => {
        selectHash[item.uuid] = String(index);
      });
      // 判断如果原来也选了，放到相同的位置，没选加进去
      list.forEach(item => {
        let index = selectHash[item.uuid];
        if (index) {
          this.addData.selectedList[type].push(selectCopy[index]);
        } else {
          addList.push(item);
        }
      });
      this.addData.selectedList[type].push(...addList);
      this.validFence()
    },
    // 手动校验围栏表单
    validFence () {
      this.$refs['adForm'].validateField('taskFence')
    },
    // 新增或者选择课程包
    selectStudy () {
      this.showStudy = true
    },
    // 下一步
    async goNext () {
      const valid = await this.$refs['adForm'].validate()
      if (!valid) {
        return false
      }
      console.log('this.addData.taskDescribe', this.addData.taskDescribe)
      console.log('this.addData.taskDescribe', this.$refs['uEditor'].editorInstance.hasContents())
      if (this.$refs['uEditor'] && !this.$refs['uEditor'].editorInstance.hasContents()) {
        this.$Message.error('请输入任务描述')
        return false
      }
      this.$emit('goNext', this.addData)
    },
    // 取消
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="less" scoped>
.step1_wrap {
  margin-left: ~"calc(-300px)";
  overflow-x: hidden;
  margin-top: 12px;
  width: ~"calc(100vw - 20% - 300px)";
  // min-height: 60vh;
  height: auto;
  .operator {
    /deep/ .ivu-select-selection {
      max-height: 150px;
      overflow: auto;
    }
  }
  /deep/ .edui-editor {
    width: 100% !important;
    z-index: 1000 !important;
  }
  /deep/ .ivu-select-dropdown {
    z-index: 1002 !important;
  }
  .adForm {
    /deep/ .line {
      display: flex;
      justify-content: flex-start;
      // margin-top: 4px;
      .item {
        margin-right: 16px;
        white-space: nowrap;
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
          width: 20px;
          height: 20px;
        }
      }
      .fence_list {
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        margin-top: 4px;
        flex-wrap: wrap;
      }
    }
    /deep/ .ivu-input-wrapper {
      input {
        width: 220px;
      }
      textarea {
        width: 400px;
        height: 150px;
      }
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
.radio-group-text {
  margin-left: 10px;
  font-size: 14px !important;
}
.md-help {
  background: red;
  border-radius: 50%;
  color: white;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
