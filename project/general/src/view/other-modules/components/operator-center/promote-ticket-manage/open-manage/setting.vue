<template>
  <div>
    <Modal v-model="show" width="50%" :title="title" :mask-closable="false" @on-cancel="cancel">
      <Form :model="formData" :label-width="120" :rules="formValidate" ref="_form">
        <FormItem label="省/市：" prop="city">
          <Cascader
            v-model="formData.city"
            :data="cityList"
            class="item-style"
            :disabled="edit"
            :render-format="cityRenderFormatter"
            @on-change="handleCityChange"
          ></Cascader>
        </FormItem>
        <FormItem label="运营商：" prop="agentUuid">
          <Select
            v-model="formData.agentUuid"
            class="item-style"
            :disabled="edit"
            :label-in-value="true"
            :clearable="true"
            @on-change="agentChange"
          >
            <Option
              v-for="(item, index) in agentList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="推券二维码地址：" prop="qrCodeUuid">
          <Input
            clearable
            v-model="formData.qrCodeUuid"
            :maxlength="100"
            placeholder="请输入二维码地址(http:/https:)"
            class="item-style"
          />
        </FormItem>
        <FormItem label="推券宣传图片：" prop="pictureUrl" width="200">
          <img-upload
            :defaultImg="formData.pictureUrl"
            :headerParams="picHeaderParams"
            :action="actionUrl"
            :params="{  }"
            :maxSize="500"
            :format="['jpg', 'png']"
            @on-change="getImgUrl"
          ></img-upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" v-lazy-click="save">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import imgUpload from "../common-img-upload";
import { tool, pick, getObjKeys } from "_o/api/baseMixin.js";
import { getAgentByCity } from "_g/api/configData";
import { addService, editService, detailService } from "_o/api/coupon-manage";

const validateUrl = (rule, value, callback) => {
  if (!(value.indexOf("http://") === 0 || value.indexOf("https://") == 0)) {
    callback(new Error("请输入正确地址"));
  } else {
    callback();
  }
};
const titleList = ["新建配置", "编辑配置"];
const formParams = {
  city: [],
  cityName: "",
  agentName: "",
  agentUuid: "",
  pictureUrl: "",
  pictureUuid: "",
  qrCodeUuid: ""
};
const formValidate = {
  city: [{ required: true, message: "省/市不能为空" }],
  agentUuid: [{ required: true, message: "请选择运营商" }],
  pictureUrl: [
    {
      required: true,
      message: "请上传宣传图片",
      trigger: "change"
    }
  ],
  qrCodeUuid: [
    {
      required: true,
      validator: validateUrl,
      trigger: "blur"
    }
  ]
};

export default {
  props: ["visible", "modalData"],
  components: {
    imgUpload
  },
  mixins: [tool],
  inject: ["getCityList"],
  data() {
    return {
      title: titleList[0],
      cityList: [], // 城市列表
      agentList: [], // 运营商列表
      actionUrl: this._uploadUrl + "/file/upload/public", // 公共文件上传服务
      formValidate,
      formData: this.deepCopy({}, formParams),
      show: this.visible,
      picHeaderParams: {},
      edit: false
    };
  },
  watch: {
    visible() {
      this.show = this.visible;
      if (this.show) {
        this.cityList = this.getCityList();
        if (this.modalData && this.modalData.id) {
          // 编辑前获取开通详情
          this.title = titleList[1];
          this.getDetail({ id: this.modalData.id });
          this.truy("edit");
        }
      } else {
        this.initData();
      }
    }
  },
  methods: {
    async getDetail(p = {}) {
      if (!p.id) return;
      const [err, data] = await this.toResult(detailService(p));
      if (err) {
        return;
      }
      if (data) {
        const {
          agentName,
          agentUuid,
          cityCode,
          cityName,
          provinceCode,
          qrCodeUuid,
          pictureUrl,
          pictureUuid
        } = data;
        let _p = pick(data, [
          "cityName",
          "agentUuid",
          "agentName",
          "pictureUrl",
          "pictureUuid",
          "qrCodeUuid"
        ]);
        this.setFormData(_p).formData.city = [provinceCode, cityCode];
        this.getAgentList(cityCode);
      }
    },
    async getAgentList(cityCode) {
      if (!cityCode) return;
      let [err, data] = await this.toResult(
        getAgentByCity({ cityCode: cityCode })
      );
      if (err) return;

      this.agentList = (data || []).map(item => {
        return {
          label: item.name,
          value: item.uuid
        };
      });
    },
    handleCityChange(value) {
      const [provinceCode, citycode] = value;
      if (!provinceCode) return;
      this.getAgentList(citycode);
    },
    save() {
      this.$refs._form.validate(async valid => {
        if (!valid) return;
        const isEdit = this.modalData && this.modalData.id;
        const {
          cityName,
          agentUuid,
          agentName,
          pictureUuid,
          qrCodeUuid
        } = this.formData;
        let params = isEdit
          ? {
              id: this.modalData.id,
              pictureUuid,
              qrCodeUuid
            }
          : {
              cityName,
              cityCode: this.formData.city[1],
              agentUuid,
              agentName,
              pictureUuid,
              qrCodeUuid
            };
        const func = isEdit ? editService : addService;
        const [err, data] = await this.toResult(func(params));
        if (err) {
          return;
        }
        this.cancel(true);
      });
    },
    getImgUrl(url, { publicUrl, uuid }) {
      this.formData.pictureUrl = publicUrl;
      this.formData.pictureUuid = uuid;
    },
    cancel(refresh = false) {
      this.$emit("close", { refresh });
    },
    initData() {
      this.agentList = [];
      this.formData = this.deepCopy({}, formParams);
      this.title = titleList[0];
      this.falsy("edit");
    },
    cityRenderFormatter(label) {
      this.formData.cityName = label[1] || "";
      return label.join(" / ");
    },
    agentChange(v) {
      this.formData.agentName = v ? v.label : "";
    },
    setFormData(d = {}) {
      getObjKeys(d).forEach(k => {
        d[k] && (this.formData[k] = d[k]);
      });
      return this;
    }
  }
};
</script>

<style lang="less" scoped>
.item-style {
  width: 280px;
}
</style>