<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-08 13:47:08
 * @LastEditTime: 2021-11-24 17:19:10
 * @Description: 新增表单弹窗
-->
<template>
  <Form ref="form" :model="formData" :label-width="120" :rules="formRules">
    <div class="form-item flex">
      <FormItem label="策略名称" prop="ruleName">
        <Input v-model="formData.ruleName" placeholder="请输入策略名称"></Input>
      </FormItem>
      <FormItem label="所选城市" prop="provinceCityCode">
        <Cascader
          v-model="formData.provinceCityCode"
          :data="cityList"
          placeholder="请选择城市"
          trigger="hover"
          filterable
          style="width: 200px; display: inline-block"
        ></Cascader>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="业务线" prop="expandBizLine">
        <Select
          v-model="formData.expandBizLine"
          @on-change="handleChangeBusiness"
        >
          <Option
            v-for="(item, index) in businessList"
            :key="index"
            :value="item.value"
          >
            {{item.label}}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="产品线" prop="bizType">
        <Select v-model="formData.bizType" @on-change="handleChangeProduct">
          <Option
            v-for="item in productList"
            :key="item.bizType"
            :value="item.bizType"
          >
            {{item.bizTypeName}}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="车型等级" prop="carLevels">
        <Select v-model="formData.carLevels" multiple>
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
    <div class="form-item flex">
      <FormItem label="渠道" prop="source">
        <Select v-model="formData.source" style="width: 200px" filterable>
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
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder=""
          style="width: 200px"
        ></DatePicker>
      </FormItem>
    </div>

    <div class="form-item flex">
      <FormItem label="改派时间限制" prop="reassignTimeRestriction">
        <InputNumber v-model="formData.reassignTimeRestriction"></InputNumber>
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
        <InputNumber v-model="formData.responsibleReassignTime"></InputNumber>
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
              placeholder="改派费（元）"
              :min="0"
            ></InputNumber>
          </FormItem>
        </div>
      </div>
      <div class="delete-icon">
        <Icon
          v-if="index > 0"
          type="md-close-circle"
          size="24"
          @click="deletePeriod(item, index)"
        />
      </div>
    </div>

    <FormItem>
      <Button type="primary" @click="addPeriod">新增有责改派时间段</Button>
    </FormItem>
    <div class="form-item" style="display: inline-block;">
      <FormItem class="connect-item" label="无责改派" prop="irresponsibleReassignTime">
        直接派单阶
        <InputNumber v-model="formData.irresponsibleReassignTime"></InputNumber>
        分钟内发起改派申请，为无责改派。
      </FormItem>

      <FormItem class="connect-item" :label-width="0" prop="responsibleReassignFee">
        否则收取改派费用
        <InputNumber v-model="formData.responsibleReassignFee"></InputNumber>
        元
      </FormItem>
    </div>

    <div class="form-item flex">
      <FormItem label="每日改派次数上限" prop="reassignTimes">
        <InputNumber v-model="formData.reassignTimes"></InputNumber>
        次
      </FormItem>
    </div>

    <div class="form-item form-button">
      <Button type="primary" @click="handleSubmit">确定</Button>
      <Button style="margin-left: 8px" @click="handleCancel">取消</Button>
    </div>
  </Form>
</template>

<script>
import { mapState } from "vuex";
import { createReassignStrategy } from "_o/api/airportPickUp.js";
import editMixin from "./edit.mixins";
import { effectiveTime } from "../../validate"
import crossRangeMixin from "./crossRange.mixins"
export default {
  mixins: [editMixin, crossRangeMixin],
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
        ruleName: [
          { required: true, message: "策略名称不能为空", trigger: "blur" }
        ],
        provinceCityCode: [
          {
            type: "array",
            required: true,
            message: "请选择城市",
            trigger: "change"
          }
        ],
        expandBizLine: [
          {
            type: "number",
            required: true,
            message: "请选择业务线",
            trigger: "change"
          }
        ],
        bizType: [
          {
            type: "number",
            required: true,
            message: "请选择产品线",
            trigger: "change"
          }
        ],
        carLevels: [
          {
            type: "array",
            required: true,
            message: "请选择车型等级",
            trigger: "change"
          }
        ],
        source: [
          {
            type: "number",
            required: true,
            message: "请选择渠道",
            trigger: "change"
          }
        ],
        effectiveTime: [
          {
            type: "date",
            required: true,
            message: "生效时间不能为空",
            trigger: "change"
          },
          { validator: effectiveTime, trigger: "change" }
        ],
        reassignTimeRestriction: [
          {
            type: "number",
            required: true,
            message: "改派时间限制不能为空",
            trigger: "blur"
          }
        ],
        responsibleReassignTime: [
          {
            type: "number",
            required: true,
            message: "有责改派限制不能为空",
            trigger: "blur"
          }
        ],
        irresponsibleReassignTime: [
          {
            type: "number",
            required: true,
            message: "无责改派限制不能为空",
            trigger: "blur"
          }
        ],
        responsibleReassignFee: [
          {
            type: "number",
            required: true,
            message: "超时收费不能为空",
            trigger: "blur"
          }
        ],
        reassignTimes: [
          {
            type: "number",
            required: true,
            message: "每日改派次数上限不能为空",
            trigger: "blur"
          }
        ]
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
      businessGradeList: state => state.common.businessGradeList
    }),
    businessList() {
      // 业务线： 过滤接送机业务线
      const list = this.businessGradeList.filter(v => v.expandBizLine === 8 || v.expandBizLine === 9);
      return list;
    }
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
    handleChangeBusiness(val) {
      const business = this.businessList.find(v => v.value === val);
      this.$nextTick(() => {
        this.productList = business.children;
        // 清空数据
        this.formData.bizType = "";
        this.formData.carLevels = [];
        this.carLevelList = [];
      });
    },
    handleChangeProduct(val) {
      const product = this.productList.find(v => v.bizType === val);
      this.$nextTick(() => {
        this.carLevelList = product.levels;
        // 清空数据
        this.formData.carLevels = [];
      });
    },
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const crossStatus = await this.handleRangeValidate()
          if (!crossStatus) return
          const [proviceCode, cityCode] = this.formData.provinceCityCode;
          const {
            reassignTimeRestriction,
            responsibleReassignTime,
            responsibleReassignFee,
            airportOrderReassignPeriods,
            irresponsibleReassignTime,
            reassignTimes,
            carLevels
          } = this.formData;
          const params = {
            ...this.formData,
            cityCode,
            proviceCode,
            airportOrderReassignRestriction: {
              reassignTimeRestriction,
              responsibleReassignTime,
              responsibleReassignFee,
              airportOrderReassignPeriods,
              irresponsibleReassignTime,
              reassignTimes,
              carLevels
            }
          }; // 傻逼增加层级
          this.handleCreate(params);
        }
      });
    },
    handleCancel() {
      this.$refs.form.resetFields();
      this.$emit("close");
    },
    // 删除改派时间段
    deletePeriod(item, index) {
      this.formData.airportOrderReassignPeriods.splice(
        index,
        1
      );
    },
    // 新增改派时间段
    addPeriod() {
      this.formData.airportOrderReassignPeriods.push({
        periodBegin: null,
        periodEnd: null,
        reassignFee: null
      });
    },
    // 创建保存
    async handleCreate(params) {
      try {
        this.$Spin.show();
        const res = await createReassignStrategy(params);
        const { success, msg } = res.data;
        this.$Spin.hide();
        if (success) {
          this.$Message.success("保存成功");
          this.$refs.form.resetFields();
          this.$emit("update");
        } else {
          this.$Message.error(msg);
        }
      } catch (error) {
        this.$Spin.hide();
      }
    }
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
