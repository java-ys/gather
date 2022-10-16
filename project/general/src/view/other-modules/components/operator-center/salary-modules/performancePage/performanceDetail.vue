<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="绩效工资规则详情"
    width="70%"
    :visible="detailVisible"
    @close="closeDialog"
  >
    <el-row class="detail-style">
      <p class="detail-text">基本信息</p>
      <el-col :span="12">
        <span class="propName">规则代码: &nbsp;</span> {{detailData.ruleCode}}
      </el-col>
      <el-col :span="12">
        <span class="propName">规则名称: &nbsp;</span> {{detailData.ruleName}}
      </el-col>
      <el-col :span="12">
        <span class="propName">城市: &nbsp;</span> {{detailData.cityName}}
      </el-col>
      <el-col :span="12">
        <span class="propName">业务线: &nbsp;</span> {{businessTypeWrapper(detailData.businessType)}}
      </el-col>
      <el-col :span="12">
        <span class="propName">生效起始周: &nbsp;</span> {{weekFormatter(detailData.beginTime)}}
      </el-col>
      <el-col :span="12">
        <span class="propName">生效结束周: &nbsp;</span> {{weekFormatter(detailData.endTime)}}
      </el-col>
      <el-col :span="12">
        <span class="propName">状态: &nbsp;</span> {{statusWrapper(detailData.ruleStatus)}}
      </el-col>
    </el-row>
    <el-row v-if="ruleVisible" class="detail-style">
      <el-col :span="24">
        <span class="detail-text">阶梯绩效奖励规则</span>
        <el-table
          :data="ruleDetailData"
          style="width: 96%"
          size="mini"
          :header-cell-style="{ background: '#F5F4F2' }"
          fit highlight-current-row
        >
          <el-table-column
            prop="period"
            label="到账流水区间"
            min-width="150"
          >
          </el-table-column>
          <el-table-column
            prop="amount"
            label="奖励到账流水(%)"
            min-width="110"
          >
          </el-table-column>
        </el-table>
      </el-col>
      <el-col v-if="detailData.businessType == 2 || detailData.businessType == 6" :span="24">
        <span class="detail-text">每单流水抽成奖励规则</span>
        <el-table
          :data="rulepumpData"
          style="width: 96%"
          size="mini"
          :header-cell-style="{ background: '#F5F4F2' }"
          fit highlight-current-row
        >
          <el-table-column
            prop="rulepump"
            label="每单流水抽成(%)"
            min-width="110"
          >
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible" append-to-body class="dialog-size">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </el-dialog>
</template>

<script>
import { parseTime } from "@/libs/util"
import { getYearWeek } from "_o/common/common"

export default {
  props: {
    detailVisible: { type: Boolean, required: false, default: false },
    detailData: { type: Object, required: false, default: {}},
  },
  data() {
    return {
      ruleVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      ruleDetailData: [],
      rulepumpData: []
    }
  },
  created() {
    this.detailData.ruleDataList.forEach(each => {
      if (each.typeCode == "IDE_WK_REWARD") {
        this.ruleDetailData.push({ period: (each.elementValue1 + "元 - " + each.elementValue2 + "元"), amount: each.objectValue })
        this.ruleVisible = true;
      }
      if (each.typeCode == "IDE_WK_CUT") {
        this.rulepumpData.push({ rulepump: each.objectValue })
        this.ruleVisible = true;
      }

    });
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialogHandle", "detail");
    },
    statusWrapper(status) {
      switch (status) {
        case 0: case "0":
          return "启用";
        case 1: case "1":
          return "无效";
        case 3: case "3":
          return "停用";
        default:
          return "未知状态";
      }
    },
    parseTimeDetail(time) {
      return parseTime(time, "{y}-{m}");
    },
    weekFormatter(time) {
      return getYearWeek(time);
    },
    handlePreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 1出租车，2专车，3跨城，4快车
    businessTypeWrapper(value) {
      switch (value) {
        case 1:
          return "出租车";
        case 2:
          return "专享";
        case 6:
          return "包车";
        case 4:
          return "快享";
        default:
          return "未知业务线";
      }
    },
  }
}
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
    line-height: 1.6;
  }

  .propName {
    font-weight: bold;
  }
</style>
