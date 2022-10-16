import axios from "./apiCustomer.request";

// 根据城市获取权限内对应-运营商列表
// cityCode-String-根据城市查询
export const getAgentByCityAuth = data => {
  // 和产品确认（陈熙芬），因机构涉及到城市查询会有问题，暂时以岗位配置的城市为维度限制
  if (!data.authDimension) data.authDimension = 1
  return axios.request({
    url: "/common/getAuthAgentByCity",
    data,
    method: "post"
  })
}

//
/**
 * 获取权限内对应业务线的已配置/已开启-----省市级联列表(m2-admin，不包含企业用车)
 * data入参,下面两个为必填字段
 * @param {Number} areaType 1-已配置城市（包括城市列表中的启用和停用城市） 2-已开通城市（城市列表中的启用城市）
 * @param {Array} businessLineList 产品线枚举值列表，必填[1,2,4]比传
 *        TAXI(1, "出租车"),
 *        SPECIAL_CAR(2, "专享"),
 *        CROSS_CITY(3, "跨城"),
 *        EXPRESS_TRAIN(4, "快享"),
 *        PICK_RIDE(5,"顺风车"),
 *        CHARTERED_CAR(8, "包车")
 * @param {Array} authDimension  权限维度（1-城市，2-城市+机构）,必填
 */
export const getAppointedProvinceCityInAuth = data => {
  if (!data.businessLineList || data.businessLineList.length === 0) {
    data.businessLineList = [1, 2, 4, 6, 7] // 211129--默认add惠享和自动驾驶
  }
  // 和产品确认（陈熙芬），因机构涉及到城市查询会有问题，暂时以岗位配置的城市为维度限制
  if (!data.authDimension) data.authDimension = 1
  return axios.request({
    url: "/common/getAppointedProvinceCityInAuth",
    data,
    method: "post"
  });
};
