<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="导入数据"
    :visible="batchInsertVisible"
    width="75%"
    @close="closeDialog"
  >
    <div v-if="isBondManage" class="tips">导入数据示例模板&nbsp;&nbsp; <span style="font-size: 13px; color: gray">(导入的数据超过<span
      style="color: red"
    >500条</span>的，系统只会对<span
      style="color: red"
    >前500条</span>进行验证及录入处理，超过的部分将跳过所有处理环节) </span>
    </div>
    <div v-if="importRule" class="tips">导入数据示例模板&nbsp;&nbsp; <span style="font-size: 13px; color: gray">(导入的数据超过<span
      style="color: red"
    >2000条</span>的，系统只会对<span
      style="color: red"
    >前2000条</span>进行验证及录入处理，超过的部分将跳过所有处理环节) </span>
    </div>
    <div v-if="importInterview" class="tips">导入数据示例模板&nbsp;&nbsp; <span style="font-size: 13px; color: gray">(导入的数据超过<span
      style="color: red"
    >200条</span>的，系统只会对<span
      style="color: red"
    >前200条</span>进行验证及录入处理，超过的部分将跳过所有处理环节) </span>
    </div>
    <!-- <div class="tips" v-else>导入数据示例模板&nbsp;&nbsp; <span style="font-size: 13px; color: gray">(导入的数据超过<span
      style="color: red">100条</span>的，系统只会对<span
      style="color: red">前100条</span>进行验证及录入处理，超过的部分将跳过所有处理环节) </span>
    </div> -->

    <!--<img src="../../assets/templateAndNote.png" width="100%"  @click="dialogVisible = true"/>-->
    <template v-for="srcPath in notePictureArr" v-if="batchInsertVisible">
      <img :src="srcPath.src" width="100%" @click="dialogVisible = true" />
    </template>

    <!--<el-table-->
    <!--:data="templateData"-->
    <!--style="width: 100%">-->
    <!--<el-table-column-->
    <!--prop="name"-->
    <!--label="姓名"-->
    <!--min-width="70">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="mobile"-->
    <!--label="手机号"-->
    <!--min-width="115">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="idCard"-->
    <!--label="身份证号"-->
    <!--min-width="160">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="a"-->
    <!--label="面试结果"-->
    <!--min-width="80">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="b"-->
    <!--label="面试人"-->
    <!--min-width="65">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="c"-->
    <!--label="面试时间"-->
    <!--min-width="100">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="d"-->
    <!--label="面试地点"-->
    <!--min-width="100">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="e"-->
    <!--label="面试备注"-->
    <!--min-width="100">-->
    <!--</el-table-column>-->
    <!--</el-table>-->
    <!--<el-table-->
    <!--:data="templateData1"-->
    <!--style="width: 100%">-->
    <!--<el-table-column-->
    <!--prop="a"-->
    <!--label="性格测试结果"-->
    <!--min-width="70">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="b"-->
    <!--label="性格测试人"-->
    <!--min-width="100">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="c"-->
    <!--label="性格测试时间"-->
    <!--min-width="100">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="d"-->
    <!--label="性格测试备注"-->
    <!--min-width="100">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="e"-->
    <!--label="路试结果"-->
    <!--min-width="70">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="f"-->
    <!--label="路试人"-->
    <!--min-width="100">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="g"-->
    <!--label="路试时间"-->
    <!--min-width="100">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="h"-->
    <!--label="路试备注"-->
    <!--min-width="100">-->
    <!--</el-table-column>-->
    <!--</el-table>-->
    <!--<br/>-->
    <!--<el-table-->
    <!--:data="templateData2"-->
    <!--style="width: 100%">-->
    <!--<el-table-column-->
    <!--prop="a"-->
    <!--label="姓名"-->
    <!--min-width="70">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="b"-->
    <!--label="手机号"-->
    <!--min-width="80">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="c"-->
    <!--label="身份证号"-->
    <!--min-width="100">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="d"-->
    <!--label="培训状态"-->
    <!--min-width="75">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="e"-->
    <!--label="培训班次"-->
    <!--min-width="70">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="f"-->
    <!--label="课程名称"-->
    <!--min-width="100">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="g"-->
    <!--label="培训成绩"-->
    <!--min-width="80">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="h"-->
    <!--label="培训师"-->
    <!--min-width="80">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="i"-->
    <!--label="培训地点"-->
    <!--min-width="100">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="j"-->
    <!--label="培训时间"-->
    <!--min-width="100">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="k"-->
    <!--label="培训课时"-->
    <!--min-width="85">-->
    <!--</el-table-column>-->
    <!--</el-table>-->
    <!--<br/>-->
    <!--<el-table-->
    <!--:data="templateData3"-->
    <!--style="width: 100%">-->
    <!--<el-table-column-->
    <!--prop="a"-->
    <!--label="体检者姓名"-->
    <!--min-width="80">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="b"-->
    <!--label="身份证"-->
    <!--min-width="110">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="c"-->
    <!--label="体检机构名称"-->
    <!--min-width="100">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="d"-->
    <!--label="体检套餐"-->
    <!--min-width="100">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="e"-->
    <!--label="到检日期"-->
    <!--min-width="120">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="f"-->
    <!--label="体检结果"-->
    <!--min-width="90">-->
    <!--</el-table-column>-->
    <!--</el-table>-->

    <el-row>
      <el-col :span="12">
        <a :href="templateHref">
          <el-button type="primary" size="small" style="width: 67%; margin-top: 30px; margin-left: 30px">下载模板
          </el-button>
        </a>
        <div style="margin: 15px 0 0 30px">
          <upload type="excel" :action="action"
                  :interface="interface" :buttonText="'点击(拖拽)上传excel文件'" :draggable="true" @handleUploadSuccess="handleUploadSuccess"
          />
        </div>
      </el-col>

    </el-row>
  </el-dialog>
</template>

<script>
import upload from "_o/components/operator-center/salary-modules/components/upload";
import config from "@/config/config";
import { isDev } from "@/micro/registerApp/appEntry";
// import {getTemplate} from "_o/api/salary/resume";
const apiUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro

const currentPath = "/resumePage";

export default {
  components: { upload },
  props: {
    batchInsertVisible: { type: Boolean, required: false },
    notePictureArr: {
      type: Array,
      required: false,
      default: () => {
        return []
      },
    },
    isBondManage: {
      type: Boolean,
      default: false
    },
    importRule: {
      type: Boolean,
      default: false
    },
    importInterview: {
      type: Boolean,
      default: false
    },
    templateHref: { type: String, required: false, default: "" },
    importAction: { type: String, required: false, default: "" },
    interface: { type: Function }
  },
  data() {
    return {
      action: apiUrl + "/m2-driver-resume-web" + this.importAction,
      excelAction: "",
      templateData: [
        {
          name: "张三",
          mobile: "18855556666",
          idCard: "220101197709190312",
          a: "通过",
          b: "赵考官",
          c: "20190112 10:30",
          d: "杭州",
          e: "优秀"
        }
      ],
      templateData1: [
        {
          a: "通过",
          b: "钱考官",
          c: "20190113 09:30",
          d: "良好",
          e: "不通过",
          f: "孙考官",
          g: "20190115 15:00",
          h: "不会用导航"
        }
      ],
      templateData2: [
        {
          a: "张三",
          b: "18855556666",
          c: "220101197709190312",
          d: "通过",
          e: "20190119001",
          f: "安全教育",
          g: "90",
          h: "李老师",
          i: "江苏省南京市江宁区国际企业园B4栋208室",
          j: "20190113 09:30",
          k: "12"
        }
      ],
      templateData3: [
        {
          a: "张三",
          b: "220101197709190000",
          c: "爱康国宾江宁分院",
          d: "ab-男组",
          e: "2018/4/29 13:00:00",
          f: "合格"
        }
      ],
      dialogVisible: false
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialogHandle", "batchAdd");
    },
    handleUploadSuccess(json) {
      this.$emit("successReload", json);
    },
  }
}
</script>

<style scoped>
  .tips {
    font-weight: bold;
    color: gray;
    margin: 15px;
    font-size: 16px;
  }
</style>
