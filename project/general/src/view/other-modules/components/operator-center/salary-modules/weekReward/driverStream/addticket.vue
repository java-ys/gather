<template>
  <div>
    <el-dialog
      title="手工扣款"
      :visible.sync="dialogVisible"
      width="42%"
      :before-close="cancel"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form ref="formTime" :inline="true" :model="form">
          <el-form-item label="司机姓名" style="margin-left: 24px">
            <div style="width: 202px">{{form.name}}</div>
          </el-form-item>
          <el-form-item label="扣款日期" style="margin-left: 12px">
            <div style="width: 202px">{{form.moneyDate}}</div>
          </el-form-item>
        </el-form>
        <el-form ref="formChild" :inline="true" :model="form">
          <div v-for="(item, index) in form.list">
            <el-form-item label="扣款项目" style="margin-left: 12px" :prop="'list.' + index + '.moneyItem'" :rules="[{ required: true, message: '必填字段', trigger: 'blur' }]">
              <el-input v-model="item.moneyItem" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="扣款金额" style="margin-left: 12px" :prop="'list.' + index + '.money'" :rules="[{ required: true, message: '必填字段', trigger: 'blur' },{ validator: validNumber, trigger: 'blur' }]">
              <el-input v-model="item.money"></el-input>
            </el-form-item>
            <el-button v-if="index + 1 != 0 && form.list.length != 1" type="primary" icon="el-icon-minus" @click="deleteItem(index)"></el-button>
            <el-button v-if="index + 1 == form.list.length" type="primary" icon="el-icon-plus" @click="addItem(index)"></el-button>
          </div>
        </el-form>
        <el-form-item label="备注" style="display: block;margin-left: 12px">
          <el-input v-model="form.remark" maxlength="120" style="width: 86%" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitChange">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { queryDeductMoney } from "_o/api/salary/salary";
import { parseTime } from "@/libs/util"
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    ticketRow: "",
  },
  data() {
    return {
      form: {
        moneyDate: "",
        remark: "",
        list: [
          {
            money: "",
            moneyItem: ""
          },
        ]
      },
      delIdList: []
    }
  },
  watch: {
    dialogVisible() {
      if (!this.dialogVisible) {
        this.$refs["formChild"].resetFields();
        this.$refs["formTime"].resetFields();
        this.delIdList = [];
        this.form = {
          moneyDate: "",
          remark: "",
          list: [
            {
              money: "",
              moneyItem: ""
            }
          ]
        }
      }
    }
  },
  methods: {
    validNumber(rule, val, callback) {
      let reg = /(^[0-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1,2}$)/;
      if (!reg.test(val)) {
        callback(new Error("请输入正确得数字,最多保留两位小数"));
      } else {
        callback();
      }
    },
    init(row) {
      queryDeductMoney({
        salaryUuid: row.uuid,
        moneyType: "2"
      }).then((res) => {
        let data = res.data.data.list;
        let date = ""
        if (data.length && data[0].updateTime) {
          date = parseTime(new Date(data[0].updateTime).getTime(), "{y}-{m}-{d}");
        } else {
          date = parseTime(new Date().getTime(), "{y}-{m}-{d}");
        }
        this.form.moneyDate = date;
        this.form.remark = data.length ? data[0].remark : "";
        this.form.name = row.driverName;
        this.form.list = data.length ? data : [
          {
            money: "",
            moneyItem: ""
          }
        ]
      })
    },
    cancel() {
      this.$emit("cancelChange");
    },
    submitChange() {

      this.$refs["formChild"].validate((valid) => {
        if (valid) {
          let arr = [];
          this.form.list.forEach(element => {
            arr.push({
              money: element.money,
              moneyItem: element.moneyItem,
              moneyDate: this.form.moneyDate,
              remark: this.form.remark,
              driverUuid: this.ticketRow.driverUuid,
              salaryUuid: this.ticketRow.uuid,
              moneyType: "2",
              id: element.id,
            })
          });
          this.$emit("submitChange", arr, this.delIdList);
        } else {
          this.$message({
            message: "手工扣款信息不完整请补充完整",
            type: "warning"
          });
        }
      })
    },
    addItem() {
      this.form.list.push({
        money: "",
        moneyItem: ""
      })
    },
    deleteItem(index) {
      this.delIdList.push(this.form.list[index].id)
      this.form.list.splice(index, 1);
    }
  }
};
</script>
