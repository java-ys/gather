import { Time } from "iview"

const woTitleData = [
  {
    value: '安全事件安全事件',
    children: [
      {
        value: '交通事故',
        children: [
          { value: '死亡1人' },
          { value: '死亡2人（含）以上' },
          { value: '死亡3人及以上' },
          { value: '重伤/抢救治疗（ICU）' },
          { value: '轻伤/轻微伤（住院）' },
          { value: '轻伤/轻微伤（未住院）' },
          { value: '车损事故' }
        ]
      },
      {
        value: '暴力/冲突',
        children: [
          { value: '刑事亡人' },
          { value: '故意伤害致人重伤' },
          { value: '故意伤害致人轻伤/轻微伤（住院）' },
          { value: '故意伤害致人轻伤/轻微伤（就医未住院）' },
          { value: '故意伤害致人轻微伤或无伤（未就医）' },
          { value: '抢劫/放火/爆炸/投毒' },
          { value: '绑架/非法拘禁' },
          { value: '限制人身自由' },
          { value: '危害公共/国家安全类犯罪' },
          { value: '抢夺（未持械/未威胁）' },
          { value: '妨碍公务' },
          { value: '寻衅滋事' },
          { value: '肇事逃逸' },
          { value: '扰乱公共秩序/阻碍执行职务' },
          { value: '盗窃/诈骗/敲诈/侵占' },
          { value: '携带危险/违禁物品' },
          { value: '无证/伪造证件被抓' },
          { value: '司机订单外其他违法犯罪' },
          { value: '敏感性失联（未成年/女性/携贵重物品/人车同时）' },
          { value: '普通失联' },
          { value: '吸食/贩卖/运输/非法持有毒品' },
          { value: '疑似吸食/贩卖/运输/非法持有毒品' },
          { value: '酒驾/毒驾' },
          { value: '疑似酒驾/毒驾' },
          { value: '已实施自残自杀' },
          { value: '扬言采取伤害行为' },
          { value: '车辆资产失联/失控' },
          { value: '故意损坏财物' },
          { value: '信息泄露' },
          { value: '超载' },
          { value: '扰乱平台经营秩序' },
          { value: '言语纠纷' },
          { value: '醉酒乘车失格' }
        ]
      },
      {
        value: '涉性',
        children: [
          { value: '强奸' },
          { value: '强制猥亵' },
          { value: '一般猥亵' },
          { value: '暴露手淫' },
          { value: '渉性肢体触碰（非性敏感区）' },
          { value: '尾随跟踪' },
          { value: '涉性言语' },
          { value: '信息骚扰' },
          { value: '泄露私密照片' },
          { value: '疑似迷药' }
        ]
      },
      {
        value: '突发疾病/意外受伤',
        children: [
          { value: '司机平台车内意外死亡' },
          { value: '司机平台车内突发疾病/意外受伤（住院/ICU）' },
          { value: '司机平台车内突发疾病/意外受伤（未就医/未住院）' },
          { value: '司机平台车外意外死亡' },
          { value: '司机平台车外突发疾病/意外受伤（住院/ICU）' },
          { value: '司机平台车外突发疾病/意外受伤（未住院）' },
          { value: '乘客订单内意外死亡' },
          { value: '乘客订单内突发疾病/意外受伤（住院/ICU）' },
          { value: '乘客订单内突发疾病/意外受伤（未就医）' },
          { value: '乘客订单外死亡' },
          { value: '疑似迷药' },
          { value: '乘客订单外突发疾病/意外受伤（所有）' }
        ]
      },
      {
        value: '群体性事件',
        children: [
          { value: '政府上访' },
          { value: '聚众游行' },
          { value: '总部/分公司上访' },
          { value: '扬言聚众上访' },
          { value: '扬言集体罢工' }
        ]
      },
      {
        value: '自然灾害',
        children: [
          { value: '死亡1人' },
          { value: '死亡2人(含)以上' },
          { value: '死亡3人及以上' },
          { value: '重伤、抢救治疗(ICU)' },
          { value: '轻伤、轻微伤（住院）' },
          { value: '轻伤、轻微伤（未住院）' },
          { value: '车损事件' }
        ]
      },
      {
        value: '社会安全',
        children: [
          { value: '死亡1人' },
          { value: '死亡2人(含)以上' },
          { value: '死亡3人及以上' },
          { value: '重伤、抢救治疗(ICU)' },
          { value: '轻伤、轻微伤（住院）' },
          { value: '轻伤、轻微伤（未住院）' },
          { value: '车损事件' }
        ]
      },
      {
        value: '事故灾难',
        children: [
          { value: '死亡1人' },
          { value: '死亡2人(含)以上' },
          { value: '死亡3人及以上' },
          { value: '重伤、抢救治疗(ICU)' },
          { value: '轻伤、轻微伤（住院）' },
          { value: '轻伤、轻微伤（未住院）' },
          { value: '车损事件' }
        ]
      },
      {
        value: '公共卫生',
        children: [
          { value: '死亡1人' },
          { value: '死亡2人(含)以上' },
          { value: '死亡3人及以上' },
          { value: '2人及以上感染甲/乙类传染病' },
          { value: '甲/乙类传染病确诊' },
          { value: '甲/乙类传染病隔离或就医' },
          { value: '疑似甲/乙类传染病症状' },
        ]
      },
    ]
  },
  {
    value: '非安全事件',
    children: [
      { value: '一般服务纠纷' },
      { value: '警察来电调取信息' },
      { value: '测试' },
      { value: '恶意触碰' },
      { value: '硬件故障' },
      { value: '车辆维修' },
      {
        value: '误碰',
        children: [
          { value: '儿童误碰' },
          { value: '调整座椅' },
          { value: '司机不清楚产品功能' },
        ]
      },
      { value: '公车私用' },
      { value: '误抓取' },
      { value: '其它' }
    ]
  }
]
function formatData(list){
  list.forEach(item=>{
    item.label = item.value
    if(item.children){
      formatData(item.children)
    }
  })
}
formatData(woTitleData)
export const woTitleList = woTitleData