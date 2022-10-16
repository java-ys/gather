<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="司机奖励发放设置"
    :center="center"
    :visible.sync="driverRewardVisable"
    width="28%"
    @close="closeDialog"
  >
    <el-form ref="driverRewardForm" :model="driverRewardForm" :rules="rules">
      <el-row>
        <el-col :span="20">
          <el-form-item label="奖励日期" label-width="100px" prop="rewardTime">
            <el-date-picker
              v-model="driverRewardForm.rewardTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="successHandle">确 定</el-button>
      <el-button type="primary" @click="closeDialog">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { batchRewardOrCancel, recommendRecord } from "_o/api/salary/driverReward";
export default {
  name: "driverRewardAdd",
  props: {
    driverRewardTitle: {
      type: String,
      required: false,
      default: ""
    },
    driverUuidList: {
      type: Array,
      required: false,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      driverRewardVisable: false,
      driverRewardForm: {
        rewardTime: "",
        rewardStatus: "",
        currPage: 1,
        pageSize: 10
      },
      totalCount: 0,
      tableData: [],
      ids: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      rules: {
        rewardTime: [{ required: true, message: "奖励日期不能为空" }]
      },
      center: true
    };
  },
  methods: {
    changeStatus(bool) {
      this.driverRewardVisable = bool;
      this.$nextTick(() => {
        // 重置表单校验
        this.$refs.driverRewardForm.resetFields();
      });
    },
    getData(params, status) {
      // 批量奖励
      this.ids = [];
      if (params.length) {
        this.driverRewardForm.rewardTime = "";
        for (let i = 0, length = params.length; i < length; i++) {
          this.ids.push(params[i].recordId);
        }
      } else {
        this.ids.push(params.recordId);
        // 单个奖励
        this.driverRewardForm.rewardTime = params.rewardTime;
      }
      this.driverRewardForm.rewardStatus = status;
    },
    cancelReward() {
      batchRewardOrCancel({
        uuidList: this.ids,
        type: this.driverRewardForm.rewardStatus,
        rewardTime: this.driverRewardForm.rewardTime
      })
        .then(res => {
          if (
            (res.data.success && res.data.data == null) ||
            (res.data.success && res.data.data.rewardFailedList.length == 0)
          ) {
            this.$message.success(res.data.msg);
            this.driverRewardVisable = false;
            this.$emit("addSuccessHandle");
          } else {
            this.driverRewardVisable = false;
            this.$message.error(res.data.data.rewardFailedList[0].failedReason);
          }
        })
        .catch(error => {
          this.$alert(res.data.msg);
        });
    },
    successHandle() {
      this.$refs["driverRewardForm"].validate(valid => {
        if (!valid) {
          return;
        }
        batchRewardOrCancel({
          uuidList: this.ids,
          type: this.driverRewardForm.rewardStatus,
          rewardTime: this.driverRewardForm.rewardTime
        })
          .then(res => {
            if (
              (res.data.success && res.data.data == null) ||
              (res.data.success && res.data.data.rewardFailedList.length == 0)
            ) {
              this.$message.success(res.data.msg);
              this.driverRewardVisable = false;
              this.$emit("addSuccessHandle");
            } else {
              this.driverRewardVisable = false;
              this.$message.error(res.data.data.rewardFailedList[0].failedReason);
            }
          })
          .catch(error => {
            this.driverRewardVisable = false;
            this.$alert("设置司机奖励发放异常,请稍后重试");
          });
        this.$refs["driverRewardForm"].resetFields();
      });
    },
    closeDialog() {
      this.$refs.driverRewardForm.resetFields();
      this.driverRewardVisable = false;
    },
    getParentPage() {
      this.getPageList({
        rewardStatus: this.driverRewardForm.rewardStatus,
        currPage: this.driverRewardForm.currPage,
        pageSize: this.driverRewardForm.pageSize
      });
    },
    // 获得分页数据并解析
    getPageList(params) {
      let requestParams = JSON.parse(JSON.stringify(params));
      for (let propName in requestParams) {
        if (
          requestParams.hasOwnProperty(propName) &&
          Number(requestParams[propName]) === -1
        ) {
          delete requestParams[propName];
        }
      }
      // 获取司机奖励发放列表
      recommendRecord(requestParams)
        .then(res => {
          if (res.data.success && res.data.data) {
            this.tableData = res.data.data.list;
            console.log(res.data.data.list);
            this.totalCount = res.data.data.totalCount;
          } else {
            this.tableData = [];
            this.totalCount = 0;
          }
        })
        .catch(error => {
          this.$alert("获取司机奖励发放分页列表数据失败，请稍后重试");
        });
    }
  }
};
</script>

<style>
</style>
