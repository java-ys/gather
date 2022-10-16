<template>
  <div class="rulestyle">
    <Modal
      v-model="showAdd"
      title="新增推荐奖励配置"
      width="1300"
      :mask-closable="false"
      :closable="false"
    >
      <div class="showAdd-content">
        <Form
          ref="form"
          :model="addForm"
          :label-width="180"
          :rules="validateRules"
        >
          <FormItem label="推荐奖励名称：" prop="ruleName">
            <Input
              v-model="addForm.ruleName"
              style="width: 360px"
              :maxlength="15"
              placeholder="请输入推荐奖励名称"
            ></Input>
          </FormItem>
          <FormItem label="省/市：" prop="city">
            <Cascader
              v-model="addForm.city"
              :data="cityList"
              style="width: 360px; z-index: 99999"
              @on-change="getCitychange"
            ></Cascader>
          </FormItem>
          <FormItem label="有效时间：" prop="time">
            <el-date-picker
              v-model="addForm.time"
              clearable
              size="small"
              type="datetimerange"
              align="left"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 360px; z-index: 99999"
              format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </FormItem>
          <FormItem label="推荐人类型：" prop="configType">
            <Select v-model="addForm.configType" style="width: 360px" @on-change="configTypeChange">
              <Option :value="1" label="司机"></Option>
              <Option :value="2" label="乘客"></Option>
            </Select>
          </FormItem>

          <FormItem label="被推荐司机类型：" prop="rewardObject">
            <Select
              v-model="addForm.rewardObject"
              style="width: 360px"
              multiple
              @on-change="rewardObjectChange"
            >
              <Option
                v-for="type in driverTypes"
                :value="type.value"
                :label="type.label"
                :key="type.value"
              ></Option>
            </Select>
          </FormItem>

          <FormItem
            v-for="(item, index) in awardItmes"
            :label="`${item.label}奖励设置：`"
            required
            :key="item.value"
          >
            <div v-if="addForm.configType == 1" class="inner-form-item">
              <FormItem
                label="奖励达成条件："
                :label-width="120"
                :prop="'detailList.' + index + '.rewardCondition'"
              >
                <RadioGroup
                  v-model="addForm.detailList[index].rewardCondition"
                >
                  <Radio :label="1">确认入职</Radio>
                  <Radio :label="2">绑车时间</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem
                label="奖励设置："
                :label-width="120"
                 :prop="'detailList.' + index + '.cashValue'"
                :rules="{ required: true, message: '奖励设置不能为空' }"
              >
                <Input
                  style="width: 120px"
                  v-model="addForm.detailList[index].cashValue"
                ></Input>
                元/人
              </FormItem>
            </div>
            <!-- 乘推司奖励配置 -->
            <recommend-item
              v-else
              ref="recommend"
              v-model="awardDetail"
              :bindKey="item.value"
              :name="item.label"
            ></recommend-item>
          </FormItem>
          <FormItem label="活动规则：">
            <div class="textarea-wrapper">
              <Input
                v-model="addForm.ruleContent"
                type="textarea"
                :rows="4"
                placeholder="请输入..."
                style="width: 360px"
                :maxlength="totalWordLength"
              />
              <div class="max-words-limit">
                {{ currentWordLength }} / {{totalWordLength}}
              </div>
            </div>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" ghost @click="cancleAdd"> 取消 </Button>
        <Button type="primary" @click="confirmAdd"> 确定 </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getCityList } from "_o/api/operator-carrier";
// import { cpTranslate } from '@/libs/tools';
import { addListData, saveRule } from "_o/api/operator-carrier";
import RecommendItem from "./recommend-item.vue";

import { driverTypes } from "./conf";

// 司推司固定参数
const d2dItem = {
  rewardCondition: 1, // 奖励达成条件  1 确认入职  2 绑车时间
  cashValue: "",
  rewardType: 1,
  rewardEvent: 1
};

export default {
  components: {
    RecommendItem,
  },
  props: {
    showAdd: {
      type: Boolean,
      default: false,
    },
    cityList: {
      type: Array,
      default: [],
    },
  },
  data() {
    const validLast = (rule, val, callback) => {
      let regu = /^\+?[1-9][0-9]*$/;
      if (!regu.test(val) && val) {
        callback(new Error("请输入正确的正整数"));
      } else {
        callback();
      }
    };
    return {
      totalWordLength: 1000,
      awardDetail: {},
      driverTypes,
      isCoupon: true,
      isEdit: true,
      single: false,
      single1: false,
      cashModal: false,
      couponModal: false,
      validateRules: {
        ruleName: [{ required: true, message: "推荐名称奖励不能为空" }],
        city: [{ required: true, message: "省/市不能为空" }],
        time: [{required: true, type: "array",  trigger: "change", message: "有效时间不能为空"}],
        cashValue: [
          { required: true, message: "奖励现金不能为空" },
          { validator: validLast, trigger: "blur" },
        ],
        configType: [{ required: true }],
        rewardObject: [{ required: true, message: "被推荐司机类型不能为空" }],
      },
      addForm: {
        cashValue: "",
        rewardDelay: "",
        cashMax: "",
        couponMaxInput: "",
        couponMaxInput: "",
        configType: 1,
        reward: "",
        rewardObject: [],
        detailList: [],
        time: [],
        ruleContent: ''
      },
    };
  },
  computed: {
    awardItmes() {
      return driverTypes.filter((item) =>
        this.addForm.rewardObject.includes(item.value)
      );
    },
    currentWordLength() {
      return this.addForm.ruleContent.length
    }
  },
  methods: {
    getCitychange(values, selectedData) {
      const [ provinceCode, cityCode ] = values
      const [ provinceObj, cityObj ] = selectedData

      this.addForm.provinceCode = provinceCode
      this.addForm.provinceName = provinceObj.label
      this.addForm.cityCode = cityCode
      this.addForm.cityName = cityObj.label;
    },
    // 取消新增
    cancleAdd() {
      this.$Modal.confirm({
        title: "确认取消创建活动？",
        onOk: () => {
          this.$refs.form.resetFields();
          this.$emit("close");
        },
      });
    },
    // 确认新增
    confirmAdd() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$Modal.confirm({
            title: "是否确认完成推荐奖励配置？",
            onOk: async () => {
              // 推荐人为乘客时, 会有个多个表单
              if(this.addForm.configType===2) {
                const vailds = []
                this.$refs.recommend.forEach((item) => {
                  vailds.push(item.checkForm())
                });
                const result = await Promise.all(vailds).catch(res => [false]) // 保证reject时 返回总是一个Array
                if(!result.every( _=>_ )) return
              }
              const detailList = this.formatParams();
              const [validTime, expireTime] = this.addForm.time
              // this.addForm.rewardObject.sort((a, b) => {return a-b});
              console.log("detailList",detailList)
              const postData = {
                ...this.addForm,
                validTime,
                expireTime,
                detailList,
              }
              saveRule(postData).then((res) => {
                if (res.data.data) {
                  this.$Message.warning(res.data.msg);
                } else {
                  this.$Message.success("新建成功");
                  this.$emit("confirmAdd");
                  // this.getTableConfigData();
                  // this.cancleAdd();
                }
              });
            },
          });
        }
      });
    },
    // 格式化数字为两位小数
    formatNumber(value) {
      let reg = /^\d+\.\d{3,}$/;
      if (reg.test(value)) {
        let number = value.toFixed(2) - 0;
        return number;
      }
      return value;
    },
    // 整理入参 detaiList
    formatParams() {
      let result = [];
      //
      switch (this.addForm.configType) {
        // 司推司 暂不处理
        case 1: {
          result = this.addForm.detailList
          break
        }
        // 成推司
        case 2: {
          this.addForm.rewardObject.map((item) => {
            const { coupons, data } = this.awardDetail[item];
            // 命中司机报名奖励
            if (data.single) {
              const el = {
                ...coupons[0],
                rewardEvent: 0,
                rewardType: 0,
                couponLimit:
                  data.signUpcouponMax > 0 ? data.signUpcouponMaxInput : -1,
              };
              result.push(el);
            }
            // 命中司机运营奖励
            if (data.single1) {
              // 优惠券
              if (data.couponModal) {
                const el = {
                  ...coupons[1],
                  rewardEvent: 1,
                  rewardType: 0,
                  rewardDelay: data.rewardDelay,
                  couponLimit: data.couponMax > 0 ? data.couponMaxInput : -1,
                };
                result.push(el);
              }
              // 现金
              if (data.cashModal) {
                const el = {
                  rewardObject: item,
                  rewardEvent: 1,
                  rewardType: 1,
                  rewardDelay: data.rewardDelay,
                  cashValue: data.cashValue,
                  cashMax: data.cashMax > 0 ? data.cashMax : -1,
                };
                result.push(el);             
              }
            }
          })
          break
        }
      }
      return result;
    },
    // 被推荐司机类型改变
    rewardObjectChange(values) {
      if(this.addForm.configType === 2) {
        this.addForm.detailList = []
        return
      }
      this.addForm.detailList = values.sort((a, b) => {return a-b}).map((item) => {
        return {
          ...d2dItem,
          rewardObject: item,
        };
      });
    },
    // 推荐人类型转变 将奖励明细字段初始化
    configTypeChange() {
      this.rewardObjectChange(this.addForm.rewardObject)
    }
  },
};
</script>
<style lang="less">
.ivu-select-dropdown {
  z-index: 999999 !important;
}
.el-picker-panel {
  z-index: 9999 !important;
}

.newItem {
  .ivu-form-item-error-tip {
    left: 80px !important;
  }
}
.new-label1 .ivu-form-item-label {
  width: 94px !important;
}
.new-label1:nth-child(2) .ivu-form-item-label {
  width: 70px !important;
}
.new-label {
  display: flex;
  .ivu-form-item {
    width: 210px;
  }
  .ivu-form-item-label {
    width: 82px !important;
  }
}
.passenger-name {
  margin-left: 10px;
  position: relative;
  span {
    display: inline-block;
    width: 4px;
    height: 16px;
    background: #02a7f0;
    position: absolute;
    left: -10px;
    top: 8px;
  }
}
.inner-form-item {
  margin-left: -20px;
}
.textarea-wrapper{
  position: relative;
  display: inline-block;
  .max-words-limit{
    position: absolute;
    right: 10px;
    bottom: 0;
    font-size: 12px;
    color: #b2afaf;
  }
}
</style>
