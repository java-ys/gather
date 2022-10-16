<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="能源账户补贴规则详情"
    width="60%"
    :visible="detailVisible"
    @close="closeDialog"
  >
    <el-row class="detail-style">
      <!--<p class="detail-text">基本信息</p>-->
      <!--      <el-col :span="12">
              简历ID: {{detailData.uuid}}
            </el-col>-->
      <el-col :span="12">
        <span class="propName">城市: &nbsp;</span> {{detailData.cityName}}
      </el-col>
      <el-col :span="12">
        <span class="propName">单价: &nbsp;</span> {{detailData.price}}元/度
      </el-col>
      <el-col :span="12">
        <span class="propName">系数: &nbsp;</span> {{detailData.ratio}}
      </el-col>
      <el-col :span="12">
        <span class="propName">车型: &nbsp;</span> {{detailData.carLevelNames}}
      </el-col>
      <el-col :span="12">
        <span class="propName">生效起始月份: &nbsp;</span> {{parseTimeDetail(detailData.startTime)}}
      </el-col>
      <el-col :span="12">
        <span class="propName">生效结束月份: &nbsp;</span> {{parseTimeDetail(detailData.endTime)}}
      </el-col>

      <el-col :span="12">
        <span class="propName">状态: &nbsp;</span> {{statusWrapper(detailData.status)}}
      </el-col>


    </el-row>
  </el-dialog>
</template>

<script>
import { parseTime } from "@/libs/util"
export default {
  props: {
    detailVisible: { type: Boolean, required: false, default: false },
    detailData: { type: Object, required: false, default: {}}
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialogHandle", "detail");
    },
    statusWrapper(status) {
      switch (status) {
        case 1: return "未启用";
        case 2: return "启用";
        case 3: return "停用";
        default: return "未知";
      }
    },
    sourceAgentTypeWrapper(type) {
      switch (type) {
        case 1: return "平台";
        case 2: return "运营商";
        default: return "未知";
      }
    },
    parseTimeDetail(time) {
      return time ? parseTime(time, "{y}-{m}") : "";
    },
    handlePreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
  }
}
</script>

<style scoped>
  .detail-text {
    font-weight: bold;
    font-size: 16px;
    margin: 15px 0 10px 8px;
  }

  img {
    cursor:pointer;
  }

  .detail-style {
    font-size: 15px;
    margin: 0 0 10px 30px;
    line-height: 1.6;
  }

  .propName {
    font-weight: bold;
  }
</style>
