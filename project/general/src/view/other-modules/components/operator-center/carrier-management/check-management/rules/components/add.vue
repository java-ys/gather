<template>
  <div>
    <Modal
      v-model="visible"
      :title="title"
      width="600"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="_form"
        :model="addForm"
        :label-width="150"
        :rules="validateRules"
      >
        <FormItem label="运营模式：" prop="operationMode">
          <Select
            v-model="addForm.operationMode"
            placeholder="请选择"
            style="width: 240px"
          >
            <Option v-for="(item,index) in operateTypeEnum" :key="index" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="模板标题：" prop="title">
          <Input
            v-model="addForm.title"
            style="width: 240px"
            :maxlength="20"
            placeholder="请输入指标名称"
          ></Input>
          <span class="counter">( {{addForm.title ? addForm.title.length : 0}}/20 )</span>
        </FormItem>
        <FormItem
          key="dddd"
          label="模板内容"
          class="upload_wrap"
          prop="_fileUrl"
        >
          <Upload
            ref="_uploadFile"
            style="margin-left: 10px"
            :headers="header"
            :format="format"
            :on-format-error="formatError"
            :action="actionUrl"
            :data="uploadFiles"
            :show-upload-list="false"
            :before-upload="(res) => beforeUpload(res)"
            :on-success="(response, file, fileList) => uploadSuccess(response, file, fileList)"
            :on-error="(err) => uploadError(err)"
          >
            <Button>上传PDF</Button>
            <!-- <Button
                :loading="uploadLoading"
                type="primary"
                :disabled="isDetail"
              >
                <span v-if="!uploadLoading">{{ addData.broadcast.disableBroadcastUrlName ? '重新上传': '上传音频' }}</span>
                <span v-else>上传中...</span></Button> -->
          </Upload>
        </FormItem>
      </Form>
      <p v-if="addForm._fileUrl" class="file-con">
        <a :href="addForm._fileUrl" target="_blank" class="blue">{{addForm.fileName}}</a>
        <Icon class="close-icon" type="md-close" @click="wipeOut" />
      </p>
      <div slot="footer">
        <Button type="primary" :loading="submitLoading" @click="confirmAdd">
          <span>确定</span>
        </Button>
        <Button type="primary" ghost @click="cancle">取消</Button>
      </div>
    </Modal>
  </div>
</template>


<script>
import { getToken } from "@/libs/util.js";
import { controlSaveService, controlUpdateService } from "_o/api/check";
import { tool } from "_o/api/baseMixin.js";
import oss from "@/mixins/oss";
import { operateTypeEnum } from "@/config";
const formData = {
  operationMode: "", // 运营模式
  title: "", // 模板标题
  fileName: "", // 模板文件名称
  fileUrl: "", // 模板文件的uuid
  _fileUrl: "", // 模板文件地址
};
export default {
  name: "rules-add",
  mixins: [tool, oss],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    let data = {};
    let title = "新建管理条例模板";
    let { id } = this.detail;
    if (id) {
      Object.keys(formData).forEach((key) => {
        data[key] = this.detail[key];
        if (key === "operationMode") {
          data[key] = String(this.detail[key])
        }
      });
      title = "编辑管理条例模板";
    }
    return {
      title,
      submitLoading: false,
      addForm: id ? data : { ...formData },
      uploadFiles: {},
      operateTypeEnum
    };
  },
  created() {
    this.initData();
  },
  methods: {
    confirmAdd() {
      this.$refs._form.validate(async (bool) => {
        if (!bool) return;
        let msg = "新建成功";
        let func = controlSaveService;
        let { id } = this.detail;
        if (id) {
          this.addForm.id = id;
          func = controlUpdateService;
          msg = "修改成功";
        }
        let p = this.getSubmitParams();
        this.submitLoading = true;
        const [err, data] = await this.toResult(func(p));
        this.submitLoading = false;

        if (err) {
          return;
        }
        this.$Message.success(msg);
        this.$emit("confirm");
      });
    },
    getSubmitParams() {
      let p = { ...this.addForm };
      delete p._fileUrl;
      return p;
    },
    cancle() {
      this.$Modal.confirm({
        title: `是否确认取消${this.title}？`,
        onOk: () => {
          this.$refs._form.resetFields();
          this.$emit("close");
        },
      });
    },
    initData() {
      this.validateRules = {
        operationMode: [{ required: true, message: "请选择指标类型" }],
        title: [{ required: true, message: "请输入模板标题", trigger: "blur" }],
        _fileUrl: [
          { required: true, message: "请选择模板内容", trigger: "blur" },
        ],
      };
      this.actionUrl = this._baseUrl + "/api/operate/control/upload";
      this.header = { Authorization: getToken() };
      this.format = ["PDF", "pdf"];
    },
    // 根据uuid 获取 文件地址(oss改造)
    async uploadSuccess(res, file, fileList) {
      this.addForm.fileName = file.name;
      this.uploadLoading = false;
      if (res.data && res.data.fileUuid) {
        this.addForm.fileUrl = res.data.fileUuid;
        const [, v] = await this.getOssFile({ uuid: res.data.fileUuid });
        this.addForm._fileUrl = v || "";
        this.$refs._form.validateField("_fileUrl");
      }
    },
    beforeUpload(file) {
      return true;
    },
    formatError() {
      this.uploadLoading = false;
      this.$Message.error(`请上传 ${this.format.join(", ")} 格式`);
    },
    uploadError(res) {
      this.uploadLoading = false;
      this.$Message.error(res.msg);
    },
    wipeOut() {
      this.addForm.fileName = "";
      this.addForm._fileUrl = "";
    },
  },
};
</script>


<style scoped lang="less">
.sym {
  margin: 0 10px;
}
.row-c {
  margin-bottom: 8px;
}
.file-con {
  padding: 0 150px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.close-icon {
  cursor: pointer;
  padding: 4px;
}
.blue{
  color: #2d8cf0;
}
</style>
