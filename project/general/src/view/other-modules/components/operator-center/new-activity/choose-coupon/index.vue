<template>
  <div class="choose-coupon">
    <p v-if="title" class="title">
      {{title}}：<span
        v-if="couponList.length === 0 && isEdit"
        style="margin-left:10px; font-size:12px;"
      >未设置</span>
    </p>
    <!-- <span v-if="!isEdit">选择优惠券模板</span> -->
    <Button
      v-if="!isEdit"
      type="primary"
      style="margin-bottom: 15px"
      @click="isCouponModal = true"
    >
      选择优惠券模板
    </Button>
    <div>
      <ul class="coupon-list">
        <li
          v-for="(item, index) in couponList"
          :key="item.templateCode + index"
        >
          <Form
            :ref="'editInfo' + index"
            :model="item"
            :rules="isEdit ? {} : ruleValidate"
          >
            <div class="coupon-item">
              <!-- <span class="index-num">{{ index + 1 }}.</span> -->
              <Icon
                v-if="!isEdit"
                class="close-icon fontsize18"
                type="ios-close-circle-outline"
                @click="removeCoupon(index)"
              />
              <!-- 左侧图片优惠券 -->
              <div class="coupon-left">
                <div v-if="item.templateType === 1" class="small-left">
                  <p class="fontsize18" style="color:#2D8cF0">
                    {{item.discount}}折
                  </p>
                  <p>最高抵扣 {{item.highestMoney}} 元</p>
                </div>
                <div v-else class="small-left">
                  <p class="fontsize18" style="color:#2D8cF0">
                    {{item.couponMoney}}元
                  </p>
                  <p v-if="item.needCondition">
                    满 {{item.conditionMoney}} 元可用
                  </p>
                  <p v-else>
                    不限门槛
                  </p>
                </div>
                <div class="small-right">
                  <span v-if="item.templateType === 1" class="coupon-icon">折扣券</span>
                  <span v-else class="coupon-icon">抵扣券</span>
                  <p v-if="!item.nameInput" class="coupon-name">
                    {{item.couponName}}
                    <!-- <span
                      v-if="!isEdit"
                      class="edit-btn"
                      @click="changeName(index, true)"
                      >编辑</span
                    > -->
                  </p>
                  <div v-else>
                    <Input
                      v-model="item.couponName"
                      style="width:160px;"
                      size="small"
                      @on-blur="NameBlur(index)"
                    />
                    <Button
                      class="top-move"
                      size="small"
                      type="primary"
                      @click="changeName(index, false)"
                    >
                      确定
                    </Button>
                  </div>
                </div>
              </div>
              <!-- 右侧填写内容 -->
              <div class="coupon-right">
                <!-- 每次奖励券张数 -->
                <FormItem
                  v-if="isEvery"
                  label="每次奖励券张数："
                >
                  <span>{{item.perRewardNum}}</span>
                </FormItem>
                <!-- 发放总额度select -->
                <FormItem label="发放总额度：">
                  <span v-if="item.templateQuotaType === 1">
                    {{item.totalRewardAmount}}
                  </span>
                  <span v-else>不限额度</span>
                </FormItem>
                <!--  发券总张数-->
                <FormItem label="发券总张数：">
                  <span>{{item.templateQuotaType === 2 ? "不限" : Math.floor( item.totalRewardAmount / (item.templateType === 1 ? item.highestMoney : item.couponMoney))}}</span>
                </FormItem>
                <!-- 券有效期 -->
                <FormItem label="券有效期：">
                  <span v-if="item.validityType === 1">
                    固定期限
                  </span>
                  <span v-else> 动态有效期 </span>
                </FormItem>
                <FormItem
                  v-if="item.validityType === 1"
                  label="固定期限："
                  prop="guding"
                >
                  {{item.validityBeginTime + '-' + item.validityEndTime}}
                </FormItem>
                <FormItem v-else label="动态有效期：" prop="effectiveDays">
                  {{item.effectiveDays}}天
                </FormItem>
                <FormItem label="使用城市：">
                  {{item.useCityName}}
                </FormItem>
                <!-- 使用时段 -->
                <FormItem label="使用时段：" prop="freeShardLimitTime">
                  <span v-if="item.freeShardLimitTime === 1">
                    {{item.timeSlot}}
                  </span>
                  <span v-else>不限时段</span>
                </FormItem>
                <div style="display:inline-block">
                  <FormItem label="券模板名称：">
                    <span>{{item.templateName}}</span>
                  </FormItem>
                  <FormItem label="券模板编码：">
                    <span>{{item.templateCode}}</span>
                  </FormItem>
                  <FormItem label="业务线：">
                    <span
                      v-for="(val, index) in item.businessTypeList"
                      :key="val"
                    >{{val}}
                      {{index == item.businessTypeList.length - 1 ? "" : "/"}}</span>
                  </FormItem>
                  <FormItem label="订单类型：">
                    <span v-for="(val, index) in item.userLimitList" :key="val">{{val}}
                      {{index == item.userLimitList.length - 1 ? "" : "/"}}</span>
                  </FormItem>
                  <FormItem label="车型等级：" style="margin-left: 10px">
                    <span v-if="item.carTypeList.length">
                      <span v-for="(val,index) in item.carTypeList"
                            :key="index"
                      >
                        {{val}}
                        {{index == item.carTypeList.length - 1 ? "" : "/"}}
                      </span>
                    </span>
                    <span v-else>暂无</span>
                  </FormItem>
                </div>
              </div>
            </div>
            <!-- 限定时段 -->
            <div v-if="isLimit" style="display:flex">
              <FormItem>
                <Checkbox
                  v-model="item.activityLimitTime"
                  :disabled="isEdit"
                  :true-value="1"
                  :false-value="0"
                >
                  限定时段
                </Checkbox>
              </FormItem>
              <FormItem v-if="item.activityLimitTime" prop="startLimitTime">
                <TimePicker
                  v-model="item.startLimitTime"
                  :disabled="isEdit"
                  type="time"
                  placeholder="开始时间"
                  style="width: 100px"
                />
                <span style="margin-left:15px;">-</span>
              </FormItem>
              <FormItem v-if="item.activityLimitTime" prop="endLimitTime">
                <TimePicker
                  v-model="item.endLimitTime"
                  :disabled="isEdit"
                  type="time"
                  placeholder="结束时间"
                  style="width: 100px"
                />
              </FormItem>
            </div>
            <!-- 限定区域 -->
            <div v-if="isLimit">
              <FormItem style="margin-bottom:6px;">
                <Checkbox
                  v-model="item.activityLimitArea"
                  :disabled="isEdit"
                  :true-value="1"
                  :false-value="0"
                >
                  限定区域
                </Checkbox>
                <Button
                  v-if="item.activityLimitArea && !isEdit"
                  style="margin-left:15px;"
                  type="primary"
                  size="small"
                  @click="openAreaModal(item, index)"
                >
                  选择电子围栏
                </Button>
              </FormItem>
              <FormItem
                v-if="item.activityLimitArea"
                style="min-width:200px;margin-left:20px;"
                prop="areaList"
              >
                <span>电子围栏名称：{{item.electronicCrawlName}}</span>
              </FormItem>
            </div>
          </Form>
        </li>
      </ul>
      <!-- 奖励方式 -->
      <div v-if="isAwardType && !isOnlyAwardType && couponList.length > 0">
        <Form
          :ref="'awardType'"
          :model="awardTypeObj"
          :rules="isEdit ? {} : ruleValidate"
        >
          <FormItem label="奖励方式 " prop="couponRewardType">
            <RadioGroup
              v-model="awardTypeObj.couponRewardType"
              class="right15"
              @on-change="awardTypeChange"
            >
              <Radio :disabled="isEdit" :label="1">
                每单奖励
              </Radio>
              <Radio :disabled="isEdit" :label="2">
                阶梯奖励
              </Radio>
            </RadioGroup>
          </FormItem>
          <!-- 每单奖励 -->
          <FormItem
            v-if="
              awardTypeObj.couponRewardType === 1 &&
                awardTypeObj.ladder.length > 0
            "
            :label="awardTypeList.onlyStart"
            prop="ladder"
          >
            <InputNumber
              v-model="awardTypeObj.ladder[0].ladderValue"
              :disabled="isEdit"
              :min="1"
              style="width:70px;vertical-align:top;"
            />{{awardTypeList.onlyMiddle}}
            <InputNumber
              v-model="awardTypeObj.ladder[0].rewardValue"
              :min="1"
              :disabled="isEdit"
              style="width:70px;vertical-align:top;"
            />{{awardTypeList.onlyEnd}}
          </FormItem>
          <!-- 阶梯奖励 -->
          <FormItem
            v-if="awardTypeObj.couponRewardType === 2"
            label=""
            prop="ladder"
          >
            <ul class="recom-list">
              <li class="recom-head">
                <div class="recom-first div-item">
                  {{awardTypeList.tableFirst}}
                </div>
                <div class="div-item">
                  {{awardTypeList.tableSecond}}
                </div>
              </li>
              <li
                v-for="(item, index) in awardTypeObj.ladder"
                :key="index"
                class="recom-body"
              >
                <div class="recom-first div-item">
                  <InputNumber
                    v-model="item.ladderValue"
                    :disabled="isEdit"
                    :min="1"
                    size="small"
                    style="width:100px;vertical-align:top;"
                  />
                </div>
                <div class="div-item">
                  <InputNumber
                    v-model="item.rewardValue"
                    :disabled="isEdit"
                    :min="1"
                    size="small"
                    style="width:100px;vertical-align:top;"
                  />
                </div>
                <Icon
                  v-if="index > 0 && !isEdit"
                  class="remove-icon"
                  type="ios-remove-circle-outline"
                  @click="removeRecomList(index)"
                />
              </li>
            </ul>
            <Button
              v-if="awardTypeObj.ladder.length < 5 && !isEdit"
              size="small"
              @click="addRecomList"
            >
              添加阶梯
            </Button>
          </FormItem>
        </Form>
      </div>
      <!-- 助力活动的奖励方式 -->
      <div v-if="isOnlyAwardType && couponList.length > 0">
        <Form
          :ref="'awardType'"
          :model="awardTypeObj"
          :rules="isEdit ? {} : ruleValidate"
        >
          <!-- 每单奖励 -->
          <FormItem
            v-if="
              awardTypeObj.couponRewardType === 2 &&
                awardTypeObj.ladder.length > 0
            "
            :label="awardTypeList.helpStart"
            prop="ladder"
          >
            <InputNumber
              v-model="awardTypeObj.ladder[0].ladderValue"
              :disabled="isEdit"
              :min="1"
              style="width:70px;vertical-align:top;"
            />{{awardTypeList.onlyMiddle}}
            <InputNumber
              v-model="awardTypeObj.ladder[0].rewardValue"
              :min="1"
              :disabled="isEdit"
              style="width:70px;vertical-align:top;"
            />{{awardTypeList.onlyEnd}}
          </FormItem>
        </Form>
      </div>
      <!-- 新增 -->
      <div v-if="couponList.length === 0 && !isEdit" class="coupon-box">
        <img
          src="../../../../assets/addCoupon.png"
          @click="isCouponModal = true"
        />
      </div>
      <!-- <Button
        v-if="
          couponList.length > 0 && couponList.length <= limitNumber && !isEdit
        "
        type="primary"
        @click="isCouponModal = true"
      >
        选择优惠券模板
      </Button> -->
    </div>
    <Modal
      v-model="isCouponModal"
      width="80%"
      title="请选择优惠券模板"
      footer-hide
    >
      <coupon-modal
        :isRepeat="isRepeat"
        :isShow="isCouponModal"
        :limitNumber="isRepeat ? 15 - couponList.length : limitNumber"
        :list="couponList"
        @close="isCouponModal = false"
        @selectDown="selectDown"
      />
    </Modal>
  </div>
</template>
<script>
import { orderMap, businessLineMap } from "../fields";
import { cacheData1, cacheData2, cacheData3 } from "./fields";
import couponModal from "../coupon-modal/index.vue";
export default {
  components: {
    couponModal

  },
  props: {
    // 优惠券类型
    title: {
      type: String,
      default: ""
    },
    // 城市下拉列表
    cityList: {
      type: Array,
      default: () => []
    },
    // 为了缓存，当有多个优惠券的时候，要区分缓存，目前只有1,2
    type: {
      type: String,
      default: "1"
    },
    isLimit: {
      // 是否要限定时段和限定区域,优惠券模板可以选择相同的
      type: Boolean,
      default: false
    },
    isAwardType: {
      // 是否有奖励方式
      type: Boolean,
      default: false
    },
    awardTypeList: {
      type: Object,
      default: () => {}
    },
    isEdit: {
      // 是否编辑
      type: Boolean,
      default: false
    },
    isAllEdit: {
      // 是否全部编辑
      type: Boolean,
      default: false
    },
    limitNumber: {
      type: Number,
      default: 15
    },
    isEvery: {
      // 是否有每次奖励券张数
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    },
    awardObj: {
      type: Object,
      default: () => {}
    },
    selectCityList: {
      type: Array,
      default: () => []
    },
    // 助力活动的奖励方式
    isOnlyAwardType: {
      type: Boolean,
      default: false
    },
    awardName: {
      type: String,
      default: "活动奖励"
    },
    isDynamic: {
      // 是否为动态城市
      type: Boolean,
      default: false
    },
    isRepeat: {
      // 是否可以选择重复优惠券
      type: Boolean,
      default: false
    },
    flag: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    let cacheData =
      this.type === "1"
        ? cacheData1
        : this.type === "2"
          ? cacheData2
          : cacheData3;
    return {
      ...cacheData,
      couponList: [],
      awardTypeObj: {
        couponRewardType: null,
        ladder: [{ ladderValue: null, rewardValue: null }]
      },
      orderMap,
      businessLineMap,
      isCouponModal: false,
      isAreaModal: false,
      selectAreaObj: {},
      selectAreaIndex: 0
    };
  },
  watch: {
    isEdit(newVal) {
      if (newVal) {
        this.setCouponList();
      }
    },
    isOnlyAwardType() {
      this.changeAward();
    },
    list: {
      handler() {
        this.setCouponList();
      }
    }
  },
  mounted() {
    if (this.isEdit || this.isAllEdit) {
      this.setCouponList();
    }
    this.changeAward();
  },
  methods: {
    /*
     *@description: 奖励方式修改-修改填写奖励的方式，阶梯奖励和每单奖励
     *@author: wuxuan
     *@date: 2019-08-19 11:48:06
     */
    awardTypeChange() {
      if (this.awardTypeObj && this.awardTypeObj.couponRewardType == 1) {
        this.awardTypeObj.ladder = this.awardTypeObj.ladder.splice(0, 1);
      }
    },
    /*
     *@description: 发放总额度-限定额度，当input blur时，对填入的金额做处理:正整数，并计算发券总张数
     *@author: wuxuan
     *@date: 2019-08-19 11:49:06
     */
    addCouponNum(index) {
      let item = this.couponList[index];
      let val = item.totalRewardAmount;
      if (val === null) {
        this.couponList[index].totalCouponNum = 0;
        return false;
      }
      if (String(val).indexOf(".")) {
        this.couponList[index].totalRewardAmount = parseInt(val);
        val = parseInt(val);
      }
      this.couponList[index].totalCouponNum = Math.floor(val / (item.templateType === 1 ? item.highestMoney : item.couponMoney));
    },
    formatTime(index) {
      let time = this.couponList[index].timeSlot;
      this.couponList[index].useLimitBeginTime = time[0];
      this.couponList[index].useLimitEndTime = time[1];
    },
    changeTime(index) {
      let time = this.couponList[index].guding || [];
      this.couponList[index].startTime = time[0];
      this.couponList[index].endTime = time[1];
    },
    selectAreaDown(item) {
      this.$set(
        this.couponList[this.selectAreaIndex],
        "electronicCrawlName",
        item.name
      );
      this.$set(
        this.couponList[this.selectAreaIndex],
        "electronicCrawl",
        item.uuid
      );
    },
    openAreaModal(item, index) {
      if (this.selectCityList.length === 0) {
        this.$Message.warning("请先选择活动城市");
        return false;
      }
      this.selectAreaObj = {
        uuid: item.electronicCrawl,
        name: item.electronicCrawlName
      };
      this.selectAreaIndex = index;
      this.isAreaModal = true;
    },
    // 删除一个阶梯奖励
    removeRecomList(index) {
      this.awardTypeObj.ladder.splice(index, 1);
    },
    // 添加一个阶梯奖励
    addRecomList() {
      this.awardTypeObj.ladder.push({
        ladderValue: null,
        rewardValue: null
      });
    },
    handleSubmit() {
      let that = this;
      let len = this.couponList.length;
      let failedNum = 0; // 不通过验证的优惠券个数
      if (len === 0) {
        return true;
      }
      for (let i = 0; i < len; i++) {
        let refName = "editInfo" + i;
        that.$refs[refName][0].validate(valid => {
          if (!valid) {
            failedNum++;
          }
        });
      }
      // 优惠券验证通过
      if (failedNum === 0) {
        // 奖励方式验证
        if (this.isAwardType || this.isOnlyAwardType) {
          let isSuccess = false;
          that.$refs["awardType"].validate(valid => {
            if (valid) {
              isSuccess = true;
            }
          });
          return isSuccess;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    refreshCouponList() {
      this.couponList.splice(0, 1, this.couponList[0]);
    },
    // 选择优惠券模板
    selectDown(list) {

      let that = this;
      function setData(item) {
        that.$set(item, "nameInput", false);
        that.$set(item, "couponName", item.templateName || ""); // 券名称
        that.$set(item, "templateUuid", item.templateUuid); // 模板uuid
        that.$set(item, "templateType", item.templateType); // 模板uuid
        that.$set(item, "perRewardNum", null); // 每次奖励券张数,
        that.$set(item, "templateQuotaType", null); // 发放总额度(元)
        that.$set(item, "freeShardLimitTime", null); // 发放总额度(元)
        that.$set(item, "totalRewardAmount", null); // 发放总额度(元)
        that.$set(item, "validityType", null); // 券有效期
        that.$set(item, "guding", []); // 固定有效期：
        that.$set(item, "effectiveDays", null); // 动态有效期
        that.$set(item, "useCityArray", []); // 城市
        that.$set(item, "timeSlot", []); // 使用时限
        that.$set(item, "activityLimitTime", false); // 限定时间
        that.$set(item, "activityLimitArea", false); // 限定区域
        that.$set(item, "startLimitTime", ""); // 限定开始时间
        that.$set(item, "endLimitTime", ""); // 限定结束时间
        that.$set(item, "electronicCrawl", ""); // 限定区域围栏列表
        that.$set(item, "electronicCrawlName", ""); // 限定区域围栏列表
        delete item.uuid;
        return item;
      }
      // 如果优惠券模板可以选择重复的
      if (this.isRepeat) {
        list.forEach(item => {
          let newItem = setData(item);
          this.couponList.push(newItem);
        });
        return false;
      } else {
        list.forEach(item => {
          this.couponList.push(item);
        });
      }
      let couponListCopy = JSON.parse(JSON.stringify(this.couponList));
      this.couponList.splice(0, this.couponList.length);
      let couponListHash = {};
      couponListCopy.forEach((item, index) => {
        couponListHash[item.templateCode] = String(index);
      });


      let addList = [];

      list.forEach(item => {
        let index = couponListHash[item.templateCode];
        if (index) {
          this.couponList.push(couponListCopy[index]);
        } else {
          let newItem = setData(item);
          addList.push(newItem);
        }
      });
      this.couponList.push(...addList);
      this.$emit("getCoupon", this.flag, this.couponList)
    },
    // 删除优惠券
    removeCoupon(index) {
      this.couponList.splice(index, 1);
      this.$emit("getCoupon", this.flag, this.couponList)
    },
    NameBlur(index) {
      if (this.isEdit) {
        return false;
      }
      let name = this.couponList[index].couponName;
      let len = name.length;
      if (len > 9) {
        this.$Message.error("最多输入9个字符");
        this.couponList[index].couponName = name.slice(0, 9);
      } else if (len === 0) {
        this.$Message.error("名称不能为空");
        this.couponList[index].couponName = this.couponList[index].templateName;
      }
    },
    // 修改优惠券名称
    changeName(index, status) {
      if (this.isEdit) {
        return false;
      }
      if (!status) {
        let len = this.couponList[index].couponName.length;
        if (len > 9) {
          this.$Message.error("最多输入9个字符");
        } else if (len === 0) {
          this.$Message.error("名称不能为空");
        } else {
          this.couponList[index].nameInput = status;
        }
      } else {
        this.couponList[index].nameInput = status;
      }
      this.couponList.splice(0, 1, this.couponList[0]);
    },
    changeItemCity(index, val) {
      let length = val.length;
      let cityListCopy = [];
      if (val[length - 1] === "1") {
        cityListCopy = ["1"];
      } else if (val[length - 1] === "2") {
        cityListCopy = ["2"];
      } else {
        val.forEach((v, k) => {
          if (v === "1" || v === "2") val.splice(k, 1);
        });
        cityListCopy = val;
      }
      this.couponList[index].useCityArray = cityListCopy;
      this.couponList[index].useCityId = cityListCopy.join(",");
      this.couponList.splice(0, 1, this.couponList[0]);
    },
    // 编辑用
    setCouponList() {
      this.list.forEach(item => {
        item.guding = [item.startTime, item.endTime];
        item.timeSlot = [item.useLimitBeginTime, item.useLimitEndTime];
        item.templateQuotaTypeCopy = item.templateQuotaType;
      });
      let copyList = JSON.parse(JSON.stringify(this.list));
      this.couponList = [...copyList];
      this.awardTypeObj = this.awardObj;
    },
    // 整理优惠券修改信息
    getEditInfo() {
      let res = [];
      let isSuccess = true;
      for (let i = 0; i < this.couponList.length; i++) {
        let item = this.couponList[i];
        let newVal = item.totalRewardAmount;
        let oldVal = this.list[i].totalRewardAmount;
        // 如果原来是限额，可以改成不限和更大的值
        if (item.templateQuotaTypeCopy === 1) {
          let obj = {
            uuid: item.uuid,
            activityUuid: this.$route.query.id,
            couponName:
              this.awardName + "-{" + (i + 1) + "." + item.couponName + "}"
          };
          if (item.templateQuotaType === 2) {
            obj.templateQuotaType = 2;
            obj.totalCouponNum = null;
            res.push(obj);
          } else {
            if (!newVal) {
              this.$Message.warning("优惠券中发放总额度不能为空");
              isSuccess = false;
              break;
            } else if (newVal < oldVal) {
              this.$Message.warning("优惠券中发放总额度不能修改为小于原值");
              isSuccess = false;
              break;
            } else if (newVal > oldVal) {
              obj.templateQuotaType = 1;
              obj.totalRewardAmount = newVal;
              obj.totalCouponNum = item.totalCouponNum;
              res.push(obj);
            }
          }
        }
      }
      let resData = isSuccess ? res : false;
      return resData;
    },
    changeAward() {
      if (this.awardTypeObj) {
        if (this.isOnlyAwardType) {
          this.awardTypeObj.couponRewardType = 2;
        } else {
          if (!this.isEdit && !this.isAllEdit) {
            this.awardTypeObj.couponRewardType = null;
          }
        }
      }
    }
  }
};
</script>
<style lang="less" scoped src="../activity.less"></style>
<style lang="less" scoped>
// 选择优惠券弹窗
.coupon-modal {
  /deep/ .ivu-modal {
    min-width: 1000px;
  }
}
.title {
  line-height: 30px;
  font-size: 14px;
}
.choose-coupon {
  margin-bottom: 20px;
}
.coupon-box {
  width: 100%;
  max-width: 1430px;
  height: 150px;
  padding: 20px 15px;
  border: 1px solid #cccdd1;
  border-radius: 3px;
  img {
    height: 100%;
    cursor: pointer;
  }
}
.edit-btn {
  font-size: 12px;
  color: #2d8cf0;
  float: right;
  margin-right: 10px;
}
.tip-icon {
  color: #aaa;
  font-size: 10px;
}
</style>
