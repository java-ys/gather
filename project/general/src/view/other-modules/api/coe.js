import axios from "_g/config/api.request";

function pf(url) {
  return params => {
    return axios.request({
      url,
      method: "post",
      data: params
    });
  };
}

//-------------------------------------------------------------------------------------------
//---------------------------------------城市系数管理---------------------------------------------
//-------------------------------------------------------------------------------------------

/*
考核指标分页列表查询
1	currPage	number	是	当前页码，默认1
2	pageSize	number	是	每页条数，默认10
3	name	String	否	指标名称
4	status	number	否	状态 1-正常 0-停用
*/
export const cListService = pf("/admin/city/coefficient/list");
/**
  详情
 id	String	否	主键id
 */
export const cGetService = pf("/admin/city/coefficient/get");

/**
 新增
 | cityCodeList| array| 城市对象列表([{“cityCode”:”320100”,”cityName”:”XXXXX”}]) |
 | cityLevel| INT| 城市级别: 0：默认 1:一线、2:二线、3:三线、4:卫星线V1、5:卫星线V2、6:卫星线V3 |
 | orderScale| String| 城市订单规模 |
 | coefficient| Double| 城市系数,保留2位有效小数 |
 | remark| String| 说明 |
 */
export const cAddService = pf("/admin/city/coefficient/add");

/*
id	array	主键
cityCode	STRING	城市code
cityName	STRING	城市name)
cityLevel	INT	城市级别: 0：默认 1:一线、2:二线、3:三线、4:卫星线V1、5:卫星线V2、6:卫星线V3
orderScale	String	城市订单规模
coefficient	Double	城市系数,保留2位有效小数
remark	String	说明
 */
export const cUpdateService = pf("/admin/city/coefficient/update");

/**
 启/禁用
 id	Integer	规则名称
 configStatus	String	规则状态：0-有效；1-禁用
 */
export const cStatusService = pf("/admin/city/coefficient/status/update");

/*
删除
id	Integer	规则名称
delFlag	String	逻辑删除，0：否，1：是，默认为0
 */
export const cDeleteService = pf("/admin/city/coefficient/delete");
