<template>
  <div class="approvalWrap">
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="指定审核人"
      :visible.sync="audit.visible"
      width="30%"
      @close="cancel"
    >
      <div>
        <span class="topTitle">一级审批人</span>
        <el-form label-width="60px" class="firstForm" :rules="rules">
          <el-form-item label="部门" prop="firstData">
            <treeSelect
              v-model="firstData"
              :listData="firstData"
              :testName="firstTestName"
              @on-select-change="firstSelectChange"
              @on-change="firstSearch"
            ></treeSelect>
          </el-form-item>
          <el-form-item label="姓名" prop="firstNameId">
            <el-select
              v-model="firstNameId"
              filterable
              placeholder=""
              @change="oneUserNameValue"
            >
              <div v-for="(item, index) in firstUserData" :key="index">
                <el-option :key="item.id" :label="item.name + '-' + item.empNo" :value="item.id">
                </el-option>
              </div>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <span class="topTitle">二级审批人</span>
        <el-form label-width="60px">
          <el-form-item label="部门">
            <treeSelect
              :listData="lastData"
              :testName="lastTestName"
              @on-select-change="lastSelectChange"
              @on-change="lastSearch"
            ></treeSelect>
          </el-form-item>
          <el-form-item label="姓名">
            <el-select
              v-model="lastNameId"
              filterable
              placeholder=""
              @change="twoUserNameValue"
            >
              <div v-for="(item, index) in lastUserData" :key="index">
                <el-option :key="item.id" :label="item.name + '-' + item.empNo" :value="item.id">
                </el-option>
              </div>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="isThreeLevel">
        <span class="topTitle">三级审批人</span>
        <el-form label-width="60px">
          <el-form-item label="部门">
            <treeSelect
              :listData="threeData"
              :testName="threeTestName"
              @on-select-change="threeSelectChange"
              @on-change="threeSearch"
            ></treeSelect>
          </el-form-item>
          <el-form-item label="姓名">
            <el-select
              v-model="threeNameId"
              filterable
              placeholder=""
              @change="threeUserNameValue"
            >
              <div v-for="(item, index) in threeUserData" :key="index">
                <el-option :key="item.id" :label="item.name + '-' + item.empNo" :value="item.id">
                </el-option>
              </div>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="importantType === 1" style="height:150px">
        <span style="float:left;margin-top:10px">上传审批附件:</span>
        <span style="float:left; margin-left:10px; margin-top:10px"><file-upload :action="fileAction" :params="{ id: optionId }"></file-upload></span>
        <el-button v-if="!isThreeLevel && hasPermission('approve-node-add')" type="primary" size="small" style="margin-top:10px;margin-left:10px" @click="setApprove">添加审批节点</el-button>
      </div>
      <!-- <div v-if="rewardType == 1 && isShow && salaryStatusList.btnStatus == '0' && salaryStatusList.flowLevel == '1' && salaryStatusList.appShow != 1"  style="padding:0 0 0 15px">
      <p>{{warnForm.cityName}}{{warnForm.currentYear}}年第{{warnForm.warnReward}}周周奖励初始计算结果,总人数{{details.totalPersonNum}},工资总额{{details.totalSalary}}元,平均薪资{{details.averageSalary}}元</p>
      <p>其中,有{{details.personNumOverAverage}}人本周周奖励高于三周平均薪资,超出额大于20%&nbsp;{{details.personNumOverTwentyPercent}}人,超出额大于50%&nbsp;{{details.personNumOverFiftyPercent}}人,超出额大于80%&nbsp;{{details.personNumOverEightyPercent}}人,具体可点击下载下方预警报表</p>

      </div> -->
      <!-- <div v-else-if="rewardType == 2 && isShow && salaryStatusList.btnStatus == '0' && salaryStatusList.flowLevel == '1' && salaryStatusList.appShow != 1"  style="padding:0 0 0 15px">
        <p>{{warnForm.cityName}}{{warnForm.salaryMonth ? warnForm.salaryMonth.split('-')[0] : ''}}年{{warnForm.salaryMonth ? warnForm.salaryMonth.split('-')[1] : ''}}月月工资初始计算结果,总人数{{details.totalPersonNum}},工资总额{{details.totalSalary}}元,平均薪资{{details.averageSalary}}元</p>
        <p>其中,有{{details.personNumOverAverage}}人本月月工资高于三月平均薪资,超出额大于20%&nbsp;{{details.personNumOverTwentyPercent}}人,超出额大于50%&nbsp;{{details.personNumOverFiftyPercent}}人,超出额大于80%&nbsp;{{details.personNumOverEightyPercent}}人,具体可点击下载下方预警报表</p>
      </div> -->
      <span slot="footer" class="dialog-footer">
        <!-- <el-button v-if="salaryStatusList.btnStatus == '0' && salaryStatusList.flowLevel == '1' && salaryStatusList.appShow != 1" @click="exportExcel(rewardType)">下载预警报表</el-button> -->
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="comfim">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { approval } from "./index.js";
import treeSelect from "./treeSelect";
import fileUpload from "_o/components/operator-center/salary-modules/common/salaryImport/fileUpload";
import { getWeekSalaryWarning, getMonthSalaryWarning } from "_o/api/salary/salary";
import { cancelUpload } from "_o/api/salary/salaryRule";
import {
  changeListKey,
  treeDataTranslate,
  excelDownload
} from "_o/common/common";
import { queryOrganList, queryUserInfo } from "_o/api/salary/common";
import {
  downLoadWeekSalaryWarning,
  downLoadMonthSalaryWarning
} from "_o/api/salary/exportApi";
import config from "@/config/config";
import { isDev } from "@/micro/registerApp/appEntry";
const apiUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro
export default {
  components: {
    treeSelect,
    fileUpload
  },
  props: {
    ruleUuid: {
      type: String,
      default: ""
    },
    optionId: {
      type: String,
      default: ""
    },
    warnForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    salaryStatusList: {
      type: Object,
      default: () => {
        return {};
      }
    },
    rewardType: {
      type: Number,
      default: 1
    },
    auditOptionsType: {
      type: Number,
      default: 1
    },
    auditBatchType: {
      type: Number
    },
    importantType: {
      type: Number
    }
  },
  data() {
    return {
      fileAction: apiUrl + "/salary-web-api/api/salary/v1/offlineRewards/uploadAttachment",
      id: "",
      ...approval,
      dialogVisible: this.visible,
      firstData: [],
      firstUserData: [],
      lastUserData: [],
      lastData: [],
      firstNameId: "",
      lastNameId: "",
      firstTestName: "",
      lastTestName: "",
      levelOneUserName: "",
      levelWtoUserName: "",
      threeData: [],
      threeUserData: [],
      threeNameId: "",
      threeTestName: "",
      levelThreeUserName: "",
      details: {
        totalPersonNum: "",
        totalSalary: "",
        averageSalary: "",
        personNumOverAverage: "",
        personNumOverTwentyPercent: "",
        personNumOverFiftyPercent: "",
        personNumOverEightyPercent: ""
      },
      isShow: false,
      isThreeLevel: false,
      rules: {
        firstData: [
          { required: true, message: "请输入部门", trigger: "blur" }
        ],
        firstNameId: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getOrganList();
  },
  methods: {
    setApprove() {
      this.isThreeLevel = true;
    },
    oneUserNameValue(value) {
      let obj = {};
      obj = this.firstUserData.find(item => {
        return item.id === value; // 筛选出匹配数据
      });
      this.levelOneUserName = obj ? obj.name : "";
    },
    twoUserNameValue(value) {
      let obj = {};
      obj = this.lastUserData.find(item => {
        return item.id === value; // 筛选出匹配数据
      });
      this.levelWtoUserName = obj ? obj.name : "";
    },
    threeUserNameValue(value) {
      let obj = {};
      obj = this.threeUserData.find(item => {
        return item.id === value; // 筛选出匹配数据
      });
      this.levelThreeUserName = obj ? obj.name : "";
    },
    exportExcel(rewardType) {
      let params = {};
      if (rewardType == 1) {
        params = {
          cityCode: this.warnForm.cityCode,
          queryWeek: this.warnForm.queryWeek
        };
        downLoadWeekSalaryWarning(params).then(res => {
          excelDownload(res.data, "周奖励预警报表数据信息");
        });
      } else {
        params = {
          cityCode: this.warnForm.cityCode,
          salaryMonth: this.warnForm.salaryMonth
        };
        downLoadMonthSalaryWarning(params).then(res => {
          excelDownload(res.data, "月奖励预警报表数据信息");
        });
      }
    },
    getWeekData() {
      let params = {
        cityCode: this.warnForm.cityCode,
        queryWeek: this.warnForm.queryWeek
      };
      getWeekSalaryWarning(params).then(res => {
        if (res.data.success) {
          this.details = res.data.data;
          console.log("rewardType", this.rewardType);
          this.isShow = true;
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        }
      });
    },
    getMonthData() {
      let params = {
        cityCode: this.warnForm.cityCode,
        salaryMonth: this.warnForm.salaryMonth
      };
      getMonthSalaryWarning(params).then(res => {
        if (res.data.success) {
          this.details = res.data.data;
          console.log("rewardType", this.rewardType);
          this.isShow = true;
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        }
      });
    },
    getOrganList() {
      queryOrganList().then(res => {
        if (res.data.success) {
          let data = res.data.data;
          let first = JSON.parse(JSON.stringify(data));
          let last = JSON.parse(JSON.stringify(data));
          changeListKey(first, "name", "label");
          changeListKey(first, "id", "value");
          changeListKey(first, "name", "title");
          changeListKey(last, "name", "label");
          changeListKey(last, "id", "value");
          changeListKey(last, "name", "title");
          this.firstData = treeDataTranslate(first);
          this.lastData = treeDataTranslate(last);
          this.threeData = treeDataTranslate(last);
        }
      });
    },
    firstSelectChange(value, item) {
      this.firstNameId = "";
      if (item.selected || item.check) {
        this.firstTestName = item.name;
        item.check = false;
        item.selected = true;
        let arr = [item.id];
        let organId = [];
        if (item.children) {
          new Promise((resolve, reject) => {
            organId = this.checkId(item, arr);
            resolve();
          }).then(() => {
            queryUserInfo({ organIdList: organId }).then(res => {
              if (res.data.success) {
                this.firstUserData = res.data.data;
              }
            });
          });
        } else {
          queryUserInfo({ organIdList: arr }).then(res => {
            if (res.data.success) {
              this.firstUserData = res.data.data;
            }
          });
        }
      } else {
        this.firstTestName = "";
        this.firstUserData = [];
      }
    },
    lastSelectChange(value, item) {
      this.lastNameId = "";
      if (item.selected || item.check) {
        this.lastTestName = item.name;
        item.check = false;
        item.selected = true;
        let arr = [item.id];
        let organId = [];
        if (item.children) {
          new Promise((resolve, reject) => {
            organId = this.checkId(item, arr);
            resolve();
          }).then(() => {
            queryUserInfo({ organIdList: organId }).then(res => {
              if (res.data.success) {
                this.lastUserData = res.data.data;
              }
            });
          });
        } else {
          queryUserInfo({ organIdList: arr }).then(res => {
            if (res.data.success) {
              this.lastUserData = res.data.data;
            }
          });
        }
      } else {
        this.lastTestName = "";
        this.lastUserData = [];
      }
    },
    threeSelectChange(value, item) {
      this.threeNameId = "";
      if (item.selected || item.check) {
        this.threeTestName = item.name;
        item.check = false;
        item.selected = true;
        let arr = [item.id];
        let organId = [];
        if (item.children) {
          new Promise((resolve, reject) => {
            organId = this.checkId(item, arr);
            resolve();
          }).then(() => {
            queryUserInfo({ organIdList: organId }).then(res => {
              if (res.data.success) {
                this.threeUserData = res.data.data;
              }
            });
          });
        } else {
          queryUserInfo({ organIdList: arr }).then(res => {
            if (res.data.success) {
              this.threeUserData = res.data.data;
            }
          });
        }
      } else {
        this.threeTestName = "";
        this.threeUserData = [];
      }
    },
    checkId(item, arr) {
      item.children.forEach(res => {
        arr.push(res.id);
        if (res.children) {
          this.checkId(res, arr);
        }
      });
      return arr;
    },
    firstSearch(value) {
      function hasChildMath(node, text) {
        // 父级展开
        const children = node.children || [];
        return children.some(c => {
          if (!text) return false;
          if (c.name && c.name.includes(text)) return true;
          return hasChildMath(c, text);
        });
      }
      function hasChild(node, text) {
        // 给子集加颜色
        if (!text) return false;
        if (node.name && node.name.includes(text)) return true;
      }
      function walkNode(node, cb) {
        cb(node);
        const children = node.children || [];
        children.forEach(c => walkNode(c, cb));
      }
      const root = {
        name: "",
        children: JSON.parse(JSON.stringify(this.firstData))
      };
      walkNode(root, node => {
        node.expand = hasChildMath(node, value);
        node.selected = hasChild(node, value);
        node.check = true;
      });
      this.firstData = root.children;
    },
    lastSearch(value) {
      function hasChildMath(node, text) {
        // 父级展开
        const children = node.children || [];
        return children.some(c => {
          if (!text) return false;
          if (c.name && c.name.includes(text)) return true;
          return hasChildMath(c, text);
        });
      }
      function hasChild(node, text) {
        // 给子集加颜色
        if (!text) return false;
        if (node.name && node.name.includes(text)) return true;
      }
      function walkNode(node, cb) {
        cb(node);
        const children = node.children || [];
        children.forEach(c => walkNode(c, cb));
      }
      const root = {
        name: "",
        children: JSON.parse(JSON.stringify(this.lastData))
      };
      walkNode(root, node => {
        node.expand = hasChildMath(node, value);
        node.selected = hasChild(node, value);
        node.check = true;
      });
      this.lastData = root.children;
    },
    threeSearch(value) {
      function hasChildMath(node, text) {
        // 父级展开
        const children = node.children || [];
        return children.some(c => {
          if (!text) return false;
          if (c.name && c.name.includes(text)) return true;
          return hasChildMath(c, text);
        });
      }
      function hasChild(node, text) {
        // 给子集加颜色
        if (!text) return false;
        if (node.name && node.name.includes(text)) return true;
      }
      function walkNode(node, cb) {
        cb(node);
        const children = node.children || [];
        children.forEach(c => walkNode(c, cb));
      }
      const root = {
        name: "",
        children: JSON.parse(JSON.stringify(this.threeData))
      };
      walkNode(root, node => {
        node.expand = hasChildMath(node, value);
        node.selected = hasChild(node, value);
        node.check = true;
      });
      this.threeData = root.children;
    },
    comfim() {
      // let currentId = this.store.get("userId");
      if (
        this.lastNameId &&
        this.firstNameId &&
        this.lastNameId == this.firstNameId
      ) {
        this.$message({
          message: "一级审核人和二级审核人不能相同",
          type: "warning"
        });
      }
      //  else if (
      //   currentId == this.lastNameId ||
      //   currentId == this.firstNameId
      // ) {
      //   this.$message({
      //     message: "审核人不能是自己",
      //     type: "warning"
      //   });
      // }
      else if (this.firstNameId || (this.lastNameId && this.firstNameId)) {
        let data = {};
        // 一级审核
        if (this.firstNameId && !this.lastNameId) {
          if (this.lastTestName) {
            this.$message({
              message: "审核人信息不完整请补充完整",
              type: "warning"
            });
          } else {
            if (this.auditOptionsType == 1) {
              data = {
                auditOptionsType: this.auditOptionsType,
                optionId: this.ruleUuid,
                levelOneUserUuid: this.firstNameId,
                levelOneUserName: this.levelOneUserName
              };
            } else if (this.auditOptionsType == 2) {
              data = {
                auditOptionsType: this.auditOptionsType,
                auditBatchType: this.auditBatchType,
                optionId: this.optionId,
                levelOneUserUuid: this.firstNameId,
                levelOneUserName: this.levelOneUserName
              };
            } else if (this.auditOptionsType == 3 || this.auditOptionsType == 4) {
              data = {
                auditOptionsType: this.auditOptionsType,
                optionId: this.optionId,
                levelOneUserUuid: this.firstNameId,
                levelOneUserName: this.levelOneUserName
              };
            }
            this.$emit("ruleSubmit", data);
          }
        } else {
          if (this.auditOptionsType == 1) {
            data = {
              auditOptionsType: this.auditOptionsType,
              optionId: this.ruleUuid,
              levelOneUserUuid: this.firstNameId,
              levelWtoUserUuid: this.lastNameId,
              levelThreeUserUuid: this.threeNameId,
              levelOneUserName: this.levelOneUserName,
              levelWtoUserName: this.levelWtoUserName,
              levelThreeUserName: this.levelThreeUserName
            };
          } else if (this.auditOptionsType == 2) {
            data = {
              auditOptionsType: this.auditOptionsType,
              auditBatchType: this.auditBatchType,
              optionId: this.optionId,
              levelOneUserUuid: this.firstNameId,
              levelWtoUserUuid: this.lastNameId,
              levelThreeUserUuid: this.threeNameId,
              levelOneUserName: this.levelOneUserName,
              levelWtoUserName: this.levelWtoUserName,
              levelThreeUserName: this.levelThreeUserName
            };
          } else if (this.auditOptionsType == 3 || this.auditOptionsType == 4) {
            data = {
              auditOptionsType: this.auditOptionsType,
              optionId: this.optionId,
              levelOneUserUuid: this.firstNameId,
              levelWtoUserUuid: this.lastNameId,
              levelThreeUserUuid: this.threeNameId,
              levelOneUserName: this.levelOneUserName,
              levelWtoUserName: this.levelWtoUserName,
              levelThreeUserName: this.levelThreeUserName
            };
          }
          this.$emit("ruleSubmit", data);
        }
      } else {
        this.$message({
          message: "审核人信息不完整请补充完整",
          type: "warning"
        });
      }
    },
    deleteFile() {
      if (this.importantType === 1) {
        cancelUpload({ id: this.optionId }).then((res) => {

        });
      }
    },
    cancel() {
      // 清空所有状态
      this.audit.visible = false;
      this.firstTestName = "";
      this.lastTestName = "";
      this.threeTestName = "";
      this.firstNameId = "";
      this.lastNameId = "";
      this.threeNameId = "";
      this.lastUserData = [];
      this.firstUserData = [];
      this.threeUserData = [];
      this.getOrganList();
      this.deleteFile();
    }
  }
};
</script>
<style scoped lang="scss">
.approvalWrap .topTitle {
  font-size: 14px;
  line-height: 40px;
  display: inline-block;
  margin-bottom: 10px;
  font-weight: bold;
}
.approvalWrap label {
  font-weight: normal;
}
.approvalWrap .el-form-item {
  margin-bottom: 5px;
}
.approvalWrap .el-dialog__body {
  overflow-y: auto !important;
  padding-top: 20px;
}
.approvalWrap .el-select {
  width: 100%;
}
::v-deep .approvalWrap .el-input__inner {
  height: 32px;
  line-height: 32px;
}
.approvalWrap .el-input__icon {
  line-height: 34px;
}
.approvalWrap .el-input {
  font-size: 12px;
}
::v-deep .firstForm .el-form-item{
  ::v-deep .el-form-item__label:before {
    content: "*" !important;
    display: inline-block !important;
    margin-right: 4px !important;
    font-size: 12px !important;
    color: #ed4014 !important;
  }
}
</style>
