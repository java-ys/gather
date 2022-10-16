import { computed, inject, provide, reactive, ref } from "@vue/composition-api";
import { getGradeList } from "@/libs/tools"
import {
  postActivateStrategy,
  postDeactivateStrategy,
  queryCrossLevelList
} from "./api";
import { tableCols, STATUS_LIST } from "./fields";
import { PERMISSION__CREATE_STRATEGY } from "./const";
import { callErrorMsg } from "./utils";
import { getNewBusinessLine } from "_gc/status-map";
import { getConfigCityList } from "_g/api/common";

export const noop = () => {}

/** 拉取城市列表 */
const fetchCityList = async () => {
  const res = await getConfigCityList({}).catch(noop);
  if (res?.data?.code === 200 && res.data.success) {
    let list = res.data.data || [];
    return list.map(({ cityId, city }) => ({
      value: cityId,
      label: city
    }))
  }
  return [];
}
/** 跨级接单列表查询 */
export const fetchList = async (params) => {
  const res = await queryCrossLevelList(params).catch(noop)
  if (res?.data?.code === 200 && res.data.success) {
    const data = res.data.data || [];
    return {
      list: data.list,
      currPage: data.currPage,
      totalCount: data.totalCount
    }
  }
  callErrorMsg({ content: "操作失败: " + res?.data.msg })
  return null
}

export const SYMBOL__CITY_LIST = Symbol("cityList")
export const SYMBOL__GRADE_LIST = Symbol("gradeList")

export const useSearchInput = () => {
  const gradeList = ref([]);
  const cityList = ref([])
  provide(SYMBOL__CITY_LIST, cityList)
  provide(SYMBOL__GRADE_LIST, gradeList)
  const productLineList = ref([])
  const carLevelList = ref([])
  const statusList = STATUS_LIST
  const refreshCityList = () => {
    fetchCityList().then(list => {
      cityList.value = list;
    })
  }
  const getProductLineText = code => {
    return getNewBusinessLine().map[code]
  }
  const totalCarLevelList = computed(() => {
    let list = getNewBusinessLine().list
    return list.map(pro => {
      return pro.levels && pro.levels.length ? pro.levels.map(level => ({
        value: level.vehicleLevel,
        text: level.vehicleName
      })) : {}
    }).flat(1)
  })
  const getCarLevelText = code => {
    return totalCarLevelList.value.find(v => v.value === code)?.text || ""
  }

  refreshCityList()
  // 车型等级配置拉通的需求，调接口后存在localStorage里
  gradeList.value = getGradeList().filter(item => item.businessCode === 2 || item.businessCode === 4)

  return {
    cityList,
    gradeList,
    productLineList,
    carLevelList,
    statusList,

    createBtnAuth: PERMISSION__CREATE_STRATEGY,
    getProductLineText,
    getCarLevelText
  }
}

export const PAGE_SYMBOL = Symbol("crossLevel");

export const usePageBiz = ({
  getProductLineText,
  getCarLevelText
}) => {
  const tableProps = reactive({
    isLoading: false,
    total: 0,
    current: 1,
    pageSize: 10,
    parColumns: tableCols({
      getProductLineText,
      getCarLevelText
    }),
    parTableData: []
  })

  const form = reactive({
    cityCode: undefined,
    productLineCode: undefined,
    defaultCarLevelCode: undefined,
    statusFlag: undefined,
    district: ""
  })

  /** 原始search方法，接受外界传入对象作为查询参数覆盖 */
  const queryList = (data = {}) => {
    const pagination = {
      currPage: tableProps.current,
      pageSize: tableProps.pageSize
    }
    fetchList({ ...form, ...pagination, ...data }).then(res => {
      if (res) {
        const { list, currPage, totalCount } = res
        tableProps.parTableData = list
        tableProps.current = currPage;
        tableProps.total = totalCount
      }
    }).catch(noop).finally(() => {
      tableProps.isLoading = false
    })
  }

  /** 刷新列表当前页 */
  const reloadPage = () => queryList()

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

/** 启用/停用策略 */
export const toggleStrategy = async (row, isActivate) => {
  const api = isActivate ? postActivateStrategy : postDeactivateStrategy;
  const res = await api({
    id: row.id,
    cityCode: row.cityCode
  }).catch(noop)
  return res?.data?.code === 200 && res.data.success;
}
