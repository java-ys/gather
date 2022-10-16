import axios from "_g/config/api.request";

function pf(url, s = axios) {
  return params => {
    return s.request({
      url,
      method: "post",
      data: params
    });
  };
}

//-------------------------------------------------------------------------------------------
//---------------------------------------角色组管理------------------------------------------
//-------------------------------------------------------------------------------------------

/*
角色组人员配置分页列表查询
*/
export const roleGroupPageService = pf("/api/operate/rolegroup/page");

// 详情
export const roleGroupGetService = pf("/api/operate/rolegroup/get");

// 新建角色组
export const roleGroupSaveService = pf("/api/operate/rolegroup/save");

// 修改角色组
export const roleGroupUpdateService = pf("/api/operate/rolegroup/update");

// 删除角色组
export const roleGroupDeleteService = pf("/api/operate/rolegroup/delete");

// 根据城市、群组编码查询人员列表
export const roleGroupQueryUserlistService = pf(
  "/api/operate/rolegroup/queryUserlist"
);

// 根据用户id查询城市权限
export const roleGroupQueryCitylistService = pf(
  "/api/operate/rolegroup/queryCitylist"
);

// 查询员工
export const queryStaffByPhoneService = pf(
  "/api/operate/rolegroup/queryStaffByPhone"
);