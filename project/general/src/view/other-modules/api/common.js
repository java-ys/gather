import axiosBase from '_g/config/api.request';
import axios from "axios";
import Vue from "vue";

function pf (url) {
  return params => {
    return axiosBase.request ({
      url,
      method: 'post',
      data: params,
    });
  };
}

//-------------------------------------------------------------------------------------------
//---------------------------------------oss 改造------------------------------------------
//-------------------------------------------------------------------------------------------

/*
根据uuid获取文件的地址url
入参:
{
  "uuid": "sdfsdgdfhf" // 文件的uuid，上传文件后，会返回给前端，前端使用改uuid，获取文件url，必填
}
返回:
{
  "msg": "成功",
  "code": 200,
  "data": "http://sdsfddsfds", // url地址
  "success": true,
  "errCode": 200
}
*/
export const ossUrlGet = pf ('/api/oss/url/get');

/*
入参
{
  "uuid": "sdfsdgdfhf" // 文件的uuid，上传文件后，会返回给前端，前端使用改uuid，获取文件url，必填
}
返回 文件流
*/
// export const ossDownload = pf ('/api/oss/download');

// 获取token
export const ossTokenGet = pf ('/api/oss/token/get');


// export const getFileUrl = async (params) => {
//   let t = await ossTokenGet({})
//   if(!t.data.success || !t.data.data) return
//   return new Promise((resolve, reject) => {
//     axios({
//       method: "post",
//       headers: {
//         token: t.data.data
//       },
//       data: params,
//       url: `${Vue.prototype._baseUrl}/api/oss/url/get`
//     }).then(r => {
//       resolve(r.data)
//     }).catch(e => {
//       reject(e)
//     });
//   })

// };