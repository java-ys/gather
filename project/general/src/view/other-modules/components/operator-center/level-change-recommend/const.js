import store from "@/store"

export const carTypeList = id => {
  const list = []
  const map = {}
  const { businessGradeList } = store.state.common

  const productList = businessGradeList.filter(item => {
    return item.value === id
  })[0].children

  productList.forEach(item => {
    item.levels.forEach(t => {
      const label = `${item.label}-${t.vehicleName}`
      const value = `${item.value}-${t.vehicleLevel}`
      list.push({
        label,
        value
      })
      map[value] = label
    })
  })

  return [list, map]
}

export const carTypeMap = list => {
  const obj = {}

  list.forEach(item => {
    obj[item.label] = item.value
  })

  return obj
}

export const weekList = [
  {
    label: "周一",
    value: 1
  },
  {
    label: "周二",
    value: 2
  },
  {
    label: "周三",
    value: 3
  },
  {
    label: "周四",
    value: 4
  },
  {
    label: "周五",
    value: 5
  },
  {
    label: "周六",
    value: 6
  },
  {
    label: "周日",
    value: 7
  },
]

// 触发条件 RecommendationConditionDto
export const triggerCondition = {
  startAcceptRate: "",
  endAcceptRate: "",
  agioRate: "",
  vehicleLevelForAgioRate: ""
}

// ruleDetails  RecommendationDetailDto
export const defaultRuleDetails = {
  periodTime: [],
  weekDays: [],
  recommendationVehicleLevel: "",
  triggerVehicleLevels: [],
  lazyTime: "",
  useRecommendationCoupon: 0,
  recommendationCouponId: "",
  iconUrl: [],
  triggerCondition,
  isNew: true
}

export const getCarName = (code, businessId) => {
  const [, map] = carTypeList(businessId)
  return map[code]
}
