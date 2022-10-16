<template>
  <Modal v-model="show" :mask-closable="false" :title="modalTitle" width="800px" footer-hide>
    <Form ref="form" :model="formData" :rules="type !== 3 ? rules : {}" label-position="top">
      <FormItem label="合同名称：" prop="contractName">
        <Input
          v-model="formData.contractName"
          placeholder="请选择"
        />
      </FormItem>
      <FormItem label="分类：" prop="customizationFlag">
        <RadioGroup
          v-model="formData.customizationFlag"
          @on-change="onChangeCustomization"
        >
          <Radio v-for="(item) in customizationList" :key="item.value" :label="item.value">{{item.label}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="合同类型：" prop="signNum">
        <RadioGroup
          v-model="formData.signNum"
        >
          <Radio v-for="(item) in signNumList" :key="item.value" :label="item.value">{{item.label}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-if="formData.customizationFlag === 0" label="适用对象：" prop="cpId">
        <p class="view-detail-content">所有CP公司（已配置定制版的CP公司除外）</p>
      </FormItem>
      <FormItem v-else label="适用对象：" prop="cpIds">
        <Select v-model="formData.cpIds" clearable filterable multiple onchange="handleChange" @click.native="handleCLick">
          <Option
            v-for="item in applyRentCompanyList"
            :key="item.cpId"
            :value="item.cpId"
            placeholder="请选择"
          >
            {{item.cpName}}
          </Option>
        </Select>
      </FormItem>
      <Form-item label="有效期" required>
        <Row justify="center">
          <Col span="1" style="text-align: center">自</Col>
          <Col span="5">
          <Form-item prop="startTime">
            <DatePicker v-model="formData.startTime" type="datetime" placeholder="请选择"></DatePicker>
          </Form-item>
          </Col>
          <Col span="1" style="text-align: center">至</Col>
          <Col span="5">
          <Form-item prop="endTime">
            <DatePicker v-model="formData.endTime" type="datetime" placeholder="请选择"></DatePicker>
          </Form-item>
          </Col>
        </Row>
      </Form-item>
      <FormItem label="安证通合同模板： " required prop="templateId">
        <Select v-model="formData.templateId" clearable filterable>
          <Option
            v-for="(item, index) in templateList"
            :key="index"
            :value="item.templateId"
            placeholder="请选择"
          >{{item.templateName}}</Option>
        </Select>
      </FormItem>
      <UploadFile
          ref="uploadFIle"
          type="primary"
          :uploadtitle="'上传模板'"
          :dispose="false"
          @uploadSuccess="standardSuc"
          @removefile="removefile"
          :multiple="false"
          :defaultList="defaultList"
      ></UploadFile>
      <FormItem v-if="type !== 3" :label-width="40" class="buttons">
        <Button @click="reset(true)">取消</Button>
        <Button type="primary" style="margin-right: 10px" :disabled="disabledSubmit" @click="confirm">确定</Button>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { rules, formData, searchData } from "./config.js"
import UploadFile from "./upload.vue"
import oss from "@/mixins/oss";
import {
  queryApplyRentCompany,
  queryRentCompany,
  queryTemplateName,
  saveContract,
  updateContract,
  queryContractDetail
} from "_o/api/lease";
export default {
  components:{
    UploadFile
  },
  mixins: [oss],
  name: "addmodal",
  props: {
    value: {
      default: false
    },
    modalTitle: {
      default: "新增租赁合同"
    },
    type: {
      default: 1
    },
    contractId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      rules: rules(this),
      formData: {
        ...formData,
        cpIds: []
      },
      customizationList: searchData.customizationList,
      signNumList: searchData.signNumList,
      statusList: searchData.statusList,
      applyRentCompanyList: [],
      templateList: [],
      show: this.value,
      disabledSubmit: false,
      defaultList:[]
    }
  },
  watch: {
    value(value) {
      this.show = value;
      this.$refs.uploadFIle.clearFiles()
      if (value) {
        this.handleWatch();
        // this.queryApplyRentCompanyList();
      }
    },
    show(value) {
      this.$emit("input", value);
    }
  },
  mounted() {
    this.queryTemplateNames();
  },
  methods: {
    onChangeCustomization() {

    },
    async handleWatch() {
      this.reset();
      await this.queryApplyRentCompanyList();
      if (this.type !== 1) {
        this.getContractDetail()
      }
    },
    handleCLick() {
      this.queryApplyRentCompanyList(1)
    },
    getContractDetail() {
      if (!this.contractId) {
        return;
      }
      let params = {
        contractId: this.contractId
      }
      queryContractDetail(params).then(async (res) => {
        if (res && res.data && res.data.success) {
          let { data } = res.data
          this.formData.contractName = data.name;
          this.formData.customizationFlag = data.customizationFlag;
          this.formData.signNum = data.signNum;
          this.formData.templateId = data.templateId;
          this.formData.templateName = data.templateName;
          this.formData.startTime = this.$moment(data.startTime).format("YYYY-MM-DD HH:mm:ss") || "";
          this.formData.endTime = this.$moment(data.endTime).format("YYYY-MM-DD HH:mm:ss") || "";
          this.formData.cpIds = data.cpIdList;
          this.formData.contractAgreement = data.contractAgreement
          if(this.formData.contractAgreement && this.formData.contractAgreement.attachment){
               let [, url] = await this.getOssFile({uuid: data.contractAgreement.attachment})
               this.defaultList = [{
                   name:data.contractAgreement.fileName,
                   url,
                   showProgress:false,
                   status:'finished'
               }]
               this.$forceUpdate()
          }
        } else {
          this.$Message.error(res.data.msg || "获取详情失败")
        }
      })
    },
    async queryApplyRentCompanyList(type) {
      let remoteApi = (this.type === 1 || type === 1) ? queryApplyRentCompany : queryRentCompany
      const {
        data: {
          data = [],
          success
        }
      } = await remoteApi();
      if (success) {
        let applyRentCompanyList = []

        for (let i = 0; i < data.length; i++) {
          applyRentCompanyList.push({
            cpId: data[i].id,
            cpName: data[i].name
          })
        }
        // 先缓存所有公司
        if (type !== 1) {
          this.cacheRentCompanyList = applyRentCompanyList
          // console.log(this.cacheRentCompanyList)
        }
        this.$set(this, "applyRentCompanyList", applyRentCompanyList)
        this.$forceUpdate()
      }
    },
    async queryTemplateNames() {
      const {
        data: {
          data = [],
          success
        }
      } = await queryTemplateName({
        contractType: 1
      })
      if (success) {
        this.templateList = data
      }
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        if (this.formData.endTime <= this.formData.startTime) {
          this.$Message.error("有效期结束时间必须大于开始时间！");
          return false;
        }
        if (this.disabledSubmit) return
        this.disabledSubmit = true
        let submitApi = "";
        this.type === 1 ? submitApi = saveContract : submitApi = updateContract;
        let params = {
          ...this.formData,
          contractId: this.contractId
        }
        params.contractType = 1;
        let cpDtoList = [];
        let cacheRentCompanyList = this.type === 1 ? this.applyRentCompanyList : this.cacheRentCompanyList
        for (let val of this.formData.cpIds) {
          const { cpId, cpName } = cacheRentCompanyList.find(item => item.cpId === val) || {};
          cpDtoList.push({ cpId, cpName })
        }
        cpDtoList.length > 0 ? params.cpDtoList = cpDtoList : "";
        params.templateName = this.templateList.find(item => item.templateId === params.templateId).templateName
        submitApi(params).then(res => {
          if (res && res.data.success) {
            setTimeout(() => { this.disabledSubmit = false }, 1000)
            this.$Message.info("成功！");
            this.reset(true);
            // 保存方案数据
            this.$emit("on-confirm");
          } else {
            this.$Message.error(res.data.msg || "失败！");
          }
        }).catch(err => {
          console.log(err);
          setTimeout(() => { this.disabledSubmit = false }, 1000)
        });
      });
    },
    reset(flag) {
      if (flag) {
        // 关闭弹框
        this.show = false;
      }
      this.$refs.form.resetFields();
      this.disabledSubmit = false
      this.formData.contractName = "";
      this.formData.customizationFlag = "";
      this.formData.cpDtoList = [];
      this.formData.startTime = "";
      this.formData.endTime = "";
      this.formData.templateId = "";
      this.formData.templateName = "";
      this.cacheRentCompanyList = [];
      this.formData.signNum = "";
      this.formData.contractAgreement = {}
      // this.$emit("on-cancel");
    },
    handleChange(value) {
      // console.log(value)
    },
    standardSuc(res,originres) {
      this.formData.contractAgreement = {
          fileName:originres.name.split('.')[0],
          fileExtension:originres.name.split('.')[1],
          attachment:res.uuid
      }
    },
    removefile(){
      this.formData.contractAgreement = {}
    },
  }
}
</script>

<style lang="less" scoped>
  .info-title {
    font-size: 24px;
    font-weight: bold;
    padding: 15px 0;
  }

  .buttons {
    width: 100%;
    text-align: right;

    .ivu-form-item-content {
      text-align: right;

      > button {
        margin-left: 10px;
      }
    }
  }
</style>
