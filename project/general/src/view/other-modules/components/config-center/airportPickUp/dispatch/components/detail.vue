<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-08 13:47:08
 * @LastEditTime: 2021-11-22 10:03:26
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
        <div>{{formData.ruleName}}</div>
      </FormItem>
      <FormItem label="所选城市" prop="provinceCityCode">
        <div>{{formData.cityName}}</div>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="业务线" prop="extendBizType">
        <div>{{filterBusinessName(formData.extendBizType)}}</div>
      </FormItem>
      <FormItem label="产品线" prop="businessType">
        <div>{{filterBizName(formData.businessType)}}</div>
      </FormItem>
      <FormItem label="车型等级" prop="carLevelList">
        <div>{{filterCarLevelName(formData.carLevelList, formData.businessType)}}</div>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="渠道" prop="source">
        <Select v-model="formData.source" disabled>
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
        <Select v-model="formData.typeTime" disabled>
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
          disabled
          placeholder=""
          style="width: 200px"
        ></DatePicker>
      </FormItem>
    </div>

    <div class="form-item flex">
      <FormItem label="司机资格">
        <Checkbox
          v-model="formData.mutexFilterTags"
          disabled
        >
          是否必须是双证司机
        </Checkbox>
      </FormItem>
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
              <InputNumber v-model="item.minHour" disabled :min="0"></InputNumber>
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
                message: '时间范围不能为空',
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
              :prop="'highDispatch.' + index + '.maxHour'"
              :rules="{
                type: 'number',
                required: true,
                message: '时间范围不能为空',
                trigger: 'blur'
              }"
            >
              小于
              <InputNumber v-model="item.maxHour" disabled :min="0"></InputNumber> 小时
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
                disabled
                :min="0"
                placeholder="司机报价系数"
              ></InputNumber>
            </FormItem>
          </div>
        </div>
        <!-- <div class="delete-icon">
          <Icon
            type="md-close-circle"
            size="24"
            @click="deleteDispatch(1, item, index)"
          />
        </div> -->
      </div>
    </div>
    <!-- <FormItem>
      <Button type="primary" @click="addDispatch(1)">新增优质播单轮数</Button>
    </FormItem> -->
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
                message: '时间范围不能为空',
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
              :prop="'wholeCityDispatch.' + index + '.maxHour'"
              :rules="{
                type: 'number',
                required: true,
                message: '时间范围不能为空',
                trigger: 'blur'
              }"
            >
              小于
              <InputNumber v-model="item.maxHour" disabled :min="0"></InputNumber> 小时
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
                disabled
                :min="0"
                placeholder="司机报价系数"
              ></InputNumber>
            </FormItem>
          </div>
        </div>
        <!-- <div class="delete-icon">
          <Icon
            type="md-close-circle"
            size="24"
            @click="deleteDispatch(2, item, index)"
          />
        </div> -->
      </div>
    </div>
    <!-- <FormItem>
      <Button type="primary" @click="addDispatch(2)">新增全城播单轮数</Button>
    </FormItem> -->
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
                message: '时间范围不能为空',
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
                message: '时间范围不能为空',
                trigger: 'blur'
              }"
            >
              小于
              <InputNumber v-model="item.maxHour" disabled :min="0"></InputNumber> 小时
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
                disabled
                placeholder="司机报价系数"
              ></InputNumber>
            </FormItem>
          </div>
        </div>
        <!-- <div class="delete-icon">
          <Icon
            type="md-close-circle"
            size="24"
            @click="deleteDispatch(3, item, index)"
          />
        </div> -->
      </div>
    </div>
    <!-- <FormItem>
      <Button type="primary" @click="addDispatch(3)">新增直接派单轮数</Button>
    </FormItem> -->
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
                message: '时间范围不能为空',
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
                message: '时间范围不能为空',
                trigger: 'blur'
              }"
            >
              小于
              <InputNumber v-model="item.maxHour" disabled :min="0"></InputNumber> 小时
            </FormItem>
          </div>
          <div class="form-item flex">
            <FormItem
              label="司机报价系数"
              :prop="'workDispatch.' + index + '.driverRate'"
              :rules="validNumber"
            >
              <InputNumber v-model="item.driverRate" disabled :min="0"></InputNumber>
            </FormItem>
          </div>
        </div>
        <!-- <div class="delete-icon">
          <Icon
            type="md-close-circle"
            size="24"
            @click="deleteDispatch(4, item, index)"
          />
        </div> -->
      </div>
    </div>
    <!-- <FormItem>
      <Button type="primary" @click="addDispatch(4)">新增人工派单轮数</Button>
    </FormItem> -->
    <!-- 人工派单end -->
    <div class="form-item flex">
      <FormItem label="默认派单规则">
        乘客下单可调度时间
        <InputNumber
          v-model="formData.entryTime"
          disabled
          :min="0"
          placeholder="分钟"
        ></InputNumber>
        分钟内进入优质派单
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
import { ORDER_TYPES } from "../../nums";
import detailMixin from "./detail.mixins";
import commontMixin from "../../common.mixins";
import { validNumber } from "../../validate"
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
      validNumber: [
        { type: "number", required: true, message: "司机报价系数不能为空", trigger: "blur" },
        { validator: validNumber, trigger: "blur" }
      ], // 重新赋值到data里，这样动态可以直接用
      formRules: {
      },
      formData: {
        ruleName: "",
        cityName: "",
        extendBizType: "",
        businessType: "",
        carLevelList: [],
        typeTime: "",
        effectiveTime: "",
        mutexFilterTags: 0,
        source: "",
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
            minHour: null,
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
  computed: {
    ...mapState({
      channelList: state => state.common.channel
    })
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
      this.$refs.dispatchForm.resetFields();
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
