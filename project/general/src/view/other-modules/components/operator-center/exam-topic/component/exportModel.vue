<template>
  <div>
    <Form ref="refForm" :model="exportItem" :label-width="100" :rules="topRules">
      <Row>
        <Col span="12">
          <FormItem label="题目类别：" prop="groupId">
            <Select
              v-model="exportItem.groupId"
              clearable
              :disabled="optDisabled"
              :label-in-value="true"
            >
              <Option
                v-for="item in optionList"
                :value="item.value"
                :key="item.value"
              >{{item.label}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <Input v-model="exportItem.typeTitle" class="item-style" placeholder="可输入新类别名称" />
        </Col>
      </Row>
      <Row>
        <span class="font-1">批量导入文件样式参照</span>
        <span class="font-2">（题目标题4-100字符内，答案4-50字符内）</span>
        <download-btn
          toUrl="/downloadExcel/考题批量导入模板.xlsx"
          baseUrlName="_base4Driver"
        ></download-btn>
        <!-- <Button
          size="small"
          type="primary"
          ghost
          baseUrlName="_base4Driver"
          to="'/downloadExcel/考题批量导入模板.xlsx'"
          target="_blank"
        >下载模板</Button> -->
        <Table
          :columns="tabelColumns"
          :data="tableData"
          style="margin-top: 20px; margin-bottom: 30px;"
        />
      </Row>
      <FormItem label="文件浏览：">
        <!-- todo action 替换 -->
        <Upload
          ref="upload"
          :before-upload="handleUpload"
          :action="downloadUrl+'/api/exam/question/import'"
          :data="uploadData"
          :headers="header"
          :show-upload-list="false"
          :on-success="handleSuccess"
          :on-error="handleError"
        >
          <Button>浏览</Button>
          <div v-if="file !== null">{{ file.name }}</div>
        </Upload>
      </FormItem>
    </Form>
    <div class="popView-footer-wrap">
      <Button size="large" type="text" style="margin-right: 8px;" @click="cancel">取消</Button>
      <Button size="large" type="primary" @click.native="confirm">确定</Button>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/libs/util";
import { demoColumn } from "../fields";
import { isFunc } from "_o/api/baseMixin.js";
import downloadBtn from "_a/download-btn/index.vue"

const tableData = [
  {
    topicName: "驾驶中出现瞌睡怎么办",
    correctAnswer: "1",
    answer1: "停车",
    answer2: "慢慢开",
    answer3: "继续飙车"
  }
];

export default {
  name: "AddModel",
  components: {
    downloadBtn
  },
  props: {
    exportItem: {
      type: Object,
      default: null
    },
    optionList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    "exportItem.typeTitle": {
      handler(newV, oldV) {
        if (newV) {
          let fi = this.$refs.refForm.fields;
          // 清空form字段校验
          let ff = fi.find(it => it.prop === "groupId");
          if (ff && isFunc(ff.resetField)) {
            ff.resetField();
          }
        }
        this.optDisabled = !!newV;
        this.topRules.groupId = newV
          ? []
          : [{ validator: this.validateGroupId, trigger: "change" }];
      },
      deep: true
    }
  },
  data() {
    return {
      optDisabled: false,
      topRules: {
        groupId: [{ validator: this.validateGroupId, trigger: "change" }],
        file: [{ required: true }]
      },
      tabelColumns: demoColumn,
      tableData,
      downloadUrl: this._base4Driver,
      header: { Authorization: getToken() },
      file: null,
      uploadData: {
        groupId: null,
        groupName: null
      }
    };
  },
  methods: {
    handleUpload(file) {
      this.file = file;
      return false;
    },
    async confirm() {
      this.$refs.refForm.validate(async valid => {
        if (!valid) {
          // this.$Message.error("表单验证不通过");
          return;
        }
        if (this.file === null) {
          this.$Message.error("请上传相关文件");
          return;
        }
        const { typeTitle, groupId } = this.exportItem;
        if (this.exportItem.typeTitle) {
          delete this.uploadData.groupId;
          this.uploadData.groupName = typeTitle;
        } else {
          delete this.uploadData.groupName;
          this.uploadData.groupId = groupId;
        }
        let uRef = this.$refs.upload;
        if (uRef && uRef.post) {
          uRef.post(this.file);
        }
      });
    },
    cancel() {
      this.$refs.refForm.resetFields();
      this.$emit("cancel");
    },
    validateGroupId(rule, value, callback) {
      if (this.exportItem.groupId) {
        callback();
      } else {
        callback("请选择分组名称");
      }
    },
    // getGroupId(v) {
    //   if (v) {
    //     this.exportItem.groupName = v.label;
    //   }
    // },
    handleSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.$Message.success("导入成功");
        this.$emit("success");
      } else {
        this.$Message.error(response.msg);
      }
    },
    handleError() {
      this.$Message.error("上传文件失败");
    }
  }
};
</script>

<style lang="less" scoped>
.popView-footer-wrap {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}
.item-style {
  margin-left: 20px;
  width: 200px;
}
.font-1 {
  font-weight: 700;
  font-size: 13px;
  text-decoration: none;
  color: #000000;
}
.font-2 {
  font-weight: 700;
  text-decoration: none;
  color: #555555;
}
</style>
