/*
 * @Author: NapierPLUS
 * @Date: 2022-01-14 10:20:21
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-02-25 17:51:41
 * @Description:
 */
import { inject, provide, reactive } from "@vue/composition-api";
import { vehicleGroupList } from "./api";
import { tableCols, inputList } from "./fields";

export const noop = () => {}
export const useSearchInput = () => {
  const inputListProp = reactive({
    inputList,
    isEnterSearch: true
  })
  const setInputDropList = (key, value) => {
    let item = inputListProp.inputList.find(it => it.bind_key === key)
    item.dropList = value
  }
  return {
    inputListProp,
    setInputDropList
  }
}

export const PAGE_SYMBOL = Symbol("pageSymbol");

export const usePageBiz = (props) => {
  const tableProps = reactive({
    isLoading: false,
    total: 0,
    current: 1,
    pageSize: 10,
    parColumns: tableCols(props),
    parTableData: []
  })

  const form = reactive({
    cityCode: undefined,
    expandBizLine: undefined,
    businessType: undefined,
    status: undefined,
    areaType: undefined,
    typeTime: undefined,
  })

  /** 原始search方法，接受外界传入对象作为查询参数覆盖 */
  const queryList = (data = {}) => {
    const pagination = {
      currPage: tableProps.current,
      pageSize: tableProps.pageSize
    }
    toggleLoading(true)
    vehicleGroupList({ ...form, ...pagination, ...data }).then(res => {
      if (res) {
        const { list, totalCount } = res?.data?.data
        tableProps.parTableData = list
        tableProps.total = totalCount
        toggleLoading(false)
      }
    }).catch(noop).finally(() => {
      toggleLoading(false)
    })
  }

  /** 刷新列表当前页 */
  const reloadPage = () => {
    tableProps.current = 1
    tableProps.pageSize = 10
    queryList()

  }
  /** 设置table的loading状态 */
  const toggleLoading = v => {
    tableProps.isLoading = v;
  }

  provide(PAGE_SYMBOL, {
    reloadPage,
    toggleLoading
  })
  return {
    form,
    tableProps,
    queryList,
    reloadPage,
    toggleLoading
  }
}

export const usePageBizInject = () => {
  const { reloadPage, toggleLoading } = inject(PAGE_SYMBOL)
  return {
    reloadPage,
    toggleLoading
  }
}