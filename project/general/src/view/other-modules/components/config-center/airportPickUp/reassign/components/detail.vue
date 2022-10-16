<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-08 13:47:08
 * @LastEditTime: 2021-11-22 14:46:56
 * @Description: 新增表单弹窗
-->
<template>
  <Form ref="form" :model="formData" :label-width="120" :rules="formRules">
    <div class="form-item flex">
      <FormItem label="策略名称" prop="ruleName">
        <Input v-model="formData.ruleName" placeholder="请输入策略名称"></Input>
      </FormItem>
      <FormItem label="所选城市" prop="provinceCityCode">
        <div>{{formData.cityName}}</div>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="业务线" prop="expandBizLine">
        <div>{{filterBusinessName(formData.expandBizLine)}}</div>
      </FormItem>
      <FormItem label="产品线" prop="bizType">
        <div>{{filterBizName(formData.bizType)}}</div>
      </FormItem>
      <FormItem label="车型等级" prop="carLevels">
        <div>{{filterCarLevelName(formData.carLevels, formData.bizType)}}</div>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="渠道" prop="source">
        <Select v-model="formData.source" disabled style="width: 200px">
          <Option
            v-for="(item, index) in channelList"
            :key="index"
            :value="item.value"
          >
            {{item.label}}
          </Option>
        </Select>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="生效时间" prop="effectiveTime">
        <DatePicker
          v-model="formData.effectiveTime"
          :options="DatePickerOption"
          disabled
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder=""
          style="width: 200px"
        ></DatePicker>
      </FormItem>
    </div>

    <div class="form-item flex">
      <FormItem label="改派时间限制" prop="reassignTimeRestriction">
        <InputNumber v-model="formData.reassignTimeRestriction" disabled></InputNumber>
        分钟
        <div class="tip flex">
          <Icon
            type="ios-alert-outline"
          />司机可在预约用车时间前至少N分钟前，发起改派申请
        </div>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="有责改派" prop="responsibleReassignTime">
        <InputNumber v-model="formData.responsibleReassignTime" disabled></InputNumber>
        分钟
        <div class="tip flex">
          <Icon
            type="ios-alert-outline"
          />司机在距离预约用车时间N分钟内发起改派申请，为有责改派
        </div>
      </FormItem>
    </div>

    <div
      v-for="(item, index) in formData.airportOrderReassignPeriods"
      :key="index"
      class="playlist flex"
    >
      <div class="playlist-content">
        <div class="form-item" style="display: inline-block;">
          <FormItem
            label="改派时间段"
            class="connect-item"
            :prop="'airportOrderReassignPeriods.' + index + '.periodBegin'"
            :rules="{
              type: 'number',
              required: true,
              message: '改派时间段不能为空',
              trigger: 'blur'
            }"
          >
            <InputNumber
              v-model="item.periodBegin"
              disabled
              style="width: 100px"
              placeholder=""
              :min="0"
            ></InputNumber>
            至
          </FormItem>
          <FormItem
            :label-width="0"
            class="connect-item"
            :prop="'airportOrderReassignPeriods.' + index + '.periodEnd'"
            :rules="{
              type: 'number',
              required: true,
              message: '改派时间段不能为空',
              trigger: 'blur'
            }"
          >
            <InputNumber
              v-model="item.periodEnd"
              disabled
              style="width: 100px"
              :min="0"
              placeholder=""
            ></InputNumber>
            分钟
          </FormItem>
          <FormItem
            label="改派费（元）"
            :prop="'airportOrderReassignPeriods.' + index + '.reassignFee'"
            :rules="{
              type: 'number',
              required: true,
              message: '改派费不能为空',
              trigger: 'blur'
            }"
          >
            <InputNumber
              v-model="item.reassignFee"
              disabled
              placeholder="改派费（元）"
              :min="0"
            ></InputNumber>
          </FormItem>
        </div>
      </div>
      <!-- <div class="delete-icon">
        <Icon
          v-if="index > 0"
          type="md-close-circle"
          size="24"
          @click="deletePeriod(item, index)"
        />
      </div> -->
    </div>

    <!-- <FormItem>
      <Button type="primary" @click="addPeriod">新增有责改派时间段</Button>
    </FormItem> -->
    <div class="form-item" style="display: inline-block;">
      <FormItem class="connect-item" label="无责改派" prop="irresponsibleReassignTime">
        直接派单阶
        <InputNumber v-model="formData.irresponsibleReassignTime" disabled></InputNumber>
        分钟内发起改派申请，为无责改派。
      </FormItem>

      <FormItem class="connect-item" :label-width="0" prop="responsibleReassignFee">
        否则收取改派费用
        <InputNumber v-model="formData.responsibleReassignFee" disabled></InputNumber>
        元
      </FormItem>
    </div>

    <div class="form-item flex">
      <FormItem label="每日改派次数上限" prop="reassignTimes">
        <InputNumber v-model="formData.reassignTimes" disabled></InputNumber>
        次
      </FormItem>
    </div>

    <div class="form-item form-button">
      <!-- <Button type="primary" @click="handleSubmit">确定</Button> -->
      <Button style="margin-left: 8px" @click="handleCancel">取消</Button>
    </div>
  </Form>
</template>

<script>
import { mapState } from "vuex";
import detailMixin from "./detail.mixins";
import commontMixin from "../../common.mixins";
export default {
  mixins: [detailMixin, commontMixin],
  props: {
    cityList: {
      type: Array,
      default: () => []
    },
    uuid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      DatePickerOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      formRules: {
      },
      formData: {
        ruleName: "",
        provinceCityCode: [],
        provinceCode: "",
        cityCode: "",
        expandBizLine: "",
        bizType: "",
        carLevels: "",
        source: "",
        effectiveTime: "",
        reassignTimeRestriction: null, // airportOrderReassignRestriction
        responsibleReassignTime: null, // airportOrderReassignRestriction
        responsibleReassignFee: null, // airportOrderReassignRestriction
        airportOrderReassignPeriods: [
          {
            periodBegin: null,
            periodEnd: null,
            reassignFee: null
          }
        ], // airportOrderReassignRestriction
        irresponsibleReassignTime: null, // airportOrderReassignRestriction
        reassignTimes: null // airportOrderReassignRestriction
      },
      productList: [], // 产品线
      carLevelList: [] // 车型等级
    };
  },
  computed: {
    ...mapState({
      channelList: state => state.common.channel,
    }),
  },
  watch: {
    uuid: {
      handler: function(val) {
        if (val) {
          this.getDetail(val);
        }
      },
      immediate: true
    }
  },
  methods: {
    handleCancel() {
      this.$refs.form.resetFields();
      this.$emit("close");
    },
  }
};
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
}
.form-button {
  justify-content: flex-end;
  text-align: right;
}
.form-item {
  width: 100%;
  .ivu-form-item {
    flex: 1;
  }
  .add-button {
    margin-bottom: 24px;
  }
  .ivu-form-item-content {
    display: flex;
    align-items: center;
  }
  .tip {
    margin-left: 16px;
    color: #999999;
  }
}
.delete-icon {
  width: 24px;
  height: 24px;
  margin-left: 16px;
  margin-bottom: 24px;
  .ivu-icon {
    cursor: pointer;
  }
}
.playlist {
  justify-content: space-between;
  .playlist-content {
    flex: 1;
    margin-right: 16px;
    border: 1px dotted #2d8cf0;
    margin-bottom: 8px;
    padding-top: 24px;
  }
}
.connect-item {
  display: inline-block;
}
</style>
<style lang="less">
.form-item {
  .ivu-input-wrapper {
    width: 200px;
  }
  .ivu-form-item-content {
    display: flex;
    align-items: center;
  }
}
</style>
