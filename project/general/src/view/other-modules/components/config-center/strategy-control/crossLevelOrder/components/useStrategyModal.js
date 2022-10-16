import { computed, defineComponent, ref, provide, inject, reactive } from "@vue/composition-api";
import EditStrategyForm from "./EditStrategyForm"
import { noop } from "../biz";
import {
  createCrossLevelRule,
  updateCrossLevelRule
} from "../api";
import { message } from "ant-design-vue"

const STRATEGY_MODAL__SYMBOL = "strategyModal"

const handleOrderTypesForSubmit = (formData) => {
  formData.orderTypes.push(...formData.orderFastTypes)
  delete formData.orderFastTypes
  formData.orderTypes.push(...formData.driverOrderTypes)
  delete formData.driverOrderTypes

  const transformCrowdIdsForSubmit = v => {
    v.crowdIds = v.crowdInfos.map(({ crowdCode }) => crowdCode)
    delete v.crowdInfos
  }
  formData.orderLevels.forEach(transformCrowdIdsForSubmit)
  formData.orderTypes.forEach(transformCrowdIdsForSubmit)
}

/** 格式化服务端数据的单据类型 */
export const formatOrderTypesFromServer = formData => {
  const transformCrowdInfosFromServer = v => {
    if (!v.crowdInfos) v.crowdInfos = []
    v.crowdInfos.forEach(_v => {
      _v.uuid = _v.crowdCode
    })
  }
  const orderTypes = formData.orderTypes.slice()
  formData.orderTypes = orderTypes.filter(v => v.itemType === 2)
  formData.orderFastTypes = orderTypes.filter(v => v.itemType === 3)
  formData.driverOrderTypes = orderTypes.filter(v => v.itemType === 5)

  formData.orderLevels.forEach(transformCrowdInfosFromServer)
  formData.orderTypes.forEach(transformCrowdInfosFromServer)
  formData.orderFastTypes.forEach(transformCrowdInfosFromServer)
  formData.driverOrderTypes.forEach(transformCrowdInfosFromServer)
}

export const useStrategyModal = ({ pageReloadFn }) => {
  const modalOuterProps = reactive({
    visible: false,
    title: "",
    formData: {},
    isEdit: false
  })
  const Component = defineComponent({
    render() {
      return (
        <a-modal
          v-model={modalOuterProps.visible}
          width="620px"
          title={modalOuterProps.title}
          maskClosable={false}
          destroyOnClose={true}
          scopedSlots={{
            footer: () => [
              <a-button {...this.cancelBtnAttrs}>取消</a-button>,
              <a-button {...this.okBtnAttrs}>确定</a-button>
            ]
          }}>
          <EditStrategyForm ref="form" isEdit={modalOuterProps.isEdit} formData={modalOuterProps.formData} />
        </a-modal>
      )
    },
    setup: () => {
      const formRef = ref(null)
      const loading = ref(false)

      const onModalCancel = () => {
        modalOuterProps.visible = false;
      }

      const submitFormData = formData => new Promise((resolve, reject) => {
        formData.orderTypes.forEach(item => { if (!item.isShow) { item.closeHint = "" } })
        if (!formData.orderLevels.length && !formData.orderTypes.length && !formData.orderFastTypes.length && !formData.driverOrderTypes.length) {
          message.error("指派规则不可为空");
          return
        }
        const data = {
          "cityCode": formData.cityCode,
          "productLineCode": formData.productLineCode,
          "defaultCarLevelCode": formData.defaultCarLevelCode,
          "orderLevels": formData.orderLevels.slice(),
          "orderTypes": formData.orderTypes.slice(),
          "orderFastTypes": formData.orderFastTypes.slice(),
          "driverOrderTypes": formData.driverOrderTypes.slice(),
          "districts": formData.districts.slice(),
          "ruleName": formData.ruleName,
        }
        handleOrderTypesForSubmit(data)

        const isUpdate = !!modalOuterProps.formData?.id;
        const api = isUpdate ? updateCrossLevelRule : createCrossLevelRule;
        if (isUpdate) data.id = modalOuterProps.formData.id;
        api(data).then(res => {
          if (res?.data?.code === 200 && res.data.success) {
            resolve()
          } else {
            reject(Error())
          }
        }).catch(reject)
      })

      const onModalOk = () => {
        formRef.value.callValidate().then(formData => {
          submitFormData(formData).then(() => {
            message.success("保存成功");
            modalOuterProps.visible = false;
            pageReloadFn()
          })
        }).catch(noop)
      }

      const okBtnAttrs = computed(() => ({
        props: { type: "primary", loading: loading.value },
        on: { click: onModalOk }
      }))
      const cancelBtnAttrs = computed(() => ({
        props: { loading: loading.value },
        on: { click: onModalCancel }
      }))

      return {
        form: formRef,
        okBtnAttrs,
        cancelBtnAttrs
      }
    }
  })

  const openCreateModal = () => {
    modalOuterProps.title = "新建"
    modalOuterProps.visible = true
    modalOuterProps.formData = null
    modalOuterProps.isEdit = false
  }
  const openModifyModal = ({ title, data }) => {
    modalOuterProps.title = title;
    modalOuterProps.visible = true
    modalOuterProps.formData = data
    modalOuterProps.isEdit = true
  }

  provide(STRATEGY_MODAL__SYMBOL, {
    openCreateModal,
    openModifyModal,
  })

  return {
    Component,

    openCreateModal,
    openModifyModal,
  }
}

export const useStrategyModalInject = () => {
  const {
    openCreateModal,
    openModifyModal,
  } = inject(STRATEGY_MODAL__SYMBOL)

  return {
    openCreateModal,
    openModifyModal,
  }
}
