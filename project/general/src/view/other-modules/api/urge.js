import axios from '_g/config/api.request';
import axios4Marketing from "_g/config/api4Market.request.js";

function pf (url) {
  return params => {
    return axios.request ({
      url,
      method: 'post',
      data: params,
    });
  };
}

//-------------------------------------------------------------------------------------------
//---------------------------------------运营商考核------------------------------------------
//-------------------------------------------------------------------------------------------

/*
保存或更新传id

主键id  Integer id;
 创建人 String creator;
 更新人 String updater;
 任务名称 String taskName;
 任务状态，1启用，2停用 Integer taskStatus;
 城市 String cityCode;  （逗号间隔，全部不传）
 排除城市 String excludeCityCode;（逗号间隔，全部不传）
 产品线 String bizType;（逗号间隔，全部不传）
 发送规则 SendRuleDto sendRuleDto;
 筛选规则 FilterRuleDto filterRuleDto;
 触达规则 TouchRuleDto touchRuleDto;
 开始时段 Date startTime;
 结束时段 Date endTime;

发送规则
 发送类型 1单次，2重复 Integer sendType;
 周期类型 1时，2日，3周，4月 Integer cycleType;
 周期时间 String cycleTime;
 周期值 List<Integer> cycleValue;
 周期小时 Integer cycleHour;
 发送时间  Date sendTime;

筛选规则
 过滤器类型  1动态未支付时间，2动态未支付天数，3选定日期 Integer filterType;
 开始小时 Integer startHour;
 结束小时 Integer endHour;
 开始天数 Integer startDay;
 结束天数 Integer endDay;
 开始时间 Date startTime;
 结束时间 Date endTime;

触达规则
 触达类型 1短信，2push，3奖励发放，4预约外呼 List<Integer> touchType;
 短信内容 String smsContent;
 标题 String pushTitle;
 子标题 String pushSubTitle;
 url String pushUrl;
 奖励uuid String rewardUuid;
 子奖励uuid String subRewardUuid;

*/
export const pressSaveService = pf ('/api/admin/press/task/save');

// 列表
/*
 创建人 String creator;
 任务名称 String taskName;
 任务状态，1启用，2停用 Integer taskStatus;
 城市 List<String> cityCodeList;
 产品线 List<String> bizTypeList;
 当前页面 Integer currentPage;
 页面大小 Integer pageSize;
*/
export const pressListService = pf ('/api/admin/press/task/list');

// 根据uuid获取任务
export const pressGetOneService = pf ('/api/admin/press/task/getOne');

// 更新任务状态
/*
 uuid String uuid;
 任务状态，1启用，2停用  Integer taskStatus;
*/
export const pressUpdateStatusService = pf ('/api/admin/press/task/updateStatus');

export const queryProductAndBusinessList = pf('/api/assets/v1/vehicle/getBusinessGradeProduct')


//获取有效的奖励管理列表
export const getValidRewardList= (params)=>{
  return axios4Marketing.request({
    url:'/api/marketing/grantReward/selectListNoUsePage',
    data:params,
    method:'POST'
  })
}
//根据父奖励id获取子奖励
export const getChildRewardList=(params)=>{
  return axios4Marketing.request({
    url:'/api/marketing/grantReward/selectChildRewardList',
    data:params,
    method:'POST'
  })
}