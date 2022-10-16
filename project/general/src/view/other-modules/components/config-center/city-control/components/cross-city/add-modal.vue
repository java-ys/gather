<template>
  <div>
    <Modal
      v-model="isShow"
      :width="800"
      :title="modalTitle"
      :mask-closable="false"
      @on-cancel="formReset"
    >
      <Form
        v-if="isShow && crossCityData"
        ref="adForm"
        :model="crossCityData"
        :rules="ruleValidate"
        :label-width="110"
      >
      <!-- // 先注释，暂不上 -->
        <!-- <FormItem label="行政区类型：" prop="areaType">
          <Select
            v-model="crossCityData.areaType"
            :disabled="!isAdd"
            style="width: 200px"
            placeholder="请选择行政区类型"
          >
            <Option
              :key="1"
              :value="1"
            >市级</Option>
            <Option
              :key="2"
              :value="2"
            >区县级</Option>
          </Select>
        </FormItem> -->
        <FormItem label="出发城市：">
          {{parentParams.cityName}}
        </FormItem>
        <!-- <FormItem
          label="行政区域："
          prop="areaCode"
          v-if="crossCityData.areaType === 2"
        >
          <span v-if="!isAdd">
            {{crossCityData.areaName}}
          </span>
          <Select
            v-else
            v-model="crossCityData.areaCode"
            style="width:200px"
            placeholder="请选择行政区域"
          >
            <Option v-for="item in currentAreaList" :key="item.label" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem> -->
        <FormItem label="目的城市：" prop="destCityArray">
          <span v-if="!isAdd">
            {{crossCityData.destProvinceName + "/" + crossCityData.destCityName}}
          </span>
          <Cascader
            v-else
            v-model="crossCityData.destCityArray"
            :data="cityList"
            :clearable="false"
            :filterable="true"
            style="width: 200px"
            placeholder="请选择城市"
            @on-change="destCityArrayChanged"
          >
          </Cascader>
        </FormItem>
        <FormItem label="策略对象：" prop="consumerType">
          <Select
            v-model="crossCityData.consumerType"
            :disabled="!isAdd"
            style="width: 200px"
            placeholder="请选择策略对象"
          >
            <Option
              v-for="item in consumerTypeList"
              :key="item.value"
              :value="item.value"
            >
              {{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="业务线：" prop="expandBizLine">
          <span v-if="!isAdd">
            {{getBusinessName(crossCityData.expandBizLine)}}
          </span>
          <Select
            v-else
            v-model="crossCityData.expandBizLine"
            style="width: 200px"
            placeholder="请选择业务线"
            @on-change="changeBusiness"
          >
            <Option
              v-for="item in businessGradeList"
              :key="item.value"
              :value="item.value"
            >
              {{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="产品线：" prop="bizType">
          <span v-if="!isAdd">
            {{getProductName(crossCityData.bizType)}}
          </span>
          <Select
            v-else
            v-model="crossCityData.bizType"
            style="width: 200px"
            placeholder="请选择产品线"
            @on-change="changeProduct"
          >
            <Option
              v-for="item in productLines"
              :key="item.bizType"
              :value="item.bizType"
            >
              {{item.bizTypeName}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="车型等级：" prop="carLevel">
          <span v-if="!isAdd">
            {{getCarLevelName(crossCityData.carLevel, crossCityData.bizType)}}
          </span>
          <Select
            v-else
            v-model="crossCityData.carLevel"
            style="width: 200px"
            placeholder="请选择车型等级"
          >
            <Option
              v-for="item in carLevelList"
              :key="item.vehicleLevel"
              :value="item.vehicleLevel"
            >
              {{item.vehicleName}}
            </Option>
          </Select>
        </FormItem>
        <!-- 分段 -->
        <Form
          v-for="(item, index) in crossCityData.crossCityFareRule"
          :key="index"
          ref="fareForm"
          class="flex-box pr"
          :model="item"
          :rules="crossCityFareRuleValidate"
        >
          <label class="ivu-form-item-label" style="width: 80px">
            分段 {{index + 1}}：</label>
          <FormItem prop="startCapacity" label="分段起始：" :label-width="90">
            <Select
              v-model="item.startCapacity"
              :disabled="isDetail"
              style="width: 100px"
              placeholder="请选择"
            >
              <Option v-for="item in capacityMap" :key="item" :value="item">
                {{item + "公里"}}
              </Option>
            </Select>
          </FormItem>
          <FormItem prop="endCapacity" label="分段结束：" :label-width="100">
            <Select
              v-model="item.endCapacity"
              :disabled="isDetail"
              style="width: 100px"
              placeholder="请选择"
            >
              <Option v-for="item in capacityMap" :key="item" :value="item">
                {{item + "公里"}}
              </Option>
              <Option :value="10000"> 及以上 </Option>
            </Select>
          </FormItem>
          <FormItem label="费用（元）：" prop="unitPrice" :label-width="100">
            <InputNumber
              v-model="item.unitPrice"
              :disabled="isDetail"
              :min="0"
              :max="999.9"
              :step="0.1"
              placeholder="请输入"
              @on-blur="FormatNumber(item.unitPrice, index)"
            ></InputNumber>
          </FormItem>
          <Icon
            v-if="index > 0 && !isDetail"
            class="remove-icon"
            type="ios-remove-circle-outline"
            @click="removeItem(index)"
          />
        </Form>
        <div
          v-if="
            !isDetail &&
              crossCityData.crossCityFareRule &&
              crossCityData.crossCityFareRule.length < 10
          "
        >
          <label class="ivu-form-item-label" style="width: 90px"></label>
          <Button type="primary" size="small" @click="addItem">
            新增分段
          </Button>
        </div>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="addSubmit">确定</Button>
        <Button type="text" @click="formReset(false)">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  carLevelMap,
  consumerTypeList,
  capacityMap,
  ruleValidate,
  crossCityFareRuleValidate,
} from "./fields";
import {
  crossCityUpdate,
  crossCitySave,
  crossCityDetail,
} from "_g/api/openCity";
import { mapState, mapGetters } from "vuex"
// import {getAreaInfoByCityCode} from '_o/api/configData.js'
export default {
  name: "add-cross-city-modal",
  props: {
    show: {
      type: Boolean,
    },
    parentParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
    editInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    modalType: {
      default: "detail",
    },
  },
  data() {
    return {
      carLevelMap,
      consumerTypeList,
      capacityMap,
      ruleValidate,
      crossCityFareRuleValidate,
      isShow: false,
      cityList: [],
      crossCityData: null,
      productLines: [],
      carLevelList: [],
      // 先注释，暂不上
      // currentAreaList: []
    };
  },
  computed: {
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    }),
    modalTitle() {
      const titleMap = {
        detail: "跨城费策略详情",
        edit: "编辑跨城费策略",
        add: "新增跨城费策略",
      };
      return titleMap[this.modalType];
    },
    isDetail() {
      return this.modalType === "detail";
    },
    isAdd() {
      return this.modalType === "add";
    },
  },
  watch: {
    show() {
      this.isShow = this.show;
      if (this.isShow) {
        if (this.isAdd) {
          this.crossCityData = {
            ...this.parentParams,
            cityCode: this.parentParams.cityId,
            destCityArray: [],
            consumerType: null,
            carLevel: null,
            crossCityFareRule: [],
            bizType:null,
            expandBizLine:null
          };
          this.addItem();
          // this.queryArea(this.parentParams.cityId)
        } else {
          this.getDetail(this.editInfo.uuid);
        }

      }
    },
  },
  mounted() {
    this.cityList = JSON.parse(localStorage.getItem("wholeProCityList"));
  },
  methods: {
    destCityArrayChanged(value, list) {
      this.crossCityData.destCityName = list[1].label;
      this.crossCityData.destProvinceName = list[0].label;
    },
    getDetail(uuid) {
      crossCityDetail({ uuid }).then((res) => {
        const result = res.data.data;
        this.crossCityData = {
          ...result,
          bizType: result.businessType,
          destCityArray: [result.destProvinceCode, result.destCityCode],
        };
      });
    },
    FormatNumber(VauleNumber, index, fixNum = 1) {
      if (VauleNumber) {
        let newVal = parseFloat(VauleNumber.toFixed(fixNum));
        this.crossCityData.crossCityFareRule[index].unitPrice = newVal;
      }
    },
    addItem() {
      let startCapacity = "";
      const list = this.crossCityData.crossCityFareRule;
      if (list.length) {
        const ec = list[list.length - 1].endCapacity;
        if (ec === 10000) {
          list[list.length - 1].endCapacity = 100;
        } else {
          startCapacity = ec;
        }
      }
      this.crossCityData.crossCityFareRule.push({
        unitPrice: null,
        startCapacity: startCapacity,
        endCapacity: 10000,
      });
    },
    removeItem(index) {
      this.crossCityData.crossCityFareRule.splice(index, 1);
    },
    // 检查分段没有断层，检查分段是“及以上”结尾
    checkPassed(list) {
      //  是否 有 及以上
      const isEnd = list.map((m) => m.endCapacity).indexOf(10000) !== -1;
      if (list.length === 1) {
        return isEnd;
      }
      // 排序
      const capList = list.sort((m1, m2) => m1.startCapacity - m2.startCapacity);
      for (let i = 1; i < capList.length; i++) {
        const elPre = capList[i - 1];
        const elNext = capList[i];
        if (elNext.startCapacity !== elPre.endCapacity) {
          return false;
        }
      }
      return isEnd;
    },
    // 新建&编辑-提交
    async addSubmit() {
      if (this.isDetail) {
        this.formReset();
        return;
      }
      const fetchList = this.$refs["fareForm"].map((v, i) => this.$refs["fareForm"][i].validate());
      const promise1 = this.$refs["adForm"].validate();
      const validList = await Promise.all([promise1, ...fetchList]);
      // console.log("validateResult: ", validList);
      if (validList.every((v) => v)) {
        if (this.crossCityData.destCityArray[1] === this.crossCityData.cityCode) {
          this.$Message.error(`目的城市和出发城市不能相同！`);
          return
        }
        // 校验通过
        if (!this.checkPassed(this.crossCityData.crossCityFareRule)) {
          this.$Modal.confirm({
            title: "提示",
            content: `两个分段之间不能有间隔<br>
            分段结束最后一条是：及以上 <br>
            请参考例子：30-40公里:40元，40公里及以上80元`,
          });
          return;
        }
        // 先注释，暂不上
        // let areaItem = this.currentAreaList.find(it => it.value === this.crossCityData.areaCode) || {}
        let _params = {
          ...this.crossCityData,
          destProvinceCode: this.crossCityData.destCityArray[0],
          destCityCode: this.crossCityData.destCityArray[1],
          businessType: this.crossCityData.bizType,
          // 先注释，暂不上
          // areaName: areaItem.label
        };
        let axiosFun = this.isAdd ? crossCitySave : crossCityUpdate;
        axiosFun(_params).then((res) => {
          this.$Message.success(`${this.modalTitle}成功！`);
          this.formReset(true);
        });
      }
    },
    // isReload：是否重新加载列表页面数据
    formReset(isReload) {
      this.$refs["adForm"].resetFields();
      this.$refs["fareForm"].map((v, i) => this.$refs["fareForm"][i].resetFields());
      this.$emit("close", isReload);
    },
    // 变更业务线下拉
    changeBusiness(value) {
      const business = this.businessGradeList.find(v => v.value === value)
      this.$nextTick(() => {
        this.crossCityData.bizType = null // 清空下级
        this.crossCityData.carLevel = null
        this.carLevelList = []
        this.productLines = business.children || [] // 赋值产品线
      })
    },
    // 产品线下拉
    changeProduct(val) {
      const product = this.productLines.find(v => v.bizType === val)
      this.$nextTick(() => {
        this.crossCityData.carLevel = "" // 清空下级
        this.carLevelList = product ? product.levels || [] : [] // 赋值车型等级
      })
    },
    getBusinessName(val) {
      const { businessKeyValue } = this.businessGradeName
      return businessKeyValue[val] || ""
    },
    getProductName(val) {
      const { productKeyValue } = this.businessGradeName
      return productKeyValue[val] || ""
    },
    getCarLevelName(val, bizType) {
      const { productCarKeyValue } = this.businessGradeName
      return productCarKeyValue[`${bizType}#${val}`] || ""
    },
    queryArea(val) {
      getAreaInfoByCityCode({ cityCode: val }).then(res => {
        if (res.data.success) {
          const list = res.data.data.map(it => {
            return {
              label: it.orgName,
              value: it.orgCode
            }
          })
          this.currentAreaList = list
        }
      })
    }
  },
};
</script>

<style lang="less">
.remove-icon {
  position: relative;
  width: 60px;
  text-align: center;
  top: 8px;
  font-size: 20px;
  color: #e61f10;
  font-weight: bold;
  cursor: pointer;
}
</style>
