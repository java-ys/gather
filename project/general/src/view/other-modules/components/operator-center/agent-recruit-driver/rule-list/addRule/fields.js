import {
  mapToList
} from '@/libs/util';
// 运营商-奖励条件
export const rewardConditionsMap = {
  0: '缴纳保证金时间',
  1: '绑车时间'
}
export const rewardConditionsList = mapToList(rewardConditionsMap)

export const validTime = (rule, value, callback) =>{
  if(!value[0]){
    callback(new Error('有效时间不能为空'));
  }else{
    let start = value[0].getTime()
    let end = value[1].getTime()
    if(start === end){
      callback(new Error('最小跨度一个自然日'));
    }else{
      let before = value[0]
      let after = value[1]
      let startYear = before.getFullYear()
      let endYear = after.getFullYear()
      let startMonth = before.getMonth()
      let endMonth = after.getMonth()
      let startDay = before.getDate()
      let endDay = after.getDate()
      let isLong = false
      if(startYear===endYear){
        if(endMonth-startMonth===6 && startDay<endDay || endMonth-startMonth>6){
          isLong = true
        }
      }else if(endYear-startYear>1){
        isLong = true
      }else if(endYear-startYear===1){
        if(startMonth-endMonth===6 && startDay<endDay || startMonth-endMonth<6 ){
          isLong = true
        }
      }
      if(isLong){
        callback(new Error('最长跨度半年'));
      }else{
        callback();
      }
    }
  }
}
export const validateRules = {
  ruleName: [{ required: true, message: "推荐名称奖励不能为空" }],
  city: [{ required: true, message: "省/市不能为空" }],
  time: [],
  rewardEvent: [{ required: true, type:"number", message: "奖励条件不能为空" }],
  rewardDelay: [{ required: true, type:"number", message: "时间不能为空" }],
  driverOrigin: [{ required: true, type:"array", message: "司机来源不能为空" }],
  rewardType: [{ required: true, type:"number", message: "运营商奖励不能为空" }],
  rewardLimitType: [{ required: true, type:"number", message: "奖励上限不能为空" }],
  rewardLimit: [{ required: true, type:"number", message: "奖励上限不能为空" }],
  lowerLimit: [{ required: true, type:"number", message: "梯度不能为空" }],
  upperLimit: [{ required: true, type:"number", message: "梯度不能为空" }],
  cash: [{ required: true, type:"number", message: "奖励现金不能为空" }],
}