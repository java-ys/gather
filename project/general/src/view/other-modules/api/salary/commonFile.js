import axios from "axios";
import { uploadUrl} from "@/js/envConstant";

// 获取视频在线播放地址（有转码需求的场景使用）


// 文件服务
// http://wiki.m2cn.com:8090/pages/viewpage.action?pageId=2699704#id-%E6%96%87%E4%BB%B6%E6%9C%8D%E5%8A%A1%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E-%E5%8D%81%E4%B8%80%E3%80%81%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%E6%96%87%E4%BB%B6
// 文件服务各环境
// http://wiki.m2cn.com:8090/pages/viewpage.action?pageId=3774402

// const host = window.location.host;
let baseUrl = uploadUrl;
// switch (host) {
//   case "172.16.19.201:8080": // local环境
//     baseUrl = "https://uploadlocal.m2cn.vip:4443";
//     break;
//   case "172.16.1.33": // 开发环境
//     baseUrl = "https://uploaddev.m2cn.cn:11443";
//     break;
//   case "172.16.28.115": // TMP新测试环境
//     baseUrl = "https://uploadcmpt.m2cn.cn:12443";
//     break;
//   // case "172.16.107.45:8080":
//   //   apiUrl = "http://172.16.107.57:20904"; // 兼容环境
//   //   uploadUrl = "https://uploadcmpt.m2cn.cn:12443";
//   //   break
//   case "172.16.24.44": // 测试环境
//     baseUrl = "https://uploadtest.m2cn.cn";
//     break;
//   // case "172.16.19.87:8080":
//   //   apiUrl = "http://172.16.19.71:20904" // 安全测试环境
//   //   break
//   case "172.16.2.209": // 热修复环境
//     baseUrl = "https://uploadhotfix.m2cn.cn";
//     break;
//   case "172.16.4.252": // UAT环境
//     baseUrl = "https://uploaduat.m2cn.cn";
//     break;
//   case "172.16.27.129": // KEA环境
//     baseUrl = "https://uploadkae.m2cn.cn:1443";
//     break;
//   case "172.16.50.130":
//     baseUrl = "http://172.16.50.134:20904"; // 压测环境
//     break;
//   // case "172.16.19.201:8080":
//   //   apiUrl = "http://172.16.0.211:20904" // 等保环境
//   //   break
//   case "10.0.2.149": // 生产环境
//     baseUrl = "https://upload.m2cn.cn";
//     break;
//   default:
//     // 生产环境
//     baseUrl = "https://upload.m2cn.cn";
//   // baseUrl = "https://uploaddev.m2cn.cn:11443"
// }

export const getFileInfo = (params = {}, header = {}) => {
  const fileService = axios.create({
    baseURL: baseUrl,
    timeout: 30000,
    headers: {
      "content-type": "multipart/form-data",
      ...header
    }
  });
  let formData = new FormData();
  Object.keys(params).forEach(k => {
    formData.append(k, params[k])
  })

  // service.defaults.baseURL = apiUrl + "/m2-driver-resume-web";
  return new Promise((resolve, reject) => {
    fileService
      .post("/file/view/media", formData)
      .then(response => {
        resolve(response);
      })
      .catch(error => reject(error));
  });
};
