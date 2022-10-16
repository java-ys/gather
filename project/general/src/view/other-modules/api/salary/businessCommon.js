import { getAllDriverType } from "_o/api/salary/driver";
import { toResult } from "_o/common/salaryMixin";

const _Driver_List_Key_ = "_all_driver_type";

const serialize = data => JSON.stringify(data);
const unserialize = data => (data == null ? data : JSON.parse(data));
export const storeGet = k => {
  return unserialize(localStorage.getItem(String(k)));
};
export const storeSet = (k, v) => {
  localStorage.setItem(String(k), serialize(v));
};
// 司机类型
export const getAllDriverTypeList = async () => {
  if (!storeGet(_Driver_List_Key_)) {
    const [err, data] = await toResult(getAllDriverType({}));
    let res = { err, data };
    storeSet("_all_driver_type", res);
    return res;
  }
  return storeGet(_Driver_List_Key_);
};

export const clearAllDriverTypeList = () => {
  storeSet(_Driver_List_Key_, null);
};

// 运营模式
export const operateModelList = [
  { label: "A模式", value: "1" },
  { label: "UP模式", value: "2" }
];


export const allNations = [
  "汉",
  "蒙古",
  "回",
  "藏",
  "维吾尔",
  "苗",
  "彝",
  "壮",
  "布依",
  "朝鲜",
  "满",
  "侗",
  "瑶",
  "白",
  "土家",
  "哈尼",
  "哈萨克",
  "傣",
  "黎",
  "傈僳",
  "佤",
  "畲",
  "高山",
  "拉祜",
  "水",
  "东乡",
  "纳西",
  "景颇",
  "柯尔克孜",
  "土",
  "达斡尔",
  "仫佬",
  "羌",
  "布朗",
  "撒拉",
  "毛南",
  "仡佬",
  "锡伯",
  "阿昌",
  "普米",
  "塔吉克",
  "怒",
  "乌孜别克",
  "俄罗斯",
  "鄂温克",
  "德昂",
  "保安",
  "裕固",
  "京",
  "塔塔尔",
  "独龙",
  "鄂伦春",
  "赫哲",
  "门巴",
  "珞巴",
  "基诺"
]
