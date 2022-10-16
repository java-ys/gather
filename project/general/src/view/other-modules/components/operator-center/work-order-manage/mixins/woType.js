/*
 * @Author: NapierPLUS
 * @Date: 2021-11-24 10:53:33
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-11-24 14:44:07
 * @Description: 仅工单分类使用，时间有限仅简单抽离
 */
const APPID = "520315b4d7524001a27a3bde5d052c51";
import {
  getWoTypeList
} from "_o/api/work-order/common.js";
// 520315b4d7524001a27a3bde5d052c51
export default {
  data() {
    return {
      maxlevel:3, //最大层级
      APPID,
      inputIndex:1,
      inputListKEY:'inputList'
    };
  },
  methods: {
    // 格式化级联数据
    formatCascader(list, isAll = true, level=1) {
      let resData = []
      list.forEach(item => {
        let obj = {
          ...item,
          value:item.uuid,
          label:item.name,
          children: []
        }
        level<this.maxlevel && ( obj.loading = false )
        resData.push(obj)
      });
      return resData
    },
    // 级联懒加载
    loadData(item, callback = ()=>{}, isRoot) {
      let params = {
        APPID: this.APPID
      };
      if (isRoot) {
        params = {
          ...params,
          level: 0
        };
      } else {
        item.loading = true;
        params = {
          ...params,
          level: item.classLevel + 1,
          parentUuid: item.value
        };
      }
      getWoTypeList(params).then(res => {
        let data = res.data.data || [];
        if (isRoot) {
          this[this.inputListKEY][this.inputIndex].cascaderList = this.formatCascader(data, true, 1)
        } else {
          if (data.length > 0) {
            item.children = this.formatCascader(data, true, item.classLevel + 1);
            item.loading = false;
            callback();
          } else {
            item.loading = false;
            delete item.loading;
            callback();
          }
        }
      });
    }
  },
};
