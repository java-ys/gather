
<template>
  <div>
    <Modal v-model="showModal" :title="title" width="800px">
      <Form
        ref="form"
        inline="inline"
        :model="form"
        :label-width="85"
        :rules="validateForm"
      >
        <FormItem label="策略名称:" prop="ruleName">
          {{form.ruleName}}
        </FormItem>
        <br />
        <FormItem label="业务线:" prop="expandBizLine">
          {{form.expandBizLine}}
        </FormItem>
        <br />
        <FormItem label="产品线:" prop="businessType">
          {{form.businessType}}
        </FormItem>
        <br />
        <FormItem label="车型等级:" prop="carLevel">
          {{form.carLevel}}
        </FormItem>
        <br />
        <FormItem label="城市:" prop="cityCode">
          {{cityList[form.cityCode]}}
        </FormItem>
        <br />
        <!-- 行政区划 -->
        <FormItem label="行政区类型:" prop="areaType">
          {{areaTypeMap[form.areaType]}}
        </FormItem>
        <br />
        <FormItem label="行政区:" prop="areaCode">
          {{form.areaName}}
        </FormItem>
        <br />
        <!-- 行政区划 -->
        <FormItem label="订单类型:" prop="typeTime">
          {{form.typeTime}}
        </FormItem>
        <br />
        <FormItem label="生效时间:" prop="effectiveTime">
          {{$moment(form.effectiveTime).format("YYYY-MM-DD HH:mm:ss")}}
        </FormItem>
        <br />
        <FormItem label="折扣上限:">
          {{form.cellingFare ? form.cellingFare + "元" : "未设置"}}
        </FormItem>
        <br />
        <FormItem label="星期值:" prop="discountPeriods">
          <div class="xq-title">
            <div
              v-for="(item, index) in form.discountPeriods"
              :key="index"
              :class="[item.isChecked ? 'xq-item-checked' : 'xq-item']"
              @click="checkedWeek(index)"
            >
              {{getWeekNameShow(item.week)}}
            </div>
          </div>
        </FormItem>
        <br />

        <div v-for="(item, index) in discountTime" :key="index">
          <FormItem>
            <div style="margin-top:3px">
              折扣时段{{index + 1}}&nbsp;:&nbsp;&nbsp;
              {{item.periodBegin}}&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;{{item.periodEnd}}
            </div>
            <div v-if="item.discountRate" class="mt-10">
              折扣系数&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp; {{item.discountRate}}
            </div>
            <div v-else>
              <table class="table">
                <tr>
                  <td>里程区间&nbsp;(&nbsp;公里&nbsp;)&nbsp;</td>
                  <td>折扣系数</td>
                </tr>
                <tr v-for="(yItem, yIndex) in item.mileageRules" :key="yIndex">
                  <td v-if="yIndex === item.mileageRules.length - 1">
                    {{yItem.mileStart}}以上
                  </td>
                  <td v-else>{{yItem.mileStart}}-{{yItem.mileEnd}}</td>
                  <td>{{yItem.discountRate}}</td>
                </tr>
              </table>
            </div>
            <br />
          </FormItem>
          <br />
        </div>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { getWeekName, getTypeTimeName } from "./fields";
import {getAreaInfoByCityCode} from '_o/api/configData.js'
export default {
  name: "add",
  props: ["cityList"],
  data() {
    return {
      showModal: false,
      title: "策略详情",
      form: {},
      validateForm: {
        ruleName: [{ required: true }],
        businessType: [{ required: true }],
        carLevel: [{ required: true }],
        typeTime: [{ required: true }],
        cityCode: [{ required: true }],
        effectiveTime: [{ required: true }],
        discountPeriods: [{ required: true }]
      },
      discountTime: "",
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
      this.form = {
        ruleName: val.ruleName, // 策略名称
        expandBizLine: this.getBusinessName(val.expandBizLine), // 业务类型
        businessType: this.getProductName(val.businessType), // 产品线类型
        typeTime: getTypeTimeName(val.typeTime), // 订单类型
        carLevel: this.getCarLevelName(val.carLevel, val.businessType), // 车级类型
        cityCode: val.cityCode, // 城市
        effectiveTime: val.effectiveTime, // 生效时间
        cellingFare: val.cellingFare, // 折扣上限
        discountPeriods: val.discountPeriods, // 策略明细
        areaType:val.areaType,
        areaCode:val.areaCode
      };
      getAreaInfoByCityCode({cityCode:val.cityCode}).then(res=>{
        if(res.data.success){
          let org = res.data.data.find(district=>district.orgCode===val.areaCode);
          console.log(org,"org");
          this.form = {
            ...this.form,
            areaName: org.orgName
          }
        }
      })
      this.form.discountPeriods[0].isChecked = true;
      this.discountTime = this.form.discountPeriods[0].periodRules;
    },
    checkedWeek(val) {
      this.form.discountPeriods = this.form.discountPeriods.map((item, index) => {
        if (index === val) {
          item.isChecked = true;
          this.discountTime = item.periodRules;
        } else {
          item.isChecked = false;
        }
        return item;
      });
    },
    getWeekNameShow(val) {
      let name = "";
      val.forEach(item => {
        if (name) {
          name = name + "、" + getWeekName(item);
        } else {
          name = getWeekName(item);
        }
      });
      return name;
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
.mt-10 {
  margin-top: 10px;
}
.week {
  padding: 10px;
  height: 30px;
  line-height: 13px;
  text-align: center;
  border: 1px solid #999999;
}
.table {
  margin-top: 15px;
  border: 1px solid #999999;
  border-collapse: collapse;
  td {
    border: 1px solid #999999;
    padding: 10px;
    text-align: center;
  }
}

.xq-title {
  display: flex;
  margin-right: 30px;
  .xq-item,
  .xq-item-checked {
    text-align: center;
    height: 32px;
    line-height: 12px;
    padding: 10px;
    color: #000000;
    cursor: pointer;
    margin-right: 10px;
    border-radius: 4px;
    font-weight: bold;
  }
  .xq-item {
    font-weight: bold;
    background: #ffffff;
    border: 1px solid #dcdee2;
  }
  .xq-item-checked {
    color: #ffffff;
    background: #2d8cf0;
    border: none;
  }
}
</style>

