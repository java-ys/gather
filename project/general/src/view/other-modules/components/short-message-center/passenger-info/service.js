import { noticeMenuList, insertMenuAction, updateMenuAction, menuDetailAction } from "_o/api/notice";
import { addAnnounce, salaryTypeList } from "_o/api/announcement.js"

// 类目
export const getAllMenu = async () => {
  const { data: data, status } = await noticeMenuList({});
  let list = [], nameList = [];
  data.success && data.data.forEach(it => {
    list.push({
      label: it.pubMenuName,
      value: it.pubMenuCode
    })
    nameList.push({
      label: it.pubMenuName,
      value: it.pubMenuName,
    })
  });
  return {
    data,
    status,
    nameList,
    list
  };
};

// 新增公告
export const announceSubmit = async (p = {}) => {
  const { data: data, status} = await addAnnounce(p)
  return {
    data, status,
    success: data.success
  }
}

// 新增类目
export const insertMenu = async (p = {}) => {
  const { data: data, status} = await insertMenuAction(p)
  return {
    data, status,
    success: data.success
  }
}

// 编辑类目
export const updateMenu = async (p = {}) => {
  const { data: data, status} = await updateMenuAction(p)
  return {
    data, status,
    success: data.success
  }
}

// 类目详情
export const getMenu = async (p = {}) => {
  const { data: data, status} = await menuDetailAction(p)
  return {
    data, status,
    success: data.success
  }
}
