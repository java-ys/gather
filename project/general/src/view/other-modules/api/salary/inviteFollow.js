import base from "./base";

const basePostService = url => {
  return params => {
    return base.mainRequest(url, params);
  };
};

/*
邀约跟进列表查询 {
agentUuid (string, optional): 所属组织 ,
channelName (string, optional): 简历来源 ,
cityUuid (string, optional): 城市uuid ,
currPage (integer, optional): 当前页数 ,
driverName (string, optional): 司机姓名 ,
idList (Array[integer], optional): 主键集合 ,
intentionLevel (integer, optional): 意向等级:0:S 1:A 2:B 3:C 4:D ,
invitationEndTimeAgain (string, optional): 再次邀约时间-结束 ,
invitationName (string, optional): 邀约人 ,
invitationStage (integer, optional): 邀约阶段: 0 面试邀约、1 培训邀约、2 入职邀约 ,
invitationStartTimeAgain (string, optional): 再次邀约时间-开始 ,
invitationStatus (integer, optional): 邀约状态：0 初始，1 待邀约， 2 邀约失败，3 邀约结束 4 邀约失效 ,
latestInvitationEndTime (string, optional): 最新邀约时间-结束 ,
latestInvitationResults (integer, optional): 最新邀约结果：1邀约成功、2再次邀约、3无意向、4无效数据 ,
latestInvitationStartTime (string, optional): 最新邀约时间-开始 ,
mobile (string, optional): 司机手机号 ,
pageSize (integer, optional): 每页显示数量 ,
resumeAllocationEndTime (string, optional): 简历分配时间-结束 ,
resumeAllocationStartTime (string, optional): 简历分配时间-开始 ,
resumeStatus (integer, optional): 简历状态：状态:0:初始 1:背调通过 2:背调不通过 3:面试通过 4:面试不通过 5:培训通过 6:培训不通过 7:已入职 8:
*/

// 邀约跟进列表
export const getInviteList = basePostService("/api/invitation/follow/up/queryPageList");

/*
邀约跟进详情查询 {
currPage (integer, optional): 当前页数 ,
id (integer, optional): 主键 ,
pageSize (integer, optional): 每页显示数量
}
*/
export const getInviteDetailList = basePostService("/api/invitation/follow/up/detail");

/*
邀约跟进-分配/重新分配
待分配信息 {
id (integer, optional): 主键 ,
invitationName (string, optional): 邀约人名称 ,
invitationUuid (string, optional): 邀约人uuid
}
*/
export const setDistribution = basePostService("/api/invitation/follow/up/distribution");

/*
分配比例设置保存
{
cityCode (string, optional),
cityName (string, optional),
invitationDistributionDtoList (Array[邀约分配比例], optional): 邀约分配信息集合
}
邀约分配比例 {
distributionProportion (integer, optional): 分配比例 ,
invitationName (string, optional): 邀约人名称 ,
invitationUuid (string, optional): 邀约人uuid
}
*/
export const setDistributePct = basePostService("/api/invitation/follow/up/allocationAdd");

/*
批量分配
{
invitationName (string, optional): 邀约人名称 ,
invitationUuid (string, optional): 邀约人uuid ,
uuidList (Array[integer], optional): 主键集合
}
*/
export const setBatchAllocation = basePostService("/api/invitation/follow/up/batchAllocation");

/*
导出
邀约跟进列表查询 {
agentUuid (string, optional): 所属组织 ,
channelName (string, optional): 简历来源 ,
cityUuid (string, optional): 城市uuid ,
currPage (integer, optional): 当前页数 ,
driverName (string, optional): 司机姓名 ,
idList (Array[integer], optional): 主键集合 ,
intentionLevel (integer, optional): 意向等级:0:S 1:A 2:B 3:C 4:D ,
invitationEndTimeAgain (string, optional): 再次邀约时间-结束 ,
invitationName (string, optional): 邀约人 ,
invitationStage (integer, optional): 邀约阶段: 0 面试邀约、1 培训邀约、2 入职邀约 ,
invitationStartTimeAgain (string, optional): 再次邀约时间-开始 ,
invitationStatus (integer, optional): 邀约状态：0 初始，1 待邀约， 2 邀约失败，3 邀约结束 4 邀约失效 ,
latestInvitationEndTime (string, optional): 最新邀约时间-结束 ,
latestInvitationResults (integer, optional): 最新邀约结果：1邀约成功、2再次邀约、3无意向、4无效数据 ,
latestInvitationStartTime (string, optional): 最新邀约时间-开始 ,
mobile (string, optional): 司机手机号 ,
pageSize (integer, optional): 每页显示数量 ,
resumeAllocationEndTime (string, optional): 简历分配时间-结束 ,
resumeAllocationStartTime (string, optional): 简历分配时间-开始 ,
resumeStatus (integer, optional): 简历状态：状态:0:初始 1:背调通过 2:背调不通过 3:面试通过 4:面试不通过 5:培训通过 6:培训不通过 7:已入职 8:体检通过 9:体检不通过 11:离职
}
*/

export const batchExport = params => {
  return base.exportRequest("/api/invitation/follow/up/batchExport", params);
};

/*
邀约跟进列表查询 {
agentUuid (string, optional): 所属组织 ,
channelName (string, optional): 简历来源 ,
cityUuid (string, optional): 城市uuid ,
currPage (integer, optional): 当前页数 ,
driverName (string, optional): 司机姓名 ,
idList (Array[integer], optional): 主键集合 ,
intentionLevel (integer, optional): 意向等级:0:S 1:A 2:B 3:C 4:D ,
invitationEndTimeAgain (string, optional): 再次邀约时间-结束 ,
invitationName (string, optional): 邀约人 ,
invitationStage (integer, optional): 邀约阶段: 0 面试邀约、1 培训邀约、2 入职邀约 ,
invitationStartTimeAgain (string, optional): 再次邀约时间-开始 ,
invitationStatus (integer, optional): 邀约状态：0 初始，1 待邀约， 2 邀约失败，3 邀约结束 4 邀约失效 ,
latestInvitationEndTime (string, optional): 最新邀约时间-结束 ,
latestInvitationResults (integer, optional): 最新邀约结果：1邀约成功、2再次邀约、3无意向、4无效数据 ,
latestInvitationStartTime (string, optional): 最新邀约时间-开始 ,
mobile (string, optional): 司机手机号 ,
pageSize (integer, optional): 每页显示数量 ,
resumeAllocationEndTime (string, optional): 简历分配时间-结束 ,
resumeAllocationStartTime (string, optional): 简历分配时间-开始 ,
resumeStatus (integer, optional): 简历状态：状态:0:初始 1:背调通过 2:背调不通过 3:面试通过 4:面试不通过 5:培训通过 6:培训不通过 7:已入职 8:体检通过 9:体检不通过 11:离职
}
*/
// 邀约记录导出
export const exportInvitation = params => {
  return base.exportRequest(
    "/api/invitation/follow/up/exportInvitation",
    params
  );
};

/*
邀约跟进-无效数据 {
id (integer, optional): 主键id ,
reasonForInvalidData (integer, optional): 无效数据的原因：40:停机、41:空号、42:虚假信息、43:其他 ,
remark (string, optional): 备注
}
*/
export const invalidDataAdd = basePostService("/api/invitation/follow/up/invalidDataAdd");

// 邀约跟进-邀约任务提醒(待跟进司机数量)
export const invitationTaskReminder = basePostService("/api/invitation/follow/up/invitationTaskReminder");

/*
邀约跟进-再次邀约 {
followUpReasonAgain (integer, optional): 再次邀约的原因：20:待预约时间、21:犹豫考虑中、22:人在外地、23:不方便接听、24:联系不上、25:无人接听,26:其他 ,
id (integer, optional): 主键id ,
invitationTimeAgain (string, optional): 再次邀约时间 ,
remark (string, optional): 备注
}
*/
export const inviteAgainAdd = basePostService("/api/invitation/follow/up/inviteAgainAdd");

/*
邀约跟进-无意向 {
id (integer, optional): 主键id ,
reasonsForNoIntention (integer, optional): 无意向的原因:30:无相关证件、31:没钱缴保证金、32:已有工作、33:薪资低、34:模式不适合、35:限制多不自由、36:其他 ,
remark (string, optional): 备注
}
*/
// 邀约跟进-无意向
export const noIntentionAdd = basePostService("/api/invitation/follow/up/noIntentionAdd");

/*
分配比例设置查询 {
currPage (integer, optional): 当前页数 ,
pageSize (integer, optional): 每页显示数量
}
*/
// 分配比例设置-查询
export const queryAllocation = basePostService("/api/invitation/follow/up/queryAllocation");

// GET /{id}
// 邀约跟进-跟进查询
export const queryFollowUp = basePostService("/api/invitation/follow/up/queryFollowUp");

/*
意向等级、再次邀约时间对应表-查询入参 {
invitationResults (integer, optional): 邀约结果：1邀约成功、2再次邀约、3无意向、4无效数据 ,
reasonType (integer, optional): 预约到场时间：10 当日、13 三日内、15 五日内原因：20:待预约时间、21:犹豫考虑中、22:人在外地、23:不方便接听、24:联系不上、25:无人接听,26:其他30:无相关证件、31:没钱缴保证金、32:已有工作、33:薪资低、34:模式不适合、35:限制多不自由、36:其他40:停机、41:空号、42:虚假信息、43:其他
}
*/
// 邀约跟进-意向等级、再次邀约时间对应表
export const queryCorrespondingTable = basePostService("/api/invitation/follow/up/queryCorrespondingTable");

// 分配比例设置-邀约人查询(下拉框)

export const queryInvitationPersonList = basePostService("/api/invitation/follow/up/queryInvitationPersonList");

/*
邀约跟进-邀约成功 {
appointmentArrivalTime (integer, optional): 预约到场时间: 10 当日、13 三日内、15 五日内 ,
id (integer, optional): 主键id ,
invitationTimeAgain (string, optional): 再次邀约时间 ,
remark (string, optional): 备注
}
*/
// 邀约跟进-邀约成功
export const successfulInvitationAdd = basePostService("/api/invitation/follow/up/successfulInvitationAdd");

// 邀约跟进-批量分配、分配比例设置、重新分配、分配的权限校验
export const verificationAuthority = basePostService("/api/invitation/follow/up/verificationAuthority");

// 获取已开通城市
export const cityListService = basePostService("/api/v1/driver/distributionRule/cityList");

// 已开通运营商
export const agentListService = basePostService("/api/v1/driver/distributionRule/agentListByCityUuid");

// 发送短信/批量短信
export const sendMsgService = basePostService("/api/invitation/follow/up/sendMsg");

// 邀约跟进弹层中历史邀约记录
export const historicalInvitationRecordService = basePostService("/api/invitation/follow/up/queryHistoricalInvitationRecord");

// 外呼账号信息列表
export const invitationAccountListService = basePostService("/api/invitation/follow/up/queryInvitationAccountList");

// 软电话基础信息
export const softPhoneAccountService = basePostService("/api/invitation/follow/up/querySoftPhoneAccount");

// 查询短信发送次数是否超过6次
export const msgNumService = basePostService("/api/invitation/follow/up/msgNum");

// 获取录音文件
export const synchronizeRecordingFilesService = basePostService("/api/invitation/follow/up/synchronizeRecordingFiles");
