
<template>
  <div>
    <Modal v-model="showModal" :title="title" width="800px">
      <Form
        inline="inline"
        :model="form"
        :label-width="85"
        :rules="validateForm"
        ref="form"
      >
        <FormItem label="策略名称:" prop="ruleName">
          {{ form.ruleName }}
        </FormItem>
        <br />
        <FormItem label="产品线:" prop="businessType">
          {{ form.businessType }}
        </FormItem>
        <br />
        <FormItem label="城市:" prop="cityName">
          {{ form.cityName }}
        </FormItem>
        <br />
        <FormItem label="生效时间:" prop="effectiveTime">
          {{ $moment(form.effectiveTime).format("YYYY-MM-DD HH:mm:ss") }}
        </FormItem>
        <br />
        <FormItem label="折扣上限:">
          {{ form.cellingFare ? form.cellingFare + "元" : "未设置" }}
        </FormItem>
        <br />
        <FormItem label="星期值:" prop="discountPeriods">
          <div class="xq-title">
            <div
              :class="[item.isChecked ? 'xq-item-checked' : 'xq-item']"
              v-for="(item, index) in form.discountPeriods"
              :key="index"
              @click="checkedWeek(index)"
            >
              {{ getWeekNameShow(item.week) }}
            </div>
          </div>
        </FormItem>
        <br />

        <div v-for="(item, index) in discountTime" :key="index">
          <FormItem>
            <div style="margin-top: 3px">
              折扣时段{{ index + 1 }}&nbsp;:&nbsp;&nbsp;
              {{ item.periodBegin }}&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;{{
                item.periodEnd
              }}
            </div>
            <div class="mt-10" v-if="item.discountRate">
              折扣系数&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp; {{ item.discountRate }}
            </div>
            <div v-else>
              <table class="table">
                <tr>
                  <td>里程区间&nbsp;(&nbsp;公里&nbsp;)&nbsp;</td>
                  <td>折扣系数</td>
                </tr>
                <tr v-for="(yItem, yIndex) in item.mileageRules" :key="yIndex">
                  <td v-if="yIndex === item.mileageRules.length - 1">
                    {{ yItem.mileStart }}以上
                  </td>
                  <td v-else>{{ yItem.mileStart }}-{{ yItem.mileEnd }}</td>
                  <td>{{ yItem.discountRate }}</td>
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
import { getServiceTypeName, getWeekName } from "./fields";

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
        cityName: [{ required: true }],
        effectiveTime: [{ required: true }],
        discountPeriods: [{ required: true }],
      },
      discountTime: "",
    };
  },
  methods: {
    init(val) {
      this.showModal = true;
      this.form = {
        ruleName: val.ruleName, //策略名称
        businessType: getServiceTypeName(val.businessType), //业务类型
        cityName: val.cityName, //城市
        effectiveTime: val.effectiveTime, //生效时间
        cellingFare: val.cellingFare, //折扣上限
        discountPeriods: val.discountPeriods, //策略明细
      };
      this.form.discountPeriods = JSON.parse(val.content);
      this.form.discountPeriods[0].isChecked = true;
      this.discountTime = this.form.discountPeriods[0].periodRules;
    },
    checkedWeek(val) {
      this.form.discountPeriods = this.form.discountPeriods.map(
        (item, index) => {
          if (index === val) {
            item.isChecked = true;
            this.discountTime = item.periodRules;
          } else {
            item.isChecked = false;
          }
          return item;
        }
      );
    },
    getWeekNameShow(val) {
      let name = "";
      val.forEach((item) => {
        if (name) {
          name = name + "、" + getWeekName(item);
        } else {
          name = getWeekName(item);
        }
      });
      return name;
    },
  },
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


