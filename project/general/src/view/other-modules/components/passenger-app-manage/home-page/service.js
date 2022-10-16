import { homePageList, menuList, deleteRow, getRowDetail, toggleStatus } from "_o/api/homePage"
import {toResult} from "@/mixins/base";

export const fetchMenuList = async(mediumTypeList) => {
  const [err, data] = await toResult(
    menuList({ currPage: 1, pageSize: 2000, openStatus: 1, mediumTypeList: [0, ...mediumTypeList.map(l => (+l + 1))] })); // 菜单数据和 首页配置 终端枚举不一致
  if(err || !data?.list) {
    return {list: [], originList: []}
  }
  return {
    list: data.list.filter(it => it.menuPage - 1 === 0).map(it =>
      ({label: it.menuName, value: it.menuCode})
    ), // fix: 菜单列表
    originList: data.list
  }
}
