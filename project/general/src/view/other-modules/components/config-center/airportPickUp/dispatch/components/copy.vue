<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-08 13:47:08
 * @LastEditTime: 2021-11-18 17:18:26
 * @Description: 新增表单弹窗
-->
<template>
  <Form
    ref="dispatchForm"
    :model="formData"
    :rules="formRules"
    :label-width="120"
  >
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
      <FormItem label="业务线" prop="extendBizType">
        <Select
          v-model="formData.extendBizType"
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
      <FormItem label="产品线" prop="businessType">
        <Select
          v-model="formData.businessType"
          @on-change="handleChangeProduct"
        >
          <Option
            v-for="item in productList"
            :key="item.bizType"
            :value="item.bizType"
          >
            {{item.bizTypeName}}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="车型等级" prop="carLevelList">
        <Select v-model="formData.carLevelList" multiple>
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
        <Select v-model="formData.source" filterable>
          <Option
            v-for="(item, index) in channelList"
            :key="index"
            :value="item.value"
          >
            {{item.label}}
          </Option>
        </Select>
      </FormItem>

      <FormItem label="订单类型" prop="typeTime">
        <Select v-model="formData.typeTime">
          <Option
            v-for="(item, index) in orderTypes"
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
      <FormItem label="司机资格">
        <Checkbox v-model="formData.mutexFilterTags">
          是否必须是双证司机
        </Checkbox>
      </FormItem>
    </div>
    <div class="form-item limit-content">
      <p>优质播单首轮时间范围为优质播单、全城播单、直接派单以及人工派单的最大值。</p]>
      <p>  优质播单、全城播单、直接派单以及人工派单从上到下，时间范围必须相互衔接无重叠。</p>
    </div>
    <!-- 优质播单 -->
    <div class="form-item flex">
      <div class="column-title">优质播单</div>
    </div>

    <div class="playlist">
      <div
        v-for="(item, index) in formData.highDispatch"
        :key="index"
        class="playlist-item flex"
      >
        <div class="playlist-content">
          <div v-if="index === 0" class="form-item flex">
            <FormItem
              label="时间范围"
              :prop="'highDispatch.' + index + '.minHour'"
              :rules="{
                type: 'number',
                required: true,
                message: '时间范围不能为空',
                trigger: 'blur'
              }"
            >
              可调度时间大于等于
              <InputNumber v-model="item.minHour" :min="0"></InputNumber>
              小时
            </FormItem>
          </div>
          <div v-else class="form-item" style="display: inline-block;">
            <FormItem
              label="时间范围"
              class="connect-item"
              :prop="'highDispatch.' + index + '.minHour'"
              :rules="{
                type: 'number',
                required: true,
                validator: timeRangeValidate(item),
                trigger: 'blur'
              }"
            >
              可调度时间大于等于
              <InputNumber v-model="item.minHour" :min="0"></InputNumber>
              小时，
            </FormItem>
            <FormItem
              :label-width="0"
              class="connect-item"
              :prop="'highDispatch.' + index + '.maxHour'"
              :rules="{
                type: 'number',
                required: true,
                validator: timeRangeValidate(item),
                trigger: 'blur'
              }"
            >
              小于
              <InputNumber v-model="item.maxHour" :min="0"></InputNumber> 小时
            </FormItem>
          </div>
          <div class="form-item flex">
            <FormItem
              label="司机报价系数"
              :prop="'highDispatch.' + index + '.driverRate'"
              :rules="validNumber"
            >
              <InputNumber
                v-model="item.driverRate"
                :min="0"
                placeholder="司机报价系数"
              ></InputNumber>
            </FormItem>
          </div>
        </div>
        <div class="delete-icon">
          <Icon
            v-if="index > 0"
            type="md-close-circle"
            size="24"
            @click="deleteDispatch(1, item, index)"
          />
        </div>
      </div>
    </div>
    <FormItem>
      <Button type="primary" @click="addDispatch(1)">新增优质播单轮数</Button>
    </FormItem>
    <!-- 优质播单end -->
    <!-- 全城播单 -->
    <div class="form-item flex">
      <div class="column-title">全城播单</div>
    </div>

    <div class="playlist">
      <div
        v-for="(item, index) in formData.wholeCityDispatch"
        :key="index"
        class="playlist-item flex"
      >
        <div class="playlist-content">
          <div class="form-item" style="display: inline-block;">
            <FormItem
              label="时间范围"
              class="connect-item"
              :prop="'wholeCityDispatch.' + index + '.minHour'"
              :rules="{
                type: 'number',
                required: true,
                validator: timeRangeValidate(item),
                trigger: 'blur'
              }"
            >
              可调度时间大于等于
              <InputNumber v-model="item.minHour" :min="0"></InputNumber>
              小时，
            </FormItem>
            <FormItem
              :label-width="0"
              class="connect-item"
              :prop="'wholeCityDispatch.' + index + '.maxHour'"
              :rules="{
                type: 'number',
                required: true,
                validator: timeRangeValidate(item),
                trigger: 'blur'
              }"
            >
              小于
              <InputNumber v-model="item.maxHour" :min="0"></InputNumber> 小时
            </FormItem>
          </div>
          <div class="form-item flex">
            <FormItem
              label="司机报价系数"
              :prop="'wholeCityDispatch.' + index + '.driverRate'"
              :rules="validNumber"
            >
              <InputNumber
                v-model="item.driverRate"
                :min="0"
                placeholder="司机报价系数"
              ></InputNumber>
            </FormItem>
          </div>
        </div>
        <div class="delete-icon">
          <Icon
            type="md-close-circle"
            size="24"
            @click="deleteDispatch(2, item, index)"
          />
        </div>
      </div>
    </div>
    <FormItem>
      <Button type="primary" @click="addDispatch(2)">新增全城播单轮数</Button>
    </FormItem>
    <!-- 全城播单end -->

    <!-- 直接派单 -->
    <div class="form-item flex">
      <div class="column-title">直接派单</div>
    </div>

    <div class="playlist">
      <div
        v-for="(item, index) in formData.directDispatch"
        :key="index"
        class="playlist-item flex"
      >
        <div class="playlist-content">
          <div class="form-item" style="display: inline-block;">
            <FormItem
              label="时间范围"
              class="connect-item"
              :prop="'directDispatch.' + index + '.minHour'"
              :rules="{
                type: 'number',
                required: true,
                validator: timeRangeValidate(item),
                trigger: 'blur'
              }"
            >
              可调度时间大于等于
              <InputNumber v-model="item.minHour" :min="0"></InputNumber>
              小时，
            </FormItem>
            <FormItem
              :label-width="0"
              class="connect-item"
              :prop="'directDispatch.' + index + '.maxHour'"
              :rules="{
                type: 'number',
                required: true,
                validator: timeRangeValidate(item),
                trigger: 'blur'
              }"
            >
              小于
              <InputNumber v-model="item.maxHour" :min="0"></InputNumber> 小时
            </FormItem>
          </div>
          <div class="form-item flex">
            <FormItem
              label="司机报价系数"
              :prop="'directDispatch.' + index + '.driverRate'"
              :rules="validNumber"
            >
              <InputNumber
                v-model="item.driverRate"
                :min="0"
                placeholder="司机报价系数"
              ></InputNumber>
            </FormItem>
          </div>
        </div>
        <div class="delete-icon">
          <Icon
            type="md-close-circle"
            size="24"
            @click="deleteDispatch(3, item, index)"
          />
        </div>
      </div>
    </div>
    <FormItem>
      <Button type="primary" @click="addDispatch(3)">新增直接派单轮数</Button>
    </FormItem>
    <!-- 直接派单end -->

    <!-- 人工派单 -->
    <div class="form-item flex">
      <div class="column-title">人工派单</div>
    </div>

    <div class="playlist">
      <div
        v-for="(item, index) in formData.workDispatch"
        :key="index"
        class="playlist-item flex"
      >
        <div class="playlist-content">
          <div class="form-item" style="display: inline-block;">
            <FormItem
              label="时间范围"
              class="connect-item"
              :prop="'directDispatch.' + index + '.minHour'"
              :rules="{
                type: 'number',
                required: true,
                validator: timeRangeValidate(item),
                trigger: 'blur'
              }"
            >
              可调度时间大于等于
              <InputNumber v-model="item.minHour" disabled :min="0"></InputNumber>
              小时，
            </FormItem>
            <FormItem
              :label-width="0"
              class="connect-item"
              :prop="'directDispatch.' + index + '.maxHour'"
              :rules="{
                type: 'number',
                required: true,
                validator: timeRangeValidate(item),
                trigger: 'blur'
              }"
            >
              小于
              <InputNumber v-model="item.maxHour" :min="0"></InputNumber> 小时
            </FormItem>
          </div>
          <div class="form-item flex">
            <FormItem
              label="司机报价系数"
              :prop="'workDispatch.' + index + '.driverRate'"
              :rules="validNumber"
            >
              <InputNumber v-model="item.driverRate" :min="0"></InputNumber>
            </FormItem>
          </div>
        </div>
        <div class="delete-icon">
          <!-- <Icon
            type="md-close-circle"
            size="24"
            @click="deleteDispatch(4, item, index)"
          /> -->
        </div>
      </div>
    </div>

    <!-- 人工派单end -->
    <div class="form-item flex">
      <FormItem label="默认派单规则">
        乘客下单可调度时间
        <InputNumber
          v-model="formData.entryTime"
          :min="0"
          placeholder="分钟"
        ></InputNumber>
        分钟内进入优质派单
      </FormItem>
    </div>

    <div class="form-item form-button">
      <Button type="primary" @click="handleSubmit">确定</Button>
      <Button style="margin-left: 8px" @click="handleCancel">取消</Button>
    </div>
  </Form>
</template>

<script>
import { createDispatchStrategy } from "_o/api/airportPickUp.js";
import { ORDER_TYPES } from "../../nums";
import copyMixin from "./copy.mixins"
import commonMixin from "./common.mixins"
import crossRangeMixin from "./crossRange.mixins"
export default {
  mixins: [copyMixin, commonMixin, crossRangeMixin],
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
      formData: {
        ruleName: "",
        provinceCityCode: [],
        extendBizType: "",
        businessType: "",
        carLevelList: [],
        source: "",
        typeTime: "",
        effectiveTime: "",
        mutexFilterTags: 0,
        wholeCityDispatch: [
          {
            minHour: null,
            maxHour: null,
            driverRate: null
          }
        ], // 全城播单
        highDispatch: [
          {
            minHour: null,
            maxHour: null,
            driverRate: null
          }
        ], // 优质播单
        directDispatch: [
          {
            minHour: null,
            maxHour: null,
            driverRate: null
          }
        ], // 直接派单
        workDispatch: [
          {
            minHour: 0,
            maxHour: null,
            driverRate: null
          }
        ], // 人工派单
        entryTime: null
      },
      orderTypes: ORDER_TYPES,
      productList: [], // 产品线
      carLevelList: [] // 车型等级
    };
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
    handleSubmit() {
      this.$refs.dispatchForm.validate(async valid => {
        if (valid) {
          const crossStatus = await this.handleRangeValidate()
          if (!crossStatus) return
          const [proviceCode, cityCode] = this.formData.provinceCityCode;
          this.formData.cityCode = cityCode;
          this.formData.proviceCode = proviceCode;
          this.encodeDispatchList(this.formData);
          this.handleCreate({
            ...this.formData,
            mutexFilterTags: this.formData.mutexFilterTags ? 1 : 0 // 改变传值
          });
        }
      });
    },
    // 创建保存
    async handleCreate(params) {
      try {
        this.$Spin.show();
        const res = await createDispatchStrategy(params);
        const { success, msg } = res.data;
        this.$Spin.hide();
        if (success) {
          this.$Message.success("保存成功");
          this.$refs.dispatchForm.resetFields();
          this.$emit("update")
        } else {
          this.$Message.error(msg);
        }
      } catch (error) {
        this.$Spin.hide();
      }
    },
    handleCancel() {
      this.$refs.dispatchForm.resetFields();
      this.$emit("close");
    },
    // 业务线下拉change
    handleChangeBusiness(val) {
      if (!val) return
      const business = this.businessList.find(v => v.value === val);
      this.$nextTick(() => {
        this.productList = business.children;
        // 清空数据
        this.formData.businessType = "";
        this.formData.carLevelList = [];
        this.carLevelList = [];
      });
    },
    // 产品线下拉change
    handleChangeProduct(val) {
      if (!val) return
      const product = this.productList.find(v => v.bizType === val);
      this.$nextTick(() => {
        this.carLevelList = product.levels;
        // 清空数据
        this.formData.carLevelList = [];
      });
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
  text-align: right;
  justify-content: flex-end;
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
  .column-title {
    border-left: 4px solid #2d8cf0;
    padding-left: 8px;
    margin-bottom: 24px;
    font-size: 14px;
    font-weight: 700;
    margin-left: 24px;
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
  .playlist-item {
    width: 100%;
  }
  .playlist-content {
    flex: 1;
    margin-right: 16px;
    border: 1px dotted #2d8cf0;
    margin-bottom: 8px;
    padding-top: 24px;
  }
}
.limit-content{
  margin-bottom: 24px;
  color: #996220;
  background: rgba(255, 133, 51, 0.5);
  padding: 12px;
  border-radius: 5px;
  p{
    font-size: 13px
  }
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
.connect-item {
  display: inline-block;
}
</style>
