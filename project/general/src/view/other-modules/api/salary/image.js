import { uploadUrl} from "@/js/envConstant";

export const uploadPrivateImage = (formData = {}, header = {}) => {
  const fileService = axios.create({
    baseURL: uploadUrl,
    timeout: 30000,
    headers: {
      "content-type": "multipart/form-data",
      ...header
    }
  });
  // let formData = new FormData();
  // Object.keys(params).forEach(k => {
  //   formData.append(k, params[k])
  // })
  // service.defaults.baseURL = apiUrl + "/m2-driver-resume-web";

  // http://wiki.m2cn.com:8090/pages/viewpage.action?pageId=2699704
  return new Promise((resolve, reject) => {
    fileService
      .post("/file/upload/image/private", formData)
      .then(response => {
        resolve(response);
      })
      .catch(error => reject(error));
  });
};

