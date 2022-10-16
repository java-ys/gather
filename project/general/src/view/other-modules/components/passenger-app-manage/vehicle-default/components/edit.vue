<template>
  <Modal
    v-model="show"
    width="1000"
    :title="title"
    :mask-closable="false"
    class="modal-s"
    @on-cancel="cancel"
  >
    <Form
      ref="_form"
      :model="formData"
      :label-width="150"
      :rules="rules"
      v-if="show"
    >
      <Row type="flex" justify="space-around">
        <Col span="12">
          <FormItem label="策略名称：" prop="strategyName">
            <Input
              v-model="formData.strategyName"
              class="item-width"
              :maxlength="20"
              placeholder="请输入"
              :disabled="isDetail"
            ></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="城市：" prop="cityCodes">
            <Select
              v-model="formData.cityCodes"
              multiple
              filterable
              class="input-width item-width"
              :disabled="isDetail || isEdit"
              @on-change="cityChange"
            >
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
      <Row type="flex" justify="start">
        <Col span="12">
          <FormItem label="生效日期：" prop="effectiveTime">
            <DatePicker
              v-model="formData.effectiveTime"
              type="datetime"
              class="item-width"
              placeholder="请选择时间"
              :options="datePickerOption"
              :editable="false"
              :disabled="isDetail || isEdit"
            >
            </DatePicker>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="默认不勾选车型：" prop="allUnSelectedVehicleTypes">
            <Select
              v-model="formData.allUnSelectedVehicleTypes"
              multiple
              filterable
              :disabled="isDetail"
              class="input-width item-width"
            >
              <Option
                v-for="(item, index) in vehicleList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div slot="footer">
      <Button type="primary" ghost @click="(e) => cancel()">{{
        isDetail ? "关闭" : "取消"
      }}</Button>
      <Button
        type="primary"
        v-if="!isDetail"
        :loading="submitLoading"
        @click="save"
      >
        <span>提交</span>
      </Button>
    </div>
  </Modal>
</template>

<script>
import { rules } from "./edit";
import { mapGetters, mapState } from "vuex";
import { tool, freeze, pick } from "@/mixins/base";
import { addService, updateService } from "_o/api/vehicle-default";
import { deepCopy } from "@/libs/tools";
import { defaultParams } from "../config";

export default {
  name: "edit",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    cData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  mixins: [tool],
  inject: ["getCityList"],
  watch: {
    value: {
      handler(value) {
        this.show = value;
        if (value) {
          this.formData.strategyName = this.cData.strategyName;
          this.formData.cityCodes = this.cData.cityCode
            ? [this.cData.cityCode]
            : [];
          this.formData.effectiveTime = this.cData.effectiveTime;
          this.formData.allUnSelectedVehicleTypes =
            this.cData.allUnSelectedVehicleTypes || [];
        }
      },
      immediate: true,
    },
    show(value) {
      this.$emit("input", value);
    },
  },
  computed: {
    // 复制和新建去除 全国 选项
    cityList({isEdit, isDetail}) {
      if(!isEdit && !isDetail) {
        let list = JSON.parse(JSON.stringify(this.getCityList() || []))
        list.shift()
        return list
      }
      return this.getCityList() || [];
    },
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList,
      bookingBusinessGradeList: (state) =>
        state.common.businessGradeList.filter(
          (it) => it.value !== 8 && it.value !== 9
        ),
      bizTypeList: (state) => state.common.bizTypeList,
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName",
    }),
    vehicleList({ bookingBusinessGradeList }) {
      let r = [];
      bookingBusinessGradeList.forEach((item) => {
        let name = item.label || item.expandBizLineName;
        let val = item.value || item.expandBizLine;
        item?.children?.forEach((it) => {
          r.push({
            label: `${name}-${it.label}`,
            value: `${val}#${it.value}`, // 业务线#产品线
          });
        });
      });
      return r;
    },
    isDetail({ cData }) {
      return !!cData._detail;
    },
    isCopy({ cData }) {
      return !!cData._copy;
    },
    isEdit({cData}) {
      return !!cData._edit
    },
    title({ isDetail, isCopy, cData }) {
      if (isDetail) {
        return "策略详情";
      }
      if (isCopy) {
        return "复制策略";
      }
      if (cData.uuid) {
        return "编辑策略";
      }
      return "新建策略";
    },
  },
  data() {
    return {
      show: false,
      formData: deepCopy(defaultParams),
      rules,
      // title: "新建策略",
      submitLoading: false,
      datePickerOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        },
      },
    };
  },
  methods: {
    cancel() {
      this.show = false;
    },
    async save() {
      const valid = await this.$refs._form.validate();
      if (!valid) return;
      let effectiveTime = this.$moment(this.formData.effectiveTime).format(
        "YYYY-MM-DD HH:mm:ss"
      )
      if(!this.isEdit) { // 编辑的时候不校验生效日期
        let now = +new Date()
        let effectiveTimeTs = +new Date(`${effectiveTime}`.replace('-', '/'))
        if(effectiveTimeTs < now) {
          this.$Message.error(`生效日期不能小于当前时间`);
          return
        }
      }
      let p = {
        ...this.formData,
        effectiveTime,
      };
      if (this.cData.uuid) {
        p.uuid = this.cData.uuid;
      }
      let func = this.cData.uuid ? updateService : addService;
      let tip = this.cData.uuid ? "更新" : "新增";
      const [err, data] = await this.toResult(func(p));
      if (err) {
        return;
      }
      this.$Message.success(`${tip}成功`);
      this.show = false;
      this.$emit("refresh");
    },
    cityChange(v) {
      if (!v?.length) return;
      let last = v[v.length - 1];
      if (`${last}` === "0") {
        // 全国
        v.splice(0, v.length, "0");
      } else {
        let aIndex = v.find((it) => `${it}` === "0");
        if (aIndex > -1) {
          v.splice(aIndex, 1);
        }
      }
    },
  },
};
</script>

<style scoped lang="less">
.item-width {
  width: 300px;
}
</style>
