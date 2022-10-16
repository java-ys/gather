<template>
  <div>
    <Modal
      v-model="isShow"
      :width="710"
      :title="modalTitle+'菜单'"
      :mask-closable="false"
      @on-cancel="formReset('addForm')">
      <Form ref="addForm" :model="addData" :rules="ruleValidate" :label-width="110">

        <FormItem label="菜单名称：" prop="menuName">
          <Input v-model="addData.menuName" :maxlength="4" placeholder="请输入菜单名称" class="width200"></Input>
          <span class="counter">( {{addData.menuName?addData.menuName.length:0}}/4 )</span>
        </FormItem>

        <FormItem label="链接地址：" prop="menuUrl">
          <Input
            v-model="addData.menuUrl"
            placeholder="请输入链接地址"
            style="width:350px;"
            @on-blur="formatUrl(addData.menuUrl,'menuUrl')"></Input>
        </FormItem>

        <FormItem label="展示权重：" prop="priority">
          <InputNumber
            v-model="addData.priority"
            :precision="0"
            :min="1"
            :max="100"
            placeholder="请输入1-100的整数"
            style="width:130px;"
          ></InputNumber>
        </FormItem>

        <FormItem label="上传图片：" prop="menuIcon">
          <img-upload
            :defaultImg="addData.menuIcon"
            :action="actionUrl"
            :params="{imgType:1}"
            :width="200"
            :height="200"
            accept="image/png, image/jpeg"
            :format="['jpg','png']"
            @on-change="getImgUrl"
          ></img-upload>
        </FormItem>
        <div class="flex-box">
          <FormItem label="开放城市：" prop="cityType">
            <RadioGroup v-model="addData.cityType">
              <Radio :label="1">全部城市</Radio>
              <Radio :label="2">部分城市</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem v-if="addData.cityType === 2" prop="cityList" class="no-margin">
            <Select
              multiple
              filterable
              clearable
              style="width:320px"
              v-model="addData.cityList"
            >
              <Option
                v-for="(value, key) in allCityList"
                :value="key"
                :key="key"
                >{{ value }}
              </Option>
            </Select>
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="addSubmit('addForm')">确定</Button>
        <Button type="text" @click="isShow = false;formReset('addForm')">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  ruleValidate,
  targetList,

} from "../fields";
import imgUpload from "_a/img-upload/index.vue";
import { cityList } from "../../passenger/fields";
import {
  axiosLeftMenuAdd,
  axiosLeftMenuEdit
} from '_o/api/configData.js'
export default {
  name: "add-left-menu",
  props: {
    show: {
      type: Boolean
    },
    isNew: {
      type: Boolean
    },
    addData: {}
  },
  components: {
    imgUpload
  },
  computed: {
    modalTitle() {
      return this.isNew ? "新增" : "编辑";
    }
  },
  data() {
    return {
      ruleValidate,
      isShow: this.show,
      actionUrl: this._baseUrl4CommonWeb + "/common/uploadImg",
      allCityList: cityList
    };
  },
  methods: {
    formatUrl(value,key){
      this.addData[key] = value.replace(/(^\s*)|(\s*$)/g, "");
    },
    chooseTime(date) {
      this.addData.effectTime = date;
    },
    formReset(name) {
      this.$refs[name].resetFields();
      this.addData.menuIcon = "";
      this.$emit("close");
    },
    addSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let that = this;

          let params = { ...this.addData };
          if( params.cityType===1 ){
            params.cityCodes = 1
          }else{
            params.cityCodes = params.cityList.join(',')
          }
          delete params.cityType
          delete params.cityList


          let axiosFun = this.isNew ? axiosLeftMenuAdd : axiosLeftMenuEdit
          axiosFun(params).then(res => {
            that.$emit('refresh');
            that.$Message.success(`${this.modalTitle}成功！`);
            that.formReset(name);
            this.$emit("close");
          })
        }
      });
    },
    getImgUrl(url) {
      // TODO common/uploadImg改造 暂时没用到
      this.addData.menuIcon = url;
    }
  },
  watch: {
    show() {
      this.isShow = this.show;
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