<template>
  <div>
    <Modal
      v-model="isShow"
      :width="1000"
      :title="modalTitle"
      :mask-closable="false"
      class="add-advertising"
      @on-cancel="formReset"
    >
      <Form
        ref="adForm"
        class="top15"
        :model="addData"
        :rules="ruleValidate"
        :label-width="130"
      >
        <FormItem
          label="所属位置："
          prop="position"
        >
          <span v-if="!isAdd">
            {{ positionMap[addData.position] }}
          </span>
          <Select
            v-else
            v-model="addData.position"
            filterable
            placeholder="请选择所属位置"
            class="width200"
            @on-change="changeposition"
          >
            <!-- eslint-disable -->
            <Option
              v-for="item in positionList"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</Option>
            <!-- eslint-enable -->
          </Select>
        </FormItem>
        <FormItem
          label="广告类型："
          prop="type"
        >
          <span v-if="!isAdd">
            {{ typeMap[addData.type] }}
          </span>
          <Select
            v-else
            v-model="addData.type"
            :disabled="!addData.position"
            placeholder="请选择广告类型"
            class="width200"
            @on-change="changetype"
          >
            <!-- eslint-disable -->
            <Option
              v-for="item in typeList"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</Option>
            <!-- eslint-enable -->
          </Select>
        </FormItem>
        <FormItem
          label="广告名称："
          prop="name"
        >
          <span v-if="!isAdd">
            {{ addData.name }}
          </span>
          <Input
            v-else
            v-model="addData.name"
            style="width:450px"
            :maxlength="50"
            placeholder="请输入广告名称"
          />
          <span
            v-if="isAdd"
            class="counter"
          >( {{ addData.name ? addData.name.length:0 }}/50 )</span>
        </FormItem>
        <FormItem
          v-if="addData.type != 10"
          label="优先级："
          prop="priority"
        >
          <span v-if="isDetail">
            {{ addData.priority }}
          </span>
          <InputNumber
            v-else
            v-model="addData.priority"
            :precision="0"
            :min="0"
            :max="99"
            placeholder="请输入0-99的整数"
            style="width:150px;"
          ></InputNumber>
        </FormItem>
        <transition
          :name="isAdd?'fade':''"
          mode="out-in"
          appear
        >
          <common-inner
            v-if="isCommonInner"
            ref="commonInner"
            :addData="addData"
            :setting="commonSetting"
            :handleType="handleType"
            :imgInfo="commonImgInfo"
            :cityList="cityList"
            :businessGradeList="businessGradeList"
            :businessProductCarEnum="businessProductCarEnum"
          ></common-inner>
          <cascader-inner
            v-if="isCascaderInner"
            ref="cascaderInner"
            :addData="addData"
            :handleType="handleType"
            :addDataKey="addDataKey"
            :cityList="cityList"
            :businessGradeList="businessGradeList"
            :businessProductCarEnum="businessProductCarEnum"
          ></cascader-inner>
        </transition>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          @click="addSubmit"
        >
          确定
        </Button>
        <Button
          v-if="handleType!==3"
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
  positionToTypeMap,
  positionList,
  positionMap,
  typeMap,
  needTaxiPositionArr,
  OWNER_VALUE,
  PASSENGER_VALUE,
  TAXI_ONLINE_VALUE,
  TAXI_YZ_VALUE
} from "../fields";
import {
  ruleValidate,
  detaultAddData,
  otherAddDataMap
} from "./fields";
import {
  axiosAppAdgAdd,
  axiosAppAdgUpdate,
  axiosAppAdgDetail,
  axiosAppAdgPriorityCheck
} from "_o/api/app-adg";
import commonInner from "./common-inner";
import cascaderInner from "./cascader-inner";

import { getUnion, getChildList } from "@/libs/tools"
import { mapState } from "vuex";

const handleTypeMap = {
  1: {
    title: "新增广告",
    type: "新增"
  },
  2: {
    title: "广告编辑",
    type: "编辑"
  },
  3: {
    title: "广告详情",
    type: "详情"
  }
};
// 使用commonInner组件的广告类型枚举值，来源：typeMap
const commonInnerType = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
// 使用cascaderInner组件的广告类型枚举值，来源：typeMap
const cascaderInnerType = [4];

export default {
  name: "add-ad-modal",
  components: {
    commonInner,
    cascaderInner
  },
  props: {
    show: {
      type: Boolean
    },
    uuid: {},
    type: {},
    handleType: {
      default: 1
    },
    cityList: {},
    infoData: {}// 审批详情的详情数据
  },
  data() {
    return {
      positionMap, // 位置Map
      typeMap, // 广告类型
      positionList, // 位置List
      isShow: this.show, // 新增弹窗是否显示
      ruleValidate: ruleValidate(this),
      addData: {
        ...detaultAddData,
        checkedRoles: ["5"],
        checkedTypes: ["1"], // 出租车选中订单类型
      }
    };
  },
  computed: {
    ...mapState({
      businessGradeList: state => state.common.businessGradeList,
      businessProductCarEnum: state => state.common.businessProductCarEnum,
    }),
    // 是否是详情
    isDetail() {
      return this.handleType === 3;
    },
    // 是否是新增
    isAdd() {
      return this.handleType === 1;
    },
    // 弹窗标题
    modalTitle() {
      return handleTypeMap[this.handleType].title;
    },
    // 位置对应的广告类型列表
    typeList() {
      if (this.addData.position) {
        return positionToTypeMap[this.addData.position];
      }
      return [];
    },
    // 位置和广告类型的组合key，规则：String(位置枚举值)+String(广告类型枚举值)，因为不同位置和广告类型组合的新增内容不一样
    addDataKey() {
      return `${this.addData.position}${this.addData.type}`
    },
    // common-inner组件使用的配置Object
    commonSetting() {
      let selectedObj = otherAddDataMap[this.addDataKey] || {};
      return selectedObj.setting;
    },
    // common-inner组件-图片上传功能的配置
    commonImgInfo() {
      let selectedObj = otherAddDataMap[this.addDataKey] || {};
      return selectedObj.imgInfo;
    },
    // 是否是普通广告
    isCommonInner() {
      return this.judgeIsHave(commonInnerType);
    },
    // 是否是轮播广告
    isCascaderInner() {
      return this.judgeIsHave(cascaderInnerType);
    }
  },
  watch: {
    show() {
      this.isShow = this.show;
      if (this.isShow) {
        this.$refs["adForm"].resetFields();
        this.handleType !== 1 && this.getDetail();
      }
    }
  },
  methods: {
    // 判断所选广告类型在不在arr中
    judgeIsHave(arr) {
      let type = this.addData.type;
      let result = arr.includes(type)
      return result;
    },
    // 获取详情
    getDetail(value) {
      // 没有uuid，说明是审批管理过来的，直接带了详情信息过来
      if (!this.uuid) {
        let data = JSON.parse(JSON.stringify(this.infoData))
        this.handleDetailInfo(data)
        return false
      }
      let params = {
        uuid: this.uuid,
        type: this.type
      };
      axiosAppAdgDetail(params).then(res => {
        let data = res.data.data || {}
        this.handleDetailInfo(data)
      })
    },
    // 根据详情返回数据结构，调整为适用于组件的
    handleDetailInfo(data) {
      // 详情接口数据格式转为我们能用的格式
      data.effectTime = [data.startTime, data.endTime]
      // 产品线
      if (data.productLineType === 1) {
        data.productLineArray = [0]
      }
      // else if (data.productLineType === 2) {
      let productLineArray = data.productLineArray || [];
      const checkedRoles = [] // 顺风车角色
      const checkedTypes = [] // 出租车类型
      const hasPassenger = productLineArray.includes(PASSENGER_VALUE);
      const hasOwnerOfCar = productLineArray.includes(OWNER_VALUE);
      const hasTaxiOnline = productLineArray.includes(TAXI_ONLINE_VALUE);
      const hasTaxiYz = productLineArray.includes(TAXI_YZ_VALUE)
      if (hasPassenger) {
        checkedRoles.push(PASSENGER_VALUE)
        productLineArray.splice(productLineArray.indexOf(PASSENGER_VALUE), 1)
      }
      if (hasOwnerOfCar) {
        checkedRoles.push(OWNER_VALUE)
        productLineArray.splice(productLineArray.indexOf(OWNER_VALUE), 1)
      }
      // 车主或乘客存在其一则选中顺风车
      // if (hasOwnerOfCar || hasPassenger) {
      //   productLineArray.push(PICKRIDE)
      // }
      // 是否包含出租车网约
      if (hasTaxiOnline) {
        checkedTypes.push(TAXI_ONLINE_VALUE)
        productLineArray.splice(productLineArray.indexOf(TAXI_ONLINE_VALUE), 1)
      }
      // 是否包含出租车扬招
      if (hasTaxiYz) {
        checkedTypes.push(TAXI_YZ_VALUE)
        productLineArray.splice(productLineArray.indexOf(TAXI_YZ_VALUE), 1)
      }

      // // 出租车扬招,网约存在其一则选中出租车
      // if (hasTaxiOnline || hasTaxiYz) {
      //   productLineArray.push(TAXISIGN)

      // }

      data.checkedRoles = checkedRoles;
      data.checkedTypes = checkedTypes;
      // }
      // 城市
      if (data.cityType === 1) {
        data.cityArray = ["1"]
      }
      // 轮播
      if (data.carouselList) {
        data.carouselList.forEach(item => {
          item.effectTime = [item.startTime, item.endTime]
          item.userGroupInfo && item.userGroupInfo.forEach(son => {
            son.uuid = son.userGroupCode
          })
          item.userGroupArray = item.userGroupInfo || []
        })
      }
      // 用户群
      if (data.userGroupInfo) {
        data.userGroupInfo.forEach(item => {
          item.uuid = item.userGroupCode
        })
        data.userGroupArray = data.userGroupInfo || []
      }
      // 商品类型
      if (data.productType === 1) {
        data.productTypeArray = [0]
      }
      if (data.productType === 2) {
        data.productTypeArray = data.productTypeArray.map(item => {
          return Number(item)
        })
      }
      // 选中的商品集合信息
      if (data.shopVo && data.shopVo.length > 0) {
        data.selectGoods = data.shopVo;
      }
      // data.selectGoods = [
      //   {
      //     spuName:"优惠券-陈奇",
      //     skuCode:"CS202007108038701"
      //   }, {
      //     spuName:"测试优惠券-x",
      //     skuCode:"500000006060012"
      //   }
      // ]
      // 业务线值转Number，过滤其他值
      const businessLineArray = data.businessLineArray = data.businessLineArray ? data.businessLineArray.map(item => Number(item)).filter(Boolean) : []
      productLineArray = productLineArray.map(item => Number(item));
      const position = Number(data.position);
      const PLA = {}
      businessLineArray.forEach(k => {
        const list = getChildList(this.businessGradeList, k).filter(item => {
          if (needTaxiPositionArr.includes(position)) {
            return true;
          } else {
            return item.value !== 1; // 去掉出租车
          }
        });
        PLA[k] = {
          label: (this.businessGradeList.find(it => it.value === k) || {}).label,
          businessListFinal: list,
          // 如果全选 0， 其他一个个加
          productLineArray: data.productLineType === 1 ? [0] : productLineArray.filter(pl => list.find(it => it.value === pl))
        };
      });
      data.productLineArray = productLineArray;
      data.PLA = PLA;

      this.addData = data
      // console.log(111,this.addData)

    },
    // 新增&编辑-提交
    // eslint-disable-next-line
    async addSubmit() {
      if (this.isDetail) {
        this.formReset();
        return false;
      }
      // 限定时段校验
      let commonValidResult = true
      if (this.$refs.commonInner) {
        let validPromise = this.$refs.commonInner.validTime()
        commonValidResult = await validPromise.then(res => {
          return res
        })
      }
      // 限定时段校验
      let addValidResult = false
      this.$refs["adForm"].validate(valid => { addValidResult = valid })

      // 数据格式重写
      if (commonValidResult && addValidResult) {
        let that = this;
        let params = JSON.parse(JSON.stringify(this.addData))
        // 小程序弹窗版本号默认1
        if (params.position === 9) {
          params.appVersionType = 1
        }
        if (this.handleType === 2) params.uuid = this.uuid;
        if (params.businessLineArray && params.PLA) {
          // 格式化产品线
          const PLA = params.PLA;
          const productLineArray = [];
          Object.keys(PLA).forEach(k => {
            PLA[k].productLineArray.forEach(productLine => {
              if (!productLineArray.includes(productLine)) {
                productLineArray.push(productLine);
              }
            });
          });
          params.productLineArray = productLineArray
          // 数据按照api要求调整
          // 1.如果产品线有0-全部，
          if (params.productLineArray && params.productLineArray.length) {
            if (params.productLineArray.includes(0)) {
              params.productLineType = 1
              params.productLineArray = []
            } else {
              params.productLineType = 2
            }
            // 若选择顺风车 将被选的顺风车角色加入产品线
            if (params.checkedRoles && params.checkedRoles.length) {
              params.productLineArray = getUnion(params.productLineArray, params.checkedRoles)
            }
            // 出租车类型
            if (params.checkedTypes && params.checkedTypes.length) {
              params.productLineArray = getUnion(params.productLineArray, params.checkedTypes)
            }
          }
        }
        // 2.如果城市有'1'-全部城市，
        if (params.cityArray) {
          if (params.cityArray.includes("1")) {
            params.cityType = 1
            params.cityArray = []
          } else {
            params.cityType = 2
          }
        }
        delete params.cityNameArray
        if (params.type == 10) delete params.priority
        function formatT(time) {
          return that.$moment(time).format("YYYY-MM-DD HH:mm:ss")
        }
        // 3.有效时间数组拆分成startTime和endTime
        params.startTime = formatT(params.effectTime[0])
        params.endTime = formatT(params.effectTime[1])
        delete params.effectTime
        if (params.type === 4) {
          params.carouselList.forEach(son => {
            son.startTime = formatT(son.effectTime[0])
            son.endTime = formatT(son.effectTime[1])
            delete son.effectTime
          })
        }
        // 4.用户群数据取codeList
        if (params.userGroupArray) params.userGroupArray = params.userGroupArray.map(item => item.userGroupCode)
        // 5.弹窗
        if (params.carouselList) {
          params.carouselList.forEach(son => {
            son.userGroupArray = son.userGroupArray.map(inner => inner.userGroupCode)
          })
        }
        // params.businessLineArray = params.businessLine ? [params.businessLine] : undefined
        this.validSubmit(params)
      }
    },
    // 所属位置相同,城市有重叠,产品线有重叠,生效时间重叠，优先级相同校验弹窗
    async validSubmit(params) {
      // 优先级相同校验
      if (params.type == 10) {
        this.axiosSubmit(params)
        return
      }
      params.PLA = undefined
      const res = await axiosAppAdgPriorityCheck(params);
      let list = res.data.data || []
      let result = {
        isHave: list.length > 0,
        msg: list.join(","),
        first: list[0]
      }
      if (result.isHave) {
        this.$Modal.confirm({
          title: "存在同优先级广告",
          width: 550,
          content: `<p>与以下广告优先级相同：${result.msg}</p><p>${result.first} 将展示在靠前位置</p><p>是否确认保存？</p>`,
          onOk: () => {
            this.axiosSubmit(params)
          }
        });
      } else {
        this.axiosSubmit(params)
      }
    },
    // 发送保存请求
    axiosSubmit(params) {
      let axiosFun = this.isAdd ? axiosAppAdgAdd : axiosAppAdgUpdate

      axiosFun(params).then(res => {
        this.$Message.success(`${handleTypeMap[this.handleType].type}成功！`);
        this.formReset(true);
      })
    },
    // isReload：是否重新加载列表页面数据
    formReset(isReload) {
      this.$refs["adForm"].resetFields();
      this.$emit("close", isReload);
    },
    // 切换位置，清空广告类型()
    changeposition(value) {
      // 如果广告类型候选值只有一个，默认选中
      if (this.typeList.length === 1) {
        this.addData.type = this.typeList[0].value
        this.changetype()
      } else {
        this.addData.type = null;
      }
      if (this.addData.newUserGroupType) {
        /**
         * newUserGroupType 人群类型 1-用户画像/2-司机画像/3-车辆画像
         */
        if (value === 14) {
          this.addData.newUserGroupType = 2
        } else {
          this.addData.newUserGroupType = 1
        }
      }
      console.log(value)
    },
    // 切换广告类型，addData声明的变量不同
    changetype() {
      let { position, type, name, priority } = this.addData
      let selectedObj = JSON.parse(JSON.stringify(otherAddDataMap[this.addDataKey] || {}));
      this.addData = {
        ...detaultAddData,
        ...selectedObj.data,
        position,
        type,
        name,
        priority
      };
    }
  }
};
</script>
<style lang="less">
.add-advertising {
  .ivu-modal {
    top: 20px;
  }
  .ivu-modal-body {
    min-height: 600px;
  }
}
</style>
