<template>
  <div class="accounting-add">
    <Card class="account-card">
      <Form ref="addForm" class="top15" :model="addData" :rules="ruleValidate" :label-width="150">
        <div class="class-tit bottom30">基本信息</div>
        <div class="flex-box">
          <!-- 策略名称 -->
          <FormItem label="策略名称：" prop="ruleName" class="right50">
            <span v-if="isDetail" class="width200">{{addData.ruleName}}</span>
            <Input
              v-else
              v-model="addData.ruleName"
              class="width200"
              :maxlength="32"
              placeholder="请输入策略名称"
            />
          </FormItem>
          <!-- 渠道 -->
          <FormItem label="渠道：" prop="channelSource" class="right50">
            <span v-if="isDetail" class="width200">{{addData.channelSourceName}}</span>
            <Select
              v-else
              v-model="addData.channelSource"
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
          <FormItem v-if="!isDetail" label="行政区类型：" prop="districtType">
            <Select
              v-model="addData.districtType"
              placeholder="请选择"
              style="width:80px;"
            >
              <Option :value="1" >市级</Option>
              <Option :value="2" >区县级</Option>
            </Select>
          </FormItem>
          <!-- 城市 -->
          <FormItem label="城市：" prop="cityCode">
            <div v-if="isDetail" class="width200">
              <span>{{addData.cityName}}</span>
            </div>
            <Select
              v-else
              v-model="addData.cityCode"
              filterable
              clearable
              placeholder="请选择城市"
              style="width:280px;"
            >
              <Option
                v-for="item in cityList"
                :key="item.value"
                :value="item.value"
              >{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem v-if="addData.districtType == 2" label="区县：" prop="areaCode">
            <div v-if="isDetail" class="width200">
              <span>{{addData.areaName}}</span>
            </div>
            <Select
              v-else
              v-model="addData.areaCode"
              filterable
              clearable
              placeholder="请选择区县"
              style="width:280px;"
            >
              <Option
                v-for="item in areaList"
                :key="item.value"
                :value="item.value"
              >{{item.label}}</Option>
            </Select>
          </FormItem>
        </div>
        <div>
          <FormItem label="司机类型：" prop="driverTypes">
            <div v-if="isDetail" class="width200">
              <span>{{addData.driverTypeNames}}</span>
            </div>
            <Select
              v-else
              v-model="addData.driverTypes"
              filterable
              clearable
              multiple
              placeholder="请选择"
              style="width:280px;"
            >
              <Option
                v-for="item in salaryTypeList"
                :key="item.value"
                :value="item.value"
              >{{item.label}}</Option>
            </Select>
          </FormItem>
        </div>
        <!-- 有效时间 -->
        <FormItem label="有效时间：" prop="effectiveTime">
          <span v-if="isDetail">{{addData.effectiveTime.join(" 至 ")}}</span>
          <el-date-picker
            v-else
            v-model="addData.effectiveTime"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :clearable="false"
            :editable="false"
            size="small"
            style="width: 400px"
            align="left"
            range-separator="至"
            value-format="yyyy-MM-dd"
            @change="validItem('effectiveTime')"
          />
        </FormItem>
        <div class="class-tit bottom30">策略信息</div>
        <Form
          v-for="(item,index) in addData.itemList"
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
            <Icon v-if="addData.itemList.length > 1 && !isDetail" class="remove-icon" type="ios-remove-circle-outline" @click="removeTime(index)" />
          </div>
          <!-- 是否使用动态折扣 -->
          <div class="flex-box left20">
            <FormItem label="受动态折扣影响：" prop="useDynamicDiscount">
              <span v-if="isDetail">{{item.useDynamicDiscount == 1 ? '是' : '否'}}</span>
              <RadioGroup v-else v-model="item.useDynamicDiscount" class="width200">
                <Radio :label="1" disabled checked style="margin-right:15px;">是</Radio>
                <Radio :label="0" disabled>否</Radio>
              </RadioGroup>
            </FormItem>
            <!-- 是否使用渠道折扣 -->

            <FormItem key="useChannelDiscount" label="受渠道折扣影响：" prop="useChannelDiscount">
              <span v-if="isDetail">{{item.useChannelDiscount == 1 ? '是' : '否'}}</span>
              <RadioGroup
                v-else
                v-model="item.useChannelDiscount"
                style="width:300px" 
              >
                <Radio :label="1" :disabled="isDetail" style="margin-right:15px;">是</Radio>
                <Radio :label="0" :disabled="isDetail">否</Radio>
              </RadioGroup>
            </FormItem>
          </div>
          <div v-if="item.useChannelDiscount==1" class="flex-box left20">
            <FormItem
              key="itemList"
              label="渠道折扣策略id："
              prop="itemList"
              class="right30 inner-input"
            >
              <span v-if="isDetail">{{item.bindChannelDiscounts.map(v => v.channelDiscountName).join(',')}}</span>
              <Select
                v-else
                v-model="item.bindChannelDiscounts"
                filterable
                clearable
                multiple
                :disabled="disableStrategySelect"
                :placeholder="disableStrategySelect?'请先选择城市和渠道':'请选择'"
                style="width:280px;"
              >
                <Option
                  v-for="v in strategyList"
                  :key="v.value"
                  :value="v.value"
                >{{v.label}}</Option>
              </Select>
            </FormItem>
          </div>
          <div class="dash-line"></div>
        </Form>
        <Button v-if="!isDetail && addData.itemList.length < 20" type="primary" size="small" style="margin:0 0 20px 75px;" @click="addTimeItem">添加时间段</Button>
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
import { hasTimesection } from "@/libs/tools.js";
import { getOnLineCity } from "_g/api/common.js"
import {
  handleTypeMap,
  ruleValidate
} from "./fields";
import {
  querySalaryDriverTypes,
  queryChannelList,
  queryStrategyDetail,
  queryStrategyList,
  postStrategy,
  patchStrategy,
  getAreaInfoByCityCode,
} from "_o/api/configData";
import { parmMap } from '../../../short-message-center/businessMessage/push/fields';


export default {
  name: "strategy-form",
  data() {
    return {
      channelList: [],
      handleType: Number(this.$route.query.type),
      uuid: this.$route.params.uuid,
      addData: {
        districtType: 1,
        ruleName: "",
        channelSource: "",
        cityCode: "",
        effectiveTime: [],
        driverTypes: [],
        itemList: [
          {
            time: ["00:00:00", "23:59:59"],
            bindChannelDiscounts: [],
            endTime: "",
            startTime: "",
            useChannelDiscount: "",
            useDynamicDiscount: 1,
          }
        ]
      },
      cityList: [],
      areaList: [],
      salaryTypeList: [], // 工资类别
      strategyList: [],
      addLoading: false,
      // prodoctLines: [], // 产品线
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
    // 是否是详情
    isDetail() {
      return this.handleType === 3;
    },
    isAdd() {
      return this.handleType === 1;
    },
    disableStrategySelect() {
      const data = this.addData;
      if(!data.cityCode || data.channelSource === "") {
        data.itemList.forEach(v => v.bindChannelDiscounts = []);
        return true;
      }
      this.updateStrategyList();
      return false;
    },
    ruleValidate() {
      return this.isDetail ? null : ruleValidate;
    }
  },
  watch: {
    'addData.cityCode'(v) {
      if(v) {
        this.updateAreas(v);
        const city = this.cityList.find(o => o.value == v);
        this.addData.cityName = city ? city.label : "";
      }
    },
    'addData.districtType'(v) {
      const {addData} = this;
      if(v === 1) addData.areaCode = addData.areaName = "";
    },
    'addData.areaCode'(v) {
      const {addData} = this;
      if(v) {
        const area = this.areaList.find(o => o.value == v);
        addData.areaName = area ? area.label : "";
      } else {
        addData.areaName = "";
      }
    },
  },
  created() {
    this.updateChannelList();
    this.updateSalaryDriverTypes();
  },
  mounted() {
    this.getCityList()
    this.getDetailInfo(this.uuid);
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
        let itemList = this.addData.itemList
        // let temp = true
        let num = 0
        for (let i = 0; i < itemList.length; i++) {
          let it = itemList[i].time
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
    this.ruleValidate.time.splice(2, 1, { required: true, validator: timeValid, trigger: "change" })
  },
  methods: {
    timeListChange(index) {
      this.addData.itemList.forEach((item, i) => {
        this.$refs[`timeForm${i}`][0].validateField("time")
      })
    },
    removeTime(index) {
      this.addData.itemList.splice(index, 1)
    },
    addTimeItem() {
      this.addData.itemList.push({
        time: [],
        bindChannelDiscounts: [],
        endTime: "",
        startTime: "",
        useChannelDiscount: "",
        useDynamicDiscount: 1,
      })
    },
    getCityList() {
      getOnLineCity().then(res => {
        if(!res.data.success) return;
        this.cityList = (res.data.data || []).map(item => ({
          label: item.city,
          value: item.cityId
        }));
      })
    },
    updateAreas(val) {
      getAreaInfoByCityCode({ cityCode: val }).then(res => {
        if(!res.data.success) return;
        this.areaList = (res.data.data || []).map(it => ({
          label: it.orgName,
          value: it.orgCode
        }));
      });
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
      queryStrategyDetail({
        uuid: uuid
      }).then(res => {
        const data = res.data.data || {}
        data.effectiveTime = [data.effectiveTime, data.failureTime];
        data.itemList.forEach(item => {
          item.time = [item.startTime, item.endTime];
          item.useDynamicDiscount = typeof item.useDynamicDiscount != 'undefined' ? item.useDynamicDiscount : 1;
          if(!this.isDetail) item.bindChannelDiscounts = item.bindChannelDiscounts.map(v => v.channelDiscountId);
        })
        data.districtType = data.areaCode ? 2 : 1;
        this.addData = data;
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
      this.addData.itemList.forEach((item, index) => {
        let key = "timeForm" + index;
        this.$refs[key][0].validate().then(status => {
          if (!status) {
            timeValid = false;
          }
        });
        if(item.useChannelDiscount !== 1) item.bindChannelDiscounts = [];
      });
      if (addFormValid && timeValid) {
        // 数据格式重写
        let that = this;
        let params = JSON.parse(JSON.stringify(this.addData))
        if (this.handleType === 2) params.uuid = this.uuid;

        // 3.有效时间数组拆分成startTime和endTime
        const [start, end] = params.effectiveTime;
        const discounts = this.strategyList.reduce((res,v) => (res[v.value] = v.label, res), {});
        params.effectiveTime = this.$moment(start).format("YYYY-MM-DD HH:mm:ss")
        params.failureTime = this.$moment(end).format("YYYY-MM-DD HH:mm:ss")
        delete params.districtType;

        params.itemList.forEach(item => {
          item.startTime = item.time[0]
          item.endTime = item.time[1]
          item.bindChannelDiscounts = item.bindChannelDiscounts.map(v => ({channelDiscountName: discounts[v], channelDiscountId: v}));
          delete item.time
        })

        this.axiosSubmit(params)
      }
    },
    // 发送保存请求
    axiosSubmit(params) {
      let axiosFun = this.isAdd ? postStrategy : patchStrategy;
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
      this.$router.push({name: "driver-waterflow-strategy-manage"});
    },
    updateChannelList() {
      queryChannelList().then(res => {
        if(!res.data.success) return;
        this.channelList = (res.data.data || []).map(v => ({
          label: v.sourseName,
          value: v.sourseValue
        }))
      })
    },
    // 初始司机工资类别
    updateSalaryDriverTypes() {
      querySalaryDriverTypes().then(res => {
        if (!res.data.success) return;
        this.salaryTypeList = (res.data.data.driverTypeDtos || []).map(item => ({
          label: item.desc,
          value: item.driverType
        }));
      });
    },
    updateStrategyList() {
      const data = this.addData;
      queryStrategyList({
        channelCode: data.channelSource,
        cityCode: data.cityCode,
        channelStatus: 0
      }).then(res => {
        if (!res.data.success) return;
        this.strategyList = (res.data.data.list || []).map(v => ({label: v.channelStrategyName, value: v.uuid}))
      })
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
