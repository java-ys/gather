<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-09-15 15:19:58
 * @LastEditors: wangp
 * @LastEditTime: 2020-09-25 13:45:00
-->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    :visible="showSalaryModal"
    width="35%"
    @close="closeDialog"
  >
    <el-form ref="salaryForm" :model="salaryData" :rules="rules">
      <el-row style="height: 20px">
        <el-col :span="12">
          <el-form-item label="司机姓名：" size="mini" label-width="110px">
            {{salaryData.driverName}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="dateType === 'week' ? '奖励周：' : '薪酬月份：'"
            size="mini"
            label-width="110px"
          >
            {{salaryData.salaryPeriod}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-card
        v-for="(item, index) in salaryData.itemList"
        :key="index"
        style="margin-top: 10px"
      >
        <el-row style="margin-top: 10px">
          <el-col :span="12">
            <el-form-item
              v-if="salaryType === 1"
              label="事项名称："
              size="mini"
              label-width="110px"
              :prop="'itemList.' + index + '.itemName'"
              :rules="[
                { required: true, message: '请输入补发事项', trigger: 'blur' },
                {
                  max: 12,
                  message: '长度最大为12个字符',
                  trigger: 'blur'
                }
              ]"
            >
              <el-input v-model="item.itemName" style="width: 120px"></el-input>
            </el-form-item>
            <el-form-item
              v-if="salaryType === 2"
              label="事项名称："
              size="mini"
              label-width="110px"
              :prop="'itemList.' + index + '.itemName'"
              :rules="[
                { required: true, message: '请输入补扣事项', trigger: 'blur' },
                {
                  max: 12,
                  message: '长度最大为12个字符',
                  trigger: 'blur'
                }
              ]"
            >
              <el-input
                v-model="item.itemName"
                maxlength="12"
                style="width: 120px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="salaryType === 1"
              label="金额："
              size="mini"
              label-width="110px"
              :prop="'itemList.' + index + '.repairAmount'"
              :rules="[
                { required: true, message: '不能为空', trigger: 'blur' },
                { validator: validateAmount, trigger: 'blur' }
              ]"
            >
              <el-input
                v-model="item.repairAmount"
                style="width: 120px"
              ></el-input>
              <span>&nbsp;元</span>
            </el-form-item>
            <el-form-item
              v-if="salaryType === 2"
              label="金额："
              size="mini"
              label-width="110px"
              :prop="'itemList.' + index + '.repairAmount'"
              :rules="[
                { required: true, message: '不能为空', trigger: 'blur' },
                { validator: validateAmount, trigger: 'blur' }
              ]"
            >
              <el-input
                v-model="item.repairAmount"
                style="width: 120px"
              ></el-input>
              <span>&nbsp;元</span>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="补发/补扣" label-width="110px" size="mini" :prop="'itemList.' + index + '.type'" :rules="[{required: true, message: '请选择', trigger: 'change'}]">
              <el-select v-model="item.type" :disabled="item.id ? true : false" placeholder="请选择" style="width: 200px">
                <el-option label="补发" :value="1"></el-option>
                <el-option label="补扣" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item
              label="备注："
              size="mini"
              label-width="110px"
              :prop="'itemList.' + index + '.itemName'"
            >
              <el-input
                v-model="item.mark"
                type="textarea"
                maxlength="100"
                :rows="4"
                show-word-limit
                style="width: 100%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="item.operateTime && item.operateTime !== ''"
              label="上次操作时间："
              size="mini"
              label-width="110px"
            >
              {{item.operateTime}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="item.operator && item.operator !== ''"
              label="操作人："
              size="mini"
              label-width="110px"
            >
              {{item.operator}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex;justify-content:center">
          <el-button type="primary" size="mini" @click="handleSave(index)">
            保存
          </el-button>
          <el-button type="info" size="mini" @click="closeDialog"> 取消 </el-button>
          <!-- <el-button @click="handleDelete(index)" type="info" size="mini">
            删除
          </el-button> -->
        </el-row>
      </el-card>
    </el-form>
    <div slot="footer" style="display: flex;justify-content:center">
      <!-- <el-button @click="handleAdd" type="primary" size="mini">
        添加补发补扣项
      </el-button> -->
      <!-- <el-button @click="closeDialog" type="info" size="mini"> 取消 </el-button> -->
    </div>
  </el-dialog>
</template>
<script>
import { toResult, validateAmount } from "_o/common/salaryMixin";
import { addOrEditSalaryModify, deleteSalaryModify } from "_o/api/salary/salaryRule";
export default {
  props: {
    salaryData: {
      type: Object,
      required: true,
      default: {}
    },
    dateType: { type: String, required: true, default: "week" },
    salaryType: { type: Number, required: true, default: 1 }, // '1' 补发  '2' 补扣
    showSalaryModal: { type: Boolean },
    title: { type: String, required: true, default: "" },
    salaryMode: { type: Number, required: true, default: 1 }
  },
  data() {
    return {
      validateAmount,
      rules: {}
    };
  },
  methods: {
    closeDialog(type) {
      this.$refs.salaryForm.resetFields();
      this.$emit("closeDialogHandle", "salaryEdit");
    },
    handleAdd() {
      let len = this.salaryData.itemList.length;
      if (len > 9) {
        this.$message.error("最多添加10条补发/补扣项");
      } else {
        let salaryId = this.salaryData.salaryId;
        this.salaryData.itemList.push({
          itemName: "",
          repairAmount: "",
          taxType: "",
          mark: "",
          salaryId: salaryId
        });
      }
    },
    handleDelete(index) {
      let len = this.salaryData.itemList.length;
      let id = this.salaryData.itemList[index].id;
      if (id) {
        this.$confirm("删除后该补发补扣事项将不再生效，是否确定删除？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            const [err, data] = await toResult(deleteSalaryModify({ id: id }));
            if (err) {
              this.$alert(err.message);
              return;
            }
            this.$alert("删除成功");
            if (len <= 1) {
              this.$emit("closeDialogHandle", "salaryEdit");
            } else {
              this.salaryData.itemList.splice(index, 1);
            }
          })
          .catch(() => {});
      } else {
        if (len <= 1) {
          this.$message.error("至少保留一项");
        } else {
          this.salaryData.itemList.splice(index, 1);
        }
      }
    },
    handleSave(index) {
      this.$refs["salaryForm"].validate(async valid => {
        if (valid) {
          let params = this.salaryData.itemList[index];
          params.taxType = this.salaryType;
          params.salaryType = this.salaryMode;
          const [err, data] = await toResult(addOrEditSalaryModify(params));
          if (err) {
            this.$alert(err.message);
            return;
          }
          let len = this.salaryData.itemList.length;
          if (len === 1) {
            this.$emit("closeDialogHandle", "salaryEdit");
          } else {
            this.salaryData.itemList.splice(index, 1);
          }
          this.$alert("保存成功");
        }
      });
    }
  }
};
</script>
<style scoped>
.button-header {
  display: flex;
  justify-content: flex-end;
}
</style>
