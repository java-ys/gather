import api4driver from "_o/config/api4driver.request"
import axios from "_g/config/api.request";

// 补偿统计列表
export const compensateListService = (data) => {
    return api4driver.request({
        url: '/api/compensation/page',
        data,
        method: 'post'
    })
}

//补偿统计详情列表
export const compensateDetailService = (data) => {
    return api4driver.request({
        url: '/api/compensation/detailPage',
        data,
        method: 'post'
    })
}


// 新增停运补偿规则
export const addpageList = (params) => {
    return axios.request({
      url: '/api/outageRecoupRule/add',
      method: 'post',
      data: params
    })
  }
  // 删除停运补偿规则
  export const axiosdeleteList = (params) => {
    return axios.request({
      url: '/api/outageRecoupRule/delete',
      method: 'post',
      data: params
    })
  }
  // 停运补偿规则详情
  export const getdetailList = (params) => {
    return axios.request({
      url: '/api/outageRecoupRule/detail',
      method: 'post',
      data: params
    })
  }
  // 编辑停运补偿规则
  export const axioseditList = (params) => {
    return axios.request({
      url: '/api/outageRecoupRule/edit',
      method: 'post',
      data: params
    })
  }
  // 查询停运补偿规则列表
  export const getpageList = (params) => {
    return api4driver.request({
      url: '/api/outageRecoupRule/pageList',
      method: 'post',
      data: params,
    })
  }
  // 运营商平台通用
  export const getoperatorList = (data) => {
    return axios.request({
      url: '/agent/api/common/listProvinceCityAllData',
      method: 'post',
      data,
    })
  }
  // 司机服务
  export const getdriverList = (params) => {
    return axios.request({
      url: '/api/driver/dictionary/queryDriverLabel',
      method: 'post',
      data: params,
    })
  }



/**
 * 停运补偿管理开始
 */
// 新增停运补偿规则
export const addCompensateRule = (params) => {
  return api4driver.request({
    url: '/api/outageRecoupRule/add',
    method: 'post',
    data: params
  })
}
// 删除停运补偿规则
export const deleteCompensateRule = (params) => {
  return api4driver.request({
    url: '/api/outageRecoupRule/delete',
    method: 'post',
    data: params
  })
}
// 停运补偿规则详情
export const getRuleDetail = (params) => {
  return api4driver.request({
    url: '/api/outageRecoupRule/detail',
    method: 'post',
    data: params
  })
}
// 编辑停运补偿规则
export const editCompensateRule = (params) => {
  return api4driver.request({
    url: '/api/outageRecoupRule/edit',
    method: 'post',
    data: params
  })
}
/*
 * 停运补偿类型配置
 */
// 查询配置类型
export const queryConfigType = (params) => {
  return api4driver.request({
    url: '/api/outageCategory/detail',
    method: 'post',
    data: params
  })
}

// 提交配置信息
export const commitConfigInfo = (params) => {
  return api4driver.request({
    url: '/api/outageCategory/commit',
    method: 'post',
    data: params
  })
}

// 删除配置校验
export const checkBeforeDelete = (params) => {
  return api4driver.request({
    url: '/api/outageCategory/check',
    method: 'post',
    data: params
  })
}


/**
 * 批量补偿相关接口
 */
// 查询批量补偿列表
export const getCpstBatchList = (params) => {
  return api4driver.request({
    url: 'api/compensation/batchPage',
    method: 'post',
    data: params
  })
}


// 新增批量补偿
export const addCpstBatch = (params) => {
  return api4driver.request({
    url: 'api/compensation/batch',
    method: 'post',
    data: params
  })
}

// 补偿列表
export const getRecoupPage = (params) => {
  return api4driver.request({
    url: '/api/apply/recoupPage',
    method: 'post',
    data: params
  })
}



//  查询详情页l
export const queryDetail = (params) => {
  return api4driver.request({
    url: '/api/apply/recoupDetail',
    method: 'post',
    data: params
  })
}


// 补偿取消
export const cancelCompensate = (params) => {
  return api4driver.request({
    url: 'api/approve/info/operate',
    method: 'post',
    data: params
  })
}
