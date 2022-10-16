// 考核结算
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
//---------------------------------------考核指标---------------------------------------------
//-------------------------------------------------------------------------------------------

/*
考核指标分页列表查询
1	currPage	number	是	当前页码，默认1
2	pageSize	number	是	每页条数，默认10
3	name	String	否	指标名称
4	status	number	否	状态 1-正常 0-停用
*/
export const assessPageService = pf("/api/operate/assess/page");
/**
  考核指标列表查询
1	name	String	否	指标名称
2	status	number	否	状态 1-正常 0-停用
 */
export const assessListService = pf("/api/operate/assess/list");

/**
 考核指标详情
1	id	number	是	主键
 */
export const assessGetService = pf("/api/operate/assess/get");

/**
 考核指标新建

 1	classify	number	是	指标分类
2	type	number	是	指标类型
3	name	string	是	指标名称
4	remark	string	是	指标说明
5	standard	json	是	考核标准
6	└─way	number	是	阶梯标准类型 0:百分比，1:数值
7	└─coefficient	number	是	系数
8	└─definition	jsonArray	是	考核阶梯数组
9	└─└─min	number	是	最小值
10	└─└─minSign	string	是	最小值符号
11	└─└─max	number	是	最大值
12	└─└─maxSign	string	是	最大值符号

 */
export const assessSaveService = pf("/api/operate/assess/save");

/*
考核指标修改
1	id	number	是·	主键
2	classify	number	是	指标分类
3	type	number	是	指标类型
4	name	string	是	指标名称
5	remark	string	是	指标说明
6	standard	json	是	考核标准
7	└─way	number	是	阶梯标准类型 0:百分比，1:数值
8	└─coefficient	number	是	系数
9	└─definition	jsonArray	是	考核阶梯数组
10	└─└─min	number	是	最小值
11	└─└─minSign	string	是	最小值符号
12	└─└─max	number	是	最大值
13	└─└─maxSign	string	是	最大值符号
 */
export const assessUpdateService = pf("/api/operate/assess/update");

/**
 启/禁用考核指标
1	id	number	是	主键
2	status	number	是	状态 1-启用 0-禁用
 */
export const assessStatusService = pf("/api/operate/assess/status");

/*
删除考核指标
1	id	number	是	主键
 */
export const assessDeleteService = pf("/api/operate/assess/delete");

//-------------------------------------------------------------------------------------------
//---------------------------------------管理条例---------------------------------------------
//-------------------------------------------------------------------------------------------

/**
 管理条例模板分页列表查询
1	currPage	number	是	当前页码，默认1
2	pageSize	number	是	每页条数，默认10
3	title	String	否	模板名称
4	status	number	否	状态 1-正常 0-停用

 */
export const controlPageService = pf("/api/operate/control/page");

/**
 管理条例模板列表查询
1	title	String	否	模板名称
2	status	number	否	状态 1-正常 0-停用
 */
export const controlListService = pf("/api/operate/control/list");

/*
管理条例模板详情
1	id	number	是	主键
 */
export const controlGetService = pf("/api/operate/control/get");


/*
新建管理条例模板
1	operationMode	number	是	运营模式：1-A模式、2-UP模式
2	title	string	是	模板名称
3	fileName	string	是	文件名称
4	fileUrl	string	是	文件url
 */
export const controlSaveService = pf("/api/operate/control/save");

/*
修改管理条例模板
1	id	number	是	主键
2	operationMode	number	是	运营模式：1-A模式、2-UP模式
3	title	string	是	模板名称
4	fileName	string	是	文件名称
5	fileUrl	string	是	文件url
 */
export const controlUpdateService = pf("/api/operate/control/update");

/**
启/禁用管理条例模板
1	id	number	是	主键
2	status	number	是	状态 1-启用 0-禁用
  */
export const controlStatusService = pf("/api/operate/control/status");

/*
删除管理条例模板
1	id	number	是	主键
  */
export const controlDeleteService = pf("/api/operate/control/delete");

// 分佣规则列表
export const commissionList = pf("/admin/divide/commission/list");

// add 分佣规则
export const commissionAdd = pf("/admin/divide/commission/add");

// update 分佣规则
export const commissionUpdate = pf("/admin/divide/commission/update");

// 启用/禁用 status update 分佣规则
export const commissionStatusUpdate = pf("/admin/divide/commission/status/update");

// delete 分佣规则
export const commissionDelete = pf("/admin/divide/commission/delete");

// get 分佣规则
export const commissionGet = pf("/admin/divide/commission/get");

