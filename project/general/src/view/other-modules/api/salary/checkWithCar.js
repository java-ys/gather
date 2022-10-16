import base from "./base"

import { uploadUrl } from "@/js/envConstant";
import axios from "axios";
import { getToken } from "./common";
import { MessageBox } from "element-ui";

// 带车加盟司机审核列表
export const getCheckList = (params) => {
  return base.mainRequest("/api/v1/driver/withCardAudit/list", params);
};
// 带车加盟司机审核列表
export const getMyApprovingList = (params) => {
  return base.mainRequest("/api/v1/driver/withCardAudit/myApprovingList", params);
};
// 批量分配
export const batchAssign = (params) => {
  return base.mainRequest("/api/v1/driver/withCardAudit/batchAssign", params);
};
// 批量取消分配
export const batchCancelAssign = (params) => {
  return base.mainRequest("/api/v1/driver/withCardAudit/batchCancelAssign", params);
};
// 审核人查询
export const queryAssigner = (params) => {
  return base.mainRequest("/api/v1/driver/withCardAudit/queryAssigner", params);
};
// 淘汰
export const toEliminate = (params) => {
  return base.mainRequest("/api/v1/driver/withCardAudit/eliminate/submit", params);
};
// 日志
export const getLog = (params) => {
  return base.mainRequest("/api/driver/logCommon/queryLog", params);
};
// 司机列表日志
export const getQueryLogV2 = (params) => {
  return base.mainRequest("/api/driver/logCommon/queryLogV2", params);
};
// 获取品牌列表
export const brandQuery = (params) => {
  return base.mainRequest("/api/v1/common/wthCarBrandQuery", params);
}
// 获取车辆颜色列表
export const colorQuery = (params) => {
  return base.mainRequest("/api/v1/common/wthCarColorQuery", params);
}
// 根据品牌查询车系
export const seriesQuery = (params) => {
  return base.mainRequest("/api/v1/common/wthCarSeriesQuery", params);
}
// 根据车系查询车型
export const levelQuery = (params) => {
  return base.mainRequest("/api/v1/common/wthCarLevelQuery", params);
}
// 上传(新)
export const uploadImg = (params) => {
  return base.imageRequest("/api/driver/upload/uploadImg", params);
};

// 上传(正脸)
export const uploadImgFace = (params) => {
  return base.imageRequest("/api/v1/driver/resume/uploadIdentityCard", params);
};
// 带车加盟司机导入
export const importApi = (params) => {
  return base.mainRequest("/api/v1/driver/withCardAudit/import", params);
};

export const uploadZip = async (formData = {}) => {
  let { data } = await getToken({})
  if (!data || !data.success || !data.data) {
    return MessageBox.alert("上传失败！");
  }
  const fileService = axios.create({
    baseURL: uploadUrl,
    timeout: 30000,
    headers: {
      "content-type": "multipart/form-data",
      "token": data.data
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
      .post("/file/upload/zip", formData)
      .then(response => {
        resolve(response);
      })
      .catch(error => reject(error));
  });
};
// 添加zip解压任务
export const addZipTask = (params) => {
  return base.mainRequest("/api/v1/driver/task/addZipTask", params);
}

// 查看zip解压任务详情
export const queryZipTask = (params) => {
  return base.mainRequest("/api/v1/driver/task/queryZipTask", params);
}

// 批量导出
// export const batchExport = (params) => {
//   params = base.filterNonsense(params, ["cityCode"])
//   params = base.filterEmpty(params)
//   return base.exportRequest('/api/driver/reinstated/batchExport', params);
// };
// 批量审核通过
// export const batchReview = (params) => {
//   return base.mainRequest('/api/driver/reinstated/batchReview', params);
// };

// 审核接口
export const auditCheck = (params) => {
  return base.mainRequest("/api/v1/driver/withCardAudit/audit", params);
};
//
// 删除车架号活着车牌号接口
export const deleteCarInfo = (params) => {
  return base.mainRequest("api/v1/driver/withCardAudit/car/delete", params);
};
// ocr识别接口
export const ocrApi = (params) => {
  return base.mainRequest("/api/v1/driver/withCardAudit/get/ocrInfo", params);
};
//
// //审核不通过
// export const rejectReview = (params) => {
//   return base.mainRequest('/api/driver/reinstated/reject', params);
// };

// 审核详情
export const auditDetail = (params) => {
  return base.mainRequest("/api/v1/driver/withCardAudit/detail", params);
};
// 审核详情
export const auditSave = (params) => {
  return base.mainRequest("/api/v1/driver/withCardAudit/edit", params);
};

// 日志
// export const getLog = (params) => {
//   return base.mainRequest('/api/driver/reinstated/log', params);
// };

// 导出
export const withCardAuditExport = (params) => {
  return base.exportRequest("/api/v1/driver/withCardAudit/export", params);
};
