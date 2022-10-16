<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-09-22 16:08:18
 * @LastEditors: wangp
 * @LastEditTime: 2020-09-22 17:29:14
-->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title + '详情'"
    :visible="showSalaryDetail"
    width="50%"
    style="padding: 15px"
    @close="closeDialog"
  >
    <el-table :data="salaryDetailProps.repairDetailResVoList" style="width: 100%;">
      <el-table-column type="index" label="序号" width="50"> </el-table-column>
      <el-table-column
        prop="itemName"
        label="事项名称"
        min-width="85"
      >
      </el-table-column>
      <el-table-column
        prop="repairAmount"
        label="金额（元）"
        min-width="130"
      >
      </el-table-column>
      <!-- <el-table-column
        label="补发/补扣"
        min-width="130"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.type === 1 ? '补发' : '补扣' }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="mark" label="备注" min-width="130">
      </el-table-column>
      <el-table-column prop="operator" label="操作人" min-width="85">
      </el-table-column>
      <el-table-column prop="operateTime" label="操作时间" min-width="120">
      </el-table-column>
    </el-table>
    <el-row style="margin: 20px 20px 0 0;">
      <el-col :span="22">
        <!-- <p>合计补发补扣金额（元）：{{ salaryDetailProps.reissueAmountTotal }}</p> -->
        <!-- <p v-if="salaryDetailProps.deductionAmountTotal !== null">合计补扣金额（元）：{{ salaryDetailProps.deductionAmountTotal }}</p> -->
      </el-col>
      <!-- <el-col :span="2">
        <el-button size="mini" type="primary" @click="closeDialog"
          >确定</el-button
        >
      </el-col> -->
    </el-row>
  </el-dialog>
</template>

<script>
import { parseTime } from "@/libs/util";
export default {
  props: {
    title: { type: String, required: false },
    showSalaryDetail: { type: Boolean },
    salaryType: { type: Number },
    manualAmount: { type: Number },
    salaryDetailProps: { type: Object, required: false }
  },
  data() {
    return {};
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialogHandle", "salaryDetail");
    }
  }
};
</script>
