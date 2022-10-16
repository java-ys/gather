const Mock = require('mockjs')


export const secretFreeGuidanceQueryPage = function (params = {}) {
  console.log('secretFreeGuidanceQueryPage: ', JSON.stringify(params, null, 2));

  return new Promise((resolve => {
    resolve(Mock.mock({
      data: {
        success: true,
        code: 200,
        errCode: 200,
        msg: "",
        exception: "",
        data: {
          currPage: params.currPage || 1,
          pageSize: params.pageSize || 20,
          hasMore: true,
          totalCount: 554,
          'list|20': [{
            "id":1,
            "sfConfigName": "策略名称1",
            "cityName": "南京市、上海市",
            "productLineName": "快享、企业用车",
            "triggerNodeName":"注册、确认用车",
            "taskFlag": true, // 是否关联任务
            "status|1-3": 1,
            "auditStatus|1-3": 1,
            "startTime":1619320711000,
            "endTime":1619350711000,
            "creator":"@cname",
            "createTime":1619350711000,
            "updateTime":1619350711000,
            "updater":"@cname"
          }]
        },
      }
    }))
  }))
}

export const secretFreeGuidanceAdd = function(params = {}) {

  console.log('secretFreeGuidanceAdd: ', JSON.stringify(params, null, 2));

  return new Promise(resolve => {
    resolve(Mock.mock({
      data: {
        success: true,
        code: 200,
        errCode: 200,
        msg: "新建成功",
        exception: "",
        data: null,
      }
    }))
  })
}

export const secretFreeGuidanceDetail = function(params = {}) {

  console.log('secretFreeGuidanceDetail: ', JSON.stringify(params, null, 2));

  return new Promise(resolve => {
    resolve(Mock.mock({
      data: {
        success: true,
        code: 200,
        errCode: 200,
        msg: "新建成功",
        exception: "",
        data: {
          "id":1,
          "sfConfigName": "策略名称1",
          "cityName": "南京市、上海市",
          "productLineName": "快享、企业用车",
          "triggerNodeName":"注册、确认用车",
          "status": 1,
          "auditStatus": 1,
          "startTime":1619320711000,
          "endTime":1619350711000,
          "creator":"创建人",
          "createTime":1619350711000,
          "updateTime":1619350711000,
          "updater":"最近一次编辑人",
          "groupName":"用户群1、用户群2",
          "guidePageImage":"https://image/xxxx.jpg",
          "guidePageContent":"引导页文案",
          "guidePageEntranceContent":"引导页入口文案",
          "paymentContent":"收银台文案",
          "taskFlag":1,
          "userGroupType":1
        },
      }
    }))
  })
}

export const getSfFrequency = function(params = {}) {

  console.log('getSfFrequency: ', JSON.stringify(params, null, 2));

  return new Promise(resolve => {
    resolve(Mock.mock({
      data: {
        success: true,
        code: 200,
        errCode: 200,
        msg: "新建成功",
        exception: "",
        data: {
          "id":1,
          "startTime":123456,
          "endTime":12346578,
          "totalTime":20,
          "configInfo":[
            {"triggerNode":"1","manyDay":30,"manyDaySum":15,"everyDdaySum":3},
            {"triggerNode":"2","manyDay":30,"manyDaySum":15,"everyDdaySum":3}
          ],
          "updater":"xxxx",
          "updateTime":12323132,
          "creator":"",
          "createTime":231321,
          "status":1,
          "auditStatus":1
        },
      }
    }))
  })
}

export const selectTaskPage = function (params = {}) {
  console.log('selectTaskPage: ', JSON.stringify(params, null, 2));

  return new Promise((resolve => {
    resolve(Mock.mock({
      data: {
        success: true,
        code: 200,
        errCode: 200,
        msg: "",
        exception: "",
        data: {
          currPage: params.currPage || 1,
          pageSize: params.pageSize || 20,
          hasMore: true,
          totalCount: 554,
          'list|20': [{
            "taskId": '@id',
            "taskName":"任务名称",
            "taskDes":"任务简介",
            "city":"适用城市",
            "startTime":132123132,
            "endTime":1231312
          }]
        },
      }
    }))
  }))
}
