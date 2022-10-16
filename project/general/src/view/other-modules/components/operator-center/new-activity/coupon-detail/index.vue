<template>
    <div>
      <ul class="coupon-list">
        <li v-for="(item,index) in listData">
          <Form>
            <div class="coupon-item">
              <!-- 左侧图片优惠券 -->
              <div class="coupon-left" >
                <div class="small-left" v-if="item.templateType == '1'">
                  <p class="fontsize18" style="color:#2D8cF0">
                    {{ item.discount }}折
                  </p>
                  <p>最高抵扣 {{ item.highestMoney }} 元</p>
                </div>
                <div  class="small-left" v-else>
                  <p class="fontsize18" style="color:#2D8cF0">
                    {{ item.couponMoney }}元
                  </p>
                  <p v-if="item.needCondition">
                    满 {{ item.conditionMoney }} 元可用
                  </p>
                 <p v-else>
                    不限门槛
                  </p>
                </div>
                <div class="small-right" >
                  <span v-if="item.templateType == '1'" class="coupon-icon"
                    >折扣券</span
                  >
                  <span v-else class="coupon-icon">抵扣券</span>
				          <p v-if="!item.nameInput" class="coupon-name">
                     {{ item.templateName }}
                  </p>
                </div>
              </div>
              <!-- 右侧填写内容 -->
              <div class="coupon-right">
                <!-- 每次奖励券张数 -->
                <FormItem
                  label="每次奖励券张数："
                >
                  <span>{{ item.perRewardNum }}</span>
               
                </FormItem>
                <!-- 发放总额度select -->
                <FormItem label="发放总额度：" >
                  <span v-if="item.templateQuotaType === 1">
                    {{ item.totalRewardAmount }}
                  </span>
                   <span v-else>不限额度</span>
                </FormItem>
                <!--  发券总张数-->
                <FormItem label="发券总张数：">
                  <span>{{item.templateQuotaType === 2? "不限": Math.floor( item.totalRewardAmount /(item.templateType === 1? item.highestMoney: item.couponMoney))}}</span>
                </FormItem>
                <!-- 券有效期 -->
                <FormItem label="券有效期：">
                  <span  v-if="item.validityType === 1">
                      {{ item.validityBeginTime + '-' + item.validityEndTime }}
                  </span>
                  <span v-else>  {{ item.effectiveDays }}天有效 </span>
                </FormItem>
                <!-- <FormItem
                  v-if="item.validityType === 1"
                  label="固定期限："
                  prop="guding"
                >
                    {{ item.validityBeginTime + '-' + item.validityEndTime }}
                </FormItem>

                <FormItem
                v-else
                  label="动态有效期："
                  prop="effectiveDays"
                  
                >
                   {{ item.effectiveDays }}天
                </FormItem> -->
                <FormItem  label="使用城市：" prop="useCityArray">
                  <span>
                    {{ item.useCityName }}
                  </span>
                </FormItem>
                <!-- 使用时段 -->
                <FormItem label="使用时段：" prop="freeShardLimitTime">
                  <span v-if="item.freeShardLimitTime === 1">
                    {{ item.timeSlot }}
                  </span>
                  <span v-else>不限时段</span>
                </FormItem>
                <!-- 限定时段-选择 -->
                <FormItem>
                </FormItem>
                <div style="display:inline-block">
                  <FormItem label="券模板名称：">
                    <span>{{ item.templateName }}</span>
                  </FormItem>
                  <FormItem label="券模板编码：">
                   <span>{{ item.templateCzode }}</span>
                  </FormItem>
                  <FormItem label="业务线：">
                    <span
                      v-for="(val, index) in item.businessTypeList"
                      :key="val"
                      >{{ val }}
                      {{  
                        index == item.businessTypeList.length - 1 ? "" : "/"
                      }}</span
                    >
                  </FormItem>
                  <FormItem label="订单类型：">
                    <span v-for="(val, index) in item.userLimitList" :key="val"
                      >{{ val }}
                      {{
                        index == item.userLimitList.length - 1 ? "" : "/"
                      }}</span
                    >
                  </FormItem>
                  <FormItem label="车型等级：" style="margin-left: 10px">
                    <span v-if="item.carTypeList.length">
                      <span  v-for="(val,index) in item.carTypeList"
                        :key="index">
                        {{val}}
                        {{index == item.carTypeList.length - 1 ? "" : "/"}}
                      </span>
                    </span>
                    <span v-else>暂无</span>
                  </FormItem>
                </div>
              </div>
            </div>
            <!-- 限定区域 -->
          </Form>
        </li>
      </ul>
      
    </div>
</template>
<script>
export default {
    props:{
      listData: {
        type: Array,
        default: []
      }
    },
    data() {
        return {
         
        }
    }
}
</script>
<style lang="less" scoped src="../activity.less"></style>
<style lang="less" scoped>
// 选择优惠券弹窗
.coupon-modal {
  /deep/ .ivu-modal {
    min-width: 1000px;
  }
}
.title {
  line-height: 30px;
  font-size: 14px;
}
.choose-coupon {
  margin-bottom: 20px;
}
.coupon-box {
  width: 100%;
  max-width: 1430px;
  height: 150px;
  padding: 20px 15px;
  border: 1px solid #cccdd1;
  border-radius: 3px;
  img {
    height: 100%;
    cursor: pointer;
  }
}
.edit-btn {
  font-size: 12px;
  color: #2d8cf0;
  float: right;
  margin-right: 10px;
}
.tip-icon {
  color: #aaa;
  font-size: 10px;
}
</style>
