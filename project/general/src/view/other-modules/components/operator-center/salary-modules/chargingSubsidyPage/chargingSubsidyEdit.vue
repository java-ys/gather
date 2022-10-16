<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="title" :visible="editVisible" width="85%" @close="closeDialog">
    <el-form ref="editForm" :inline="true" :rules="rules" :model="editForm" class="demo-form-inline" size="small" label-width="120px">
      <el-row>
        <el-col v-if="isEdit" :span="12">
          <el-form-item label="城市" prop="cityUuid">
            {{editForm.cityName}}
          </el-form-item>
        </el-col>
        <el-col v-else :span="12">
          <el-form-item label="城市" prop="cityUuid">
            <el-select v-model="editForm.cityUuid" placeholder="城市" filterable @change="setCityName">
              <template v-for="(cityObj, index) in cities">
                <el-option :key="index" :label="cityObj.orgName" :value="cityObj.orgCode"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单价(元/度)" prop="price">
            <el-input v-model="editForm.price" placeholder="单价" maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="起始月份" prop="startTime">
            <el-date-picker v-model="editForm.startTime" class="win-300" type="month" placeholder="起始月份" value-format="yyyy-MM-dd" :clearable="false"
                            :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束月份" prop="endTime">
            <el-date-picker v-model="editForm.endTime" class="win-300" type="month" placeholder="结束月份" value-format="yyyy-MM-dd" :clearable="false"
                            :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="系数" prop="ratio">
            <el-input v-model="editForm.ratio" placeholder="系数" maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="车型" prop="carLevelCodes">
            <el-checkbox :key="allCheck" v-model="allCheck" label="全选" @change="checkAll">全选</el-checkbox></br>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-loadPage="getCarTypePage" class="carTypeList">
        <el-col :span="24">
          <template v-for="(obj, i) in carType">
            <el-col :span="10" :offset="2" style="height:35px;">
              <el-checkbox :key="i" v-model="obj.check" :label="obj.name.carLevelCode" @change="checkOne">
                {{obj.name.brandName}}-{{obj.name.seriesName}}-{{obj.name.carLevelCode}}-{{obj.name.carLevelName}}-{{obj.name.fuelType}}</el-checkbox>
            </el-col>
            <template v-if="i != 0 && (i + 1) % 6 === 0"><br /></template>
          </template>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer" style="width:93%;margin:5px 30px;display:flex;align-items:center;justify-content:space-between;flex-flow:row-reverse;">
      <div class="button-group">
        <el-button v-show="!saving" type="primary" @click="confirmSave">保存</el-button>
        <el-button type="info" @click="closeDialog">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getMonthLastDay } from "_o/common/common";
import { parseTime } from "@/libs/util";
import { cityListByAll, queryCitiesWithAgent, queryCitiesWithJurisdiction } from "_o/api/salary/common";
import { getCarTypePage, chargeSubsidySaveOrUpdate } from "_o/api/salary/salary";
export default {
  props: {
    isEdit: { type: Boolean, required: false, default: false },
    title: { type: String, required: false },
    editVisible: { type: Boolean, required: false },
    editForm: {
      type: Object,
      required: false,
      default: {}
    }
  },
  data() {
    return {
      currentPage: 1,
      saving: false,
      cities: [],
      allCheck: false,
      carType: [],
      rules: {
        price: [
          { validator: this.validatePrice, trigger: "blur" },
          { required: true, message: "当前项不能为空", trigger: "blur" }
        ],
        ratio: [
          { validator: this.validatePrice, trigger: "blur" },
          { required: true, message: "当前项不能为空", trigger: "blur" }
        ],
        cityUuid: [
          { required: true, message: "请选择城市", trigger: "change" },
          { required: true, message: "请选择城市", trigger: "blur" }
        ],
        startTime: [
          { validator: this.validateValidTime, trigger: "change" },
          { validator: this.validateValidTime, trigger: "blur" },
          { required: true, message: "当前项不能为空", trigger: "blur" }
        ],
        endTime: [
          { validator: this.validateValidTime, trigger: "change" },
          { validator: this.validateValidTime, trigger: "blur" },
          { required: true, message: "当前项不能为空", trigger: "blur" }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      }
    };
  },
  created() {
    this.getCities();
    this.getCarTypePage();
  },
  methods: {
    // 关闭弹框
    closeDialog() {
      this.$refs["editForm"].resetFields();
      this.$emit("closeDialogHandle", "edit");
    },
    // 保存
    confirmSave() {
      this.$refs["editForm"].validate(valid => {
        if (new Date(this.editForm.startTime).getTime() > new Date(this.editForm.endTime).getTime()) {
          this.$alert("生效起始时间不能晚于生效结束时间");
        } else if (valid) {
          this.editForm.carLevelCodes = "";
          this.carType.forEach(each => {
            if (each.check) {
              this.editForm.carLevelCodes += each.name.carLevelCode + ",";
            }
          });
          if (!this.editForm.carLevelCodes) {
            this.$alert("请至少选择一个车型");
          } else {
            this.editForm.endTime = parseTime(getMonthLastDay(this.editForm.endTime), "{y}-{m}-{d}");
            if (this.editForm.startTime.length > 10) {
              this.editForm.startTime = this.editForm.startTime.substr(0, 10);
            }
            this.editForm.carLevelCodes = this.editForm.carLevelCodes.substr(0, this.editForm.carLevelCodes.length - 1);
            delete this.editForm.cityName;
            this.saving = true;
            chargeSubsidySaveOrUpdate(this.editForm)
              .then(res => {
                if (res.data.success) {
                  this.$emit("successHandle");
                } else {
                  this.saving = false;
                  this.$alert(res.data.msg ? res.data.msg : "规则保存失败");
                }
              })
              .catch(() => {
                this.saving = false;
                this.$alert("服务器异常，规则保存失败，请稍后重试");
              });
          }
        }
      });
    },
    // 车型全选/全不选
    checkAll(val) {
      if (val) {
        this.carType.forEach((each, i) => {
          this.carType[i].check = true;
        });
      } else {
        this.carType.forEach((each, i) => {
          this.carType[i].check = false;
        });
      }
    },
    // 根据选择车型的数量判定需不需要把全选值改变
    checkOne() {
      let checkFlag = true;
      for (let i in this.carType) {
        if (!this.carType[i].check) {
          checkFlag = false;
          break;
        }
      }
      this.allCheck = checkFlag;
    },
    // 校验单价和系数
    validatePrice(rule, value, callback) {
      if (!value) {
        return callback(new Error("当前项不能为空"));
      } else if (value && !/^\d+(\.\d+)?$/.test(value)) {
        return callback(new Error("必须是不小于0的数字"));
      } else if (value && value != 0 && !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) {
        return callback(new Error("小数点后只能保留两位"));
      } else if (!value || (value >= 0 && value < 100)) {
        return callback();
      } else {
        return callback(new Error("只能输入100以内的数字"));
      }
    },
    // 校验起止时间
    validateValidTime(rule, value, callback) {
      // console.info(rule);
      let desc; let
        compareDate;
      if (rule.field === "startTime") {
        desc = "起始";
        compareDate = new Date(this.editForm.endTime);
      } else {
        desc = "结束";
        compareDate = new Date(this.editForm.startTime);
      }
      let inputDate = new Date(value);
      let now = new Date();
      if (!value) {
        return callback(new Error("请选择生效" + desc + "时间"));
      } else if (
        desc === "起始" &&
        ((inputDate.getFullYear() === compareDate.getFullYear() && inputDate.getMonth() > compareDate.getMonth()) ||
          inputDate.getFullYear() > compareDate.getFullYear())
      ) {
        return callback(new Error("起始时间不能晚于结束时间"));
      } else if (
        desc === "结束" &&
        ((inputDate.getFullYear() === compareDate.getFullYear() && inputDate.getMonth() < compareDate.getMonth()) ||
          compareDate.getFullYear() > inputDate.getFullYear())
      ) {
        return callback(new Error("结束时间不能早于起始时间"));
      } else {
        return callback();
      }
    },
    setCityName(val) {
      for (let idx in this.cities) {
        if (val == this.cities[idx].orgCode) {
          this.editForm.cityName = this.cities[idx].orgName;
        }
      }
    },
    getCities() {
      queryCitiesWithAgent({})
        .then(res => {
          if (res.data.success && res.data.data) {
            if (res.data.data.length === 0) {
              this.$alert("获取开通城市数据信息失败，请刷新页面重试");
            } else {
              this.cities = res.data.data.cities;
            }
          }
        })
        .catch(err => {
          this.$alert("获取数据信息失败，请刷新页面重试");
        });
    },
    statusWrapper(status) {
      switch (status) {
        case 0:
          return "汽油车";
        case 1:
          return "纯电动汽车";
        case 2:
          return "油电混合汽车";
        case 3:
          return "燃料电池汽车";
        case 4:
          return "增程式混动汽车";
        case 5:
          return "柴油汽车";
        case 6:
          return "天然气汽车";
        case 7:
          return "插电式混动汽车";
        default:
          return "";
      }
    },
    getCarTypePage() {
      let carArr = this.editForm.carLevelCodes ? this.editForm.carLevelCodes.split(",") : [];
      getCarTypePage({ currPage: this.currentPage, pageSize: 100 })
        .then(res => {
          if (res.data.success && res.data.data.list) {
            this.currentPage += 1;
            let _this = this;
            res.data.data.list.forEach(each => {
              let flag = false;
              for (let i in carArr) {
                if (carArr[i] === each.carLevelCode) {
                  flag = true;
                  break;
                }
              }
              each.fuelType = this.statusWrapper(each.fuelType);
              this.carType.push({
                name: each,
                check: flag
              });
            });
            this.checkOne();
          } else {
            this.$alert("获取车型失败，请稍后重试");
          }
        })
        .catch(() => {
          this.$alert("获取车型失败，请稍后重试");
        });
    }
  }
};
</script>

<style scoped lang="scss">
.win-300 {
  width: 200px;
}
.carTypeList {
  height: 550px;
  min-height: 500px;
  overflow-y:scroll;
}
</style>
