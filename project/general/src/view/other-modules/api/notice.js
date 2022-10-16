
import crmRequest from "_o/config/api4Crm.request"

// 类目列表  (全量)
export const noticeMenuList = (data={}) => {
  return crmRequest.request({
    url: "/system/notice/pubMenuList",
    method: "post",
    data: data
  });
};

// 类目列表分页  分页接口
export const noticeMenuPage = (data={}) => {
  return crmRequest.request({
    url: "/system/notice/pubMenuPage",
    method: "post",
    data: data
  });
};

// 类目模糊查询 pubMenuName
export const noticeMenuQuery = (data={}) => {
  return crmRequest.request({
    url: "/system/notice/pubMenuQuery",
    method: "post",
    data: data
  });
};


// 新增类目 pubMenuName pubMenuPicUrl
export const insertMenuAction = (data={}) => {
  return crmRequest.request({
    url: "/system/notice/insertPubMenu",
    method: "post",
    data: data
  });
};

// 编辑类目 pubMenuCode pubMenuName pubMenuPicUrl
export const updateMenuAction = (data={}) => {
  return crmRequest.request({
    url: "/system/notice/updatePubMenu",
    method: "post",
    data: data
  });
};

// 详情 pubMenuCode
export const menuDetailAction = (data={}) => {
  return crmRequest.request({
    url: "/system/notice/pubMenuDetail",
    method: "post",
    data: data
  });
};

