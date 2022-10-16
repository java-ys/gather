import request4Driver from "_g/config/api4Driver";
import axiosManager from "_g/config/safe-api.request";
import axios from "_g/config/api.request";


// 获取下载文件的token
export const getDownloadToken = (data = {}) => {
  return request4Driver.request({
    url: "/api/common/service/getDownloadToken",
    data,
    method: "POST"
  });
};

// 获取下载文件的token
export const getFileToken = (data = {}) => {
  return axios.request({
    url: "/api/oss/token/get",
    data,
    method: "POST"
  });
};



