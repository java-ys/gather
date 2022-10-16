import routeAxios from "_g/config/api4Route.request";

// 查询预警系统详情
export const warnStrategyDetail = (data) => {
  return routeAxios.request({
    url: '/config/warnStrategy/detail',
    data,
    method: 'post'
  })
}

// 更新预警系统信息
export const warnStrategyUpdate = (data) => {
  return routeAxios.request({
    url: '/config/warnStrategy/update',
    data,
    method: 'post'
  })
}
