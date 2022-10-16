import { computed, defineComponent, ref, provide, inject, reactive } from "@vue/composition-api";
import EditStrategyForm from "./EditStrategyForm"
import { noop } from "../biz";
import { message } from "ant-design-vue"
import { specialExpensesNoticeAdd, specialExpensesNoticeUpdate } from "../api";
const STRATEGY_MODAL__SYMBOL = "strategyModal"

export const useStrategyModal = ({ pageReloadFn }) => {
  const modalOuterProps = reactive({
    visible: false,
    title: "",
    formData: {},
    isEdit: false,
    width: 1200
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
        }
        console.log(data)
        let api = modalOuterProps.title === "新建策略"?specialExpensesNoticeAdd:specialExpensesNoticeUpdate
        api(data).then(res => {
          if (res?.data?.code === 200 && res.data.success) {
            resolve()
          } else {
            reject(Error())
          }
        }).catch(reject)
      })

      const onModalOk = () => {
        toggleLoading(true)
        formRef.value.callValidate().then(formData => {
          if (!formData) {
            toggleLoading(false)
            console.log(111)
            return
          }

          submitFormData(formData).then(() => {
            message.success("保存成功");
            modalOuterProps.visible = false;
            pageReloadFn()
          })
        }).catch(noop).finally(() => {
          toggleLoading(false)
        })
      }
      const toggleLoading = (v) => {
        loading.value = v
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
    modalOuterProps.title = "新建策略"
    modalOuterProps.visible = true
    modalOuterProps.formData = null
    modalOuterProps.isEdit = true
  }
  const openViewModal = ({ data }) => {
    modalOuterProps.title = "查看策略";
    modalOuterProps.visible = true
    modalOuterProps.formData = data
    modalOuterProps.isEdit = false
  }
  const openEditModal = ({ data }) => {
    modalOuterProps.title = "编辑策略";
    modalOuterProps.visible = true
    modalOuterProps.formData = data
    modalOuterProps.isEdit = true
  }
  provide(STRATEGY_MODAL__SYMBOL, {
    openCreateModal,
    openViewModal,
    openEditModal
  })

  return {
    Component,
    openCreateModal,
    openViewModal,
    openEditModal
  }
}

export const useStrategyModalInject = () => {
  const {
    openCreateModal,
    openViewModal,
    openEditModal
  } = inject(STRATEGY_MODAL__SYMBOL)

  return {
    openCreateModal,
    openViewModal,
    openEditModal
  }
}
