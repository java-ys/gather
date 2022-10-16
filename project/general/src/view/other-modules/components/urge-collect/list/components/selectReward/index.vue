<template>
  <div>
    <div>
      <Steps :current="current">
        <Step title="选择父奖励"></Step>
        <Step title="选择子奖励"></Step>
      </Steps>
    </div>
    <div v-if="!isChild" style="margin-top: 20px">
      <Form ref="formInline" :model="infoData" :label-width="100" inline>
        <FormItem label="奖励名称" prop="rewardName">
          <Input v-model="infoData.rewardName" clearable style="width: 200px">
          </Input>
          <Button type="primary" class="margin15" @click="searchData(infoData)"
            >查询</Button
          >
          <Button type="text" class="margin15" @click="clearForm">清空</Button>
        </FormItem>
      </Form>
      <VTable
        :total="pageObj.total"
        :current="pageObj.current"
        :pageSize="pageObj.pageSize"
        :parColumns="parColumns"
        :parTableData="tableData"
        class="top15"
        @changePage="changePage"
        @changePageSize="changePageSize"
      >
        <template slot="action" slot-scope="params">
          <Button
            ghost
            type="info"
            size="small"
            class="tableBtn"
            @click="selectChild(params.data.row)"
          >
            选择子奖励
          </Button>
        </template>
      </VTable>
    </div>
    <div v-if="isChild">
      <Table
        :columns="childParColumns"
        :data="childTableData"
        class="top15"
        :height="550"
      >
        <template slot="action" slot-scope="params">
          <Button
            ghost
            type="success"
            size="small"
            class="tableBtn"
            @click="selectReward(params.row)"
          >
            确认奖励
          </Button>
        </template>
      </Table>
    </div>
    <div class="footer">
      <Button v-if="Object.keys(fatherData).length > 0" @click="step">{{
        isChild ? "上一步" : "下一步"
      }}</Button>
    </div>
  </div>
</template>
<script>
import { returnFields, returnChildFields, cacheData } from "./fields";
import { getValidRewardList, getChildRewardList } from "_o/api/urge";
export default {
  props: {
    selected: {
      type: Object,
      default: () => {
        return {};
      },
    },
    limitType: {
      type: Array,
      default: () => {
        return [];
      },
    },
    time: {
      type: Array,
      default: () => {
        return [];
      },
    },
    //传false过来就是 是修改，传true不是修改
    isChanged: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    grantEventId: {
      type: String,
      default: () => {
        return "02";
      },
    },
    selectedRewardEventTypeCode: {
      type: Number,
      default: () => {
        return 0;
      },
    },
  },
  data() {
    return {
      ...cacheData,
      current: 1,
      isChild: false,
      fatherData: {},
      infoData: {
        rewardName: "",
      }, //表单数据
    };
  },
  created() {
    this.parColumns.length === 0 &&
      Object.entries(returnFields(this)).forEach(([key, value]) => {
        this.parColumns.push(value);
      });
    this.childParColumns.length === 0 &&
      Object.entries(returnChildFields(this)).forEach(([key, value]) => {
        this.childParColumns.push(value);
      });
    this.getList();
  },
  methods: {
    clearForm() {
      this.$refs["formInline"].resetFields();
      this.getList(this.infoData);
    },
    searchData(params) {
      this.getList(params);
    },
    //获取奖励中心列表
    getList(obj) {
      let params = {
        pageSize: this.pageObj.pageSize,
        currPage: this.pageObj.current,
        grantEventId: this.grantEventId,
      };
      params = Object.assign(params, obj);
      this.$store.commit("changeLoadingFlag", true);
      getValidRewardList(params).then((res) => {
        this.$store.commit("changeLoadingFlag", false);
        if (res.data.success) {
          let data = res.data.data;
          this.tableData = data.list || [];
          this.pageObj.total = data && data.totalCount;
          console.log(data);
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    changePage(val) {
      this.pageObj.current = val;
      this.getList();
    },
    changePageSize(val) {
      this.pageObj.pageSize = val;
      this.getList();
    },
    checkTime(row, startTime, endTime) {
      let success = true;
      if (this.time.length > 0) {
        let rowStartTime = new Date(row.beginTime);
        let rowEndTime = new Date(row.endTime);
        let changeTimeFlag = row.changeTimeFlag;
        //如果是固定日期的时候 校验时间规则
        if (changeTimeFlag === 0) {
          if (!(startTime >= rowStartTime && endTime <= rowEndTime)) {
            success = false;
            this.$Message.error("活动时间必须在奖励时间之内，请重新选择!");
          }
        }
      }
      return success;
    },
    //选择子奖励
    selectChild(row) {
      //不是修改
      let startTime = new Date(this.time[0]);
      let endTime = new Date(this.time[1]);
      let nowTime = new Date();
      if (this.isChanged) {
        let success = this.checkTime(row, startTime, endTime);
        if (!success) {
          return;
        }
      } else if (!this.isChanged && nowTime > startTime) {
        //是修改
        if (this.time.length > 0) {
          let endTime = new Date(this.time[1]);
          let rowStartTime = new Date(row.beginTime);
          let rowEndTime = new Date(row.endTime);
          let changeTimeFlag = row.changeTimeFlag;
          if (changeTimeFlag === 0) {
            if (!(nowTime >= rowStartTime && endTime <= rowEndTime)) {
              this.$Message.error("活动时间必须在奖励时间之内，请重新选择!");
              return;
            }
          }
        }
      } else if (!this.isChanged && nowTime < startTime) {
        //是修改 奖励开始时间大于当前时间
        let success = this.checkTime(row, startTime, endTime);
        if (!success) {
          return;
        }
      }
      //判断活动时间

      //判断之前有没有选择
      if (this.selected.grantRewardPackageUuid) {
        //如果选择的父奖励和之前一样
        if (this.selected.grantRewardPackageUuid === row.uuid) {
          this.isChild = true;
          this.fatherData = row;
          this.current = 2;
          this.$nextTick(() => {
            this.getChildList(row);
          });
        } else {
          this.$Modal.confirm({
            title: "您已选择了奖励包，是否更换？更换后将重新更新选择奖励",
            content: "",
            onOk: () => {
              this.isChild = true;
              this.fatherData = row;
              this.current = 2;
              this.$emit("changeFaterRward", row); //告诉父组件更换了父奖励uuid
              this.$nextTick(() => {
                this.getChildList(row);
              });
            },
            onCancel: () => {},
          });
        }
      } else {
        this.isChild = true;
        this.fatherData = row;
        this.current = 2;
        this.$nextTick(() => {
          this.getChildList(row);
        });
      }
    },
    //获取子奖励的list
    getChildList(row) {
      let params = {
        grantRewardPackageUuid: row.uuid,
      };
      this.$store.commit("changeLoadingFlag", true);
      getChildRewardList(params).then((res) => {
        this.$store.commit("changeLoadingFlag", false);
        if (res.data.success) {
          let data = res.data.data;
          this.childTableData = data;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    //上一步或者下一步
    step() {
      if (this.isChild) {
        this.isChild = false;
        this.current = 1;
        this.getList();
      } else {
        this.isChild = true;
        this.current = 2;
        this.getChildList(this.fatherData);
      }
    },
    //选定奖励
    selectReward(row) {
      let canSelect = true;
      //这里要校验指定奖励、智能奖励和随机奖励
      if (row.rewardPattern === 1 || row.rewardPattern === 3) {
        if (this.limitType && this.limitType.length) {
          this.limitType.forEach((item) => {
            if (item === row.rewardTypeCode) {
              canSelect = false;
            }
          });
        }
      } else if (row.rewardPattern === 2) {
        if (
          this.selectedRewardEventTypeCode >= 38 &&
          this.selectedRewardEventTypeCode <= 41
        ) {
          this.$Message.error("商推乘活动不可选择随机奖励");
          return;
        }
        let randomGrantRewardSubDetailDtoList =
          row.randomGrantRewardSubDetailDtoList || [];
        randomGrantRewardSubDetailDtoList.forEach((randomItem) => {
          if (this.limitType && this.limitType.length) {
            this.limitType.forEach((item) => {
              if (item === randomItem.rewardTypeCode) {
                canSelect = false;
              }
            });
          }
        });
      }
      let obj = Object.assign({}, row);
      obj.changeTimeFlag = this.fatherData.changeTimeFlag;
      obj.grantRewardPackageName = this.fatherData.rewardName;
      obj.eventTargetType = this.fatherData.eventTargetType;
      if (canSelect) {
        console.log(obj);
        this.$emit("close", obj);
      } else {
        let msg = "";
        let length = this.limitType.length;
        this.limitType.forEach((item, index) => {
          if (index !== length - 1) {
            msg += this.rewardTypeList[item] + ",";
          } else {
            msg += this.rewardTypeList[item];
          }
        });
        this.$Message.error(`不能选择子奖励为${msg}的奖励!`);
      }
    },
  },
};
</script>
<style scoped lang="less">
.footer {
  text-align: center;
  margin-top: 20px;
}
.margin15 {
  margin-left: 15px;
}
</style>
