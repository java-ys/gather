```

1、保存或更新接口(更新传id)
http://10.3.97.243/m2-admin/api/admin/press/task/save

请求

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
 周期时间 String cycleTime;   dd:mm:ss   日周月传
 周期值 List<Integer> cycleValue;  0-周日  月1-31
 周期小时 Integer cycleHour;  按时
 发送时间  Date sendTime;   单次传

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

返回
{"attachment":null,"code":200,"data":null,"errCode":200,"exception":"","msg":"成功","success":true}

```

```

2、分页查询列表
http://10.3.97.243/m2-admin/api/admin/press/task/list
请求
 创建人 String creator;
 任务名称 String taskName;
 任务状态，1启用，2停用 Integer taskStatus;
 城市 List<String> cityCodeList;
 产品线 List<String> bizTypeList;
 当前页面 Integer currentPage;
 页面大小 Integer pageSize;

返回
参考保存接口的请求
{"attachment":null,"code":200,"data":{"currPage":1,"hasMore":true,"list":[{...}],"pageSize":10,"totalCount":96},"errCode":200,"exception":"","msg":"成功","success":true}

```

```


3、根据任务uuid获取任务
http://10.3.97.243/m2-admin/api/admin/press/task/getOne

请求
 uuid String uuid;

返回
参考保存接口的请求
{"attachment":null,"code":200,"data":{。。。},"errCode":200,"exception":"","msg":"成功","success":true}

```

```

4、更新任务状态
http://10.3.97.243/m2-admin/api/admin/press/task/updateStatus

请求
 uuid String uuid;
 任务状态，1启用，2停用  Integer taskStatus;

返回
{"attachment":null,"code":200,"data":null,"errCode":200,"exception":"","msg":"成功","success":true}◊
```