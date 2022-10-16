import axios from '_g/config/api.request'

//新增消息模板
export const addMesModule = (data) => {
    return axios.request({
        url: 'api/manager/message/module/addModule',
        data,
        method: 'post'
    })
}

//更新消息模板
export const updateMesModule = (data) => {
    return axios.request({
        url: 'api/manager/message/module/updateMsgTemplate',
        data,
        method: 'post'
    })
}

//模板列表
export const getMesModuleList = (data) => {
    return axios.request({
        url: 'api/manager/message/module/queryList',
        data,
        method: 'post'
    })
}

//删除模板
export const deleteMesModule = (data) => {
    return axios.request({
        url: 'api/manager/message/module/deleteModule',
        data,
        method: 'post'
    })
}
