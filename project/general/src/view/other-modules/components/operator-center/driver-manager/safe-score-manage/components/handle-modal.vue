<template>
  <div>
    <Modal
      v-model="isShow"
      :width="700"
      title="处理"
      :mask-closable="false"
      @on-cancel="formReset('addForm')">
      <Form ref="addForm" :model="addData" :rules="ruleValidate" :label-width="150">

        <FormItem label="上传保证书照片：" prop="dealImages" v-if="handleType===1">
          <v-upload
            :params="uploadParams"
            :action="upLoadUrl"
            :maxSize="imgSize"
            :isDetail="false"
            :maxUpLoadCount="4"
            :sizeType="2"
            :defaultList="addData.dealImages"
            @on-upsuccess="getAnswerImg"
          ></v-upload>
          <span class="colorc3">限png或jpg格式，单张照片大小不超过5M，最多上传4张。</span>
        </FormItem>
        <div v-else>
          <FormItem :label="`${beforeText}退邮件接收人邮箱：`" prop="email">
            <Input
              v-model="addData.email"
              :maxlength="30"
              placeholder="请输入"
              style="width:300px"></Input>
            <span class="counter">( {{addData.email?addData.email.length:0}}/30 )</span>
          </FormItem>
          <FormItem :label="`${beforeText}退邮件内容：`" prop="content">
            <Input
              v-model="addData.content"
              :maxlength="200"
              placeholder="请输入"
              type="textarea"
              :autosize="{minRows: 5,maxRows: 15}"
              style="width:430px"></Input>
            <span class="counter">( {{addData.content?addData.content.length:0}}/200 )</span>
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button type="primary" :loading="formLoading" @click="addSubmit('addForm')">
          <span v-if="!formLoading">确定</span>
          <span v-else>提交中</span>
        </Button>
        <Button type="text" @click="isShow = false;formReset('addForm')">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { acnValid } from "@m2-micro/validate";
import vUpload from "_a/v-upload/v-upload";
import {
  axiosSafeScoreHandle
} from "_o/api/driver.js";

export default {
  name: "add-left-menu",
  props: {
    show: {
      type: Boolean
    },
    editInfo: {
      type: Object
    }
  },
  components: {
    vUpload
  },
  data() {
    return {
      isShow: this.show,
      upLoadUrl: this._baseUrl + '/common/uploadPics',
      imgSize: 5120, // 5M
      uploadParams: { imgType: 1 },
      formLoading: false,
      addData: {
        dealImages: [],
        email: '',
        content: ''
      },
      ruleValidate: {
        dealImages: [{ required: true, type: 'array', min: 1, message: "请上传保证书照片", trigger: "blur" }],
        email: [
          { required: true, message: "请输入接收人邮箱", trigger: "blur" },
          { trigger: "change", validator: acnValid }
        ],
        content: [{ required: true, message: "请输入邮件内容", trigger: "blur" }],
      }
    };
  },
  computed: {
    // 3-小于等于0分-清退
    // 2-大于0分小于等于25分-劝退
    // 1-大于25分小于100分-签订保证书
    handleType(){
      let score = Number(this.editInfo.score)
      if (score <= 0) {
        return 3
      } else if (score>0 && score <=25) {
        return 2
      }else{
        return 1
      }
    },
    beforeText(){
      let res = this.handleType===3?'清':'劝'
      return res
    }
  },
  methods: {
    resetData(){
      let editInfo = this.editInfo
      if(this.handleType===2){
        this.addData.content = `您好：\r\n\r\n兹有贵处司机${editInfo.name}（司机ID：${editInfo.driverNo}）安全分${editInfo.score}分，违规情节较为严重，达到劝退要求，请予以劝退处理，谢谢！\r\n`
      }else if(this.handleType===3){
        this.addData.content = `您好：\r\n\r\n兹有贵处司机${editInfo.name}（司机ID：${editInfo.driverNo}）安全分${editInfo.score}分，违规情节非常严重，达到清退要求，请予以清退处理，谢谢！\r\n`
      }
    },
    chooseTime(date) {
      this.addData.effectTime = date;
    },
    formReset(name) {
      this.$refs[name].resetFields();
      this.addData.dealImages = [];
      this.$emit("close");
    },
    addSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let that = this;
          let params = {
            ...this.addData,
            driverUuid: this.editInfo.driverUuid,
            opType: this.handleType
          };
          params.dealImages = params.dealImages.map(item=>item.url)
          this.formLoading = true
          axiosSafeScoreHandle(params).then(res => {
            this.formLoading = false
            that.$emit('refresh');
            that.$Message.success(`处理成功！`);
            that.formReset(name);
            this.$emit("close");
          }).catch(err=>{
            this.formLoading = false
          })
        }
      });
    },
    // TODO /common/uploadPics改造
    getAnswerImg (res) {
      if (res.success) {
        let { picUrl: imgUrl } = res.data
        this.addData.dealImages.push({
          name: this.addData.dealImages.length,
          url: imgUrl
        })
      }
    }
  },
  watch: {
    show() {
      this.isShow = this.show;
      if(this.isShow){
        this.resetData()
      }
    }
  }
};
</script>
<style lang="less">
.no-margin{
  .ivu-form-item-content{
    margin-left: 20px !important;
  }
}
</style>
