/**
 * 一些业务方法处理集合
 */

/**
 * 处理围栏类型是"限停围栏"的提交数据 (直接修改原始对象)
 *
 * @see http://wiki.m2cn.com:8090/pages/viewpage.action?pageId=51841745
 *
 * @desc 限停围栏去除产品线和车型配置 —— 车型不用传，产品线传5
 */
export const handleLimitStopRailTypeSubmitData = formData => {
  delete formData.carLevelList
  formData.serviceType = 5
}
