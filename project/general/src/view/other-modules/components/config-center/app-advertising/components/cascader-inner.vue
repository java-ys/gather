<template>
  <div class="cascader-add-inner">
    <FormItem
      v-if="dataSetting.isEffectTime"
      label="有效时间："
      prop="effectTime"
    >
      <span v-if="isDetail">
        {{ addData.effectTime.join(" 至 ") }}
      </span>
      <el-date-picker
        v-else
        v-model="addData.effectTime"
        type="datetimerange"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :clearable="false"
        :editable="false"
        size="small"
        style="width: 360px"
        align="left"
        value-format="yyyy-MM-dd HH:mm:ss"
        :default-time="['00:00:00', '23:59:59']"
        @change="chooseTime"
      />
    </FormItem>
    <FormItem
      v-if="dataSetting.isbusinessType"
      label="业务线："
      prop="businessLineArray"
    >
      <div v-if="isDetail">
        <span
          v-for="(val, index) in addData.businessLineArray"
          :key="val"
        >
          {{ businessProductCarEnum[val]
          }}{{ index === addData.businessLineArray.length - 1 ? "" : " / " }}
        </span>
      </div>
      <CheckboxGroup
        v-else
        v-model="addData.businessLineArray"
        @on-change="updateBusinessListFinal"
      >
        <Checkbox
          v-for="item in businessGradeList"
          :key="item.value"
          :label="item.value"
          style="margin-right: 15px;"
        >
          {{ item.label }}
        </Checkbox>
      </CheckboxGroup>
    </FormItem>
    <template
      v-if="dataSetting.isbusinessType"
    >
      <FormItem
        v-for="(item, key) in addData.PLA"
        :key="`${key}`"
        :label="`${item.label}产品线：`"
        prop="productLineArray"
      >
        <div v-if="isDetail">
          <span v-show="addData.productLineType === 1">
            全部产品线
          </span>
          <span
            v-for="(val, index) in item.productLineArray"
            :key="val"
          >
            {{ businessProductCarEnum["#" + val]
            }}{{ index === item.productLineArray.length - 1 ? "" : " / " }}
          </span>
        </div>
        <CheckboxGroup
          v-else
          v-model="item.productLineArray"
          @on-change="(value) => handleProductLine(value, key)"
        >
          <Checkbox
            v-if="item.businessListFinal.length"
            :label="0"
            style="margin-right:15px;"
          >
            全选
          </Checkbox>
          <Checkbox
            v-for="item in item.businessListFinal"
            :key="item.value"
            :label="item.value"
            style="margin-right:15px;"
          >
            {{ item.label }}
          </Checkbox>
        </CheckboxGroup>
      </FormItem>
    </template>
    <!-- 顺风车角色 乘客 & 车主 -->
    <FormItem
      v-if="showPickRideItem"
      label="顺风车角色："
      prop="checkedRoles"
    >
      <CheckboxGroup
        v-if="!isDetail"
        v-model="addData.checkedRoles"
      >
        <Checkbox
          v-for="item in pickrideRoles"
          :key="item.value"
          :label="item.value"
          style="margin-right:15px;"
        >
          {{ item.label }}
        </Checkbox>
      </CheckboxGroup>
      <span
        v-for="val in addData.checkedRoles"
        v-else
        :key="val"
      >
        {{ val | setPickRideRole }}
      </span>
    </FormItem>
    <!-- 出租车类型 网约1 & 扬招12 -->
    <FormItem
      v-if="showTaxiSignItem"
      label="出租车类型："
      prop="checkedTypes"
    >
      <CheckboxGroup
        v-if="!isDetail"
        v-model="addData.checkedTypes"
      >
        <Checkbox
          v-for="item in taxisignType"
          :key="item.value"
          :label="item.value"
          style="margin-right:15px;"
        >
          {{ item.label }}
        </Checkbox>
      </CheckboxGroup>
      <span
        v-for="val in addData.checkedTypes"
        v-else
        :key="val"
      >
        {{ val | setTaxisignType }}
      </span>
    </FormItem>
    <FormItem
      v-if="dataSetting.isCity"
      label="针对城市："
      prop="cityArray"
    >
      <div v-if="isDetail">
        <span v-show="addData.cityType === 1">
          全部城市
        </span>
        <span>{{ addData.cityNameArray.join(" / ") }}</span>
      </div>
      <Select
        v-else
        v-model="addData.cityArray"
        filterable
        multiple
        clearable
        placeholder="请选择针对城市"
        style="width:300px;"
        @on-change="changeCity"
      >
        <!-- eslint-disable -->
        <Option
          v-for="item in cityList"
          :key="item.value"
          :value="item.value"
        >{{ item.label }}</Option>
        <!-- eslint-enable -->
      </Select>
    </FormItem>
    <div>
      <Button
        v-if="!isDetail && addData.carouselList && addData.carouselList.length < 20"
        type="primary"
        class="right-add"
        @click="openAddModal"
      >
        添加轮播
      </Button>
    </div>
    <Divider style="margin-bottom:12px;" />
    <!-- 轮播列表 -->
    <FormItem prop="carouselList"></FormItem>
    <Table
      width="950"
      size="small"
      border
      :columns="cascaderTableColumns"
      :data="addData.carouselList"
    >
      <template
        slot="action"
        slot-scope="{ row, index }"
      >
        <Button
          v-if="isDetail"
          ghost
          type="warning"
          size="small"
          @click="handleAddModal(3, row, index)"
        >
          详情
        </Button>
        <ButtonGroup v-else>
          <Button
            ghost
            type="success"
            size="small"
            @click="handleAddModal(2, row, index)"
          >
            编辑
          </Button>
          <Button
            ghost
            type="warning"
            size="small"
            @click="handleAddModal(3, row, index)"
          >
            详情
          </Button>
          <Button
            ghost
            type="info"
            size="small"
            :disabled="index === 0"
            @click="moveItem(1, index)"
          >
            上移
          </Button>
          <Button
            ghost
            type="info"
            size="small"
            :disabled="index === addData.carouselList.length - 1"
            @click="moveItem(2, index)"
          >
            下移
          </Button>
          <Button
            ghost
            type="error"
            size="small"
            @click="deleteItem(index)"
          >
            删除
          </Button>
        </ButtonGroup>
      </template>
    </Table>
    <!-- 添加轮播 -->
    <Modal
      v-model="isAddModal"
      :width="860"
      :mask-closable="false"
      :title="modalTypeMap[handleModalType].title"
      @on-cancel="formReset"
    >
      <Form
        ref="addCascaderForm"
        class="top15"
        :model="addModalData"
        :rules="ruleValidate"
        :label-width="110"
      >
        <common-inner
          ref="cCommonInner"
          :addData="addModalData"
          :isShow="isAddModal"
          :handleType="handleModalType"
          :setting="commonSetting"
          :cityList="cityList"
          :imgInfo="commonImgInfo"
        ></common-inner>
      </Form>
      <div slot="footer">
        <Button
          v-show="handleModalType !== 3"
          type="primary"
          @click="modalAdd"
        >
          确定
        </Button>
        <Button
          type="text"
          @click="formReset"
        >
          取消
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  cascaderTableColumns,
  otherAddDataMap,
  ruleValidate,
  cascaderSetting
} from "./fields";
import {
  businessInfo,
  pickrideRoles,
  PICKRIDE,
  taxisignType,
  TAXISIGN,
  needTaxiPositionArr,
  TAXI_ONLINE_VALUE,
  TAXI_YZ_VALUE,
  PASSENGER_VALUE,
  OWNER_VALUE
} from "../fields";
import commonInner from "./common-inner";
import { tools } from "./mixin-tools";
import { getChildList } from "@/libs/tools";

const businessList = businessInfo.list.map(item => {
  if (item.value === "5") { // 5 为原始的顺风车value, 改为新值
    item.value = PICKRIDE
  }
  if (item.value === "1") // 1 为原始的出租车value, 改为新值
  {
    item.value = TAXISIGN
  }
  return item
})

// const businessMap = {
//   ...businessInfo.map,
//   ...{
//     [PICKRIDE]: "顺风车"
//   },
//   ...{
//     [TAXISIGN]: "出租车"
//   }
// }


const modalTypeMap = {
  1: {
    title: "添加轮播",
    type: "添加"
  },
  2: {
    title: "轮播编辑",
    type: "编辑"
  },
  3: {
    title: "轮播详情",
    type: "详情"
  }
};
export default {
  name: "cascader-inner",
  components: {
    commonInner
  },
  filters: {
    setPickRideRole(val) {
      let role
      switch (val) {
        case PICKRIDE: {
          role = ""
          break
        }
        case PASSENGER_VALUE: {
          role = "乘客"
          break
        }
        case OWNER_VALUE: {
          role = "车主"
          break
        }
      }
      return role
    },
    setTaxisignType(val) {
      let role
      switch (val) {
        case TAXISIGN: {
          role = ""
          break
        }
        case TAXI_ONLINE_VALUE: {
          role = "网约"
          break
        }
        case TAXI_YZ_VALUE: {
          role = "扬招"
          break
        }
      }
      return role
    }
  },
  mixins: [tools],
  props: {
    addData: {
      default: () => {
        return {};
      }
    },
    // 1-新增，2-编辑，3-详情
    handleType: {
      default: 1
    },
    addDataKey: {},
    cityList: {},
    businessGradeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    businessProductCarEnum: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      cascaderTableColumns: cascaderTableColumns(this),
      addModalData: JSON.parse(JSON.stringify(otherAddDataMap[this.addDataKey].addData)),
      ruleValidate: ruleValidate(this),
      modalTypeMap,
      businessList,
      // businessMap,
      isAddModal: false,
      editIndex: 0,
      handleModalType: 1, // 1-添加，2-编辑，3-详情
      pickrideRoles,
      taxisignType
    };
  },
  computed: {
    // 是否是详情
    isDetail() {
      return this.handleType === 3;
    },
    // common-inner组件-图片上传功能的配置
    commonSetting() {
      let selectedObj = otherAddDataMap[this.addDataKey] || {};
      return selectedObj.setting;
    },
    // common-inner组件-轮播图片限制
    commonImgInfo() {
      let selectedObj = otherAddDataMap[this.addDataKey] || {};
      return selectedObj.imgInfo;
    },
    // common-inner组件-轮播图片限制
    dataSetting() {
      let selectedObj = otherAddDataMap[this.addDataKey] || {};
      return selectedObj.dataSetting || cascaderSetting;
    },
    // 是否显示顺风车角色
    showPickRideItem() {
      const data = this.addData.businessLineArray
      return data ? data.includes(4) : false
    },
    // 是否显示出租车角色
    showTaxiSignItem() {
      let data = [];
      Object.keys(this.addData.PLA || {}).forEach(k => {
        data = data.concat(this.addData.PLA[k].productLineArray)
      });
      // 单选 出租车
      if (data.includes(1)) {
        return true
      }
      // else if (data.includes(0) && this.productList.find(item => item.value === 1)) {
      // 全选 && productList 里面有出租车
      //   return true
      // }
      return false
    },
    productList() {
      return getChildList(this.businessGradeList, this.addData.businessLine);
    }
  },
  watch: {
    addDataKey() {
      this.cascaderTableColumns = cascaderTableColumns(this)
      // app版本
      if (!this.commonSetting.isAppVersion) {
        this.cascaderTableColumns.splice(3, 1);
      }
    },
    // "addData.position": {
    //   handler(newValue) {
    //     let final = JSON.parse(JSON.stringify(businessList))
    //     if (Array.prototype.includes.call(needTaxiPositionArr, Number(newValue))) {
    //       final.push({
    //         ...taxiProductLine
    //       })
    //     }
    //     this.businessListFinal = final
    //   },
    //   immediate: true
    // },
    "addData.position": {
      handler(newValue) {
        this.updateBusinessListFinal()
      },
      immediate: false
    },
  },
  mounted() {
    this.cascaderTableColumns = cascaderTableColumns(this);
    // 如果是详情，修改操作栏宽度，为了美观
    this.handleType === 3 &&
      this.cascaderTableColumns.splice(-1, 1, {
        title: "操作",
        key: "action",
        tooltip: true,
        width: 80,
        slot: "action"
      });
    // app版本
    if (!this.commonSetting.isAppVersion) {
      this.cascaderTableColumns.splice(3, 1);
    }
    // 主要编辑的时候cityArray传过来页面组件没更新，需要手动更新一下
    this.addData.cityArray &&
      this.addData.cityArray.length > 0 &&
      this.addData.cityArray.splice(0, 1, this.addData.cityArray[0]);
  },
  methods: {
    // 非需要出租车的广告位置去掉出租车产品线
    updateBusinessListFinal() {
      const position = Number(this.addData.position);
      const businessLineArray = this.addData.businessLineArray || [];
      this.$set(this.addData, "PLA", {});
      businessLineArray.forEach(k => {
        let Obj;
        const list = getChildList(this.businessGradeList, k).filter(item => {
          if (needTaxiPositionArr.includes(position)) {
            return true;
          } else {
            return item.value !== 1;
          }
        });
        Obj = {
          label: (this.businessGradeList.find(it => it.value === k) || {}).label,
          businessListFinal: list,
          productLineArray: []
        };
        this.$set(this.addData.PLA, k, Obj);
      });
    },
    // 点击添加轮播按钮
    openAddModal() {
      this.handleModalType = 1;
      this.addModalData = JSON.parse(JSON.stringify(otherAddDataMap[this.addDataKey].addData));
      this.$refs["addCascaderForm"].resetFields();
      if (this.addModalData.effectTime) this.addModalData.effectTime = [...this.addData.effectTime]
      this.isAddModal = true;
    },
    // 轮播新增部分-编辑-详情
    handleAddModal(type, item, index) {
      this.editIndex = index;
      this.handleModalType = type;
      this.addModalData = { ...item };
      if (this.addData.position === 13) {
        this.addModalData = { ...this.addModalData, ...{ newUserGroupType: 2 } };
      }
      this.isAddModal = true;
    },
    // 添加轮播
    async modalAdd() {
      // 限定时段校验
      let commonValidResult = true
      if (this.$refs.cCommonInner) {
        let validPromise = this.$refs.cCommonInner.validTime()
        commonValidResult = await validPromise.then(res => {
          return res
        })
      }

      let casValidResult = false
      this.$refs["addCascaderForm"].validate(valid => { casValidResult = valid })

      if (commonValidResult && casValidResult) {
        let copyAddData = JSON.parse(JSON.stringify(this.addModalData));
        if (this.handleModalType === 1) {
          this.addData.carouselList.push(copyAddData);
        } else {
          this.addData.carouselList.splice(this.editIndex, 1, copyAddData);
        }
        this.isAddModal = false;
      }
    },
    // 取消添加轮播
    formReset() {
      this.$refs["addCascaderForm"].resetFields();
      this.isAddModal = false;
    },
    // 上移下移，type===1上移，type===2下移
    moveItem(type, index) {
      let moveIndex = type === 1 ? index - 1 : index + 1;

      let moveData = this.addData.carouselList[moveIndex];
      this.addData.carouselList.splice(moveIndex, 1);
      this.addData.carouselList.splice(index, 0, moveData);
    },
    // 表格删除
    deleteItem(index) {
      this.addData.carouselList.splice(index, 1);
    }
  }
};
</script>
<style lang="less">
.cascader-add-inner {
  .tableImg {
    width: 80px;
    height: 30px;
    margin: 5px 0;
  }
  .ivu-tooltip.lang-val {
    .ivu-tooltip-rel span {
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      overflow: hidden;
      max-width: 210px;
    }
  }
  .right-add {
    float: right;
    position: relative;
    top: -23px;
  }
}
</style>
