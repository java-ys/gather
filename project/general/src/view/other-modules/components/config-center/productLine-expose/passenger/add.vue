<template>
  <Modal v-model="showModal" :title="title" width="800px" :z-index="1">
    <Form
      inline="inline"
      :model="formData"
      :label-width="85"
      :rules="formValidate"
      ref="form"
    >
      <FormItem label="菜单类型" prop="businessType">
        <Select
          v-model="formData.businessType"
          clearable
          style="width:300px"
          placeholder="请选择菜单类型"
          :disabled="formData.isEdit"
        >
          <Option :value="1">产品线</Option>
          <Option :value="2">自定义</Option>
        </Select>
      </FormItem>
      <FormItem label="" v-if="formData.businessType == 1" prop="productLine">
        <Select
          clearable
          style="width:300px"
          placeholder="请选择产品线"
          v-model="formData.productLine"
          :disabled="formData.isEdit"
        >
          <Option
            v-for="(item, index) in optList"
            :value="item.value"
            :key="index"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="" v-if="formData.businessType == 2" prop="linkUrl">
        <Input
          clearable="clearable"
          style="width:300px"
          v-model="formData.linkUrl"
          :maxlength="255"
          placeholder="请输入链接地址"
          :disabled="formData.isEdit"
          @on-blur="formatUrl(formData.linkUrl,'linkUrl')"
        />
      </FormItem>
      <br />
      <FormItem
        label="菜单名称"
        v-if="formData.businessType != 2"
        prop="productLine"
      >
        <Input
          clearable="clearable"
          style="width:300px"
          v-model="gerProductLineName[formData.productLine]"
          :maxlength="4"
          placeholder="请输入菜单名称"
          disabled
        />
      </FormItem>
      <FormItem
        label="菜单名称"
        v-if="formData.businessType == 2"
        prop="businessName"
      >
        <Input
          clearable="clearable"
          style="width:300px"
          v-model="formData.businessName"
          :maxlength="4"
          placeholder="请输入菜单名称"
        />
      </FormItem>
      <br />
      <FormItem label="展示权重" prop="weight">
        <InputNumber
          v-model="formData.weight"
          :precision="0"
          :min="1"
          :max="99"
          placeholder="请输入0-100的整数"
          style="width:130px;"
        ></InputNumber>
      </FormItem>
      <br />
      <FormItem label="上传图标" prop="picUrl">
        <img-upload
          :defaultImg="formData.picUrl"
          :action="actionUrl"
          :params="{ imgType: 1 }"
          :width="200"
          :height="200"
          :format="['jpg', 'png', 'gif']"
          @on-change="getImgUrl"
        ></img-upload>
      </FormItem>
      <br />
      <FormItem label="开放城市:" prop="effectiveFlag">
        <RadioGroup v-model="formData.effectiveFlag" @on-change="changeCity">
          <Radio :label="0">
            <span>全部城市</span>
          </Radio>
          <Radio :label="1">
            <span>部分城市</span>
          </Radio>
          <Select
            v-if="formData.effectiveFlag === 1"
            multiple
            filterable
            clearable
            style="width:200px"
            v-model="formData.cityCodeList"
          >
            <Option
              v-for="(value, key, index) in cityList"
              :value="key"
              :key="key"
              >{{ value }}
            </Option>
          </Select>
        </RadioGroup>
      </FormItem>
      <br />

      <FormItem label="菜单状态:" prop="status">
        <RadioGroup v-model="formData.status">
          <Radio :label="0">
            <span>开启</span>
          </Radio>
          <Radio :label="2">
            <span>仅白名单</span>
          </Radio>
          <Radio :label="1">
            <span>关闭</span>
          </Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <div slot="footer" style="text-align: center;">
      <Button type="primary" v-lazy-click="saveData">确定</Button>
      <Button @click="showModal = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { validatorTime } from "./fields";
import { cityList, gerProductLineName } from "./fields";
import imgUpload from "_a/img-upload/index.vue";

import {
  addProductStrategyExpose,
  editProductStrategyExpose,
  getHasStrategyProduct
} from "_o/api/configData.js";

export default {
  name: "add",
  components: {
    imgUpload
  },
  data() {
    return {
      showModal: false,
      title: "新增菜单",
      cityList: cityList,
      gerProductLineName: gerProductLineName,
      actionUrl: this._baseUrl + "/common/uploadFile",
      optList: [],
      formData: {},
      formValidate: {
        businessType: {
          type: "number",
          required: true,
          message: "必选",
          trigger: "change"
        },
        productLine: {
          type: "number",
          required: true,
          message: "必选",
          trigger: "change"
        },
        businessName: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          },
          {
            pattern: "[^ \x22]+",
            message: "不能输入全空格",
            trigger: "change"
          }
        ],
        linkUrl: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          },
          {
            pattern: "[^ \x22]+",
            message: "不能输入全空格",
            trigger: "change"
          }
        ],
        picUrl: [
          {
            required: true,
            message: "请上传图标",
            trigger: "change"
          }
        ],
        weight: [
          {
            type: "number",
            required: true,
            message: "必填",
            trigger: "change"
          }
        ],
        effectiveFlag: {
          type: "number",
          required: true,
          message: "必选",
          trigger: "change"
        },
        status: {
          type: "number",
          required: true,
          message: "必选",
          trigger: "change"
        },
        cityCodeList: {
          required: true,
          message: "必选",
          trigger: "change"
        }
      }
    };
  },
  methods: {
    formatUrl(value,key){
      this.formData[key] = value.replace(/(^\s*)|(\s*$)/g, "");
    },
    init(val) {
      this.showModal = true;
      this.$refs.form.resetFields();

      if (!val) {
        this.title = "新增菜单";
        this.optList = [];
        this.formData = {
          businessName: "",
          linkUrl: "",
          effectiveFlag: 0,
          status: 1,
          isEdit: false,
          weight: null,
          id: "",
          picUrl: ""
        };
        this.getHasStrategyProductFun();
      } else {
        this.title = "编辑菜单";
        this.formData = {
          businessType: val.businessType,
          weight: val.weight,
          picUrl: val.picUrl,
          effectiveFlag: val.effectiveFlag,
          status: val.status,
          isEdit: true,
          id: val.id,
          businessName: ""
        };
        if (val.businessType === 1) {
          this.formData.productLine = val.productLine;
          this.formData.businessName = this.gerProductLineName[val.productLine];
          this.optList = [
            {
              value: this.formData.productLine,
              label: this.formData.businessName
            }
          ];
        }
        if (val.businessType === 2) {
          this.formData.linkUrl = val.linkUrl;
          this.formData.businessName = val.businessName;
        }
        if (val.effectiveFlag === 1) {
          this.formData.cityCodeList = val.cityCodeList;
        }
      }
    },
    getHasStrategyProductFun() {
      getHasStrategyProduct({})
        .then(res => {
          const resData = (res.data && res.data.data) || [];
          this.optList = resData.map(item => ({
            label: item.businessName,
            value: item.businessType
          }));
        })
        .catch(err => {
          console.log(err);
        });
    },
    // TODO /common/uploadFile 改造 未使用
    getImgUrl(url, data) {
      this.formData.picUrl = data.fileUrl;
      this.$refs.form.validate();
    },
    changeCity(val) {
      if (val === "1") {
        this.formData.cityCodeList = "";
      }
    },
    saveData() {
      console.log(this.formData);
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        }
      });
    },
    submit() {
      let params = {
        businessType: this.formData.businessType,
        weight: this.formData.weight,
        picUrl: this.formData.picUrl,
        effectiveFlag: this.formData.effectiveFlag,
        status: this.formData.status
      };
      if (this.formData.businessType === 1) {
        params.productLine = this.formData.productLine;
        params.businessName = this.gerProductLineName[params.productLine];
      }
      if (this.formData.businessType === 2) {
        params.linkUrl = this.formData.linkUrl;
        params.businessName = this.formData.businessName;
      }
      if (this.formData.effectiveFlag === 1) {
        if (
          !this.formData.cityCodeList ||
          this.formData.cityCodeList.length === 0
        ) {
          this.$Message.error("请选择城市");
          return;
        }
        params.cityCodeList = this.formData.cityCodeList;
      }

      if (this.formData.isEdit) {
        params.id = this.formData.id;
        editProductStrategyExpose(params).then(res => {
          this.showModal = false;
          this.$emit("reload");
          this.$Message.success(res.data.msg);
        });
      } else {
        addProductStrategyExpose(params).then(res => {
          this.showModal = false;
          this.$emit("reload");
          this.$Message.success(res.data.msg);
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.text-description {
  margin-left: 100px;
  margin-top: -10px;
  margin-bottom: 10px;
}
</style>
