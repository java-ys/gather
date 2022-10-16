<template>
  <div class="accounting-add">
    <Card class="account-card">
      <Form ref="addForm" class="top15" :model="addData" :rules="ruleValidate" :label-width="150">
        <div class="class-tit bottom30">基本信息</div>
        <div class="flex-box">
          <!-- 策略名称 -->
          <FormItem label="策略名称：" prop="channelStrategyName" class="right50">
            <span v-if="!isAdd" class="width200">{{addData.channelStrategyName}}</span>
            <Input
              v-else
              v-model="addData.channelStrategyName"
              class="width200"
              :maxlength="50"
              placeholder="请输入策略名称"
            />
          </FormItem>
          <!-- 渠道 -->
          <FormItem label="渠道：" prop="channelCode" class="right50">
            <span v-if="!isAdd" class="width200">{{channelMap[addData.channelCode]}}</span>
            <Select
              v-else
              v-model="addData.channelCode"
              placeholder="请选择渠道"
              class="width200"
            >
              <Option
                v-for="item in channelList"
                :key="item.value"
                :value="item.value"
              >
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
        </div>
        <div class="flex-box">
          <!-- 业务线 -->
          <!-- <FormItem label="业务线：" prop="expandBizLine" class="right50">
            <span v-if="!isAdd" class="width200">普通用车</span>
            <Select
              v-else
              v-model="addData.expandBizLine"
              placeholder="请选择渠道"
              class="width200"
              @on-change="changeBusiness"
            >
              <Option
                v-for="(m, index) in businessGradeList"
                :key="index"
                :value="m.value"
              >
                {{m.label}}
              </Option>
            </Select>
          </FormItem> -->
          <!-- 产品线 -->
          <FormItem label="产品线：" prop="typeModule">
            <span v-if="!isAdd" class="width200">{{getProductName(addData.typeModule)}}</span>
            <Select
              v-else
              v-model="addData.typeModule"
              placeholder="请选择产品线"
              class="width200"
              @on-change="changeProduct"
            >
              <Option
                v-for="item in bizTypeList"
                :key="item.value"
                :value="item.value"
              >
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
          <!-- 车型等级 -->
          <FormItem label="车型等级：" prop="carLevels" class="right50">
            <span v-if="isDetail" class="width200">{{getCarLevelName(addData.carLevels, addData.typeModule)}}</span>
            <Select
              v-else
              v-model="addData.carLevels"
              multiple
              :disabled="!addData.typeModule"
              placeholder="请选择车型等级"
              class="width200"
            >
              <Option
                v-for="item in carLevelList"
                :key="item.vehicleLevel"
                :value="item.vehicleLevel"
              >
                {{item.vehicleName}}
              </Option>
            </Select>
          </FormItem>
        </div>
        <div class="flex-box">
          <!-- 城市 -->
          <FormItem label="城市：" prop="cityCodes">
            <div v-if="isDetail" class="width200">
              <span>{{addData.cityNames && addData.cityNames.join(",")}}</span>
            </div>
            <Select
              v-else
              v-model="addData.cityCodes"
              filterable
              multiple
              clearable
              placeholder="请选择城市"
              style="width:280px;"
              @on-change="changeCity"
            >
              <Option
                v-for="item in cityList"
                :key="item.value"
                :value="item.value"
              >
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
        </div>
        <div class="flex-box">
          <!-- 订单类型 -->
          <FormItem label="订单类型：" prop="typeTimes" class="right50">
            <span v-if="isDetail" class="width200">{{addData.typeTimes.map(item => orderTypeMap[item]).join(',')}}</span>
            <CheckboxGroup v-else v-model="addData.typeTimes" style="width:200px;">
              <Checkbox v-for="item in orderTypeList"
                        :key="item.value"
                        :label="item.value"
              >
                {{item.label}}
              </Checkbox>
            </CheckboxGroup>
          </FormItem>
          <!-- 用车场景 -->
          <div class="flex-box">
            <FormItem key="typeTripLimited" label="用车场景：" prop="typeTripLimited" class="right30">
              <div v-if="isDetail">
                <span v-if="addData.typeTripLimited === 0" class="right15">不限场景</span>
                <span v-if="addData.typeTripLimited === 1">{{addData.typeTrips.map(item => sceneMap[item]).join(',')}}</span>
              </div>
              <Select
                v-else
                v-model="addData.typeTripLimited"
                placeholder="请选择"
                style="width:150px;"
                @on-change="addData.typeTrips && addData.typeTrips.splice(0,5)"
              >
                <Option :value="0">不限场景</Option>
                <Option :value="1">限定场景</Option>
              </Select>
            </FormItem>
            <FormItem v-if="addData.typeTripLimited === 1 && !isDetail" key="typeTrips" prop="typeTrips">
              <CheckboxGroup v-model="addData.typeTrips" style="width:240px;">
                <Checkbox v-for="item in sceneAddList"
                          :key="item.value"
                          style="margin-right:15px;"
                          :label="item.value"
                >
                  {{item.label}}
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
          </div>
        </div>
        <!-- 有效时间 -->
        <FormItem label="有效时间：" prop="effectTime">
          <span v-if="isDetail">{{addData.effectTime.join(" 至 ")}}</span>
          <el-date-picker
            v-else
            v-model="addData.effectTime"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :clearable="false"
            :editable="false"
            size="small"
            style="width: 400px"
            align="left"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            @change="validItem('effectTime')"
          />
        </FormItem>
        <div class="class-tit bottom30">策略信息</div>
        <Form
          v-for="(item,index) in addData.channelPriceRules"
          :ref="'timeForm' + index"
          :key="index - 100"
          class="time-form"
          :model="item"
          :rules="ruleValidate"
          :label-width="150"
        >
          <div class="rel-box">
            <FormItem :label="'时间段' + (index + 1) + ' ：'" prop="time" :label-width="100">
              <span v-if="isDetail" class="width200">{{item.startTime + '-' + item.endTime}}</span>
              <TimePicker
                v-else
                v-model="item.time"
                :editable="false"
                type="timerange"
                placeholder="请选择时段"
                style="width: 200px"
                @on-change="timeListChange(index)"
              >
              </TimePicker>
            </FormItem>
            <Icon v-if="addData.channelPriceRules.length > 1 && !isDetail" class="remove-icon" type="ios-remove-circle-outline" @click="removeTime(index)" />
          </div>
          <Form
            v-for="(v,i) of item.ruleDetails"
            :model="v"
            :key="v.key"
            :rules="ruleValidate"
            ref="mileage"
          >
            <div class="flex-box">
              <FormItem label="里程：" :label-width="100" prop="startMileage">
                <InputNumber
                  v-model="v.startMileage"
                  :disabled="isDetail"
                  :max="99999.99"
                  placeholder="请输入公里数"
                  style="width:120px;"
                ></InputNumber>
              </FormItem>
              <span style="margin: 10px">~</span>
              <FormItem
                prop="endMileage"
                :label-width="0"
              >
                <InputNumber
                  v-model="v.endMileage"
                  :disabled="isDetail"
                  :max="99999.99"
                  placeholder="请输入公里数"
                  style="width:120px;"
                ></InputNumber>
              </FormItem>
              <Icon v-if="item.ruleDetails.length > 1 && !isDetail" size="25" color="#e61f10" style="margin: 8px" type="ios-remove-circle-outline" @click="removeMileage(index,i)" />
              <Icon type="ios-add-circle-outline" size="25" color="#57a3f3" style="margin: 8px" @click="addMileage(index, i)" />
            </div>
            <!-- 是否使用动态折扣 -->
            <div class="flex-box left20">
              <FormItem label="是否使用动态折扣：" :label-width="140" prop="dynamicDiscountOpened">
                <RadioGroup v-model="v.dynamicDiscountOpened" class="width200">
                  <Radio :label="1" :disabled="isDetail" style="margin-right:15px;">是</Radio>
                  <Radio :label="0" :disabled="isDetail">否</Radio>
                </RadioGroup>
              </FormItem>
              <!-- 是否使用渠道折扣 -->

              <FormItem key="channelDiscountOpened" label="是否使用渠道折扣：" :label-width="140" prop="channelDiscountOpened">
                <RadioGroup
                  v-model="v.channelDiscountOpened"
                  style="width:300px" @on-change="v.channelDiscount = null"
                >
                  <Radio :label="1" :disabled="isDetail" style="margin-right:15px;">是</Radio>
                  <Radio :label="0" :disabled="isDetail">否</Radio>
                </RadioGroup>
              </FormItem>
            </div>
            <div class="flex-box left20">
              <FormItem
                v-if="v.channelDiscountOpened === 1"
                key="channelDiscount"
                label="渠道折扣系数"
                :label-width="140"
                prop="channelDiscount"
                class="right30 inner-input"
              >
                <InputNumber
                  v-model="v.channelDiscount"
                  :min="0"
                  :disabled="isDetail"
                  placeholder="请输入渠道折扣系数"
                  style="width:120px;"
                ></InputNumber>
              </FormItem>
              <FormItem
                v-if="v.channelDiscount && v.channelDiscount < 1"
                key="channelMarkUpFare"
                label="封顶金额："
                :label-width="100"
                prop="channelMarkUpFare"
                class="right30 inner-input"
              >
                <InputNumber
                  v-model="v.channelMarkUpFare"
                  :disabled="isDetail"
                  placeholder="封顶金额"
                  style="width:150px;"
                ></InputNumber>
              </FormItem>
            </div>
            <div class="flex-box left20">
              <FormItem label="渠道直减：" prop="channelDirectMinus" class="right50" :label-width="100">
                <InputNumber
                  v-model="v.channelDirectMinus"
                  class="right-box"
                  :max="100"
                  :disabled="isDetail"
                  placeholder="请输入"
                  style="width:120px;"
                ></InputNumber>
                <span class="right-y">元</span>
                <span class="tip-info"> ( 渠道直减扣减节点为计算渠道折扣后 )</span>
              </FormItem>
              <!-- 计费方式 -->
              <FormItem label="计费方式：" prop="channelFareMethod" class="right50" :label-width="100">
                <RadioGroup
                  v-model="v.channelFareMethod"
                  style="width:185px;" @on-change="v.otherFareMethod = null;v.otherFare = null"
                >
                  <Radio :label="1" :disabled="isDetail" style="margin-right:15px;">实时计费</Radio>
                  <Radio :label="0" :disabled="isDetail">预估一口价</Radio>
                </RadioGroup>
              </FormItem>
              <!-- 附加费添加方式 -->
              <FormItem v-if="v.channelFareMethod === 0" key="otherFareMethod" label="附加费添加方式：" :label-width="140" prop="otherFareMethod">
                <RadioGroup
                  v-model="v.otherFareMethod"
                  @on-change="v.otherFare = null"
                >
                  <Radio :label="1" :disabled="isDetail" style="margin-right:15px;">系统预置</Radio>
                  <FormItem
                    v-if="v.otherFareMethod === 1"
                    key="otherFare"
                    prop="otherFare"
                    class="no-left-margin right30 inner-input"
                  >
                    <InputNumber
                      v-model="v.otherFare"
                      :min="0"
                      :disabled="isDetail"
                      placeholder="请输入"
                      style="width:170px;"
                    ></InputNumber>
                  </FormItem>
                  <Radio :label="0" :disabled="isDetail">司机添加</Radio>
                </RadioGroup>
              </FormItem>
            </div>
            <div class="dash-line"></div>
          </Form>
        </Form>
        <Button v-if="!isDetail && addData.channelPriceRules.length < 20" type="primary" size="small" style="margin:0 0 20px 75px;" @click="addTimeItem">添加时间段</Button>
      </Form>
      <div class="footer-box">
        <Button type="primary" size="large" :loading="addLoading" @click="addSubmit('addForm')">
          <span v-if="!addLoading">确定</span>
          <span v-else>提交中</span>
        </Button>
        <Button v-if="handleType !== 3" size="large" type="text" @click="formReset('addForm')">取消</Button>
      </div>
    </Card>
  </div>
</template>
<script>
import { carTypeMapAll, orderTypeMap } from "_g/config/status-map";
import { getCommonAppointedCityInAuth, queryChannel } from "_g/api/common.js"
import { hasTimesection } from "@/libs/tools.js";
import {
  handleTypeMap,
  ruleValidate,
  mileageObject,
} from "./fields";
import {
  channelMap,
  businessInfo,
  BusinessArr,
  orderTypeList,
  sceneMap,
  sceneAddList,
} from "../fields";
import {
  axiosChannelPriceSave,
  axiosChannelPriceUpdat,
  axiosChannelPriceDetail
} from "_o/api/priceCenter";
import { mapState, mapGetters } from "vuex"

const RULE_FIELD = {
  dynamicDiscountOpened: null,
  channelDiscountOpened: null,
  channelMarkUpFare: null,
  channelDiscount: null,
  channelFareMethod: null,
  channelDirectMinus: null,
  otherFareMethod: null,
  otherFare: null,
  startMileage: null,
  endMileage: null
}

export default {
  name: "channel-price-add",
  data() {
    return {
      ruleValidate,
      channelMap,
      channelList: [],
      carTypeMapAll,
      businessInfo,
      orderTypeMap,
      sceneMap,
      orderTypeList,
      sceneAddList,
      handleType: Number(this.$route.query.type),
      uuid: this.$route.params.uuid,
      addData: {
        channelStrategyName: "",
        channelCode: null,
        typeModule: null,
        carLevels: [],
        cityCodes: [],
        typeTimes: [],
        typeTripLimited: null,
        typeTrips: [],
        effectTime: [],
        channelPriceRules: [{
          time: ["00:00:00", "23:59:59"],
          ruleDetails: [{...RULE_FIELD, key: Date.now()}]
        }]
      },
      cityList: [],
      addLoading: false,
      // prodoctLines: [], // 产品线
      carLevelList: [], // 业务线
      mileageObject,
    };
  },
  // 根据新增，编辑，详情类型，修改meta信息
  beforeRouteEnter(to, from, next) {
    let uuid = to.params.uuid;
    let type = Number(to.query.type);
    to.meta.title = handleTypeMap[type].title
    to.meta.closeAlert = handleTypeMap[type].closeAlert
    next();
  },
  // 路由更新
  beforeRouteUpdate(to, from, next) {
    this.handleType = Number(to.query.type)
    this.uuid = to.params.uuid || ""
    if (this.uuid) {
      this.getDetailInfo(to.params.uuid);
    }
    next();
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList,
      businessGradeList: (state) => state.common.businessGradeList
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    }),
    // 是否是详情
    isDetail() {
      return this.handleType === 3;
    },
    // 是否是新增
    isAdd() {
      return this.handleType === 1;
    },
    // 弹窗标题
    modalTitle() {
      return handleTypeMap[this.handleType].title;
    }
  },
  mounted() {
    this.getCityList()
    this.getDetailInfo(this.uuid);
    this.getChannel()
    let timeValid = (rule, value, callback) => {
      let res = value.every(item => {
        return item
      })
      if (!res) {
        callback(new Error("请选择时间"));
      } else if (value[0] == value[1]) {
        callback(new Error("结束时间要大于开始时间"))
      } else {
        // 时间交叉
        let channelPriceRules = this.addData.channelPriceRules
        // let temp = true
        let num = 0
        for (let i = 0; i < channelPriceRules.length; i++) {
          let it = channelPriceRules[i].time
          if (it[0] && !hasTimesection(value, it, false)) {
            num++
          }
        }
        if (num > 1) {
          callback(new Error("时段不可交叉"))
        } else {
          callback()
        }
      }
    }
    const mileageValid = (_, __, callback) => {
      this.addData.channelPriceRules.every((rule) => {
        return rule.ruleDetails.every((v,j,arr) => {
          if(v.startMileage && v.endMileage) {
            if(v.startMileage >= v.endMileage) {
              callback(new Error("结束里程要大于起始里程"));
              return false;
            }
            arr.every((o,n) => {
              if(n !== j) {
                const uncross = v.endMileage <= o.startMileage || v.startMileage >= o.endMileage;
                if(!uncross) {
                  callback(new Error("里程不可交叉"));
                  return false;
                }
              }
              return true;
            })
          }
          return true;
        })
      }) && callback();
    }
    this.ruleValidate.time.splice(2, 1, { required: true, validator: timeValid, trigger: "change" })
    this.ruleValidate.startMileage.splice(2, 1, { required: true, validator: mileageValid, trigger: "change" })
    this.ruleValidate.endMileage.splice(2, 1, { required: true, validator: mileageValid, trigger: "change" })
  },
  methods: {
    // 获取渠道
    async getChannel() {
      const res = await queryChannel()
      const { data, success } = res.data
      if (success) {
        const list = data ? data.map(v => {
          return {
            label: v.sourseName,
            value: v.sourseValue
          }
        }) : []
        this.channelList = list
      }
    },
    timeListChange(index) {
      this.addData.channelPriceRules.forEach((item, i) => {
        this.$refs[`timeForm${i}`][0].validateField("time")
      })
    },
    removeTime(index) {
      this.addData.channelPriceRules.splice(index, 1)
    },
    addTimeItem() {
      this.addData.channelPriceRules.push({
        time: [],
        ruleDetails: [{...RULE_FIELD, key: Date.now()}]
      })
    },
    // 根据产品线获取城市列表
    getCityList() {
      let params = {
        areaType: 1,
        businessLineList: [1, 2, 4, 6, 7]
      }
      getCommonAppointedCityInAuth(params).then(res => {
        let resData = res.data.data || {};
        let list = resData.openAreaConfigDtoList || []
        let transformData = list.map(item => {
          return {
            label: item.city,
            value: item.cityId
          }
        })
        let listCopy = JSON.parse(JSON.stringify(transformData))
        // 新增，只有有全国权限的用户，才能新增全部城市的数据
        if (resData.hasAllCountyAuth === 1) listCopy.unshift({ label: "全部城市", value: "1" })
        this.cityList = listCopy
      })
    },
    // 城市切换时触发，全国所有城市和其他互斥
    changeCity(val) {
      let length = val.length;
      if (val[length - 1] == "1") {
        this.addData.cityCodes = ["1"];
      } else {
        val.forEach((v, k) => {
          if (v == "1") val.splice(k, 1);
        });
        this.addData.cityCodes = val;
      }
    },
    validItem(name) {
      this.$refs.addForm.validateField(name);
    },
    // 获取详情
    getDetailInfo(uuid) {
      // 没有uuid，说明是审批管理过来的，直接带了详情信息过来
      if (!uuid) {
        return false
      }
      axiosChannelPriceDetail({
        uuid: uuid
      }).then(res => {
        let data = res.data.data || {}
        data.effectTime = [data.effectiveTimeStart, data.effectiveTimeEnd]
        data.cityCodes.length === 0 &&　(data.cityCodes.push("1"))
        data.channelPriceRules.forEach(item => {
          item.time = [item.startTime, item.endTime]
        })
        this.addData = data
        // 更新车型下拉
        const product = this.bizTypeList.find(v => v.value === data.typeModule)
        this.$nextTick(() => {
          this.carLevelList = product ? product.children || [] : [] // 赋值车型等级
        })
      })

    },
    // 新增&编辑-提交
    async addSubmit(name) {
      if (this.isDetail) {
        this.formReset();
        return false;
      }
      let addFormValid = await this.$refs[name].validate()
      let timeValid = true
      for(var i = 0;i<this.addData.channelPriceRules.length; i++) {
        await this.$refs["timeForm"+i][0].validate().then(status => {
          if (!status) {
            timeValid = false;
          }
        });
      }
      for(let form of this.$refs.mileage) {
        await form.validate().then(b => addFormValid = addFormValid && b);
      }
      if (addFormValid && timeValid) {
        // 数据格式重写
        let that = this;
        let params = JSON.parse(JSON.stringify(this.addData))
        if (this.handleType === 2) params.uuid = this.uuid;

        // 3.有效时间数组拆分成startTime和endTime
        params.effectiveTimeStart = this.$moment(params.effectTime[0]).format("YYYY-MM-DD HH:mm:ss")
        params.effectiveTimeEnd = this.$moment(params.effectTime[1]).format("YYYY-MM-DD HH:mm:ss")
        delete params.effectTime

        params.channelPriceRules.forEach(item => {
          item.startTime = item.time[0]
          item.endTime = item.time[1]
          delete item.time
        })

        this.axiosSubmit(params)
      }
    },
    // 发送保存请求
    axiosSubmit(params) {
      let axiosFun = this.isAdd ? axiosChannelPriceSave : axiosChannelPriceUpdat
      this.addLoading = true
      axiosFun(params).then(res => {
        this.addLoading = false
        this.$Message.success(`${handleTypeMap[this.handleType].type}成功！`);
        this.$route.meta.closeAlert = false;
        this.formReset()
      }).catch(err => {
        this.addLoading = false
      })
    },
    // isReload：是否重新加载列表页面数据
    formReset() {
      this.$refs["addForm"].resetFields();
      for (let i = 0; i < 20; i++) {
        let timei = this.$refs[`timeForm${i}`]
        if (timei) {
          timei[0] && timei[0].resetFields()
        } else {
          break
        }
      }
      this.$store.commit("setChangeTab", this.$route);
      this.$router.push("/pricing-manage/accounting-strategy");
    },
    // // 变更业务线下拉
    // changeBusiness(value) {
    //   const business = this.businessGradeList.find(v => v.value === value)
    //   this.$nextTick(() => {
    //     this.addData.typeModule = "" // 清空下级
    //     this.addData.carLevels = ""
    //     this.carLevelList = []
    //     this.prodoctLines = business.children || [] // 赋值产品线
    //   })
    // },
    // 产品线下拉
    changeProduct(val) {
      const product = this.bizTypeList.find(v => v.value === val)
      this.$nextTick(() => {
        this.addData.carLevels = "" // 清空下级
        this.carLevelList = product ? product.children || [] : [] // 赋值车型等级
      })
    },
    getCarLevelName(vals, bizType) {
      const { productCarKeyValue } = this.businessGradeName
      const names = vals.map(v => productCarKeyValue[`${bizType}#${v}`])
      return names.join(",") || ""
    },
    getProductName(val) {
      const { productKeyValue } = this.businessGradeName
      return productKeyValue[val] || ""
    },
    removeMileage(i,j) {
      this.addData.channelPriceRules[i].ruleDetails.splice(j, 1);
    },
    addMileage(i,j) {
      this.addData.channelPriceRules[i].ruleDetails.splice(j+1, 0, {...RULE_FIELD, key: Date.now()});
    }
  }
};
</script>
<style lang="less" scoped>
.accounting-add{
  .account-card{
    overflow: auto;
  }
}
.no-left-margin {
  /deep/ .ivu-form-item-content {
    margin-left: 0 !important;
  }
  &.table-item {
    margin-left: 60px !important;
    margin-top: -15px;
  }
}
.inner-input{
  display: inline-block;
}
.footer-box{
  margin-top: 20px;
  margin-left: 60%;
}
.tip-info{
  color:#bbb;
  display: inline-block;
}
.dash-line{
  border-bottom:1px dashed #ddd;
  width:95%;
  margin:auto;
  margin-bottom:20px;
}
.remove-icon{
  position: absolute;
  top:7px;
  left:390px;
  font-size: 25px;
  color:#e61f10;
  font-weight: bold;
  cursor: pointer;
}
.rel-box{
  position: relative;
}
.left20{
  padding-left: 40px;
}
.right-y{
  position: absolute;
  left:125px;
  top:0;
}
.right-box{
  margin-right: 24px;
}
</style>
