import api4partner from "_o/config/api4partner.request";

// 查询人员列表
export const fetchGroupList = async data => {
  return api4partner.request({
    url: "/api/group/users/queryPage",
    data,
    method: "post"
  });
};

// 根据类别编码查询群组列表
export const fetchGroupCategoryList = async data => {
  return api4partner.request({
    url: "/api/group/queryGroupsByCategoryCode",
    data,
    method: "post"
  });
};

// 据手机号查询人员信息
export const fetchStaffInfoByPhone = async data => {
  return api4partner.request({
    url: "/api/group/queryStaffByPhone",
    data,
    method: "post"
  });
};

// 批量用户加入群组
export const pullUsersJoin = async data => {
  return api4partner.request({
    url: "/api/group/users/join",
    data,
    method: "post"
  });
};

// 批量用户移除群组
export const pullRemoveUser = async data => {
  return api4partner.request({
    url: "/api/group/users/remove",
    data,
    method: "post"
  });
};

// 修改用户群组关联
export const pullUpdateUser = async data => {
  return api4partner.request({
    url: "/api/group/user/update",
    data,
    method: "post"
  });
};

// 查询群组的类别列表
export const fetchCategoryList = async data => {
  return api4partner.request({
    url: "/api/group/queryGroupCategory",
    data,
    method: "post"
  });
};

// 查询通用配置
export const fetchCommonConfig = async data => {
  return api4partner.request({
    url: "/api/shift/config/queryCommonConfig",
    data,
    method: "post"
  });
};

// 查询城市
// export const fetchCityList = async params => {
//   return api4partner.request({
//     url: "/manage/extend/queryOpenAreaAll",
//     params,
//     method: "get"
//   });
// };
export const fetchCityList = async data => {
  return api4partner.request({
    url: "/manage/extend/queryOpenAreaAll",
    data,
    method: "post"
  });
};


// 保存排班配置
export const pullAddScheduleConfig = async data => {
  return api4partner.request({
    url: "/api/shift/config/save",
    data,
    method: "post"
  });
};

// 编辑排班配置
export const pullEditScheduleConfig = async data => {
  return api4partner.request({
    url: "/api/shift/config/edit",
    data,
    method: "post"
  });
};

// 查询排班配置
export const fetchScheduleConfig = async data => {
  return api4partner.request({
    url: "/api/shift/config/query",
    data,
    method: "post"
  });
};

// 工单自动判责配置-新增
export const addJudgeConfig = async data => {
  return api4partner.request({
    url: "/manage/config/judge/add",
    data,
    method: "post"
  });
};

// 工单自动判责配置-更新
export const editJudgeConfig = async data => {
  return api4partner.request({
    url: "/manage/config/judge/edit",
    data,
    method: "post"
  });
};

// 工单自动判责配置-查询
export const queryAllJudgeConfig = async data => {
  return api4partner.request({
    url: "/manage/config/judge/queryAll",
    data,
    method: "post"
  });
};

// 获取工单类型列表
export const getJudgeTypeList = async data => {
  return api4partner.request({
    url: "/manage/config/thirdparty/judgeTypeList",
    data,
    method: "post"
  });
}

// 查询判责标准
export const judgeStandardList = async data => {
  return api4partner.request({
    url: "/manage/config/thirdparty/judgeList",
    data,
    method: "post"
  });
}

// 列表查询
export const getList = async data => {
  return api4partner.request({
    url: "/manage/config/thirdparty/page",
    data,
    method: "post"
  });
}

// 删除规则
export const delteRule = async data => {
  return api4partner.request({
    url: "/manage/config/thirdparty/delete",
    data,
    method: "post"
  });
}

// 停用规则
export const stopUse = async data => {
  return api4partner.request({
    url: "/manage/config/thirdparty/disable",
    data,
    method: "post"
  });
}

// 启用规则
export const enable = async data => {
  return api4partner.request({
    url: "/manage/config/thirdparty/enable",
    data,
    method: "post"
  });
}

// 编辑
export const edit = async data => {
  return api4partner.request({
    url: "/manage/config/thirdparty/update",
    data,
    method: "post"
  });
}

// 查看详情
export const getDetail = async data => {
  return api4partner.request({
    url: "/manage/config/thirdparty/detail",
    data,
    method: "post"
  });
}

// 创建规则
export const create = async data => {
  return api4partner.request({
    url: "/manage/config/thirdparty/create",
    data,
    method: "post"
  });
}

// 城市查询
export const getCityList = data => {
  return api4partner.request({
    url: "/common/citys",
    data,
    method: "post"
  });
};

// 查询司机类型
export const queryDriverType =  data => {
  return api4partner.request({
    url: "/api/common/driver/queryDriverType",
    data,
    method: "post"
  })
}

// 判责分类写入配置
export const insertJudgeType =  data => {
  return api4partner.request({
    url: "/api/judge/config/insert",
    data,
    method: "post"
  })
}

// 判责分类更新配置
export const updateJudgeType =  data => {
  return api4partner.request({
    url: "/api/judge/config/update",
    data,
    method: "post"
  })
}

// 判责分类删除配置
export const deleteJudgeType =  data => {
  return api4partner.request({
    url: "/api/judge/config/delete",
    data,
    method: "post"
  })
}

// 判责分类查询配置
export const queryPageJudgeTypeList =  data => {
  return api4partner.request({
    url: "/api/judge/config/query",
    data,
    method: "post"
  })
}

// 判责分类查询配置
export const queryByParentId =  data => {
  return api4partner.request({
    url: "/api/judge/config/queryByParentId",
    data,
    method: "post"
  })
}

// 判责分类查询配置全部
export const queryAllJudgeType =  data => {
    return api4partner.request({
      url: "/api/judge/config/queryAll",
      data,
      method: "post"
    })
  }


// 服务分
export const queryServiceScore =  data => {
  return api4partner.request({
    url: "/manage/driver/servicescore/queryPage",
    data,
    method: "post"
  })
}

// 学习任务列表
export const queryExamStudyList =  data => {
  return api4partner.request({
    url: "/manage/driver/study/queryExamStudyList",
    data,
    method: "post"
  })
}


export const queryExamTaskList =  data => {
  return api4partner.request({
    url: "/manage/driver/study/queryExamTaskList",
    data,
    method: "post"
  })
}

// 查询处罚详情  id
export const judgeDetailService =  data => {
  return api4partner.request({
    url: "/api/judge/config/queryById",
    data,
    method: "post"
  })
}

// 批量查询处罚详情  ids
export const judgeDetailsService =  data => {
  return api4partner.request({
    url: "/api/judge/config/queryByIds",
    data,
    method: "post"
  })
}

// 查询当前违规的明细
//   "judgeTypeId":
//   "woCode":""
export const queryViolationDetail =  data => {
  return api4partner.request({
    url: "/manage/order/yy/queryCurrentViolationDetail",
    data,
    method: "post"
  })
}
/* eslint-disable no-confusing-arrow,no-return-assign */
const createRequest = url => data => api4partner.request({ url, data, method: "post" }).then(({data: res}) => res.success ? res.data : Promise.reject(res));

/**
 *  API {@link http://wiki.m2cn.com:8090/pages/viewpage.action?pageId=49124959#id-%E3%80%9020220509%E3%80%91%E6%B5%81%E8%BD%AC%E5%B7%A5%E5%8D%95%E6%8E%A5%E5%8F%A3%E8%AE%BE%E8%AE%A1-23.%E6%9F%A5%E8%AF%A2%E6%B5%81%E8%BD%AC%E9%85%8D%E7%BD%AE%E6%9C%AA%E9%85%8D%E7%BD%AE%E7%9A%84%E8%BF%90%E8%90%A5%E5%95%86%E5%88%97%E8%A1%A8}
 * 需求 {@link http://wiki.m2cn.com:8090/pages/viewpage.action?pageId=45994351}
 */
export const queryLabelList = createRequest("/api/order/circular/label/list")
export const postLabel = createRequest("/api/order/circular/label/add")
export const putLabel = createRequest("/api/order/circular/label/update")
export const deleteLabel = createRequest("/api/order/circular/label/delete")
export const deleteLabelList = createRequest("/api/order/circular/label/remove")
export const queryClassificationList = createRequest("/api/order/circular/class/list")
export const queryClassification = createRequest("/api/order/circular/class")
export const putClassification = createRequest("/api/order/circular/class/update")
export const postClassification = createRequest("/api/order/circular/class/add")
export const queryCirculationList = createRequest("/api/order/circular/list")
export const patchCirculation = createRequest("/api/order/circular/update")
export const queryNotConfiguredList = createRequest("/api/order/circular/configured")
export const queryClassOptions = createRequest("/api/class/list")
export const queryDepartmentList = createRequest("/api/order/circular/part/list")
export const queryDepartment = createRequest("/api/order/circular/part")
export const postDepartment = createRequest("/api/order/circular/part/add")
export const putDepartment = createRequest("/api/order/circular/part/update")
export const deleteDepartment = createRequest("/api/order/circular/part/delete")
export const deleteDepartmentList = createRequest("/api/order/circular/part/remove")
export const queryLinkList = createRequest("/api/order/circular/config/agent/list")
export const queryLink = createRequest("/api/order/circular/config/agent")
export const putLink = createRequest("/api/order/circular/config/agent/update")
export const queryUserByPhone = createRequest("/api/group/queryStaffByPhone")
export const queryAreaList = createRequest("/api/order/circular/region/list")
export const queryAllLabelList = createRequest("/api/order/circular/label/withOutPage/list")
export const queryMyCreateOrderList = createRequest("/api/order/circular/wo/query")
export const queryDefaultDepartment = createRequest("/api/order/circular/wo/queryPartInfoByCategory")
export const postOrder = createRequest("/api/order/circular/wo/create")
export const queryOrder = createRequest("/api/order/circular/wo/detail")
export const patchOrder = createRequest("/api/order/circular/wo/commit")
export const queryPartUserList = createRequest("/api/order/circular/wo/partUserList")
export const postOrderUser = createRequest("/api/order/circular/wo/delegate")
export const putOrderUser = createRequest("/api/order/circular/wo/reassign");
export const queryAllDepartmentList = createRequest("/api/order/circular/part/withOutPage/list")
export const confirmOrder = createRequest("/api/order/circular/wo/confirm")
export const postEvaluation = createRequest("/api/order/circular/wo/assess")
export const queryPlateNumInfo = createRequest("/api/common/car/queryByPlateNum")