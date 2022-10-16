<template>
  <a-form-model ref="strategyForm" :model="form" :rules="rules" labelAlign="left">
    <a-form-model-item v-bind="formItemProps" label="规则名称：" prop="ruleName">
      <a-input v-model="form.ruleName" style="width: 200px" prop="ruleName" :disabled="isEdit" allow-clear />
    </a-form-model-item>
    <a-form-model-item v-bind="formItemProps" label="城市：" prop="cityCode">
      <a-select
        v-model="form.cityCode"
        style="width: 200px"
        :disabled="isEdit"
        allow-clear
        showSearch
        :filter-option="filterOption"
        @change="onCityChange"
      >
        <a-select-option v-for="({ label, value }) in cityList" :key="value" :value="value">
          {{label}}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item v-bind="formItemProps" label="区县：" prop="districts">
      <a-select
        v-model="form.districts"
        style="width: 200px"
        mode="multiple"
        :disabled="isEdit || isUndefined(form.cityCode)"
        allow-clear
        showSearch
        :filter-option="filterOption"
        @change="changeArea"
      >
        <a-select-option v-for="({ label, value }) in currentAreaList" :key="value" :value="value">{{label}}</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item v-bind="formItemProps" label="产品线：" prop="productLineCode">
      <a-select
        v-model="form.productLineCode"
        style="width: 200px"
        allow-clear
        :filter-option="filterOption"
        :disabled="isEdit || isUndefined(form.cityCode)"
        @change="onProductLineChange"
      >
        <a-select-option v-for="({ label, value }) in productLines" :key="value" :value="value">{{label}}</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item v-bind="formItemProps" label="车型等级：" prop="defaultCarLevelCode">
      <a-select
        v-model="form.defaultCarLevelCode"
        allow-clear
        style="width: 200px"
        :filter-option="filterOption"
        :disabled="isEdit || isUndefined(form.productLineCode)"
        @change="onCarLevelChange"
      >
        <a-select-option v-for="({ label, value }) in carLevelList" :key="value" :value="value">{{label}}</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="司机接单类型配置：" prop="orderLevels">
      <SettingRow
        v-for="(type, index) in [
          ...form.orderLevels,
          form.orderLevels.length >= assignableTypes.length - 1 ? null : { itemType: 1, itemCode: '',itemName: '', isShow: 1, closeHint: '' }
        ]"
        :key="index"
        :item="type"
        :index="index"
        :itemDisabled="isUndefined(form.defaultCarLevelCode) || index < form.orderLevels.length"
        :optionList="assignableTypes"
        :optionDisableFn="isOptionDisabled"
        :parentList="form.orderLevels"
        @change="handleTypeChoose"
        @show-modal="showModal(type)"
        @del="onClickDeleteLast(index)"
      />
    </a-form-model-item>
    <a-form-model-item label="接受指派特价订单：" prop="orderTypes">
      <SettingRow
        v-for="(type, index) in [
          ...form.orderTypes,
          form.orderTypes && form.orderTypes.length >= 2 ? null : { itemType: 2, itemCode: '',itemName: '', isShow: 1, closeHint: '' }
        ]"
        :key="index"
        :item="type"
        :index="index"
        :itemDisabled="isUndefined(form.defaultCarLevelCode) || index < form.orderTypes.length"
        :optionList="orderAssignableTypes"
        :optionDisableFn="isOptionOrderDisabled"
        :parentList="form.orderTypes"
        @change="handleOrderTypeChoose"
        @show-modal="showModal(type)"
        @del="onClickOrderDeleteLast(index)"
      />
    </a-form-model-item>
    <a-form-model-item label="接受指派特快订单：" prop="orderFastTypes">
      <SettingRow
        v-for="(type, index) in [
          ...form.orderFastTypes,
          form.orderFastTypes && form.orderFastTypes.length >= 1 ? null : { itemType: 2, itemCode: '',itemName: '', isShow: 1, closeHint: '' }
        ]"
        :key="index"
        :item="type"
        :index="index"
        :itemDisabled="isUndefined(form.defaultCarLevelCode) || index < form.orderFastTypes.length"
        :optionList="orderFastTypes"
        :optionDisableFn="isOptionFastOrderDisabled"
        :parentList="form.orderFastTypes"
        @change="handleOrderFastTypeChoose"
        @show-modal="showModal(type)"
        @del="onClickFastOrderDeleteLast(index)"
      />
    </a-form-model-item>
    <a-form-model-item label="司机接单来源配置：" prop="driverOrderTypes">
      <SettingRow
        v-for="(type, index) in [
          ...form.driverOrderTypes,
          form.driverOrderTypes && form.driverOrderTypes.length >= 1 ? null : { itemType: 5, itemCode: '',itemName: '', isShow: 1, closeHint: '' }
        ]"
        :key="index"
        :item="type"
        :index="index"
        :itemDisabled="isUndefined(form.defaultCarLevelCode) || index < form.driverOrderTypes.length"
        :optionList="driverOrderTypes"
        :optionDisableFn="isOptionDriverOrderDisabled"
        :parentList="form.driverOrderTypes"
        @change="handleDriverOrderTypeChoose"
        @show-modal="showModal(type)"
        @del="onClickDriverOrderDeleteLast(index)"
      />
    </a-form-model-item>
    <a-modal
      v-model="modalProps.isShow"
      width="80%"
      :footer="null"
      title="查看新用户群"
    >
      <new-user-group-modal
        v-bind="modalProps"
        @close="closeModal"
        @selectDown="onSelectUserGroup"
      />
    </a-modal>
  </a-form-model>
</template>
<script>
import { computed, inject, nextTick, reactive, ref, watch } from "@vue/composition-api";
import { SYMBOL__CITY_LIST } from "../biz";
import { getNewBusinessLine, getNewCarLevelList, callAreaInfoByCityCode } from "_gc/status-map";
import { DRIVER_ORDER_TYPES, ORDER_ASSIGNABLES_TYPES, ORDER_FAST_TYPES } from "../fields"
import { listToMap } from "@/libs/util.js"
import NewUserGroupModal from "_a/new-user-group-modal";
import _lodash from "lodash"
import {
  formatOrderTypesFromServer
} from "_o/components/config-center/strategy-control/crossLevelOrder/components/useStrategyModal";
import SettingRow from "_o/components/config-center/strategy-control/crossLevelOrder/components/SettingRow";

const useUserGroupModal = () => {
  const list = ref([]);
  const visible = ref(false)
  let item = null;
  const modalProps = reactive({
    isShow: visible,
    limitNumber: 15,
    list,
    overrideReqParams: {
      userGroupType: 2, // 司机画像
    }
  })

  const closeModal = () => {
    visible.value = false;
  }

  const onSelectUserGroup = (l = []) => {
    if (item) {
      item.crowdInfos.push(...l.map(v => ({
        crowdCode: v.userGroupCode,
        crowdName: v.userGroupName,
        userNum: v.userGroupCount,
        isDynamic: v.dynamicUpdate,

        uuid: v.userGroupCode,
      })))
      item.crowdInfos = _lodash.uniqBy(item.crowdInfos, "crowdCode").filter(v => Boolean(v.uuid))
    }
  }

  const showModal = i => {
    if (i) {
      item = i;
      list.value = item.crowdInfos
      nextTick(() => {
        visible.value = true;
      })
    }
  }

  return {
    modalProps,

    showModal,
    closeModal,
    onSelectUserGroup
  }
}

export default {
  name: "EditStrategyForm",
  components: {
    NewUserGroupModal,
    SettingRow,
  },
  props: {
    formData: Object,
    isEdit: Boolean
  },
  setup: (props) => {
    const { modalProps, showModal, closeModal, onSelectUserGroup } = useUserGroupModal()
    const cityList = inject(SYMBOL__CITY_LIST);
    const currentAreaList = ref([])
    const productLines = ref(getNewBusinessLine().list);
    const carLevelList = ref([])
    const orderTypeMap = listToMap(ORDER_ASSIGNABLES_TYPES)
    const orderFastTypeMap = listToMap(ORDER_FAST_TYPES)
    const driverOrderTypeMap = listToMap(DRIVER_ORDER_TYPES)

    const strategyForm = ref(null)
    const form = reactive({
      ruleName: undefined,
      cityCode: undefined,
      districts: [], // 区县配置
      productLineCode: undefined,
      defaultCarLevelCode: undefined,
      orderLevels: [], // 接单类型配置
      orderTypes: [], // 特价订单配置
      orderFastTypes: [], // 特快订单配置
      driverOrderTypes: [], // 司机接单来源配置
    })

    const rules = reactive({
      ruleName: [{ required: true, message: "请填写规则名称", trigger: ["blur", "change"] }],
      cityCode: [{ required: true, message: "请选择城市", trigger: ["blur", "change"] }],
      districts: [{ required: true, message: "请选择区县", trigger: ["blur", "change"] }],
      productLineCode: [{ required: true, message: "请选择产品线", trigger: ["blur", "change"] }],
      defaultCarLevelCode: [{ required: true, message: "请选择车型等级", trigger: ["blur", "change"] }],
    })
    const formItemProps = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }
    const filterOption = (input, option) => {
      return option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase())
    }
    const assignableTypes = computed(() => productLines.value.map(v => (v.levels.map(d => ({
      value: `${v.value}#${d.vehicleLevel}`,
      label: `${v.label}-${d.vehicleName}`
    })))).flat(1))

    const onClickDeleteLast = (index) => {
      form.orderLevels.splice(index, 1)
      if (form.orderLevels.length === 0) {
        strategyForm.value.validateField("orderLevels")
      }
    }
    const onClickOrderDeleteLast = (index) => {
      form.orderTypes.splice(index, 1)
      if (form.orderTypes.length === 0) {
        strategyForm.value.validateField("orderTypes")
      }
    }
    const onClickFastOrderDeleteLast = (index) => {
      form.orderFastTypes.splice(index, 1)
      if (form.orderFastTypes.length === 0) {
        strategyForm.value.validateField("orderFastTypes")
      }
    }
    const onClickDriverOrderDeleteLast = (index) => {
      form.driverOrderTypes.splice(index, 1)
      if (form.driverOrderTypes.length === 0) {
        strategyForm.value.validateField("driverOrderTypes")
      }
    }
    const handleTypeChoose = val => {
      form.orderLevels.push({
        itemType: 1,
        itemCode: val,
        itemName: "",
        isShow: 1,
        closeHint: "",
        crowdInfos: [],
      })
      strategyForm.value.clearValidate("orderLevels")
    }
    const handleOrderTypeChoose = val => {
      form.orderTypes.push({
        itemType: 2,
        itemCode: val,
        itemName: orderTypeMap[val],
        isShow: 1,
        closeHint: "",
        crowdInfos: [],
      })
      strategyForm.value.clearValidate("orderTypes")
    }

    const handleOrderFastTypeChoose = val => {
      form.orderFastTypes.push({
        itemType: 3,
        itemCode: val,
        itemName: orderFastTypeMap[val],
        isShow: 1,
        closeHint: "",
        crowdInfos: [],
      })
      strategyForm.value.clearValidate("orderFastTypes")
    }
    const handleDriverOrderTypeChoose = val => {
      form.driverOrderTypes.push({
        itemType: 5,
        itemCode: val,
        itemName: driverOrderTypeMap[val],
        isShow: 1,
        closeHint: "",
        crowdInfos: [],
      })
      strategyForm.value.clearValidate("driverOrderTypes")
    }
    const isOptionDisabled = val => {
      let arr = form.orderLevels.map(i => { return i.itemCode })
      if (arr.includes(val)) return true;
      const [pCode, lCode] = val.split("#");
      return pCode === String(form.productLineCode) && lCode === String(form.defaultCarLevelCode)
    }
    const isOptionOrderDisabled = val => {
      let arr = form.orderTypes.map(i => { return i.itemCode })
      return arr.includes(val);
    }
    const isOptionFastOrderDisabled = val => {
      let arr = form.orderFastTypes.map(i => { return i.itemCode })
      return arr.includes(val);
    }
    const isOptionDriverOrderDisabled = val => {
      let arr = form.driverOrderTypes.map(i => { return i.itemCode })
      return arr.includes(val);
    }
    const callValidate = () => new Promise((resolve, reject) => {
      strategyForm.value.validate((st) => {
        if (st) resolve(form)
        else reject(new Error())
      })
    })

    const onCityChange = v => {
      form.productLineCode = undefined
      form.defaultCarLevelCode = undefined;
      form.orderLevels = []
      form.orderTypes = []
      if (v) {
        queryArea(v)
      } else {
        form.cityCode = undefined
      }
    }
    const queryArea = cityCode => {
      form.districts = []
      currentAreaList.value = []
      callAreaInfoByCityCode(cityCode, list => { currentAreaList.value = list })
    }
    const changeArea = areaCode => {
      let length = areaCode.length
      if (length > 0 && areaCode[length - 1] === "0") {
        form.districts = ["0"]
      } else {
        areaCode.forEach((v, k) => {
          if (v === "0") areaCode.splice(k, 1)
        })
        form.districts = areaCode
      }
    }

    const onProductLineChange = productLineCode => {
      form.defaultCarLevelCode = undefined;
      if (productLineCode) {
        carLevelList.value = getNewCarLevelList(productLineCode).list;
      } else {
        carLevelList.value = []
      }
      form.orderLevels = []
      form.orderTypes = []
    }

    const onCarLevelChange = v => {
      form.orderLevels = []
      form.orderTypes = []
    }

    watch(() => props.formData, _v => {
      const v = _v || {
        cityCode: undefined,
        productLineCode: undefined,
        defaultCarLevelCode: undefined,
        orderLevels: [],
        orderTypes: [],
        orderFastTypes: [],
        driverOrderTypes: [],
        districts: [],
        ruleName: undefined
      }
      formatOrderTypesFromServer(v)
      Object.assign(form, v)

      if (v.cityCode && v.districts && v.districts.length > 0 && v.districts[0] !== "0") {
        callAreaInfoByCityCode(v.cityCode, list => { currentAreaList.value = list })
      } else {
        currentAreaList.value = [{ label: "全部", value: "0" }]
      }
      if (form.productLineCode !== undefined) {
        form.productLineCode = String(form.productLineCode);
        carLevelList.value = getNewCarLevelList(form.productLineCode).list;
      } else {
        carLevelList.value = []
      }
    }, { immediate: true })

    return {
      cityList,
      productLines,
      carLevelList,

      strategyForm,
      form,
      rules,
      formItemProps,
      onClickDeleteLast,
      onClickOrderDeleteLast,
      onClickFastOrderDeleteLast,
      onClickDriverOrderDeleteLast,
      onCityChange,
      onProductLineChange,
      onCarLevelChange,
      filterOption,
      assignableTypes,
      orderAssignableTypes: ORDER_ASSIGNABLES_TYPES,
      orderFastTypes: ORDER_FAST_TYPES,
      driverOrderTypes: DRIVER_ORDER_TYPES,

      handleTypeChoose,
      handleOrderTypeChoose,
      handleOrderFastTypeChoose,
      handleDriverOrderTypeChoose,
      isOptionDisabled,
      isOptionOrderDisabled,
      isOptionFastOrderDisabled,
      isOptionDriverOrderDisabled,

      callValidate,

      isUndefined: v => v === undefined,

      currentAreaList,
      queryArea,
      changeArea,

      modalProps,
      showModal,
      closeModal,
      onSelectUserGroup,
    }
  }
}
</script>
