import api4driver from "_o/config/api4driver.request"

// 日志列表
export const logList = (data) => {
    return api4driver.request({
        url: '/api/operateLog/queryLog',
        data,
        method: 'post'
    })
}

// 休假规则列表
export const restList = (data) => {
    return api4driver.request({
        url: '/api/vacationRule/selectByPage',
        data,
        method: 'post'
    })
}

// 添加休假规则
export const addRest = (data) => {
    return api4driver.request({
        url: '/api/vacationRule/save',
        data,
        method: 'post'
    })
}

// 编辑休假规则
export const updateRest = (data) => {
    return api4driver.request({
        url: '/api/vacationRule/update',
        data,
        method: 'post'
    })
}

// 删除休假规则
export const delRest = (data) => {
    return api4driver.request({
        url: '/api/vacationRule/delete',
        data,
        method: 'post',
    })
}

// 休假规则详情
export const detailRest = (data) => {
    return api4driver.request({
        url: '/api/vacationRule/details',
        data,
        method: 'post'
    })
}

// 适用排班
export const restQueryShift = (data) => {
    return api4driver.request({
        url: '/api/vacationRule/queryShift',
        data,
        method: 'post'
    })
}

// 排班日历详情查询
export const calDetailList = (data) => {
    return api4driver.request({
        url: '/api/shift/calendar/pageListDetail',
        data,
        method: 'post'
    })
}

// 排班日历历史详情查询
export const hisDetailList = (data) => {
    return api4driver.request({
        url: '/api/shift/calendar/pageListHistory',
        data,
        method: 'post'
    })
}

// 请假规则列表
export const leaveRuleList = (data) => {
    return api4driver.request({
        url: '/api/leaveRule/pageList',
        data,
        method: 'post'
    })
}

// 新增请假规则
export const addLeaveRule = (data) => {
    return api4driver.request({
        url: '/api/leaveRule/add',
        data,
        method: 'post'
    })
}

// 删除请假规则
export const delLeaveRule = (data) => {
    return api4driver.request({
        url: '/api/leaveRule/delete',
        data,
        method: 'post'
    })
}

// 请假规则详情
export const detailLeaveRule = (data) => {
    return api4driver.request({
        url: '/api/leaveRule/detail',
        data,
        method: 'post'
    })
}

// 编辑请假规则
export const editLeaveRule = (data) => {
    return api4driver.request({
        url: '/api/leaveRule/edit',
        data,
        method: 'post'
    })
}

// 司机姓名模糊查询
export const driverNameMobileList = (data) => {
    return api4driver.request({
        url: '/api/approve/info/driverNameMobileFuzzySearch',
        data,
        method: 'post'
    })
}
 
// 审批列表
//销假列表
export const cancelLeaveList = (data) => {
    return api4driver.request({
        url: '/api/apply/cancelLeavePage',
        data,
        method: 'post'
    })
}

//请假列表 
export const leaveList = (data) => {
    return api4driver.request({
        url: '/api/apply/leavePage',
        data,
        method: 'post'
    })
}

//补假列表 
export const patchLeaveList = (data) => {
    return api4driver.request({
        url: '/api/apply/patchLeavePage',
        data,
        method: 'post'
    })
}

//休息列表 
export const restLeaveList = (data) => {
    return api4driver.request({
        url: '/api/apply/restPage',
        data,
        method: 'post'
    })
}

//审批详情 
export const approvalDetail = (data) => {
    return api4driver.request({
        url: '/api/approve/info/queryDetail',
        data,
        method: 'post'
    })
}

//审批操作
export const approvalOperate = (data) => {
    return api4driver.request({
        url: '/api/approve/info/operate',
        data,
        method: 'post'
    })
}

