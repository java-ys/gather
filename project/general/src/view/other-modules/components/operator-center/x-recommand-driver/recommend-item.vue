<template>
  <div class="component-recommend">
    <Form :model="formData" ref="recommendForm" :rules="rules">
      <div>
        <Checkbox v-model="formData.single"> 司机报名奖 </Checkbox>
        <span style="margin-left: 15px; color: #b2afaf">每个司机报名成功，对推荐人奖励</span>
      </div>
      <div v-if="formData.single">
        <div class="passenger-name"><span></span>优惠券奖励</div>
        <choose-coupon
          ref="couponRef"
          :isRepeat="false"
          :limitNumber="1"
          :isEvery="true"
          flag="0"
          @getCoupon="getCoupon"
        ></choose-coupon>
        <div class="new-label">
          <FormItem label="奖励上限：" prop="signUpcouponMax" class="newItem">
            <Select
              v-model="formData.signUpcouponMax"
              placeholder="请选择"
              style="width: 120px"
            >
              <Option :value="-1"> 不限次数 </Option>
              <Option :value="1"> 限定次数 </Option>
            </Select>
          </FormItem>
          <FormItem v-if="formData.signUpcouponMax == 1" prop="signUpcouponMaxInput">
            <Input
              v-model="formData.signUpcouponMaxInput"
              placeholder="请输入"
              :maxlength="10"
              style="width: 100px"
            />
            <span style="margin-left: 4px">次</span>
          </FormItem>
        </div>
      </div>
      <Checkbox v-model="formData.single1" style="margin-top: 20px">
        司机营运奖励
      </Checkbox>
      <span style="margin-left: 15px; color: #b2afaf">司机确认入职达到一定时间后，对推荐人奖励</span>
      <div v-if="formData.single1">
        <div>
          <FormItem
            label="确认入职满"
            class="new-label1 newItem"
            prop="rewardDelay"
          >
            <Input
              v-model="formData.rewardDelay"
              style="width: 60px"
              :maxlength="5"
              placeholder="请输入"
            ></Input>
            天
          </FormItem>
          <FormItem
            label="奖励类型"
            class="new-label1"
            style="margin-top: 20px"
            prop="rewardType"
          >
            <Checkbox v-model="formData.couponModal"> 优惠券 </Checkbox>
            <Checkbox v-model="formData.cashModal"> 现金 </Checkbox>
          </FormItem>
        </div>
        <div v-if="formData.couponModal">
          <div class="passenger-name"><span></span>优惠券奖励</div>
          <choose-coupon
            ref="couponRef2"
            :limitNumber="1"
            :isEvery="true"
            flag="1"
            @getCoupon="getCoupon"
          ></choose-coupon>
          <div class="new-label">
            <FormItem label="奖励上限：" prop="couponMax" class="newItem">
              <Select
                v-model="formData.couponMax"
                placeholder="请选择"
                style="width: 120px"
              >
                <Option :value="-1"> 不限次数 </Option>
                <Option :value="1"> 限定次数 </Option>
              </Select>
            </FormItem>

            <FormItem v-if="formData.couponMax == 1" prop="couponMaxInput">
              <Input
                v-model="formData.couponMaxInput"
                placeholder="请输入"
                :maxlength="10"
                style="width: 100px"
              /><span style="margin-left: 4px">次</span>
            </FormItem>
          </div>
        </div>
        <div v-if="formData.cashModal" style="margin-top: 20px">
          <div class="passenger-name"><span></span>现金奖励</div>
          <div class="new-label">
            <FormItem label="奖励现金：" prop="cashValue" class="newItem">
              <Input
                v-model="formData.cashValue"
                placeholder="请输入"
                style="width: 100px"
              />
              <span style="margin-left: 4px">元</span>
            </FormItem>
            <FormItem label="奖励上限：" prop="max" class="newItem">
              <Select
                v-model="formData.max"
                placeholder="请选择"
                style="width: 120px"
              >
                <Option :value="-1"> 不限金额 </Option>
                <Option :value="1"> 限定金额 </Option>
              </Select>
            </FormItem>
            <FormItem v-if="formData.max == 1" prop="cashMax">
              <Input
                v-model="formData.cashMax"
                placeholder="请输入"
                :maxlength="10"
                style="width: 100px"
              /><span style="margin-left: 4px">元</span>
            </FormItem>
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>
<script>
import chooseCoupon from "../new-activity/choose-coupon/index.vue";
export default {
  name: "RecommendItem",
  components: {
    chooseCoupon,
  },
  props: {
    bindKey: {
      type: [String, Number],
      required: true,
      default: "",
    },
    name: {
      type: String,
    },
    /**
     * 
     * 数据结构
     * {
     *  (被推荐司机类型code) : {
     *    coupons: [司机报名奖励优惠券, 司机营运奖励优惠券],
     *    data: {} 表单中其他的数据
     *  } 
     * }
     */
    value: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  data() {

    const cashValueValid = (rule, value, callback) => {
      if (this.formData.max == 1) {
        console.log(this.formData.cashMax, this.formData.cashMax % value == 0);
        if (this.formData.cashMax % value == 0) {
          callback()
        } else {
          callback(new Error('奖励上限必须是奖励现金的倍数'))
        }
      }else{
        callback()
      }
    }

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
    const rewardMax = (rule, val, callback) => {
      if (val > 10000) {
				callback(new Error(''));
			} else {
				callback();
			}
    }

    const validRewardType = (rule, val, callback) => {
      if(this.formData.couponModal || this.formData.cashModal) {
        callback()
      }else {
        callback(new Error('奖励类型不能为空'))
      }
    }

    return {
      formData: {
        couponMax: -1,
        couponMaxInput: '',
        signUpcouponMax: -1,
        signUpcouponMaxInput: '',
        max: -1,
        cashMax: '',
        single: false,
        single1: false,
        couponModal: false,
        cashModal: false,
        rewardDelay: ''
      },
      coupons: [],
      rules:{
        cashValue: [{ required: true, message: "奖励现金不能为空" }, {validator: cashValueValid, trigger: "blur"}],
        rewardDelay: [{ required: true, message: "确认入职天数不能为空" }, { validator: validNum, trigger: "blur" }],
        max: [{ required: true, message: "奖励上限不能为空" }],
        couponMax: [{ required: true, message: "奖励上限不能为空" }],
        cashMax: [{ required: true, message: "限定金额不能为空" }, { validator: validLast, trigger: "blur" }],
        couponMax: [{ required: true, message: "奖励上限不能为空" }],
        couponMaxInput: [{ required: true, message: "限定次数不能为空" }, { validator: validLast, trigger: "blur" }],
        signUpcouponMaxInput: [{ required: true, message: "奖励上限不能为空" }],
        reward: [
          { required: true, message: "奖励金额不能为空"}, 
          { trigger: "change", validator: validNum, message: "奖励金额必须为正整数"},
          { trigger: "change", validator: rewardMax, message: "奖励金额最大10000"}
        ],
        rewardType: [{validator: validRewardType}]
      }
    };
  },
  created() {
    this.value[this.bindKey] = this.value[this.bindKey] || {}
    this.coupons = this.value[this.bindKey].coupons || []
  },
  watch: {
    'formData': {
      handler(data) {
        console.log('watch from......');
        this.value[this.bindKey].data = data
        this.$emit('input', this.value)
      },
      deep: true
    }
  },
  methods: {
    // type 1 司机报名奖  2 司机营运奖励
    getCoupon(type, data) {
      let templateUuid = "";
      let activityUuid = "";
      let couponMoney = "";
      let templateName = "";
      let perRewardNum = "";
      let templateType = "";
      let couponUuid = "";
      if (data.length) {
        const coupon = data[0]
        templateType = coupon.templateType;
        if (templateType == "1") {
          // 1 折扣，2 抵扣
          couponMoney = coupon.highestMoney;
        } else {
          //  抵扣
          couponMoney = coupon.couponMoney;
        }
        templateUuid = coupon.templateUuid;
        activityUuid = coupon.activityUuid;
        templateName = coupon.templateName;
        perRewardNum = coupon.perRewardNum;
        couponUuid = coupon.couponUuid;
        this.coupons[type] = {
          rewardObject: this.bindKey,
          rewardType: "0", // 奖励类型  0 优惠券  1现金
          rewardEvent: type,
          couponLimit: this.formData.couponMaxInput,
          couponTemplateUuid: templateUuid, // 模板ID
          couponActivityUuid: activityUuid, // 活动ID
          couponName: templateName, // 模板名称
          couponValue: couponMoney, // 模板金额
          couponNum: perRewardNum, // 优惠劵数量 ,
          couponUuid: couponUuid
        }
      } else {
        delete this.coupons[type]
      }
      this.value[this.bindKey].coupons = this.coupons
      this.$emit('input', this.value)
    },
    checkCoupon() {
      let flag1 = true, // 报名奖励验证结果
          flag2 = true  // 运营奖励验证结果

      // 当勾选了司机报名奖励
      if(this.formData.single) {
        // 校验是否选择了优惠券
        if(!this.coupons[0]) {
          this.$Message.warning(`请选择${this.name}推荐奖励优惠券`)
          flag1 = false
        }
      }
      // 当勾选了司机营运奖励 & 选择优惠券奖励
      if(this.formData.single1 && this.formData.couponModal) {
        if(!this.coupons[1]) {
          this.$Message.warning(`请选择${this.name}推荐人奖励优惠券`)
          flag2 = false
        }
      }

      return flag1 && flag2
    },
    checkForm() {
      // 验证是否设置奖励类型
      if(!this.formData.single && !this.formData.single1){
        this.$Message.warning(`请设置${this.name}奖励类型`) 
        return Promise.resolve(false)
      }

      if(!this.checkCoupon()) return Promise.resolve(false)

      return new Promise( (resolve, reject) => {
        this.$refs.recommendForm.validate( valid => {
          resolve(valid)
        })
      })
    }
  },
  destroyed() {
    this.coupons = []
  }
};
</script>