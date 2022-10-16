<template>
  <div>
    <Modal
      v-model="show"
      width="46%"
      :title="title"
      :mask-closable="false"
      @on-cancel="e => cancel()"
    >
      <Form ref="_form" :model="formData" :rules="formRules" :label-width="110">
        <div v-if="isEdit">
          <FormItem label="类目现名称：">
            <span>{{ formData._pubMenuName }}</span>
          </FormItem>
          <FormItem label="类目现头像：">
            <img :src="formData._pubMenuPicUrl" class="img" @click="viewImg" />
          </FormItem>
          <FormItem label="类目新名称：">
            <Input
              v-model="formData.pubMenuName"
              :maxlength="20"
              placeholder="请填写类目新名称"
              style="width: 300px"
            />
          </FormItem>
          <FormItem label="类目新头像：">
            <Alert style="width: 300px">建议图片尺寸32x32</Alert>
            <UploadImg
              ref="_upload"
              :action="_baseUrl + '/common/uploadPics'"
              @on-uperror="onUperror"
              @before-upload="beforeUpload"
              @on-upsuccess="getPicUrl"
              @on-remove="fileRemove"
            >
            </UploadImg>
            <input v-model="formData.pubMenuPicUrl" type="hidden" />
          </FormItem>
        </div>
        <div v-else>
          <FormItem label="类目名称：" prop="pubMenuName">
            <Input
              v-model="formData.pubMenuName"
              :maxlength="20"
              placeholder="请填写类目名称"
              style="width: 300px"
            />
          </FormItem>
          <FormItem label="类目头像：" prop="pubMenuPicUrl">
            <Alert style="width: 300px">建议图片尺寸32x32</Alert>
            <UploadImg
              ref="_upload"
              :action="_baseUrl + '/common/uploadPics'"
              @on-uperror="onUperror"
              @before-upload="beforeUpload"
              @on-upsuccess="getPicUrl"
              @on-remove="fileRemove"
            >
            </UploadImg>
            <input v-model="formData.pubMenuPicUrl" type="hidden" />
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost @click="e => cancel()">取消</Button>
        <Button type="primary" :loading="loading" @click="submit">
          <span>提交</span>
        </Button>
      </div>
    </Modal>
    <Modal title="查看" v-model="imgVisible">
      <img :src="formData._pubMenuPicUrl" style="width: 100%" />
    </Modal>
  </div>
</template>

<script>
import UploadImg from "_a/v-upload/v-upload.vue";
import {
  insertMenu,
  updateMenu
} from "_o/components/short-message-center/passenger-info/service";
const _formData = {
  pubMenuCode: "",
  pubMenuName: "",
  pubMenuPicUrl: "",
  _pubMenuName: "", // 编辑时展示之前类目名
  _pubMenuPicUrl: "" // 编辑时展示之前类目图
};

export default {
  components: { UploadImg },
  data() {
    return {
      show: false,
      imgVisible: false,
      formData: { ..._formData },
      loading: false,
      formRules: {
        pubMenuName: [{ required: true, message: "类目名称不得为空" }],
        pubMenuPicUrl: [{ required: true, message: "类目头像不得为空" }]
      }
    };
  },
  computed: {
    isEdit({ formData }) {
      return !!formData.pubMenuCode;
    },
    title({isEdit}) {
      return isEdit ? "编辑类目": "新增类目"
    }
  },
  methods: {
    init(p = {}) {
      if (p.pubMenuCode) {
        this.initData = p
        this.formData.pubMenuCode = p.pubMenuCode;
        this.formData._pubMenuName = p.pubMenuName;
        this.formData._pubMenuPicUrl = p.pubMenuPicUrl;
      } else {
        Object.keys(_formData).forEach(key => {
          this.formData[key] = "";
        });
      }
      this.show = true;
    },
    cancel(b) {
      this.show = false;
      this.formData.pubMenuName = ""
      this.formData.pubMenuPicUrl = ""
      if(!this.isEdit) {
        this.$refs._form.resetFields()
      }
      this.$refs._upload.clear();
      b && this.$emit("refresh");
    },
    async submit() {
      let valid = await this.$refs._form.validate();
      if (!valid) return;
      let [func, msg] = [insertMenu, "新增类目成功"];
      if (this.isEdit) {
        func = updateMenu;
        msg = "修改类目成功";
      }
      const { success } = await func(this.getSubmitParams());
      if (success) {
        this.$Message.success(msg);
        this.cancel(true);
      } else {
        this.$Message.error("操作失败");
      }
    },
    getSubmitParams() {
      let { pubMenuName, pubMenuPicUrl, pubMenuCode } = this.formData;
      let p = { pubMenuName, pubMenuPicUrl };
      if (this.isEdit) {
        p.pubMenuCode = pubMenuCode;
        // 编辑时, 名称和类目图片非必填
        if(!pubMenuName) {
          p.pubMenuName = this.initData.pubMenuName
        }
        if(!pubMenuPicUrl) {
          p.pubMenuPicUrl = this.initData.pubMenuPicUrl
        }
      }
      return p;
    },
    getPicUrl(res) {
      this.loading = false;
      this.formData.pubMenuPicUrl = res.data.picUrl;
    },
    beforeUpload(file) {
      this.loading = true;
    },
    onUperror() {
      this.loading = false;
    },
    fileRemove() {
      this.formData.pubMenuPicUrl = "";
    },
    viewImg() {
      this.imgVisible = true;
    }
  }
};
</script>

<style scoped>
.img {
  width: 100px;
  height: 100px;
  display: inline-block;
}
</style>
