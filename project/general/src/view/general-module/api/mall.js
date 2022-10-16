/**
 * 商城API
 */
import axios from "_g/config/api4Mall.request.js";

// 商城数据字典
export const getMallDict = (data) => {
  return axios.request({
    url: "/api/mall/web/queryMallDictionary",
    method: "post",
    data
  });
};

// 商品管理列表
export const getCommodityManageList = (data) => {
  return axios.request({
    url: "/api/mall/web/spu/queryListPage",
    method: "post",
    data
  });
};
// 新增商品
export const addCommodity = (data) => {
  return axios.request({
    url: "/api/mall/web/spu/addProduct",
    method: "post",
    data
  });
};
// 编辑商品
export const editCommodity = (data) => {
  return axios.request({
    url: "/api/mall/web/spu/updateProduct",
    method: "post",
    data
  });
};
// 商品下架
export const changeCommodityStatus = (data) => {
  return axios.request({
    url: "/api/mall/web/spu/updateProductStatus",
    method: "post",
    data
  });
};
// 商品详情
export const detailCommodity = (data) => {
  return axios.request({
    url: "/api/mall/web/spu/getDetail",
    method: "post",
    data
  });
};

// 商品获取记录列表
export const getCommodityGetRecordList = (data) => {
  return axios.request({
    url: "/api/mall/order/list",
    method: "post",
    data
  })
}
