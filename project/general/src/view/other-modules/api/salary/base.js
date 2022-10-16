import axios from "axios";
import Cookies from "js-cookie"
import {
  filters
} from "_o/common/common";
import config from "@/config/config";
import { isDev } from "@/micro/registerApp/appEntry";
import { getToken } from "@/libs/util";

const CancelToken = axios.CancelToken;
const apiUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro
let cancel;
const header = {
  grayVersion: "W_offer_709"
};

const service = axios.create({
  baseURL: apiUrl + "/m2-driver-resume-web",
  timeout: 30000,
  headers: {
    "content-type": "application/json;charset=utf-8",
    ...header
  },
  withCredentials: false
});

const authService = axios.create({
  baseURL: apiUrl + "/m2-driver-resume-web",
  timeout: 30000,
  headers: {
    "content-type": "application/json;charset=utf-8",
    ...header
  },
  withCredentials: false
});
const authInfoService = axios.create({
  baseURL: apiUrl + "/auth-api",
  timeout: 30000,
  headers: {
    "content-type": "application/json;charset=utf-8",
    ...header
  },
  withCredentials: false
});
const mainService = axios.create({
  baseURL: apiUrl + "/m2-driver-resume-web",
  timeout: 30000,
  headers: {
    "content-type": "application/json;charset=utf-8",
    ...header
  },
  withCredentials: false
});

const exportService = axios.create({
  baseURL: apiUrl + "/m2-driver-resume-web",
  timeout: 120000,
  headers: {
    "content-type": "application/json;charset=utf-8",
    ...header
  },
  responseType: "blob",
  withCredentials: false
});

const adminService = axios.create({
  baseURL: apiUrl + "/m2-admin",
  timeout: 120000,
  headers: {
    "content-type": "application/json;charset=utf-8",
    ...header
  },
  responseType: "blob",
  withCredentials: false
});

const photoService = axios.create({
  baseURL: "//127.0.0.1:38088",
  headers: {
    "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    ...header
  }
});

// 添加请求拦截器
service.interceptors.request.use(
  config => {
    config.headers["Authorization"] = authorizationSetter(config.url);
    // 如果token过期并未返回刷新后的token，此flag = 1，中断该次请求
    if (
      Cookies.get("m2-driver-resume-token-expired") &&
      Cookies.get("m2-driver-resume-token-expired") === 1
    ) {
      console.log("前一个请求已过期，先刷新token");
      cancel();
    } else if (
      Cookies.get("m2-driver-resume-needReLogin") &&
      Cookies.get("m2-driver-resume-needReLogin") === 1
    ) {
      console.log("需要重新登录，掐断后续请求");
      cancel();
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);// 添加请求拦截器
mainService.interceptors.request.use(
  config => {
    config.headers["Authorization"] = authorizationSetter(config.url);
    // 如果token过期并未返回刷新后的token，此flag = 1，中断该次请求
    if (
      Cookies.get("m2-driver-resume-token-expired") &&
      Cookies.get("m2-driver-resume-token-expired") === 1
    ) {
      console.log("前一个请求已过期，先刷新token");
      cancel();
    } else if (
      Cookies.get("m2-driver-resume-needReLogin") &&
      Cookies.get("m2-driver-resume-needReLogin") === 1
    ) {
      console.log("需要重新登录，掐断后续请求");
      cancel();
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// 添加请求拦截器
adminService.interceptors.request.use(
  config => {
    config.headers["Authorization"] = authorizationSetter(config.url);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// 添加请求拦截器
authInfoService.interceptors.request.use(
  config => {
    config.headers["Authorization"] = authorizationSetter(config.url);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

authService.interceptors.request.use(
  config => {
    config.headers["Authorization"] = authorizationSetter(config.url);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

exportService.interceptors.request.use(
  config => {
    config.headers["Authorization"] = authorizationSetter(config.url);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    // if (response.data.code == 4012) {
    //   // handleExpired();
    //   console.log(
    //     "~~~~~~4012过期, 此时的缓存过期旗帜: %o",
    //     Cookies.get("m2-driver-resume-token-expired")
    //   );
    //   // 如果过期，设置缓存过期旗帜，用于判断未成功刷新缓存前的后续请求是否继续发送
    //   // 旗帜为0的情况，说明前边的刷新token请求已成功，无需再进行刷新token处理
    //   // if (
    //   //   !webStorageCache.get("m2-driver-resume-token-expired") ||
    //   //   (webStorageCache.get("m2-driver-resume-token-expired") &&
    //   //     webStorageCache.get("m2-driver-resume-token-expired") != 0)
    //   // ) {
    //   //   webStorageCache.set("m2-driver-resume-token-expired", 1);
    //   //   handleExpired();
    //   // }
    // }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

authService.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

exportService.interceptors.response.use(
  response => {
    // if (response.data.code == 4012) {
    //   handleExpired();
    // }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

// 主要请求方法
const mainRequest = (url, params) => {
  // service.defaults.baseURL = apiUrl + "/m2-driver-resume-web";
  // service.defaults.baseURL = "http://192.168.33.113:6007/";
  return new Promise((resolve, reject) => {
    mainService
      .post(url, params, {
        cancelToken: new CancelToken(function executor(c) {
          // executor 函数接收一个 cancel 函数作为参数
          cancel = c;
        })
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => reject(error));
  });
};
// admin的请求方法
const adminRequest = (url, params) => {
  // service.defaults.baseURL = apiUrl + "/m2-driver-resume-web";
  // service.defaults.baseURL = "http://192.168.33.113:6007/";
  return new Promise((resolve, reject) => {
    adminService
      .post(url, params, {
        // cancelToken: new CancelToken(function executor(c) {
        //   // executor 函数接收一个 cancel 函数作为参数
        //   cancel = c;
        // })
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => reject(error));
  });
};

// 薪酬请求方法
const salaryRequest = (url, params) => {
  service.defaults.baseURL = apiUrl + "/salary-web-api";
  // service.defaults.baseURL = "http://192.168.33.113:6007/";
  return new Promise((resolve, reject) => {
    service
      .post(url, params, {
        cancelToken: new CancelToken(function executor(c) {
          // executor 函数接收一个 cancel 函数作为参数
          cancel = c;
        })
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => reject(error));
  });
};

// 鉴权系统请求方法
const authRequest = (url, params, method) => {
  // 三户登录 -> 切换到新的api上
  return new Promise((resolve, reject) => {
    if (method === "DELETE") {
      authService
        .delete(url)
        .then(response => resolve(response))
        .catch(error => reject(error));
    } else {
      authService
        .post(url, params)
        .then(response => resolve(response))
        .catch(error => reject(error));
    }
  });
};

// 登录信息请求方法
const authInfoRequest = (url, params) => {
  // service.defaults.baseURL = apiUrl + "/auth-api";
  return new Promise((resolve, reject) => {
    authInfoService
      .post(url, params)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};

// 图片请求方法
const imageRequest = (url, params) => {
  service.defaults.baseURL = apiUrl + "/m2-driver-resume-web";
  return new Promise((resolve, reject) => {
    service
      .post(url, params)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};

// 导出请求方法
const exportRequest = (url, params) => {
  exportService.defaults.baseURL = apiUrl + "/m2-driver-resume-web";
  // exportService.defaults.baseURL = "http://192.168.33.116:6007/";
  return new Promise((resolve, reject) => {
    exportService
      .post(url, params)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};

// 风控导出请求方法
const riskExportRequest = (url, params) => {
  exportService.defaults.baseURL = apiUrl + "/salary-web-api";
  return new Promise((resolve, reject) => {
    exportService
      .post(url, params)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};

// 薪酬导出请求方法
const salaryExportRequest = (url, params) => {
  exportService.defaults.baseURL = apiUrl + "/salary-web-api";
  return new Promise((resolve, reject) => {
    exportService
      .post(url, params)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};

// 本地高拍仪服务请求方法
const photoServiceRequest = (url, params) => {
  return new Promise((resolve, reject) => {
    photoService
      .post(url, params)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};

// 设置鉴权header值
const authorizationSetter = url => {
  // 不是登录或者获取秘钥的请求，并且能从浏览器缓存拿到accessToken时的设置
  // 刷新去掉了。
  if (
    url.indexOf("/api/login/login") === -1 &&
    // url.indexOf("/oauth/refresh/token") === -1 &&
    url.indexOf("/api/login/random/key") === -1 &&
    getToken()
  ) {
    return getToken()
  }
  // 基础鉴权header值
  else {
    return "Basic ZHJpdmVyLW1hbmFnZXI6cTM0T1FKQjlkNmpvTmZBTg==";
    // return 'Basic ZHJpdmVyLW1hbmFnZXI6cTM0T1FKQjlkNmpvTmZBTg==';
  }
};

export default {
  mainRequest: mainRequest,
  adminRequest: adminRequest,
  authRequest: authRequest,
  authInfoRequest: authInfoRequest,
  imageRequest: imageRequest,
  photoServiceRequest: photoServiceRequest,
  exportRequest: exportRequest,
  salaryRequest: salaryRequest,
  riskExportRequest: riskExportRequest,
  salaryExportRequest: salaryExportRequest,
  ...filters
};
