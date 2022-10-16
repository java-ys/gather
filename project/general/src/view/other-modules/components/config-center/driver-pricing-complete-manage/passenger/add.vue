<template>
  <div>
    <Modal
      v-model="visible"
      :title="title"
      width="950"
      :mask-closable="false"
      :closable="false"
    >
      <Form ref="_form" :model="addForm" :label-width="110" :rules="formRules">
        <Row>
          <Col span="12">
          <FormItem label="策略名称：" prop="ruleName">
            <Input
              v-model="addForm.ruleName"
              class="item-width"
              :maxlength="32"
              clearable
              :disabled="isPreview"
              placeholder="请输入策略名称"
            ></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="城市：" prop="cityCode">
            <Select
              v-model="addForm.cityCode"
              class="input-width item-width"
              filterable
              clearable
              :disabled="isPreview"
              @on-change="cityChange"
            >
            <Option label="全国" :value="'0'">全国</Option>
              <Option
                v-for="(item, index) in cityList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <!--  prop="areaCode" -->
          <FormItem label="区县：">
            <Select
              v-model="addForm.areaCode"
              class="input-width item-width"
              filterable
              clearable
              :disabled="isPreview"
            >
              <Option
                v-for="(item, index) in areaList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
            <!-- <span class="o-text">选填，为空则策略针对城市生效</span> -->
          </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="运营模式：" >
              {{"UP模式"}}
          </FormItem>
          </Col>
        </Row>
        <!-- <Row>
          <Col span="12">
          <FormItem label="司机类型：" prop="typeTime">
            <Select
              v-model="addForm.typeTime"
              placeholder="请选择"
              class="item-width"
              filterable
              clearable
              multiple
              :disabled="isPreview"
            >
              <Option
                v-for="(item, index) in orderTypeList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="司机工资类别：" prop="typeTime">
            <Select
              v-model="addForm.typeTime"
              placeholder="请选择"
              class="item-width"
              filterable
              clearable
              multiple
              :disabled="isPreview"
            >
              <Option
                v-for="(item, index) in orderTypeList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          </Col>

        </Row> -->
        <Row>
          <Col span="12">
          <FormItem label="业务线：" prop="expandBizLine">
            <Select
              v-model="addForm.expandBizLine"
              class="input-width item-width"
              filterable
              clearable
              :disabled="isPreview"
            >
              <Option label="全部" :value="0">全部</Option>
              <Option
                v-for="(item, index) in expandBizLineList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="产品线：" prop="bizType">
            <Select
              v-model="addForm.bizType"
              class="input-width item-width"
              filterable
              clearable
              :disabled="isPreview"
              @on-change="bizTypeChange"
            >
              <Option label="全部" :value="0" v-if="addForm.expandBizLine===0">全部</Option>
              <Option
                v-show="addForm.expandBizLine!==0"
                v-for="(item, index) in bizTypeList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="车型等级：" prop="vehicleLevel">
            <Select
              v-model="addForm.vehicleLevel"
              placeholder="请选择"
              class="item-width"
              filterable
              clearable
              :disabled="isPreview"
            >
              <Option label="全部" :value="0" v-if="addForm.expandBizLine===0">全部</Option>
              <Option
                v-show="addForm.expandBizLine!==0"
                v-for="(item, index) in carList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="订单类型：" prop="typeTimes">
            <Select
              v-model="addForm.typeTimes"
              placeholder="请选择"
              class="item-width"
              filterable
              clearable
              :disabled="isPreview"
              multiple
            >
              <Option
                v-for="(item, index) in orderTypeList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          </Col>
        </Row>
        <!-- <Row>
          <FormItem label="工作日/休息日：" prop="workRestDayType">
            <Select
              v-model="addForm.workRestDayType"
              placeholder="请选择"
              class="item-width"
              filterable
              :disabled="isPreview"
            >
              <Option
                v-for="(item, index) in dayList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Row> -->
        <Row>
          <FormItem label="策略有效期：" prop="timeRange">
            <DatePicker
              v-model="addForm.timeRange"
              type="datetimerange"
              class="item-width"
              :options="options"
              :disabled="isPreview"
              placeholder="请选择有效期"
              :editable="false"
            >
            </DatePicker>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="备注：">
            <Input
              v-model="addForm.remark"
              class="item-width-text"
              :maxlength="50"
              clearable
              type="textarea" 
              :rows="5"
              :disabled="isPreview"
              placeholder="请输入备注"
            ></Input>
          </FormItem>
        </Row>
      </Form>
      <template>
        <Divider orientation="left">策略信息</Divider>
        <div style="margin-left: 46px">
          <time-component
          v-if="visible"
            ref="_times"
            :disabled="isPreview"
            :list="detail.discountItems"
            :content="detail.content"
            :detail="detail.discountItems ? detail : detail.discountItems"
          ></time-component>
        </div>
      </template>
      <div slot="footer">
        <Button v-if="!isPreview" type="primary" :loading="submitLoading" @click="(e) => save()">
          <span>确定</span>
        </Button>
        <Button type="primary" ghost @click="(e) => cancel()">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { _getAreaInfoByCityCode } from "_g/api/general";
import { createService, saveDetailService } from "_o/api/dynamic-price";
import { freeze, tool } from "@/mixins/base";
import ModalMixin from "@/mixins/modal.js";
import TimeComponent from "../components/time.vue";
import { formRules } from "../fields";
import { dayList, orderTypeList } from "../config";
import { deepCopy } from "@/libs/tools";

/*
保存校验
①所有必填字段不得为空，且字段合法
②策略至少包含1个时段

*/
const default_params = {
  ruleName: "",
  cityCode: "",
  areaCode: "",
  expandBizLine: "",
  bizType: "",
  vehicleLevel: "",
  typeTimes: "",
  // workRestDayType: '',
  timeRange: [],
  content: {
    configs:[]
  },
  areaType:1,
  remark:"",
  uuid:""
};
const Day_Millisecond = 24 * 60 * 60 * 1000;
const YMD_Format = "YYYY-MM-DD HH:mm:ss";
export default {
  name: "add-price-strategy",
  components: {
    TimeComponent,
  },
  inject: ["getCityList", "getBizTypeList", "getExpandBizLineList"],
  mixins: [tool, ModalMixin],
  data() {
    return {
      title: "新增策略",
      submitLoading: false,
      formRules,
      addForm: deepCopy(default_params),
      dayList,
      orderTypeList,
      carList: [], // 车型
      areaList: [], // 区县
      options: freeze({
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - Day_Millisecond;
        },
      }),
    };
  },
  computed: {
    cityList() {
      return this.getCityList();
    },
    bizTypeList() {
      return this.getBizTypeList();
    },
    expandBizLineList() {
      return this.getExpandBizLineList();
    },
    isPreview({detail}) {
      return detail.isDetail
    }
  },
  watch: {
    visible(v) {
      v && this.init();
    },
    // "addForm.cityCode"(){
    //   debugger
    // }
  },
  methods: {
    init() {
      console.log(11111111,this.detail)
      if (this.detail.uuid) {
        const { effectiveTime, failureTime, discountItems, isCopy, isDetail,content } =
          this.detail;
        Object.keys(default_params).forEach((key) => {
          this.addForm[key] = this.detail[key];
        });
        // discountItems?.forEach((item) => {
        //   item.period = [item.startTime || "", item.endTime || ""];
        // });
        content.configs?.forEach((item) => {
          item.period = [item.startTime || "", item.endTime || ""];
          item.replenishRatio = item.replenishRatio
        });
        // debugger
        this.addForm.timeRange = [effectiveTime, failureTime];
        this.cityChange(this.addForm.cityCode);
        this.bizTypeChange(this.addForm.bizType);
        if (isDetail) {
          this.title = "策略详情";
        } else if (isCopy) {
          // 复制操作:
          //   除策略名称、有效期外，所有字段默认带入系统保存的值
          this.title = "编辑策略";
          // this.addForm.ruleName = "";
          // this.addForm.timeRange = [];
        } else {
          this.title = "新增策略";
        }
      }
    },
    async save() {
      const valid = await this.$refs._form.validate();
      const timeValid= await this.$refs._times.valid()
      // console.log(this.$refs._times.content.configs)
      // debugger
      // if (!valid || !timeValid) return;
      if(this.addForm.expandBizLine === 0 && this.addForm.bizType !==0 && this.addForm.vehicleLevel !== 0){
        this.addForm.bizType = null;
        this.addForm.vehicleLevel = null;
        this.$Message.error('业务线选择全部，产品线/车型等级必须更改为全部')
        return
      }
      if (!valid ) return;
      let p = this.getCommitParams();
      // const [bool, msg] = this.checkPeriodTime(p.discountItems)
      const [bool, msg] = this.checkPeriodTime(p.content.configs)
      // console.log(p)
      // console.log(p.content.configs)
      // debugger
      if(!bool) {
        this.$Message.error(msg)
        return
      }
      let handleMsg = this.detail.isCopy ? "编辑" : "新增";
      const [err, data] = await this.toResult(saveDetailService(p));
      if (err) {
        return;
      }
      this.$message.success(`${handleMsg}成功`);
      this.cancel(true);
    },
    getCommitParams() {
      const {
        ruleName,
        cityCode,
        areaCode,
        expandBizLine,
        bizType,
        vehicleLevel,
        typeTimes,
        // workRestDayType,
        timeRange,
        remark,
        areaType,
        uuid
      } = this.addForm;
      // console.log(this.addForm)
      // debugger
      return {
        ruleName,
        cityCode,
        areaCode,
        expandBizLine,
        bizType,
        vehicleLevel,
        typeTimes,
        uuid,
        // workRestDayType,
        areaType:areaCode?2:1,
        remark,
        effectiveTime: this.dateFormat(timeRange[0]),
        failureTime: this.dateFormat(timeRange[1]),
        ...this.getTimeParams(),
      };
    },
    getTimeParams() {
      let timeComponentParams = this.$refs._times.returnParams();
      // let discountItems = timeComponentParams.map((it) => {
      //   debugger
      //   const { period, acceptItemDetails } = it;
      //   return {
      //     acceptItemDetails,
      //     startTime: period[0],
      //     endTime: period[1],
      //   };
      // });
      let content = timeComponentParams.map((it) => {
        const { period,replenishRatio } = it;
        if(!it.replenishRatio){
          // this.$Message.error("请填写比率")
          // return 
          it.replenishRatio = 1
        }
        // console.log(it.replenishRatio)
        // debugger
        return {
          replenishRatio:replenishRatio?replenishRatio:1,
          startTime: period[0],
          endTime: period[1],
        };
      });
      return {
        content:{
          configs:content
        },
      };
    },
    // 时段左开右闭  不能有交集
    checkPeriodTime(list = []) {
      if(list.length < 2) return [true]
      let _periodTime = []; // 策略时间段
      list.forEach(item => {
        _periodTime.push([item.startTime.split(':').join(""), item.endTime.split(':').join("")]);
      })
      let len = list.length
      for(let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if(this.timeIntersection(_periodTime[i], _periodTime[j])) {
            return [false, '时段有重复']
          }
        }
      }
      return [true]
    },
    // 00:00:00 - 23:59:59 校验时段
    timeIntersection(date1, date2) {
      if(date1.filter(Boolean).length < 2 || date2.filter(Boolean).length < 2) {
        return false
      }
      return !(date2[1] <= date1[0] || date2[0] >= date1[1])
    },
    dateFormat(v, type = YMD_Format) {
      return this.$moment(v).format(type);
    },
    cancel(refresh) {
      // this.content.configs = []
      // console.log(this.$refs._times)
      // this.$refs._times.content.configs[0].period = []
      // this.$refs._times.content.configs[0].replenishRatio = 1
      // debugger
      this.restore();
      this.$emit("close", refresh);
      // this.$refs._form.resetFields();
    },
    restore() {
      Object.keys(default_params).forEach((key) => {
        this.addForm[key] = default_params[key];
      });
      this.$refs._form.resetFields();
    },
    bizTypeChange(value) {
      if (!value) {
        this.carList = [];
        return;
      }
      let f = this.bizTypeList.find((it) => `${it.value}` === `${value}`);
      this.carList = f?.children || [];
    },
    async cityChange(value) {
      if (!value) {
        this.areaList = [];
        this.addForm.areaCode = ''
        return;
      }
      const { list } = await _getAreaInfoByCityCode(value);
      this.areaList = list;
    },
  },
};
</script>

<style scoped lang="less">
.item-width {
  width: 320px;
}
.item-width-text {
  width: 480px;
}
.o-text {
  margin-left: 12px;
  font-size: 12px;
  color: #999;
}
</style>
