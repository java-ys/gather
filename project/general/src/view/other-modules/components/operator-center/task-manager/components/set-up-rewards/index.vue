<template>
  <div>
    <Modal
      v-model="isShow"
      :width="1000"
      title="选择奖励"
      :mask-closable="false"
      :footer-hide="true"
      @on-cancel="$emit('close')"
    >
      <div class="steps-wrap">
        <Steps :current="stepsValue">
          <Step title="选择父奖励"></Step>
          <Step title="选择子奖励"></Step>
        </Steps>
        <div class="button-item">
          <Button type="primary" @click="gotoReward">创建奖励</Button>
          <Button type="primary" @click="upData">刷新</Button>
        </div>
      </div>
      <m2-table
        v-if="stepsValue === 0"
        class="top15"
        :total="parent.total"
        :current="parent.current"
        :pageSize="parent.pageSize"
        :parColumns="parentColumns"
        :parTableData="parentData"
        :isLoading="parent.isLoading"
        @changePage="(val) => changePage(val, 'parent')"
        @changePageSize="(val) => changePageSize(val, 'parent')"
      >
        <template slot-scope="params" slot="action">
          <Button
            ghost
            type="info"
            size="small"
            @click="chooseParent(params.data.row)"
            >选择子奖励</Button
          >
        </template>
      </m2-table>
      <m2-table
        v-if="stepsValue === 1"
        class="top15"
        :total="son.total"
        :current="son.current"
        :pageSize="son.pageSize"
        :parColumns="sonColumns"
        :parTableData="sonData"
        :isLoading="son.isLoading"
        @changePage="(val) => changePage(val, 'son')"
        @changePageSize="(val) => changePageSize(val, 'son')"
      >
        <template slot-scope="params" slot="action">
          <Button
            ghost
            type="success"
            size="small"
            @click="chooseSon(params.data.row)"
            >确认奖励</Button
          >
        </template>
      </m2-table>
      <div class="text-center">
        <Button v-show="stepsValue === 1" size="large" @click="stepsValue = 0"
          >上一步</Button
        >
      </div>
    </Modal>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import {
  parentColumns,
  sonColumns,
  rewardTypeMap,
  rewardPatternMap,
} from "./fields.js";
import { axiosParentReward, axiosSonReward } from "_o/api/task-manager.js";
/** 使用方法：
 * html:
 * <set-up-rewards
 *   :show="isSetUpReward"
 *   :time="taskTime"
 *   :selectedList="selectedList"
 *   @setRewards="setRewards"
 *   @close="isSetUpReward=false"
 *   ></set-up-rewards>
 *
 * data:
 *   isSetUpReward: false,
 *   selectedList: []
 *
 * components:
 *   setUpRewards
 *
 * methods:
 *   setRewards(selectedList){
 *     this.selectedList = selectedList
 *   }
 */

const defaultPageVal = {
  total: 20,
  current: 1,
  pageSize: 10,
  isLoading: false,
};

export default {
  name: "set-up-rewards",
  props: {
    show: {
      type: Boolean,
    },
    // 任务开始时间结束时间
    time: {
      default: () => [],
    },
    // @setRewards方法返回的list绑定
    selectedList: {
      default: () => [],
    },
    canAddDIANBU: {
      type: Boolean,
    },
  },
  data() {
    return {
      isShow: this.show,
      stepsValue: 0,
      parentColumns,
      sonColumns,
      parent: {
        ...defaultPageVal,
      },
      son: {
        ...defaultPageVal,
      },
      parentData: [],
      sonData: [],
      parentInfo: {},
    };
  },
  components: {
    m2Table,
  },
  created() {},
  methods: {
    upData() {
      if (this.stepsValue === 1) {
        this.getsonList();
      } else {
        this.getparentList();
      }
    },
    gotoReward() {
      this.$router.pushToAnotherModule("/m2-web-marketing", {
        path: `/rewardCenters/new-reward-centers`,
        query: {},
      });
    },
    changePage(val, type) {
      this[type].current = val;
      eval(`this.get${type}List()`);
    },
    changePageSize(val, type) {
      this[type].pageSize = val;
      eval(`this.get${type}List()`);
    },
    getparentList() {
      let params = {
        pageSize: this.parent.pageSize,
        currPage: this.parent.current,
      };
      this.parent.isLoading = true;
      axiosParentReward(params).then((res) => {
        this.parent.isLoading = false;

        let data = res.data.data || {};
        this.parentData = data.list || [];
        this.parent.total = data.totalCount || 0;
      });
    },
    getsonList() {
      let params = {
        pageSize: this.son.pageSize,
        currPage: this.son.current,
        grantRewardPackageUuid: this.parentInfo.uuid,
        rewardTypeCode: 'cash'
      };
      this.son = {...this.son,isLoading : true};
      axiosSonReward(params).then((res) => {
        this.son.isLoading = false;
        this.son = {...this.son,isLoading : false};
        let data = res.data.data || {};
        this.sonData = data || [];
        this.son.total = data.length || 0;
      });
    },
    // 选择父奖励
    chooseParent(parentInfo) {
      // 不是跟随奖励，判断生效时间
      if (
        !(
          parentInfo.changeTimeFlag && String(parentInfo.changeTimeFlag) === "1"
        )
      ) {
        if (!this.time[0] || !this.time[1]) {
          this.$Message.error("请先选择任务时间");
          return false;
        }
        let rewardStart = parentInfo.beginTime.split(" ")[0].slice(0, 10);
        let rewardEnd = parentInfo.endTime.split(" ")[0].slice(0, 10);
        let taskStart = this.$moment(this.time[0]).format("YYYY-MM-DD");
        let taskEnd = this.$moment(this.time[1]).format("YYYY-MM-DD");
        if (
          this.$moment(rewardStart).diff(taskStart, "days") > 0 ||
          this.$moment(rewardEnd).diff(taskEnd, "days") < 0
        ) {
          this.$Message.error("任务时间必须在奖励时间内，请重新选择");
          return false;
        }
      }

      this.stepsValue = 1;
      this.son = {
        ...this.defaultPageVal,
      };
      this.parentInfo = parentInfo;
      this.getsonList();
    },
    // 确认奖励
    chooseSon(sonInfo) {
      this.sonInfo = sonInfo;
      this.emitSelect();
    },
    emitSelect() {
      console.log("this.selectedList", this.selectedList);
      let isInSelectParent = false;
      let parentIndex = "";
      let rewardList = JSON.parse(JSON.stringify(this.selectedList));

      rewardList.forEach((p, pi) => {
        // 如果在已选择的父奖励里面，那么直接插入对应的子奖励列表
        if (p.prCode === this.parentInfo.rewardCode) {
          isInSelectParent = true;
          parentIndex = pi;
          return;
        }
        isInSelectParent = false;
        parentIndex = "";
      });
      if (isInSelectParent) {
        rewardList[parentIndex].subRewardList.push({
          srCode: this.sonInfo.subRewardCode,
          srMode: this.sonInfo.rewardPattern,
          srModeDesc: rewardPatternMap[this.sonInfo.rewardPattern],
          srName: this.sonInfo.subRewardName,
          srTotalAmount:
            this.sonInfo.extentMap &&
            JSON.parse(this.sonInfo.extentMap).totalAmount,
          srPerAmount:
            this.sonInfo.extentMap &&
            JSON.parse(this.sonInfo.extentMap).perAmount,
          srTotalCount:
            this.sonInfo.extentMap &&
            JSON.parse(this.sonInfo.extentMap).totalCount,
          srType: this.sonInfo.rewardTypeCode,
          srTypeDesc: rewardTypeMap[this.sonInfo.rewardTypeCode],
          srUuid: this.sonInfo.uuid,
        });
      } else {
        rewardList.push({
          prCode: this.parentInfo.rewardCode,
          prEndValidTime: this.parentInfo.endTime,
          prId: this.parentInfo.id,
          prName: this.parentInfo.rewardName,
          prStartValidTime: this.parentInfo.beginTime,
          prUuid: this.parentInfo.uuid,
          prEventTargetType: this.parentInfo.eventTargetType,
          subRewardList: [
            {
              srCode: this.sonInfo.subRewardCode,
              srMode: this.sonInfo.rewardPattern,
              srModeDesc: rewardPatternMap[this.sonInfo.rewardPattern],
              srName: this.sonInfo.subRewardName,
              srTotalAmount:
                this.sonInfo.extentMap &&
                JSON.parse(this.sonInfo.extentMap).totalAmount,
              srPerAmount:
                this.sonInfo.extentMap &&
                JSON.parse(this.sonInfo.extentMap).perAmount,
              srTotalCount:
                this.sonInfo.extentMap &&
                JSON.parse(this.sonInfo.extentMap).totalCount,
              srType: this.sonInfo.rewardTypeCode,
              srTypeDesc: rewardTypeMap[this.sonInfo.rewardTypeCode],
              srUuid: this.sonInfo.uuid,
            },
          ],
        });
      }
      console.log("rewardList", rewardList);
      this.$emit("setRewards", rewardList);
      this.$emit("close");
    },
  },
  watch: {
    show() {
      this.isShow = this.show;
      if (this.isShow) {
        (this.stepsValue = 0), this.getparentList();
      }
    },
  },
};
</script>
<style lang="less" scoped>
.steps-wrap{
  position: relative;
  .button-item{
    position: absolute;
    right: 4px;
    top: -4px;
  }
}
</style>