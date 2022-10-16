//
export const npsPreviewUrl = () => {
  let url = "https://wxpubliccqdev.m2cn.cn"; // 默认开发环境
  if (window.location.host === "10.3.64.188") { // 开发环境
    // local环境
    url = "https://wxpubliccqdev.m2cn.cn";
  } else if (window.location.host === "10.3.97.249") {
    // 测试环境
    url = "https://wxpubliccqtest.m2cn.cn";
  } else if (window.location.host === "172.16.2.209") {
    // 热修复环境
    url = "https://wxpublichotfix.m2cn.cn";
  } else if (window.location.host === "10.0.2.149") {
    // 生产环境
    url = "http://static.m2cn.cn";
  } else {
    // 找不到对应域名，默认dev环境请求地址
    url = "https://wxpubliccqdev.m2cn.cn";
    console.log("没有找到对应的H5地址预览 配置可能不匹配，暂定为默认开发环境：https://wxpubliccqdev.m2cn.cn");
  }
  return { url };
};
