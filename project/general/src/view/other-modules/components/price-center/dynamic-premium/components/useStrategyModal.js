import { computed, defineComponent, ref, provide, inject, reactive } from "@vue/composition-api";
import EditStrategyForm from "./EditStrategyForm"
import { noop } from "../biz";
import { addPremiumStrategy } from "_o/api/priceCenter";
import { message } from "ant-design-vue"

const STRATEGY_MODAL__SYMBOL = "strategyModal"

export const useStrategyModal = ({ pageReloadFn }) => {
  const modalOuterProps = reactive({
    visible: false,
    title: "",
    formData: {},
    isEdit: false,
    width: 1300
  })
  const Component = defineComponent({
    render() {
      return (
        <a-modal
          v-model={modalOuterProps.visible}
          title={modalOuterProps.title}
          maskClosable={false}
          destroyOnClose={true}
          width={modalOuterProps.width}
          scopedSlots={{
            footer: () => [
              <a-button {...this.cancelBtnAttrs}>取消</a-button>,
              <a-button {...this.okBtnAttrs}>确定</a-button>
            ]
          }}>
          <EditStrategyForm ref="form" isEdit={modalOuterProps.isEdit} remoteData={modalOuterProps.formData} />
        </a-modal>
      )
    },
    setup: (props, { refs }) => {
      const formRef = ref(null)
      const loading = ref(false)

      const onModalCancel = () => {
        modalOuterProps.visible = false;
        modalOuterProps.formData = {}
      }

      const submitFormData = formData => new Promise((resolve, reject) => {
        const data = {
          ...formData.formData,
          basicPeriods: formData.weekFormData.value,
          basicEnable: formData.formData?.basicEnable?.length ? 1 : 0,
          floatEnable: formData.formData?.floatEnable?.length ? 1 : 0,
        }
        const isUpdate = !!modalOuterProps.formData?.id;
        const api = isUpdate ? addPremiumStrategy : addPremiumStrategy;
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
        on: { click: onModalOk },
        style: {
          display: modalOuterProps.isEdit ? "inline-block" : "none"
        },
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
    modalOuterProps.isEdit = true
  }
  const openViewModal = ({ title, data }) => {
    modalOuterProps.title = title;
    modalOuterProps.visible = true
    modalOuterProps.formData = data
    modalOuterProps.isEdit = false
  }
  const openCopyModal = ({ title, data }) => {
    modalOuterProps.title = title;
    modalOuterProps.visible = true
    modalOuterProps.formData = data
    modalOuterProps.isEdit = true
  }
  provide(STRATEGY_MODAL__SYMBOL, {
    openCreateModal,
    openViewModal,
    openCopyModal
  })

  return {
    Component,
    openCreateModal,
    openViewModal,
    openCopyModal
  }
}

export const useStrategyModalInject = () => {
  const {
    openCreateModal,
    openViewModal,
    openCopyModal
  } = inject(STRATEGY_MODAL__SYMBOL)

  return {
    openCreateModal,
    openViewModal,
    openCopyModal
  }
}
