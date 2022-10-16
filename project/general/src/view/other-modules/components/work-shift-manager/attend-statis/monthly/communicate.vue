<template>
  <div class="container">
    <Modal
      v-model="showModal"
      title="考情异常"
      width="700"
      :mask-closable="false"
      @on-cancel="cancelData"
    >
      <Form ref="form" :model="formData" :label-width="80">
        <div class="form-item-title">司机信息 :</div>
        <Row>
          <Col span="10" offset="2">
            <FormItem label="司机姓名 :">{{ formData.driverName }}</FormItem>
          </Col>
          <Col span="10">
            <FormItem label="手机号 :">{{ formData.phone }}</FormItem>
          </Col>
          <Col span="10"  offset="2">
            <FormItem label="车牌号 :">{{ formData.plateNum }}</FormItem>
          </Col>
          <Col span="10">
            <FormItem label="排班日 :">{{ formData.name }}</FormItem>
          </Col>
        </Row>
        <div class="form-item-title">排班信息 :</div>
        <Row>
          <Col span="20" offset="2">
            <FormItem label="排班时段 :">{{ formData.name }}</FormItem>
          </Col>
          <Col span="20" offset="2">
            <FormItem label="时长要求 :">{{ formData.name }}</FormItem>
          </Col>
        </Row>
        <div class="form-item-title">考勤信息 :</div>
        <Row>
          <Col span="6" offset="2">
            <FormItem label="在线时长 :">{{ formData.name }}</FormItem>
          </Col>
          <Col span="6">
            <FormItem label="高峰时长 :">{{ formData.name }}</FormItem>
          </Col>
          <Col span="6">
            <FormItem label="服务时长 :">{{ formData.name }}</FormItem>
          </Col>
          <Col span="8" offset="2">
            <FormItem label="出勤状况 :">{{ formData.name }}</FormItem>
          </Col>
        </Row>
      </Form>
      <!-- <Divider /> -->
      <Form
        ref="formValidate"
        :model="form"
        :rules="validateForm"
        :label-width="80"
        style="width: 300px"
      >
        <FormItem label="约谈方式" prop="city">
          <Select v-model="form.city" placeholder>
            <Option value="1">电话约谈</Option>
            <Option value="2">面谈</Option>
            <Option value="3">线下培训</Option>
            <Option value="4">其他</Option>
          </Select>
        </FormItem>
        <FormItem label="约谈附件：" :label-width="100" prop="spuIconUrl">
          <Upload multiple action="//jsonplaceholder.typicode.com/posts/">
            <Button icon="ios-cloud-upload-outline">上传附件</Button>
          </Upload>
          <!-- <div class="info-img" @click="showBigImg(form.spuIconUrl)" v-if="form.spuIconUrl">
            <img :src="form.spuIconUrl" />
            <span class="delete-img" @click.stop="deleteIcon('spuIconUrl')">×</span>
          </div>
          <upload-img
            :imgSize="imgSize"
            :maxSize="maxSize"
            :accept="accept"
            :format="format"
            @uploadSuccess="uploadSuccess"
            v-else
          ></upload-img>-->
        </FormItem>
        <FormItem label="约谈说明" prop="desc">
          <Input
            v-model="form.desc"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancelData">取消</Button>
        <Button type="primary" @click="saveData">约谈</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      showModal: false,
      formData: {},
      form: {},
      validateForm: {},
      maxSize: 100,
      accept: ".png,.jpg",
      format: ["png", "jpg"],
      imgSize: { width: 192, height: 192 },
      bingImgSize: { width: 750, height: 396 }
    };
  },
  methods: {
    initData(data, type) {
      this.type = type;
      detailCompleteInfoTask({ driverId: data.driverId }).then(res => {
        let data = res.data.data || {};
      });
    },
    cancelData() {
      this.showModal = false;
      this.$refs.form.resetFields();
    },
    saveData() {},
    uploadSuccess(data) {
      this.form.spuIconUrl = data.fileUrl;
      //   this.$refs.form.validateField("spuIconUrl");
    }
  },
  watch: {
    value: {
      handler(value) {
        this.showModal = value;
      },
      immediate: true
    },
    showModal(value) {
      this.$emit("input", value);
    }
  }
};
</script>

<style scoped lang="less">
.form-item-title {
  width: 100px;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 5px;
}

.commodity-img {
  width: 100px;
  cursor: pointer;
  position: relative;
  display: inline-block;
  margin-right: 20px;

  img {
    width: 100%;
  }

  .delete-img {
    width: 20px;
    height: 20px;
    background-color: #ed4014;
    border-radius: 50%;
    position: absolute;
    top: -10px;
    right: -10px;
    content: "x";
    text-align: center;
    line-height: 20px;
    color: #fff;
    font-weight: bolder;
  }
}
</style>
