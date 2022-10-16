<template>
  <div>
    <Form :model="formData" :label-width="130" :rules="formValidate" ref="form">
      <FormItem label="城市：" prop="cityArr">
        <span v-if="handleType == 3">{{detailInfo.cityName}}</span>
        <Cascader v-else v-model="formData.cityArr" placeholder="请选择" :data="cityList" style="width: 200px;" @on-change="getAgentName"></Cascader>
      </FormItem>
      <FormItem label="运营商：" prop="agentArr">
        <span v-if="handleType == 3">{{detailInfo.agentNameStr}}</span>
        <Select v-else v-model="formData.agentArr" style="width: 200px" multiple placeholder="请选择" @on-change="getAgentInfo">
          <Option v-for="(item, index) in agentInfo" :key="index" :value="item.value">
            {{ item.label }}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="产品线：" prop="driverType">
        <span v-if="handleType == 3">{{detailInfo.driverTypeNames}}</span>
        <Select v-else v-model="formData.driverType" style="width: 200px" multiple placeholder="请选择">
          <Option v-for="item in bizTypeList" :label="item.label" :value="item.value.toString()" :key="item.key"></Option>
        </Select>
      </FormItem>
      <FormItem label="司机类型：" prop="operationType">
        <span v-if="handleType == 3">{{operationMap[detailInfo.operationType]}}</span>
        <Select v-else v-model="formData.operationType" style="width: 200px" multiple placeholder="请选择">
          <Option label="UP司机" value="2"></Option>
        </Select>
      </FormItem>
      <FormItem label="司机工资类别：" prop="salaryTypeCode">
        <span v-if="handleType == 3">{{detailInfo.salaryTypeName}}</span>
        <Select v-else v-model="formData.salaryTypeCode" style="width: 200px" multiple filterable clearable  placeholder="请选择" @on-change="getSalaryName">
          <Option v-for="(item, index) in salaryTypeList" :key="index" :value="item.itemcode">
            {{ item.itemvalue }}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="是否展示预估收入：" prop="isShowEstimate">
        <span v-if="handleType == 3">{{detailInfo.isShowEstimate == 0 ? "否" : "是"}}</span>
        <RadioGroup v-else v-model="formData.isShowEstimate" style="width: 200px" placeholder="请选择">
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="说明：" prop="confDesc">
        <span v-if="handleType == 3">{{detailInfo.confDesc}}</span>
        <Input v-else v-model="formData.confDesc" :rows="8" :autosize="{maxRows:8,minRows: 8}" :maxlength="100" show-word-limit type="textarea" placeholder="请输入" style="width: 200px" />
        <span v-if="handleType != 3" class="numberV">{{txtVal}}/100</span>
      </FormItem>
    </Form>
    <div slot="footer" class="button-group">
      <Button v-if="handleType != 3" @click="cancel()">取消</Button>
      <Button v-if="handleType != 3" type="primary" v-lazy-click="saveData">保存</Button>
      <Button v-else @click="cancel()" size="large">关闭</Button>
    </div>
  </div>
</template>

<script>
import {
  getAgentByCity,
  driverOrderAdd,
  driverOrderEdit
} from "_o/api/configData";
import { operationMap, productMap, handleTypeMap } from "../fields";
import { mapState } from "vuex";
export default {
  name: "add",
  props: {
    cityList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    salaryTypeList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    editInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    handleType: {
      default: 1
    }
  },
  data() {
    return {
      txtVal: 0,
      operationMap,
      productMap,
      handleTypeMap,
      detailInfo: {},
      cityArr: [],
      agentInfo: [],
      formData: {
        agentList: [],
        cityArr: [],
        agentArr: [],
        driverType: [],
        operationType: [],
        salaryTypeCode: [],
        isShowEstimate: null,
        confDesc: ""
      },
      formValidate: {
        cityArr: [
          {
            required: true,
            message: "请选择城市",
            trigger: "change",
            type: "array"
          }
        ],
        agentArr: [
          {
            required: true,
            message: "请选择运营商",
            trigger: "blur",
            type: "array"
          }
        ],
        driverType: [
          {
            required: true,
            message: "请选择产品线",
            trigger: "change",
            type: "array"
          }
        ],
        operationType: [
          {
            required: true,
            message: "请选择司机类型",
            trigger: "change",
            type: "array"
          }
        ],
        salaryTypeCode: [
          {
            required: true,
            message: "请选择司机工资类别",
            trigger: "change",
            type: "array"
          }
        ],
        isShowEstimate: [
          {
            required: true,
            message: "请选择预估收入",
            trigger: "change",
            type: "number"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      bizTypeList: state => state.common.bizTypeList,
    }),
  },
  mounted() {
    if (this.handleType == 2) {
      this.formData = this.setJson(this.editInfo);
    }
    if (this.handleType == 3) {
      this.detailInfo = JSON.parse(JSON.stringify(this.editInfo));
      this.detailInfo.driverTypeNames = this.getDriverTypeList(this.detailInfo);
    }
  },
  watch: {
    "formData.confDesc"() {
      this.txtVal = this.formData.confDesc.length;
    }
  },
  methods: {
    getDriverTypeList(data) {
      let info = "";
      if (data.driverType.indexOf(",") != -1) {
        data.driverType.split(",").forEach(item => {
          info += (this.bizTypeList.find(it => it.value === Number(item)) || {}).label+ " ";
        });
      } else {
        info += (this.bizTypeList.find(it => it.value === Number(data.driverType)) || {}).label;
      }
      return info;
    },
    // 根据城市code获取运营商
    async getAgentName([_, cityCode]) {
      this.formData.agentArr = [];
      if (!cityCode) return;
      this.formData.cityName = await this.getCityInfo(cityCode).city;
      this.formData.cityCode = cityCode;
      getAgentByCity({ cityCode: cityCode }).then(res => {
        let list = res.data.data || [];
        list.forEach(item => {
          item.label = item.name;
          item.value = item.uuid;
        });
        this.agentInfo = list;
      });
    },
    cancel() {
      this.$refs["form"].resetFields();
      this.$emit("close");
    },
    setJson(data) {
      let params = {};
      let provinceID = this.getCityInfo(data.cityCode).provinceID;
      params.cityArr = [provinceID, data.cityCode];
      if (params.cityArr) {
        this.getAgentName(params.cityArr);
      }
      params.agentArr = this.stringToArr(data.agentUuidStr);
      params.agentList = this.getAgentInfo(params.agentArr);
      params.driverType = this.stringToArr(data.driverType);
      params.operationType = [data.operationType];
      params.salaryTypeCode = this.stringToArr(data.salaryTypeCode);
      params.isShowEstimate = data.isShowEstimate;
      params.confDesc = data.confDesc;
      return params;
    },
    stringToArr(data) {
      return data.split(",");
    },
    saveData() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = {
            agentList: this.formData.agentList,
            cityCode: this.formData.cityCode,
            cityName: this.formData.cityName,
            driverType: this.formData.driverType,
            isShowEstimate: this.formData.isShowEstimate,
            operationType: this.formData.operationType,
            salaryTypeCode: this.formData.salaryTypeCode,
            salaryTypeName: this.formData.salaryTypeName,
            confDesc: this.formData.confDesc
          };
          if (this.handleType == 1) {
            this.add(params);
          } else if (this.handleType == 2) {
            this.edit(params);
          }
        }
      });
    },
    add(params) {
      driverOrderAdd(params).then(res => {
        if (res.data.success) {
          this.$Message.info(res.data.msg);
          this.$emit("close");
        }
      });
    },
    edit(params) {
      driverOrderEdit({ ...params, id: this.editInfo.id }).then(res => {
        if (res.data.success) {
          this.$Message.info(res.data.msg);
          this.$emit("close");
        }
      });
    },
    getAgentInfo(val) {
      this.formData.agentList = [];
      this.agentInfo.forEach(it => {
        val.forEach(ig => {
          if (ig == it.uuid) {
            this.formData.agentList.push({
              agentName: it.name,
              agentUuid: it.uuid
            });
          }
        });
      });
      return this.formData.agentList;
    },
    getSalaryName(val) {
      this.formData.salaryTypeName = [];
      this.salaryTypeList.forEach(it => {
        val.forEach(ig => {
          if (ig == it.itemcode) {
            this.formData.salaryTypeName.push(it.itemvalue);
          }
        });
      });
    },
    getCityInfo(cityCode) {
      let info = {};
      let allCities = this.getAllCities();
      allCities.forEach(item => {
        if (item.cityID == cityCode) {
          info = item;
        }
      });
      return info;
    },
    getAllCities() {
      let allCities = [];
      this.cityList.forEach(item => {
        if (item.nodes.length) {
          item.nodes.forEach(it => {
            allCities.push(it);
          });
        }
      });
      return allCities;
    }
  }
};
</script>

<style lang="less" socped>
.numberV {
  position: absolute;
  top: 150px;
  left: 145px;
}
.button-group {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
.button-group button {
  margin: 0 10px;
}
</style>