<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="title" :visible="addVisible" width="620px" @close="closeDialog">
    <div class="container">
      <el-form v-show="addForm" ref="addForm" :inline="true" :rules="rules" :model="addForm" size="small" label-width="150px" label-position="right">
        <el-form-item label="城市" prop="cityCode">
          <el-select v-model="addForm.cityCode" :disabled="isEdit" placeholder="请选择城市" multiple class="text-width" filterable @change="setCityName">
            <el-option v-for="(cityObj, index) in cities" :key="index" :label="cityObj.orgName" :value="cityObj.orgCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运营模式" prop="operationType">
          <el-select v-model="addForm.operationType" :disabled="isEdit" placeholder="请输入运营模式" class="text-width" filterable>
            <el-option label="UP模式" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="司机工资类别" prop="driverSalaryType">
          <el-select v-model="addForm.driverSalaryType" :disabled="isEdit" multiple placeholder="请选择司机类别" class="text-width" filterable>
            <el-option v-for="(item,index) in driverTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="个税比例" prop="taxProportion">
          <el-input v-model="addForm.taxProportion" class="text-width" placeholder="请输入个税比例" maxlength="32"></el-input>&nbsp;%
        </el-form-item>
        <el-form-item label="生效起始周" prop="effectiveStartTime">
          <el-date-picker v-model="addForm.effectiveStartTime" class="text-width" type="week" :clearable="false" placeholder="请选择开始时间" :format="'yyyy年第WW周(' + beginTimeDesc + ')'" :picker-options="pickerOptions" @blur="beginTimeBlurchange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生效结束周" prop="effectiveEndTime">
          <el-date-picker v-model="addForm.effectiveEndTime" class="text-width" :clearable="false" type="week" placeholder="请选择结束时间" :format="'yyyy年第WW周(' + endTimeDesc + ')'" :picker-options="pickerOptions" @blur="endTimeBlurchange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark" class="text-width" type="textarea" :rows="5" maxlength="100" placeholder="请输入内容">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button v-show="!saving" type="primary" @click="saveRule">确定</el-button>
      <el-button type="info" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addRules } from "./filed";
import mixin from "./mixin";
import { parseTime } from "@/libs/util";
import { addService, editService } from "_o/api/salary/proportionSetting";
export default {
  mixins: [mixin],
  props: {
    title: { required: false, type: String },
    isEdit: { type: Boolean, required: false },
    addVisible: { type: Boolean, required: false },
    getData: { default: null, type: Function },
    addForm: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    }
  },
  inject: ["getCities", "getDriverTypeList"],
  data() {
    return {
      cityInfos: [],
      saving: false,
      beginTimeDesc: "",
      endTimeDesc: "",
      pickerOptions: {
        firstDayOfWeek: 1,
        disabledDate: time => {
          return this.disabledDateFn(time);
        }
      },
      rules: addRules
    };
  },
  computed: {
    cities() {
      return this.getCities() || [];
    },
    driverTypeList() {
      return this.getDriverTypeList() || [];
    }
  },
  watch: {
    "addForm.effectiveStartTime": {
      handler(val) {
        if (val) {
          let D; let begin; let
            end;
          D = new Date(val);
          if (Object.prototype.toString.call(val) == "[object String]") {
            begin = parseTime(val, "{y}-{m}-{d}");
            end = parseTime(
              new Date(D.getTime() + 1000 * 60 * 60 * 24 * 6),
              "{y}-{m}-{d}"
            );
          } else {
            begin = parseTime(
              new Date(D.getTime() - 1000 * 60 * 60 * 24),
              "{y}-{m}-{d}"
            );
            end = parseTime(
              new Date(D.getTime() + 1000 * 60 * 60 * 24 * 5),
              "{y}-{m}-{d}"
            );
          }
          this.beginTimeDesc = begin + "~" + end;
        }
      },
      immediate: true
    },
    "addForm.effectiveEndTime": {
      handler(val) {
        if (val) {
          let D; let begin; let
            end;
          D = new Date(val);
          if (Object.prototype.toString.call(val) == "[object String]") {
            end = parseTime(val, "{y}-{m}-{d}");
            begin = parseTime(
              new Date(D.getTime() - 1000 * 60 * 60 * 24 * 6),
              "{y}-{m}-{d}"
            );
          } else {
            begin = parseTime(
              new Date(D.getTime() - 1000 * 60 * 60 * 24),
              "{y}-{m}-{d}"
            );
            end = parseTime(
              new Date(D.getTime() + 1000 * 60 * 60 * 24 * 5),
              "{y}-{m}-{d}"
            );
          }
          this.endTimeDesc = begin + "~" + end;
        }
      },
      immediate: true
    }
  },
  methods: {
    saveRule() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          let begin = this.beginTimeDesc.split("~")[0];
          let end = this.endTimeDesc.split("~")[1];
          const {
            cityInfos,
            taxProportion,
            effectiveStartTime,
            effectiveEndTime,
            driverSalaryType,
            operationType,
            remark
          } = this.addForm;
          if (!this.isEdit) {
            this.call(
              addService,
              {
                cityInfos: this.cityInfos,
                taxProportion: taxProportion,
                effectiveStartTime: begin,
                effectiveEndTime: end,
                driverSalaryType: driverSalaryType.toString(),
                operationType: operationType,
                remark: remark
              },
              this.addSuccess,
              this.addError
            );
          } else {
            this.call(
              editService,
              {
                id: this.addForm.id,
                taxProportion: taxProportion,
                effectiveStartTime: begin,
                effectiveEndTime: end,
                remark: remark
              },
              this.addSuccess,
              this.addError
            );
          }
        }
      });
    },
    addSuccess(data) {
      this.$refs["addForm"].resetFields();
      this.$emit("closeDialogHandle", "add");
    },
    addError({ msg }) {
      this.$alert(msg || "新增失败");
    },
    // 过期时间禁止点击
    disabledDateFn(time) {
      let date = new Date();
      let day = date.getDay();
      let times = new Date(time).getTime() + 1000 * 60 * 60 * 24 * day;
      return times < Date.now();
    },
    // 失去焦点开始时间校验，跨度为52周
    beginTimeBlurchange() {
      if (this.addForm.effectiveEndTime) {
        let end =
          (new Date(this.addForm.effectiveEndTime).getTime() +
            1000 * 60 * 60 * 24 * 5) /
          1000; // 结束时间
        let begin =
          (new Date(this.addForm.effectiveStartTime).getTime() -
            1000 * 60 * 60 * 24) /
          1000; // 开始时间
        let time = (end - begin) / 60 / 60 / 24;
        if (!(time <= 372)) {
          this.$message.warning("生效起始周与生效结束周跨度为52周");
          this.beginTimeDesc = "";
          this.addForm.effectiveStartTime = "";
        }
      }
    },
    // 失去焦点结束时间校验，跨度为52周
    endTimeBlurchange() {
      if (this.addForm.effectiveStartTime) {
        let begin;
        if (this.isEdit) {
          begin = new Date(this.addForm.effectiveStartTime).getTime() / 1000; // 开始时间
        } else {
          begin =
            (new Date(this.addForm.effectiveStartTime).getTime() -
              1000 * 60 * 60 * 24) /
            1000; // 开始时间
        }
        let end =
          (new Date(this.addForm.effectiveEndTime).getTime() +
            1000 * 60 * 60 * 24 * 5) /
          1000; // 结束时间

        let time = (end - begin) / 60 / 60 / 24;
        if (!(time <= 372)) {
          this.$message.warning("生效起始周与生效结束周跨度为52周");
          this.endTimeDesc = "";
          this.addForm.effectiveEndTime = "";
        }
      }
    },
    setCityName(val) {
      this.cityInfos = [];
      val.map((select, i) => {
        this.cities.map((all, j) => {
          if (select == all.value) {
            this.cityInfos.push({ cityCode: all.value, cityName: all.label });
          }
        });
      });
    },
    closeDialog() {
      this.$refs["addForm"].resetFields();
      this.$emit("closeDialogHandle", "close");
    }
  }
};
</script>

<style scoped>
.container {
  margin-left: 50px;
}
.text-width {
  width: 280px !important;
}
.footer {
  width: 93%;
  margin: 5px;
  display: flex;
  justify-content: center;
}
</style>
