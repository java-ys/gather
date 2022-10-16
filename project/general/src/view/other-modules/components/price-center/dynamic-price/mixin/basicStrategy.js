// 兜底系数
import { deepCopy } from "@/libs/tools";
import { defaultInner } from "_o/components/price-center/dynamic-price/fields";

const default_strategy_total = 20
export default {
  data() {
    return {

    }
  },
  methods: {
    addDefaultStrategy(index, list) {
      if(list.length >= default_strategy_total) {
        this.$Message.error(`最多设置${default_strategy_total}条系数`)
        return
      }
      list.splice(index + 1, 0, deepCopy(defaultInner));
    },
    removeDefaultStrategy(index, list) {
      list.splice(index, 1);
    },
    // 校验不通过的情况下提示“XXXX-XX时段，兜底策略里程区间需完全覆盖0-9999且无重叠”
    checkDefaultStrategy(list) {
      if(!list?.length) return
      let result = true
      let msg = ""
      let [stList, edList] = [[], []]
      let len = list.length;
      for(let i = 0 ; i < len; i++) {
        let periodStart = list[i].period[0]
        let periodEnd = list[i].period[1]
        let subItem = list[i]?.defaultDiscountDetails
        let lenDefault = subItem?.length;
        if(lenDefault) {
          for(let j = 0; j < lenDefault; j ++) {
            [stList, edList] = [subItem.map(item => {
              return Number(item.startCapacity)
            }), subItem.map(item => {
              return Number(item.endCapacity)
            })]
          }
          const [bool, errorRowIndex] = this.checkDefaultMile(stList,edList)
          if(!bool) {
            msg = `${periodStart}-${periodEnd}时段，兜底策略里程区间${errorRowIndex}的范围错误`
            result = false
            break;
          }
          const [boolRange] = this.checkDefaultMileRange(subItem);
          if(!boolRange) {
            result = false
            msg = `${periodStart}-${periodEnd}时段，兜底策略里程区间需完全覆盖0-9999且无重叠`
            break;
          }
         }
      }
      if(msg) {
        this.$Message.error(msg)
      }
      return result
    },
    // 里程区间 前值小于后值
    checkDefaultMile(stList, edList) {
      let result = true;
      let i = 0;
      for (i = 0; i < stList.length; i++) {
        if (stList[i] >= edList[i]) {
          result = false
          break;
        }
      }
      return [result, i + 1]
    },
    // 里程区间不可重叠，需覆盖0-9999全里程，其中9999含9999及以上
    checkDefaultMileRange(list) {
      let result = true
      let rateList = list.map(item => {
        return [item.startCapacity, item.endCapacity]
      })
      let len = rateList.length;
      let sum = 0; // 里程范围和
      for(let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          // 里程有重叠
          if(this.numberIntersection(rateList[i], rateList[j])) {
            result = false
            break
          }
        }
        sum += rateList[i][1] - rateList[i][0]
      }
      if(result) {
        if(sum !== 9999) {
          result = false
        }
      }
      return [result]
    },
  }
}
