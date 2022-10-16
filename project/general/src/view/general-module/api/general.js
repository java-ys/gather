import { getAreaInfoByCityCode } from "_o/api/configData.js";
import { getOnLineCity, getProvinceCityList } from "_g/api/common.js";
import { getAgentList } from "_o/api/work-order/common.js";
import { getAgentByCity } from "_g/api/configData";

import { cpTranslate } from "@/libs/tools";
import { toResult } from "@/mixins/base";

//  根据城市code 获取区县
export const _getAreaInfoByCityCode = async cityCode => {
  let res = await getAreaInfoByCityCode({ cityCode });
  let list = [];
  let { data } = res;
  if (data.success) {
    list = data.data.map(it => ({
      label: it.orgName,
      value: it.orgCode
    }));
  }
  return {
    res,
    list
  };
};

// 获取已开通省、市级联列表
export const _getProvinceCityList = async (p = {}) => {
  let res = await getProvinceCityList(p);
  let { data } = res;
  let originData = [];
  let cityList = [];
  let provinceList = [];
  if (data.success) {
    originData = data.data;
    data.data.forEach(it => {
      cityList = cityList.concat(it.nodes).map(n => {
        n.label = n.city
        n.value = n.cityID
        return n
      })
      provinceList.push({ ...it, label: it.province, value: it.provinceID });
    });
  }
  return {
    res,
    cascaderList: cpTranslate(originData),
    cityList,
    provinceList
  };
};

// 所有运营商
export const _getAgentList = async (p = {}) => {
  let res = await getAgentList(p);
  let { data } = res;
  let list = [];
  if (data.success) {
    list = data.data;
  }
  return {
    res,
    list
  };
};

// 根据城市code 获取运营商
export const _getAgentByCityCode = async cityCode => {
  let res = await getAgentByCity({ cityCode });
  let { data } = res;
  let list = [];
  if (data.success) {
    list = data.data.map(d => ({
      label: d.name,
      value: d.uuid,
    }))
  }
  return { res, list };
};

// 获取已开城城市
export const _getOpenCity = async () => {
  const [err, data] = await toResult(getOnLineCity({}));
  if (err) {
    // this.$Message.error(err.message);
    return Promise.resolve({ data: [], list: [] });
  }
  let list = data.map((it) => ({
    label: it.city,
    value: it.cityId,
  }))
  return Promise.resolve({
    data,
    list
  });
}
