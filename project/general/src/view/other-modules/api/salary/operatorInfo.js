import base from "./base";


// 查询当前登录人可访问的资源
export const queryResourceByAccountId = (params) => {
  return base.authInfoRequest("/api/auth/resource/queryResourceByAccountId", params);
};

// 查询当前登录人的人员信息
export const selectLoginStaffInfo = () => {
  return base.authInfoRequest("/api/v1/staff/selectLoginStaffInfo");
};

// 查询当前登录人的机构信息
export const queryLoginStaffOrgan = () => {
  return base.authInfoRequest("/api/v1/organ/queryLoginStaffOrgan");
};

// 查询当前登录人的岗位信息
export const queryLoginStaffPosition = () => {
  return base.authInfoRequest("/api/v1/position/queryLoginStaffPosition");
};

// 退出登录
export const logout = (params) => {
  return base.authRequest("/auth/outlogin", params);
};
