/** btn key--提交审核 */
import Vue from "vue";
import { getUserIdFromLocalStorage } from "_o/common/common";

/** btn key--提交审核 */
export const BTN_KEY__SUBMIT_AUDIT = "submitAudit";
/** btn key--取消审核 */
export const BTN_KEY__CANCEL_AUDIT = "cancelAudit";
/** btn key--审核 */
export const BTN_KEY__AUDIT = "audit";
/** btn key--编辑 */
export const BTN_KEY__EDIT = "edit";
/** btn key--停用 */
export const BTN_KEY__DEACTIVATE = "deactivate";
/** btn key--详情 */
export const BTN_KEY__VIEW = "view";
/** btn key--删除 */
export const BTN_KEY__DEL = "del";
/** btn key--日志 */
export const BTN_KEY__LOG = "log";

const PERMISSION__SUBMIT_AUDIT = "citySafeguard-submitAudit";
const PERMISSION__CANCEL_AUDIT = "citySafeguard-cancelAudit";
const PERMISSION__AUDIT = "citySafeguard-audit";
const PERMISSION__EDIT = "citySafeguard-edit";
const PERMISSION__DEACTIVATE = "citySafeguard-deactivate";
const PERMISSION__VIEW = "citySafeguard-view";
const PERMISSION__DEL = "citySafeguard-del";
const PERMISSION__LOG = "citySafeguard-log";

export const operationBtns = [{
  key: BTN_KEY__SUBMIT_AUDIT,
  text: "提交审核",
  permission: PERMISSION__SUBMIT_AUDIT,
  visibleFn: record => {
    const userId = getUserIdFromLocalStorage();
    return [0, 3].includes(record.ruleStatus) && userId === record.creatorUuid;
  },
},
//  {
//   key: BTN_KEY__CANCEL_AUDIT,
//   text: "取消审核",
//   permission: PERMISSION__CANCEL_AUDIT,
//   visibleFn: record => {
//     const userId = getUserIdFromLocalStorage();
//     return record.ruleStatus === 1 && userId === record.creatorUuid;
//   },
// }, {
//   key: BTN_KEY__AUDIT,
//   text: "审核",
//   permission: PERMISSION__AUDIT,
//   visibleFn: record => {
//     const userId = getUserIdFromLocalStorage();
//     return record.ruleStatus === 1 && userId === record.auditorUuid && record.auditNodeId === record.selectNodeId;
//   },
// },
 {
  key: BTN_KEY__EDIT,
  text: "编辑",
  permission: PERMISSION__EDIT,
  visibleFn: record => {
    const userId = getUserIdFromLocalStorage();
    return [0, 3].includes(record.ruleStatus) && userId === record.creatorUuid;
  },
}, {
  key: BTN_KEY__DEACTIVATE,
  text: "停用",
  permission: PERMISSION__DEACTIVATE,
  visibleFn: record => {
    const userId = getUserIdFromLocalStorage();
    return record.ruleStatus === 2 && new Date().getTime() <= new Date(record.validEndTime).getTime() && userId === record.creatorUuid;
  },
}, {
  key: BTN_KEY__VIEW,
  text: "详情",
  permission: PERMISSION__VIEW,
}, {
  key: BTN_KEY__DEL,
  text: "删除",
  permission: PERMISSION__DEL,
  visibleFn: record => {
    const userId = getUserIdFromLocalStorage();
    return [0, 3].includes(record.ruleStatus) && userId === record.creatorUuid;
  },
}, {
  key: BTN_KEY__LOG,
  text: "日志",
  permission: PERMISSION__LOG,
}];
