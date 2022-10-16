<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="title" width="70%" :visible="detailVisible" @close="closeDialog">
    <!-- 基本信息 -->
    <el-row class="detail-style">
      <el-col :span="12">
        <span class="propName">生效时间: &nbsp;</span> {{ detailData.effectiveStartTime }} ~ {{ detailData.effectiveEndTime }}
      </el-col>
      <el-col :span="12">
        <span class="propName">城市: &nbsp;</span>{{ detailData.cityName }}
      </el-col>
      <el-col :span="12">
        <span class="propName">运营模式: &nbsp;</span> {{ detailData.operationType | operationTypeFormatter }}
      </el-col>
      <el-col :span="12">
        <span class="propName">司机工资类别: &nbsp;</span> {{ detailData.driverSalaryTypeName }}
      </el-col>
      <el-col :span="12">
        <span class="propName">个税比例: &nbsp;</span> {{ detailData.taxProportion }}&nbsp;%
      </el-col>
      <el-col :span="12">
        <span class="propName">状态: &nbsp;</span> {{ detailData.taxStatus | taxStatusFormatter }}
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import mixin from "./mixin";
export default {
  props: {
    title: { required: false, type: String },
    detailData: { type: Object, required: false, default: {} },
    detailVisible: { type: Boolean, required: false }
  },
  mixins: [mixin],
  inject: ["getDriverTypeList"],
  computed: {
    driverTypeList() {
      return this.getDriverTypeList() || [];
    }
  },
  data() {
    return {};
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialogHandle", "detail");
    },
    // 司机工资类别转换
    SalaryTypeFormatter(val) {
      let name = "";
      this.driverTypeList.forEach((item, index) => {
        if (val == item.itemcode) {
          name = item.itemvalue;
        }
      });
      return name;
    }
  },
  filters: {
    operationTypeFormatter(value) {
      switch (value) {
        case 1:
          return "自营";
          break;
        case 2:
          return "UP";
          break;
      }
    },
    taxStatusFormatter(value) {
      switch (value) {
        case 1:
          return "待生效";
          break;
        case 2:
          return "生效中";
          break;
        case 3:
          return "已终止";
          break;
        case 4:
          return "已停用";
          break;
        case 5:
          return "已过期";
      }
    }
  }
};
</script>

<style scoped>
.detail-text {
  font-weight: bold;
  font-size: 16px;
  margin: 15px 0 10px 0;
}

img {
  cursor: pointer;
}

.detail-style {
  font-size: 15px;
  margin: 0 0 10px 30px;
  line-height: 2;
}

.propName {
  font-weight: bold;
}

.footer {
  width: 93%;
  margin: 5px;
  display: flex;
  justify-content: center;
}
</style>
