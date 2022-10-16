<template>
  <div>
    <Modal
      v-model="visible"
      :title="title"
      width="600"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="_form"
        :model="formData"
        :label-width="150"
        :rules="validateRules"
      >
        <FormItem label="城市：" prop="cityCodeList">
          <!--          新增时可多选城市, 生成多个城市多条数据-->
          <Select
            v-model="formData.cityCodeList"
            placeholder="请选择"
            class="item-width"
            :multiple="!isEdit"
            label-in-value
            clearable
            filterable
            :disabled="view"
            @on-change="cityChange"
          >
            <Option
              v-for="item in cityList"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="城市级别：" prop="cityLevel">
          <Select
            v-model="formData.cityLevel"
            placeholder="请选择"
            class="item-width"
            :disabled="view"
          >
            <Option
              v-for="item in cityLevelList"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="城市订单规模：" prop="orderScale">
          <Input
            v-model="formData.orderScale"
            :maxlength="30"
            class="item-width"
            :disabled="view"
            placeholder="请输入"
          ></Input>
        </FormItem>
        <FormItem label="城市系数：" prop="coefficient">
          <Input
            v-model="formData.coefficient"
            :maxlength="20"
            type="number"
            class="item-width no-arrow"
            placeholder="请输入"
            :disabled="view"
            @on-keyup="e =>coefficientChange(e)"
          ></Input>
        </FormItem>
        <FormItem
          label="生效日期："
          prop="endDate"
        >
          <DatePicker
            v-model="formData.startDate"
            type="month"
            placeholder="起始日期"
            :readonly="view"
            :options="startDateOption"
            style="width: 105px;"
            @on-clear="startDateClear"
          />
          <span style="padding: 0 5px;color: #cbccce;"> — </span>
          <DatePicker
            v-model="formData.endDate"
            type="month"
            placeholder="截止日期"
            :readonly="!formData.startDate || view"
            :options="endDateOption"
            style="width: 105px;"
          />
        </FormItem>
        <FormItem label="说明：" prop="remark">
          <Input
            v-model="formData.remark"
            type="textarea"
            :disabled="view"
            :maxlength="100"
            :rows="4"
            placeholder="请输入..."
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          v-if="!view"
          :loading="submitLoading"
          @click="confirmAdd"
        >
          <span>确定</span>
        </Button>
        <Button type="primary" ghost @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { tool } from "_o/api/baseMixin.js";
import { freeze, positiveNumber, getMostDecimal } from "@/mixins/base";
import { timeFormat} from "@/libs/util"
import { cityLevelList } from "../fields";
import { cUpdateService, cAddService } from "_o/api/coe";

const defaultFormData = {
  cityCodeList: [],
  cityLevel: "",
  orderScale: "",
  coefficient: "",
  remark: "",
  startDate: "",
  endDate: "",
};
export default {
  name: "coefficient-add",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default: () => {
        return {};
      }
    },
    view: {
      // 是否预览
      type: Boolean,
      default: false
    }
  },
  inject: ["getCityList"],
  mixins: [tool],
  data() {
    let data = {};
    let title = "新建城市系数";
    let { id } = this.detail;
    if (id) {
      Object.keys(defaultFormData).forEach(key => {
        data[key] = this.detail[key];
      });
      data.cityCodeList = [this.detail.cityCode];
      title = "编辑城市系数";
    }
    if (this.view) title = "城市系数";
    return {
      cityLevelList: freeze(cityLevelList),
      title,
      submitLoading: false,
      formData: id ? data : { ...defaultFormData },
      startDateOption: {
        disabledDate(date) {
          const [nowYear, nowMonth] = this.$moment(Date.now()).format("YYYY-MM").split("-");
          const [dYear, dMonth] = this.$moment(date).format("YYYY-MM").split("-");
          if(nowYear < dYear) {
            return false
          } else if(nowYear - dYear === 0) {
            if(nowMonth <= dMonth) return false
          }
          return true
        }
      }
    };
  },
  created() {
    this.initData();
  },
  computed: {
    cityList() {
      let arr = [];
      this.getCityList().forEach(pro => {
        if (pro.children && pro.children.length) {
          arr = arr.concat(pro.children);
        }
      });
      return arr;
    },
    // 只有新增系数 城市可多选
    isEdit() {
      return !this.view && this.detail.id;
    },
    endDateOption({formData}) {
      return {
        disabledDate(date) {
          const [nowYear, nowMonth] = this.$moment(formData.startDate).format("YYYY-MM").split("-");
          const [dYear, dMonth] = this.$moment(date).format("YYYY-MM").split("-");
          if(nowYear < dYear) {
            return false
          } else if(nowYear - dYear === 0) {
            if(nowMonth <= dMonth) return false
          }
          return true
        }
      }
    }
  },
  methods: {
    confirmAdd() {
      this.$refs._form.validate(async bool => {
        if (!bool) return;
        let msg = "新建成功";
        let func = cAddService;
        let { id } = this.detail;
        if (id) {
          this.formData.id = id;
          func = cUpdateService;
          msg = "修改成功";
        }
        let p = this.getSubmitParams();
        this.submitLoading = true;
        const [err, data] = await this.toResult(func(p));
        this.submitLoading = false;

        if (err) {
          return;
        }
        this.$Message.success(msg);
        this.$emit("confirm");
      });
    },
    getSubmitParams() {
      let p = { ...this.formData };
      p.cityCodeList = this.selectCity;
      p.startDate = this.$moment(p.startDate).format("YYYY-MM")
      p.endDate = this.$moment(p.endDate).format("YYYY-MM")
      return p;
    },
    cancel() {
      if (this.view) {
        this.$refs._form.resetFields();
        this.$emit("close");
        return;
      }
      this.$Modal.confirm({
        title: `是否确认取消${this.title}？`,
        onOk: () => {
          this.$refs._form.resetFields();
          this.$emit("close");
        }
      });
    },
    initData() {
      this.validateRules = {
        cityCodeList: [{ required: true, message: "请选择城市" }],
        cityLevel: [{ required: true, message: "请选择城市级别" }],
        orderScale: [
          { required: true, message: "请输入城市规模", trigger: "blur" }
        ],
        coefficient: [{ required: true, message: "请输入城市系数" }],
        endDate: [{required: true, message: "请选择生效日期"}]
      };
    },
    // 大于0 小于1 两位小数
    coefficientChange(ev) {
      let v = +ev.target.value;
      if (isNaN(v)) {
        this.formData.coefficient = ""
        return;
      }
      if(`${v}` === '0') {
        return
      }
      if( v < 0) {
        this.formData.coefficient = 0
        return
      }
      if( v > 1) {
        this.formData.coefficient = 1
        return
      }
      this.formData.coefficient = getMostDecimal(v, 2);
    },
    cityChange(val) {
      if (!val.length) {
        this.selectCity = [];
        return;
      }
      this.selectCity = val.map(it => ({
        cityName: it.label,
        cityCode: it.value
      }));
    },
    startDateClear() {
      this.formData.endDate = ""
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .no-arrow input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.item-width {
  width: 240px;
}
</style>
