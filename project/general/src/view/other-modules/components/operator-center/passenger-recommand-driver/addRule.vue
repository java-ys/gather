<template>
  <div class="rulestyle">
    <Modal
      v-model="showAdd"
      v-hasAuth="'passenger-recommand-driver-add'"
      title="新增推荐奖励配置"
      width="1300"
      :mask-closable="false"
      :closable="false"
    >
      <div class="showAdd-content">
        <Form
          ref="form"
          :model="addForm"
          :label-width="150"
          :rules="validateRules"
        >
          <FormItem
            label="推荐奖励名称："
            prop="ruleName"
          >
            <Input
              v-model="addForm.ruleName"
              style="width: 360px;"
              :maxlength="15"
              placeholder="请输入推荐奖励名称"
            ></Input>
          </FormItem>
          <FormItem
            label="省/市："
            prop="city"
          >
            <Cascader
              v-model="addForm.city"
              :data="cityList"
              style="width: 360px;z-index: 99999"
              @on-change="getCitychange"
            ></Cascader>
          </FormItem>
          <FormItem
            label="有效时间："
            prop="time"
          >
            <el-date-picker
              v-model="addForm.time"
              clearable
              size="small"
              type="datetimerange"
              align="left"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width:360px;z-index: 99999"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
          </FormItem>
          <FormItem
            label="推荐奖励："
            style="position: relative;"
          >
            <!-- limitNumber 最多选一张，isEvery每张奖励张数 -->
            <span style="position: absolute;left: -82px; top: 10px;color: #ed4014;line-height: 1;font-size: 12px;font-family: SimSun;display: inline-block;">*</span>
            <div>
              <Checkbox v-model="single">
                司机报名奖
              </Checkbox>
              <span style="margin-left: 15px;color: #b2afaf">每个司机报名成功，对推荐人奖励</span>
            </div>
            <div v-if="single">
              <div class="passenger-name">
                <span></span>优惠券奖励
              </div>
              <choose-coupon
                ref="couponRef"
                :isRepeat="false"
                :limitNumber="1"
                :isEvery="true"
              ></choose-coupon>
              <div class="new-label">
                <FormItem
                  label="奖励上限："
                  prop="couonMax"
                  class="newItem"
                >
                  <Select
                    v-model="addForm.couonMax"
                    placeholder="请选择"
                    style="width:120px;"
                    @on-change="changeCoupon"
                  >
                    <Option :value="-1">
                      不限次数
                    </Option>
                    <Option :value="1">
                      限定次数
                    </Option>
                  </Select>
                </FormItem>
                <FormItem
                  v-if="addForm.couonMax == 1"
                  prop="couonMaxInput"
                >
                  <Input
                    v-model="addForm.couonMaxInput"
                    placeholder="请输入"
                    :maxlength="10"
                    style="width: 100px"
                  />
                  <span style="margin-left: 4px">次</span>
                </FormItem>
              </div>
            </div>
            <Checkbox
              v-model="single1"
              style="margin-top: 20px"
            >
              司机营运奖励
            </Checkbox>
            <span style="margin-left: 15px;color: #b2afaf">司机缴纳保证金达到一定时间后，对推荐人奖励</span>
            <div v-if="single1">
              <div>
                <FormItem
                  label="缴纳保证金满"
                  class="new-label1 newItem"
                  prop="rewardDelay"
                >
                  <Input
                    v-model="addForm.rewardDelay"
                    style="width: 60px;"
                    :maxlength="5"
                    placeholder="请输入"
                  ></Input>
                  天
                </FormItem>
                <FormItem
                  label="奖励类型"
                  class="new-label1"
                  style="margin-top: 20px"
                >
                  <Checkbox v-model="couponModal">
                    优惠券
                  </Checkbox>
                  <Checkbox v-model="cashModal">
                    现金
                  </Checkbox>
                </FormItem>
              </div>
              <div v-if="couponModal">
                <div class="passenger-name">
                  <span></span>优惠券奖励
                </div>
                <choose-coupon
                  ref="couponRef2"
                  :limitNumber="1"
                  :isEvery="true"
                ></choose-coupon>
                <div class="new-label">
                  <FormItem
                    label="奖励上限："
                    prop="coupnMax"
                    class="newItem"
                  >
                    <Select
                      v-model="addForm.coupnMax"
                      placeholder="请选择"
                      style="width:120px;"
                      @on-change="changeCoupon2"
                    >
                      <Option :value="-1">
                        不限次数
                      </Option>
                      <Option :value="1">
                        限定次数
                      </Option>
                    </Select>
                  </FormItem>

                  <FormItem
                    v-if="addForm.coupnMax == 1"
                    prop="coupnMaxInput"
                  >
                    <Input
                      v-model="addForm.coupnMaxInput"
                      placeholder="请输入"
                      :maxlength="10"
                      style="width: 100px"
                    /><span style="margin-left: 4px">次</span>
                  </FormItem>
                </div>
              </div>
              <div
                v-if="cashModal"
                style="margin-top: 20px;"
              >
                <div class="passenger-name">
                  <span></span>现金奖励
                </div>
                <div class="new-label">
                  <FormItem
                    label="奖励现金："
                    prop="cashValue"
                    class="newItem"
                  >
                    <Input
                      v-model="addForm.cashValue"
                      placeholder="请输入"
                      style="width: 100px"
                    />
                    <span style="margin-left: 4px">元</span>
                  </FormItem>
                  <FormItem
                    label="奖励上限："
                    prop="max"
                    class="newItem"
                  >
                    <Select
                      v-model="addForm.max"
                      placeholder="请选择"
                      style="width:120px;"
                      @on-change="changeCash"
                    >
                      <Option :value="-1">
                        不限金额
                      </Option>
                      <Option :value="1">
                        限定金额
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem
                    v-if="addForm.max == 1"
                    prop="cashMax"
                  >
                    <Input
                      v-model="addForm.cashMax"
                      placeholder="请输入"
                      :maxlength="10"
                      style="width: 100px"
                    /><span style="margin-left: 4px">元</span>
                  </FormItem>
                </div>
              </div>
            </div>
          </FormItem>
          <FormItem label="活动规则：">
            <Input
              v-model="addForm.ruleContent"
              type="textarea"
              :rows="4"
              placeholder="请输入..."
              style="width: 360px"
            />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button
          type="primary"
          ghost
          @click="cancleAdd"
        >
          取消
        </Button>
        <Button
          type="primary"
          @click="confirmAdd"
        >
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getCityList } from "_o/api/operator-carrier";
// import { cpTranslate } from '@/libs/tools';
import { addListData } from "_o/api/operator-carrier";
import chooseCoupon from "../new-activity/choose-coupon/index.vue";


export default {
  components: {
    chooseCoupon
  },
  props: {
    showAdd: {
      type: Boolean,
      default: false
    },
    cityList: {
      type: Array,
      default: []
    }
  },
  data() {
    const validLast = (rule, val, callback) => {
      let regu = /^\+?[1-9][0-9]*$/;
      if (!regu.test(val) && val) {
        callback(new Error("请输入正确的正整数"));
      } else {
        callback();
      }
    }
    const validNum = (rule, val, callback) =>{
			const reg = /^[0-9]+$/;
			if (!reg.test(val) && val) {
				callback(new Error('请输入正确的正整数'));
			} else {
				callback();
			}
		}
    return {
      isCoupon: true,
      isEdit: true,
      single: false,
      single1: false,
      cashModal: false,
      couponModal: false,
      validateRules: {
        ruleName: [{ required: true, message: "推荐名称奖励不能为空" }],
        city: [{ required: true, message: "省/市不能为空" }],
        time: [{ required: true, message: "有效时间不能为空" }],
        rewardAmount: [{ required: true, message: "奖励金额不能为空" }],
        cashValue: [{ required: true, message: "奖励现金不能为空" }, { validator: validLast, trigger: "blur" }],
        rewardDelay: [{ required: true, message: "缴纳保证金天数不能为空" }, { validator: validNum, trigger: "blur" }],
        max: [{ required: true, message: "奖励上限不能为空" }],
        couonMax: [{ required: true, message: "奖励上限不能为空" }],
        cashMax: [{ required: true, message: "限定金额不能为空" }, { validator: validLast, trigger: "blur" }],
        coupnMax: [{ required: true, message: "奖励上限不能为空" }],
        coupnMaxInput: [{ required: true, message: "限定次数不能为空" }, { validator: validLast, trigger: "blur" }],
        couonMaxInput: [{ required: true, message: "限定次数不能为空", trigger: "blur"}, { validator: validLast, trigger: "blur" }],
      },
      addForm: {
        cashValue: "",
        rewardDelay: "",
        cashMax: "",
        coupnMaxInput: "",
        couonMaxInput: "",
      },
      newAddForm: {

      }
    };
  },

  methods: {
    getCitychange(value, selectedData) {
      if (selectedData.length == 2) {
        this.newAddForm.cityCode = value[1];
        this.newAddForm.provinceCode = value[0];
        this.newAddForm.cityName = selectedData[1].label;
      } else {
        this.newAddForm.provinceCode = 1;
        this.newAddForm.cityCode = 1;
        this.newAddForm.cityName = "全国";
      }
    },
    // 取消新增
    cancleAdd() {
      this.$Modal.confirm({
        title: "确认取消创建活动？",
        onOk: () => {
          this.$refs.form.resetFields();
			      this.$emit("close");
        }
      })
    },
    // 确认新增
    confirmAdd() {

      this.$refs.form.validate(valid => {
        if (valid) {
          this.$Modal.confirm({
            title: "是否确认完成活动设置？",
            onOk: () => {
              if (this.addForm.max == 1) {
                if (this.addForm.cashMax % this.addForm.cashValue == 0) {

                } else {
                  this.$Message.warning("奖励上限必须是奖励现金的倍数");
                  return
                }
              }
              this.newAddForm.detailList = [];
              this.newAddForm.validTime = new Date(this.addForm.time[0]).getTime();
              this.newAddForm.expireTime = new Date(this.addForm.time[1]).getTime();
              this.newAddForm.ruleName = this.addForm.ruleName;
              this.newAddForm.ruleType = "2"
              this.newAddForm.ruleContent = this.addForm.ruleContent;
              //  司机报名奖励优惠券
              if (this.single) {
                // if (this.addForm.couonMax == "-1") {
                //   this.addForm.couonMaxInput = "-1"
                // }
                let templateUuid = "";
                let activityUuid = "";
                let couponMoney = "";
                let templateName = "";
                let perRewardNum = "";
                let templateType = "";
                let couponUuid = "";
                if (this.$refs.couponRef.couponList.length) {
                  templateType = this.$refs.couponRef.couponList[0].templateType;
                  if (templateType == "1") {  // 1 折扣，2 抵扣
                    couponMoney = this.$refs.couponRef.couponList[0].highestMoney;
                  } else {
                    //  抵扣
                    couponMoney = this.$refs.couponRef.couponList[0].couponMoney;
                  }
                  templateUuid = this.$refs.couponRef.couponList[0].templateUuid;
                  activityUuid = this.$refs.couponRef.couponList[0].activityUuid;
                  templateName = this.$refs.couponRef.couponList[0].templateName;
                  perRewardNum = this.$refs.couponRef.couponList[0].perRewardNum;
                  couponUuid = this.$refs.couponRef.couponList[0].couponUuid;
                } else {
                  this.$Message.warning("请选择司机报名奖励优惠券模板");
                  return
                }

                this.newAddForm.detailList.push({
                  rewardType: "0",
                  rewardEvent: "0",
                  couponLimit: this.addForm.couonMaxInput,
                  couponTemplateUuid: templateUuid, // 模板ID
                  couponActivityUuid: activityUuid, // 活动ID
                  couponName: templateName, // 模板名称
                  couponValue: couponMoney, // 模板金额
                  couponNum: perRewardNum,  // 优惠劵数量 ,
                  couponUuid: couponUuid
                })
              }
              if (this.single1) {
                if (this.couponModal || this.cashModal) {
                  // 司机营运奖励优惠券
                  if (this.couponModal) {
                    // if (this.addForm.coupnMax == "-1") {
                    //   this.addForm.coupnMaxInput = "-1"
                    // }
                    let templateUuid = "";
                    let activityUuid = "";
                    let couponMoney = "";
                    let templateName = "";
                    let perRewardNum = "";
                    let templateType = "";
                    let couponUuid = "";

                    if (this.$refs.couponRef2.couponList.length) {
                      templateType = this.$refs.couponRef2.couponList[0].templateType;
                      if (templateType == "1") {  // 1 折扣，2 抵扣
                        couponMoney = this.$refs.couponRef2.couponList[0].highestMoney;
                      } else {
                        //  抵扣
                        couponMoney = this.$refs.couponRef2.couponList[0].couponMoney;
                      }
                      templateUuid = this.$refs.couponRef2.couponList[0].templateUuid;
                      activityUuid = this.$refs.couponRef2.couponList[0].activityUuid;
                      templateName = this.$refs.couponRef2.couponList[0].templateName;
                      perRewardNum = this.$refs.couponRef2.couponList[0].perRewardNum;
                      couponUuid = this.$refs.couponRef2.couponList[0].couponUuid;
                    } else {
                      this.$Message.warning("请选择司机营运奖励优惠券模板");
                      return
                    }
                    this.newAddForm.detailList.push({
                      rewardType: "0",
                      rewardEvent: "1",
                      rewardDelay: this.addForm.rewardDelay,
                      couponLimit: this.addForm.coupnMaxInput,
                      couponTemplateUuid: templateUuid,
                      couponActivityUuid: activityUuid,
                      couponName: templateName,
                      couponValue: couponMoney,
                      couponNum: perRewardNum,
                      couponUuid: couponUuid
                    })
                  }
                  //  司机营运奖励现金
                  if (this.cashModal) {
                    // if (this.addForm.max == "-1") {
                    //   this.addForm.cashMax = "-1"
                    // }
                    this.newAddForm.detailList.push({
                      rewardType: "1",
                      rewardEvent: "1",
                      cashMax: this.addForm.cashMax,
                      rewardDelay: this.addForm.rewardDelay,
                      cashValue: this.addForm.cashValue
                    })
                  }
                } else {
                  this.$Message.warning("请至少选择一个运营奖励类型");
                  return
                }
              }
              if (!(this.newAddForm.detailList.length >= 1)) {
                this.$Message.warning("请至少选择一个推荐奖励");
                return
              }
              addListData(this.newAddForm).then(res => {
                if (res.data.data) {
                  this.$Message.warning(res.data.msg);
                } else {
                  this.$Message.success("新建成功");
                  this.$emit("confirmAdd");
                  // this.getTableConfigData();
                  // this.cancleAdd();
                }
              });

            }
          });
        }
      });
    },
    // 格式化数字为两位小数
    formatNumber(value) {
      let reg = /^\d+\.\d{3,}$/;
      if (reg.test(value)) {
        let number = value.toFixed(2) - 0
        return number;
      }
      return value;
    },
    changeCoupon(v) {
      this.addForm.couonMaxInput = v - 1 === 0 ? "" : "-1"
    },
    changeCoupon2(v) {
      this.addForm.coupnMaxInput = v -1 === 0 ? "" : "-1"
    },
    changeCash(v) {
      this.addForm.cashMax = v - 1 === 0 ? "" : "-1"
    }
  }
};
</script>
<style lang="less">
    .ivu-select-dropdown{
      z-index: 999999!important;
    }
    .el-picker-panel{
      z-index: 9999!important;
    }

  .newItem{
      .ivu-form-item-error-tip{
        left: 80px!important
      }
    }
  .new-label1 .ivu-form-item-label{
      width: 94px!important;
  }
  .new-label1:nth-child(2) .ivu-form-item-label{
      width: 70px!important;
  }
  .new-label{
    display: flex;
    .ivu-form-item{
      width: 210px;
    }
    .ivu-form-item-label{
      width: 82px!important;
    }
  }
  .passenger-name{
    margin-left:10px;
    position: relative;
    span{
      display: inline-block;
      width: 4px;
      height: 16px;
      background: #02a7f0;
      position: absolute;
      left: -10px;
      top: 8px
    }
  }
</style>
