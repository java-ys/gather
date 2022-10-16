<template>
  <div class="driver-app-manager-add">
    <Form
      ref="form"
      inline="inline"
      :model="formData"
      :label-width="85"
      :rules="formValidate"
    >
      <FormItem label="应用名称：" prop="appName">
        <Input
          v-model="formData.appName"
          clearable
          :disabled="isView"
          placeholder="请输入应用名称"
        />
      </FormItem>
      <FormItem label="展示次序：" prop="displayOrder">
        <InputNumber
          v-model="formData.displayOrder"
          :precision="0"
          :disabled="isView"
          placeholder="请输入整数"
        ></InputNumber>
      </FormItem>
      <FormItem label="上传图标：" prop="imageUrl">
        <img-upload
          v-show="!isView"
          :defaultImg="formData.imageUrl"
          :action="actionUrl"
          :params="{ imgType: 1 }"
          :width="64"
          :height="64"
          :format="['jpg', 'png', 'gif']"
          @on-change="getImgUrl"
        ></img-upload>
        <div v-show="isView">
          <img :src="formData.imageUrl" />
        </div>
      </FormItem>
      <FormItem label="菜单名称：" prop="menuUuid">
        <Select
          v-model="formData.menuUuid"
          :disabled="isView"
          filterable
          clearable
        >
          <Option
            v-for="value in menuList"
            :key="value.menuUuid"
            :value="value.menuUuid"
            :label="value.menuName"
          >
          </Option>
        </Select>
      </FormItem>
      <FormItem label="版本号："
                prop="version"
      >
        <Input
          v-model="formData.version"
          clearable
          :disabled="isView"
          placeholder="请输入版本号"
        ></Input>
      </FormItem>
      <FormItem label="展示城市：" prop="cityList">
        <Select
          v-model="formData.cityList"
          :disabled="isView"
          multiple
          labelInValue
          filterable
          clearable
          @on-change="getAgentList"
        >
          <Option label="全部" :value="'all'">全部</Option>
          <Option
            v-for="value in cityList"
            :key="value.cityID"
            :value="value.cityID"
            :disabled="selectedAll"
            :label="value.city"
          >
          </Option>
        </Select>
      </FormItem>
      <FormItem label="运营商：" prop="agentList">
        <Select v-model="formData.agentList"
                multiple
                filterable
                labelInValue
                clearable
                :disabled="isView"
                placeholder="请选择城市后再选择"
                @on-change="changeAgent"
        >
          <Option label="全部" :value="'all'">全部</Option>
          <Option
            v-for="(value) in agentList"
            :key="value.uuid"
            :value="value.uuid"
            :label="value.name"
            :disabled="selectedAgentAll"
          >
          </Option>
        </Select>
      </FormItem>
      <FormItem label="司机类型：" prop="driverTypeList">
        <Select v-model="formData.driverTypeList" multiple clearable :disabled="isView">
          <Option v-for="value in driverTypeList"
                  :key=" value.value"
                  :value="value.value"
                  :label="value.name"
          >
          </Option>
        </Select>
      </FormItem>
      <FormItem label="司机角色：" prop="driverRoleList">
        <Select v-model="formData.driverRoleList" multiple clearable :disabled="isView">
          <Option v-for="value in driverRoleList"
                  :key=" value.value"
                  :value="value.value"
                  :label="value.name"
          >
          </Option>
        </Select>
      </FormItem>
      <FormItem label="跳转类型：" prop="proxyType">
        <Select
          v-model="formData.proxyType"
          :disabled="isView"
          clearable
        >
          <Option
            :value="0"
          >
            native
          </Option>
          <Option
            :value="1"
          >
            h5
          </Option>
          <Option
            :value="2"
          >
            flutter
          </Option>
        </Select>
      </FormItem>
      <FormItem v-if="isH5Type"
                :required="isH5Type"
                label="跳转链接："
                prop="proxyUrl"
      >
        <Input
          v-model="formData.proxyUrl"
          clearable
          :disabled="isView"
          placeholder="请输入跳转链接"
        ></Input>
      </FormItem>
      <FormItem label="参数列表："
                :required="!isH5Type"
                prop="proxyProperty"
      >
        <Input
          v-model="formData.proxyProperty"
          type="textarea"
          :disabled="isView"
          :rows="5"
          placeholder="多参数列表，以英文逗号间隔"
        ></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button v-if="!isView" v-lazy-click="saveData" type="primary">确定</Button>
      <Button @click="back">返回</Button>
    </div>
  </div>
</template>

<script>
import imgUpload from "_a/img-upload/index.vue";

import {
  driverMenuAppAdd,
  driverMenuAppUpdate,
  driverMenuList,
  queryMultiCityAgentPageList
} from "_o/api/configData";
import { driverTypeList, driverRoleList } from "_o/components/config-center/driver-app-manager/fields";
import { mapActions, mapState } from "vuex";

export default {
  name: "driver-app-manager-add",
  components: {
    imgUpload
  },
  data() {
    return {
      title: "新增应用",
      id: "",
      isView: false,
      agentList: [],
      menuList: [],
      driverTypeList,
      driverRoleList,
      actionUrl: this._baseUrl + "/common/uploadFile",
      formCityList: [],
      formAgentList: [],
      formData: {
        appName: "",
        menuUuid: "",
        driverTypeList: [],
        driverRoleList: [],
        proxyType: "",
        proxyUrl: "",
        version: "",
        imageUrl: "",
        proxyProperty: "",
        displayOrder: null,
        cityList: [],
        agentList: []
      },
      formValidate: {
        appName: [
          {
            type: "string",
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
        menuUuid: {
          type: "string",
          required: true,
          message: "必选",
          trigger: "change"
        },
        driverTypeList: [
          {
            type: "array",
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        driverRoleList: [
          {
            type: "array",
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        proxyType: [
          {
            type: "number",
            required: true,
            message: "必选",
            trigger: "change"
          }
        ],
        proxyUrl: [
          {
            type: "string",
            message: "必填",
            trigger: "change"
          }
        ],
        proxyProperty: [
          {
            type: "string",
            message: "必填",
            trigger: "change"
          }
        ],
        version: [
          {
            type: "string",
            required: true,
            message: "必填",
            trigger: "change"
          }
        ],
        imageUrl: [
          {
            required: true,
            message: "请上传图标",
            trigger: "change"
          }
        ],
        displayOrder: [
          {
            type: "number",
            required: true,
            message: "必填",
            trigger: "change"
          }
        ],
        cityList: {
          type: "array",
          required: true,
          message: "必选",
          trigger: "change"
        },
        agentList: {
          type: "array",
          required: true,
          message: "必选",
          trigger: "change"
        },
      }
    };
  },
  computed: {
    selectedAll() {
      return this.formData.cityList.some(item => item === "all")
    },
    selectedAgentAll() {
      return this.formData.agentList.some(item => item === "all")
    },
    ...mapState({
      cityList: (state) => state.common.cityList || [],
    }),
    isH5Type() {
      return this.formData.proxyType === 1;
    }
  },
  mounted() {
    if (!this.cityList || !this.cityList.length) {
      this.getCityList();
    }
    this.init()
  },
  methods: {
    ...mapActions(["getCityList"]),
    back() {
      this.$router.back();
    },
    init() {
      this.$refs.form.resetFields();
      let {
        id,
        data,
        isView
      } = this.$route.params
      if (!Object.keys(this.$route.params).length) {
        return this.$router.back();
      }
      this.isView = !!isView;
      this.getMenuList();
      if (id) {
        this.id = id;

        Object.keys(this.formData).forEach(key => {
          if (key === "cityList" && data[key].length) {
            this.formData.cityList = data[key].map(item => item.cityCode);
            this.formCityList = data[key];
          } else if (key === "agentList" && data[key].length) {
            this.formData.agentList = data[key].map(item => item.agentId);
            this.formAgentList = data[key];
          } else {
            this.formData[key] = data[key]
          }
        })
        this.title = "编辑应用";
      } else {
        this.title = "新增应用"
      }
    },
    getMenuList() {
      driverMenuList({
        currPage: 1,
        pageSize: 500
      }).then(res => {
        if (res && res.data && res.data.success && res.data.data && res.data.data.list) {
          // this.menuList = res.data.data.list
          Array.prototype.push.apply(this.menuList, res.data.data.list);
          this.$forceUpdate()
        }
      })
    },
    getAgentList(cityItem, init) {
      this.formData.cityList = [];
      // 专门为了提交数据
      this.formCityList = [];
      let hasAll = cityItem.some(item => item.value === "all")
      if (hasAll) {
        this.formData.cityList = [];
        this.formData.cityList.push("all");
        this.formCityList.push({
          cityCode: "all",
          cityName: "全国"
        })
      } else {
        Array.prototype.push.apply(this.formData.cityList, cityItem.map(item => item.value));
        Array.prototype.push.apply(
          this.formCityList,
          cityItem.map(item => ({
            cityCode: item.value,
            cityName: item.label
          }))
        );
      }
      let params = {
        // cityId: "",
        // currPage: 1,
        // pageSize: 100,
        // provinceId: "",
      };
      if (!hasAll) {
        params.cityIdList = cityItem.map(item => item.value);
      }
      if (!this.queryAgentLoading) {
        this.queryAgentLoading = true;
        clearTimeout(this.queryAgentTimeout);
        this.queryAgentTimeout = setTimeout(() => {
          this.queryAgentLoading = false;
          this.agentList = [];
          queryMultiCityAgentPageList(params).then(res => {
            if (res && res.data && res.data.success && res.data.data && res.data.data.list.length) {
              this.agentList = res.data.data.list;
              // // 触发选中
              this.formData.agentList = JSON.parse(JSON.stringify(this.formData.agentList));
              this.$forceUpdate();
            }
          })
        }, init ? 0 : 1000)
      }
    },
    changeAgent(agentArr) {
      this.formData.agentList = [];
      // 专门为了提交数据
      this.formAgentList = [];
      let hasAll = agentArr.some(item => item.value === "all")
      if (hasAll) {
        this.formData.agentList = [];
        this.formData.agentList.push("all");
        this.formAgentList.push({
          "agentId": "all",
          "agentName": "全部"
        })
      } else {
        Array.prototype.push.apply(this.formData.agentList, agentArr.map(item => item.value));
        Array.prototype.push.apply(
          this.formAgentList,
          agentArr.map(item => ({
            agentId: item.value,
            agentName: item.label
          }))
        );
      }
    },
    // TODO /common/uploadFile 改造img-upload  未使用
    getImgUrl(url, data) {
      this.formData.imageUrl = data.fileUrl;
      this.$refs.form.validate();
    },
    saveData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit();
        }
      });
    },
    submit() {
      let params = {
        ...this.formData
      };
      if (!params.cityList.length) {
        return this.$Message.error("请选择城市！");
      }
      params.cityList = this.formCityList;
      if (!params.agentList.length) {
        return this.$Message.error("请选择运营商！");
      }
      params.agentList = this.formAgentList;
      if (this.id) {
        params.id = this.id;
        driverMenuAppUpdate(params).then(res => {
          if (res && res.data && res.data.success) {
            this.$Message.success(res.data.msg);
            this.$router.back();
          } else {
            this.$Message.error("编辑失败");
          }
        });
      } else {
        driverMenuAppAdd(params).then(res => {
          if (res && res.data && res.data.success) {
            this.$Message.success(res.data.msg);
            this.$router.back();
          } else {
            this.$Message.error("创建失败");
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .ivu-input-wrapper,
  .ivu-input-number,
  .ivu-select {
    width: 400px;
  }

  /deep/ .ivu-form-item-content {
    width: 400px;
  }
</style>
