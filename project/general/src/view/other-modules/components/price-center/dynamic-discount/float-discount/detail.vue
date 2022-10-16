
<template>
  <div>
    <Modal v-model="showModal" :title="title" width="800" draggable>
      <Form
        ref="form"
        inline="inline"
        :model="form"
        :label-width="85"
        :rules="validateForm"
      >
        <FormItem label="策略名称:" prop="strategyName">
          {{form.strategyName}}
        </FormItem>
        <br />
        <FormItem label="业务线:" prop="serviceType">
          {{form.expandBizLine}}
        </FormItem>
        <br />
        <FormItem label="产品线:" prop="serviceType">
          {{form.serviceType}}
        </FormItem>
        <br />
        <FormItem label="车型等级:" prop="carLevel">
          {{form.carLevel}}
        </FormItem>
        <br />
        <FormItem label="城市:" prop="cityName">
          {{form.cityName}}
        </FormItem>
        <br />
        <!-- 行政区划 -->
        <FormItem label="行政区类型:" prop="areaType">
          {{areaTypeMap[form.areaType]}}
        </FormItem>
        <br />
        <template v-if="form.areaName">
          <FormItem label="行政区:" prop="areaCode">
            {{form.areaName}}
          </FormItem>
        <br />
        </template>
        <!-- 行政区划 -->
        <FormItem label="生效时间:" prop="effectDate">
          <DatePicker
            v-model="form.effectDate"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            placement="bottom-end"
            placeholder="请选择生效时间"
            style="width: 260px"
            @on-change="selectDate"
          ></DatePicker>
        </FormItem>
        <br />

        <div v-for="(item, index) in form.strategyInfoVoList" :key="index">
          <FormItem :label="'策略明细' + (index + 1) + ':'">
            <div style="margin-top:20px">
              时间段:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{item.startTime}}-{{item.endTime}}
            </div>
            <div class="mt-10">
              应答率:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{item.resRateFrom}}&nbsp;%&nbsp;<Checkbox
                v-model="item.resRateFromInclude"
                disabled
              >
                包含
              </Checkbox>&nbsp;&nbsp;&nbsp;至 {{item.resRateTo}}&nbsp;%&nbsp;<Checkbox
                v-model="item.resRateToInclude"
                disabled
              >
                包含
              </Checkbox>
            </div>
            <div class="mt-10">
              最低呼叫数:&nbsp;&nbsp;&nbsp; {{item.minNum}}
            </div>
            <div class="mt-10">浮动折扣系数: {{item.rate}}</div>
            <div class="mt-10">加价系数上限: {{item.markupRateTo}}%</div>
            <div class="mt-10">加价封顶金额: {{item.markupFareTo}}元</div>
          </FormItem>
          <br />
        </div>

        <br />
      </Form>
      <div slot="footer">
        <Button @click="showModal = false">取消</Button>
        <Button v-lazy-click="saveData" type="primary">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getServiceTypeName, validatorTimeDetail, getcarLevelName } from "./fields";
import { floatEdit } from "_o/api/priceCenter";
import { mapState, mapGetters } from "vuex"
import {getAreaInfoByCityCode} from '_o/api/configData.js'

export default {
  name: "add",
  props: ["cityList"],
  data() {
    return {
      showModal: false,
      uuid: "",
      title: "策略详情",
      form: {
        strategyName: "fdsfdsfd", // 策略名称
        expandBizLine: "", // 业务线
        serviceType: "", // 产品线。只能选择一项
        cityName: "", // 城市编码
        effectDate: [], // 生效时间
        carLevel: [], // 车型等级
        strategyInfoVoList: [
          {
            dateTime: [],
            resRateFrom: "",
            resRateFromInclude: false,
            resRateTo: "",
            resRateToInclude: false,
            minNum: "",
            rate: ""
          }
        ] // 策略明细
      },
      validateForm: {
        strategyName: [{ required: true }],
        serviceType: [{ required: true }],
        cityName: [{ required: true }],
        carLevel: [{ required: true }],
        effectDate: [{ required: true, validator: validatorTimeDetail }]
      },
      areaTypeMap:{
        1:"市级",
        2:"区县级"
      }
    };
  },
  computed: {
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    })
  },
  methods: {
    init(val) {
      this.showModal = true;
      this.uuid = val.strategyUuid;
      this.form = {
        expandBizLine: this.getBusinessName(val.expandBizLine),
        strategyName: val.strategyName, // 策略名称
        serviceType: this.getProductName(val.serviceType), // 业务类型
        carLevel: this.getCarLevelName(val.carLevel, val.serviceType), // 车级类型
        cityName: val.cityName, // 城市
        effectDate: [val.effectiveTimeBegin, val.effectiveTimeEnd], // 生效时间
        strategyInfoVoList: val.strategyInfoVoList, // 策略明细
        areaType:val.areaType
      };
      getAreaInfoByCityCode({cityCode:val.cityCode}).then(res=>{
        if(res.data.success){
          let org = res.data.data.find(district=>district.orgCode===val.areaCode);
          this.form = {
            ...this.form,
            areaName: org.orgName
          }
        }
      })
    },
    selectDate(date) {
      this.form.effectDate = date;
    },
    saveData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.effectDate[0]) {
            this.$Message.warning("请选择生效时间");
          } else {
            this.editData();
          }
        }
      });
    },
    addDetail() {
      this.form.strategyInfoVoList.push({
        dateTime: [],
        resRateFrom: "",
        resRateFromInclude: false,
        resRateTo: "",
        resRateToInclude: false,
        minNum: "",
        rate: ""
      });
    },

    editData() {
      let params = {
        effectiveTimeBegin: this.form.effectDate[0],
        effectiveTimeEnd: this.form.effectDate[1],
        uuid: this.uuid
      };
      floatEdit(params).then(res => {
        this.showModal = false;
        this.$emit("reload");
        this.$Message.success(res.data.msg);
      });
    },

    getCarLevelName(val, bizType) {
      const { productCarKeyValue } = this.businessGradeName
      return productCarKeyValue[`${bizType}#${val}`] || ""
    },
    getProductName(val) {
      const { productKeyValue } = this.businessGradeName
      return productKeyValue[val] || ""
    },
    getBusinessName(val) {
      const { businessKeyValue } = this.businessGradeName
      return businessKeyValue[val] || ""
    }
  }
};
</script>
<style lang="less" scoped>
.mr-20 {
  margin-right: 20px;
}
.mt-10 {
  margin-top: 10px;
}
</style>

