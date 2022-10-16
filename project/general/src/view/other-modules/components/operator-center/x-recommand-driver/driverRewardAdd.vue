<template>
  <Modal
    title="司机奖励发放设置"
    v-model="driverRewardVisable"
    width="28%"
  >
    <Form ref="driverRewardForm" :model="driverRewardForm" :rules="rules">
      <Row>
        <Col :span="20">
          <FormItem label="奖励日期" :label-width="100" prop="rewardTime">
            <DatePicker
              v-model="driverRewardForm.rewardTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
            ></DatePicker>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button type="primary" @click="closeDialog">取 消</Button>
      <Button type="primary" @click="successHandle">确 定</Button>
    </div>
  </Modal>
</template>

<script>
import { batchDriverReward, recommendRecord, cancelDriverReward } from "_o/api/operator-carrier";
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
          this.ids.push(params[i].id);
        }
      } else {
        this.ids.push(params.id);
        // 单个奖励
        this.driverRewardForm.rewardTime = params.rewardTime;
      }
      this.driverRewardForm.rewardStatus = status;
    },
    cancelReward() {
      cancelDriverReward({
        idList: this.ids
      })
        .then(res => {
          if (res.data.success) {
            this.$Message.success(res.data.msg);
            this.driverRewardVisable = false;
            this.$emit("addSuccessHandle");
          } else {
            this.driverRewardVisable = false;
            this.$message.error(res.data.data.rewardFailedList[0].failedReason);
          }
        })
        .catch(res => {
          // console.log(res);
          // this.$alert(res.data.msg);
        });
    },
    successHandle() {
      this.$refs["driverRewardForm"].validate(valid => {
        if (!valid) {
          return;
        }
        batchDriverReward({
          idList: this.ids,
          rewardTime: this.driverRewardForm.rewardTime
        })
          .then(res => {
            if (res.data.success) {
              this.$Message.success(res.data.msg);
              this.driverRewardVisable = false;
              this.$emit("addSuccessHandle");
            } else {
              this.driverRewardVisable = false;
              this.$Message.error(
                res.data.data.rewardFailedList[0].failedReason
              );
            }
          })
          .catch(error => {
            this.driverRewardVisable = false;
            // this.$Message.error("设置司机奖励发放异常,请稍后重试");
          }).then(() => {
            this.$refs["driverRewardForm"].resetFields();
          });
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
          this.$Message.error("获取司机奖励发放分页列表数据失败，请稍后重试");
        });
    }
  }
};
</script>

<style></style>
