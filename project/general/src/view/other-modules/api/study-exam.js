import request4Driver from "_g/config/api4Driver";

function pf(url) {
  return params => {
    return request4Driver.request({
      url,
      method: "post",
      data: params
    });
  };
}

function firstUpperCase(str) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

function getUrlName(url = "") {
  let ar = url.split("/");
  let len = ar.length;
  return len > 1 ? `${ar[len - 2]}${firstUpperCase(ar[len - 1])}` : "";
}

const urlList = [
  // 考试接口
  "/api/exam/task/add",
  "/api/exam/task/detail",
  "/api/exam/task/edit",
  "/api/exam/task/enableOrDeactivate",
  "/api/exam/task/list",
  "/api/exam/task/export",
  "/api/exam/task/resultList",
  "/api/exam/task/resultDetail",
  "/api/exam/task/queryExamQuestions",
  "/api/exam/task/batch/list",
  // 试题接口
  "/api/exam/question/add",
  "/api/exam/question/categoryList",
  "/api/exam/question/edit",
  "/api/exam/question/import",
  "/api/exam/question/list",
  "/api/exam/question/randomList",
  // 学习接口
  "/api/exam/study/add",
  "/api/exam/study/detail",
  "/api/exam/study/edit",
  "/api/exam/study/enableOrDeactivate",
  "/api/exam/study/list",
  "/api/exam/study/recordList",
  "/api/exam/study/changeOnlineStatus",
  // 学习分类
  "/api/study/cata/query",
  // 配置接口
  "/api/v1/common/queryCitiesWithAgent",
  "/api/exam/study/queryStudyTaskList",
];
let _interface = {};

urlList.forEach(it => {
  let t = getUrlName(it);
  t && (_interface[t] = pf(it));
});

export default _interface;
