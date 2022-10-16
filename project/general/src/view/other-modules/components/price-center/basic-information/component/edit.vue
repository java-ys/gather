<template>
  <Modal
    v-model="showModal"
    :title="title"
    width="40%"
    :z-index="1"
    @on-cancel="cancel"
  >
    <Form
      ref="form"
      inline="inline"
      :model="formData"
      :label-width="120"
      :rules="rules"
    >
      <Row>
        <Col :span="12">
        <FormItem label="策略名称：" prop="configName">
          <Input
            v-if="type === 1"
            v-model="formData.configName"
            clearable="clearable"
            style="width: 200px"
            :maxlength="32"
            placeholder="请输入策略名称"
          />
          <span v-else>{{currentRow.configName}}</span>
        </FormItem>
        </Col>
        <Col :span="12">
        <FormItem label="城市：" prop="cityList">
          <Select
            v-if="type === 1"
            v-model="formData.cityList"
            clearable
            multiple
            filterable
            style="width: 200px"
            placeholder="请选择城市"
            @on-change="changeCity"
          >
            <Option
              v-for="(item, index) in cities"
              :key="index"
              :value="item.value"
            >
              {{item.label}}
            </Option>
          </Select>
          <span v-else>{{currentRow.city}}</span>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :span="12">
        <FormItem label="运营模式：" prop="operateMode">
          <Select
            v-if="type === 1"
            v-model="formData.operateMode"
            clearable
            style="width: 200px"
            placeholder="请选择运营模式"
          >
            <Option
              v-for="(item, index) in operateModeList"
              :key="index"
              :value="item.value"
            >
              {{item.label}}
            </Option>
          </Select>
          <span v-else>{{currentRow.operateMode}}</span>
        </FormItem>
        </Col>
        <Col :span="12">
        <FormItem label="司机工资类别：" prop="driverSalaryCategoryList">
          <Select
            v-if="type === 1"
            v-model="formData.driverSalaryCategoryList"
            clearable
            multiple
            style="width: 200px"
            placeholder="请选择司机工资类别"
            @on-change="changeCategory"
          >
            <Option
              v-for="(item, index) in dicItems"
              :key="index"
              :value="item.value"
            >
              {{item.label}}
            </Option>
          </Select>
          <span v-else>{{currentRow.driverSalaryCategory}}</span>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :span="12">
        <FormItem label="产品线：" prop="productLineList">
          <Select
            v-if="type === 1"
            v-model="formData.productLineList"
            clearable
            style="width: 200px"
            placeholder="请选择产品线"
            multiple
          >
            <Option
              v-for="(item, index) in bizTypeList"
              :key="index"
              :value="item.value"
            >
              {{item.label}}
            </Option>
          </Select>
          <span v-else>{{currentRow.productLine}}</span>
        </FormItem>
        </Col>
        <!-- <FormItem label="车型等级：" prop="carLevel">
        <Select
          v-if="type === 1"
          clearable
          style="width: 200px"
          placeholder="请选择车型等级"
          v-model="formData.carLevel"
        >
          <Option
            v-for="(item, index) in carTypeList"
            :value="item.value"
            :key="index"
            >{{ item.label }}</Option
          >
        </Select>
        <span v-else>{{currentRow.carLevel}}</span>
      </FormItem>
      <FormItem label="订单类型：" prop="typeTime">
        <CheckboxGroup
          v-model="formData.typeTime"
          style="width: 200px"
          v-if="type === 1"
        >
          <Checkbox :label="1">实时</Checkbox>
          <Checkbox :label="2">预约</Checkbox>
        </CheckboxGroup>
        <span v-else>{{currentRow.typeTime}}</span>
      </FormItem> -->
        <Col :span="12">
        <FormItem label="生效时间：" prop="startTime">
          <DatePicker
            v-if="type === 1"
            :value="formData.startTime"
            type="datetime"
            :options="options"
            placeholder="请选择生效时间"
            style="width: 200px"
            @on-change="formData.startTime = $event"
          >
          </DatePicker>
          <span v-else>{{currentRow.startTime}}-{{currentRow.endTime}}</span>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :span="12">
        <FormItem label="计费方式：" prop="configType">
          <RadioGroup
            v-if="type === 1"
            v-model="formData.configType"
            style="width: 200px"
            placeholder="请选择计费方式"
          >
            <Radio :label="1">固定金额</Radio>
            <Radio :label="2" disabled>流水比例</Radio>
          </RadioGroup>
          <span v-else>{{configTypeMap[currentRow.configType]}}</span>
        </FormItem>
        </Col>
        <Col :span="12">
        <FormItem label="基础信息费：" prop="baseFare">
          <Input
            v-if="type === 1"
            v-model="formData.baseFare"
            clearable="clearable"
            style="width: 200px"
            :maxlength="255"
            placeholder="请输入基础信息费"
          /><span v-if="type === 1">&nbsp;元/单</span>
          <span v-else>{{currentRow.baseFare | toFixed2}}</span>
        </FormItem>
        </Col>
      </Row>
    </Form>
    <div slot="footer" class="button-group">
      <Button @click="cancel">取消</Button>
      <Button v-if="type === 1" v-lazy-click="saveData" type="primary">
        确定
      </Button>
    </div>
  </Modal>
</template>

<script>
import {
  rules,
  operateModeList,
  businessInfo,
  configTypeMap,
} from "../fields";
import mixin from "../mixin";
import { baseInfoAddService, baseInfoCheckService } from "_o/api/priceCenter";
import { mapState } from "vuex"
export default {
  inject: ["getCities", "getDicItem", "getRow"],
  filters: {
    toFixed2(val) {
      return (Number(val) || 0).toFixed(2) + "元/单";
    },
  },
  mixins: [mixin],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      showModal: this.visible,
      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now();
        },
      },
      formData: {
        configName: "",
        cityList: [],
        operateMode: "",
        driverSalaryCategoryList: [],
        productLineList: [],
        startTime: "",
        configType: "",
        baseFare: "",
      },
      rules: rules,
      operateModeList,
      businessInfo,
      configTypeMap,
    };
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList
    }),
    title() {
      return this.type === 1 ? "新建策略" : "策略详情";
    },
    cities() {
      return this.getCities() || [];
    },
    dicItems() {
      return this.getDicItem() || [];
    },
    currentRow() {
      let rowTmp = this.getRow();
      let tmp = { ...rowTmp };
      return tmp;
    },
  },
  watch: {
    visible() {
      this.$nextTick(() => {
        // 重置表单校验
        this.showModal = this.visible;
        this.$refs.form.resetFields();
      });
    },
  },
  methods: {
    saveData() {
      this.$refs.form.validate(async (valid) => {
        let cityNames = "";
        if (!valid) return;
        // 校验城市策略是否重复
        let [err, data] = await this.toResult(baseInfoCheckService(this.formData));
        if (err) {
          return;
        }
        const { exist } = data;
        if (exist) {
          const { details } = data;
          details.forEach(item => {
            cityNames += this.cities.find((it) => item.city === it.value).label + ",";
          })
          this.$Modal.confirm({
            title: "提示",
            content:
              "<p>" +
              cityNames.substr(0, cityNames.length - 1) +
              "已存在相同维度的策略生效，创建新的规则生效后，原规则将会自动失效，是否确定?</p>",
            onOk: () => {
              this.call(
                baseInfoAddService,
                this.formData,
                this.addSuccess,
                this.addError
              );
            },
            onCancel: () => {
              this.$Message.error("已取消");
            },
          });
        } else {
          this.call(
            baseInfoAddService,
            this.formData,
            this.addSuccess,
            this.addError
          );
        }
      });
    },
    addSuccess(data) {
      this.cancel();
    },
    addError({ msg }) {
      this.$Message.error(msg || "新增失败");
    },
    cancel(refresh = false) {
      this.$emit("close", { refresh });
    },
    changeCity(val) {
      let length = val.length;
      if (val[length - 1] === "1") {
        this.formData.cityList = this.cities.map((it) => it.value);
      } else {
        val.forEach((v, k) => {
          if (v === "1") val.splice(k, 1);
        });
        this.formData.cityList = val;
      }
    },
    changeCategory(val) {
      let length = val.length;
      if (val[length - 1] === "1") {
        this.formData.driverSalaryCategoryList = this.dicItems.map((it) => it.value);
      } else {
        val.forEach((v, k) => {
          if (v === "1") val.splice(k, 1);
        });
        this.formData.driverSalaryCategoryList = val;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.button-group {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
.button-group button {
  margin: 0 10px;
}
</style>
