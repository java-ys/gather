<template>
  <div>
    <div class="common">
      <div class="shadow"></div>
      <div class="title">基本信息</div>
    </div>
    <div class="content">
      <!--      <div class="mr">-->
      <!--        <div class="title">任务类型:</div>-->
      <!--        <div class="detail">{{TASK_TYPE_ADD_MAP[dataSource.taskType]}}</div>-->
      <!--      </div>-->
      <div class="mr">
        <div class="title">司机姓名:</div>
        <div class="detail">{{dataSource.driverName}}</div>
      </div>
      <div class="mr">
        <div class="title">司机id:</div>
        <div class="detail">{{dataSource.driverId}}</div>
      </div>
      <div class="mr">
        <div class="title">手机号:</div>
        <div class="detail">{{dataSource.mobile}}</div>
      </div>
      <div class="mr">
        <div class="title">所属运营商:</div>
        <div class="detail">{{dataSource.agentName}}</div>
      </div>
      <div class="mr">
        <div class="title">司管姓名:</div>
        <div class="detail">{{dataSource.managerDriverName}}</div>
      </div>
      <div class="mr">
        <div class="title">司管手机号:</div>
        <div class="detail">{{dataSource.managerDriverMobile}}</div>
      </div>
    </div>
    <div class="common">
      <div class="shadow"></div>
      <div class="title">检核内容</div>
    </div>
    <div class="content">
      <div class="mr">
        <div class="title">任务名称:</div>
        <div class="detail">{{dataSource.taskName}}</div>
      </div>
      <div class="mr">
        <div class="title">任务接收时间:</div>
        <div class="detail">{{dataSource.receiveDate}}</div>
      </div>
      <div class="mr">
        <div class="title">任务执行时间:</div>
        <div class="detail">{{dataSource.operateTime}}</div>
      </div>
      <div class="mr">
        <div class="title">关联上线:</div>
        <div class="detail">
          {{dataSource.onlineRelation === 1 ? "是" : "否"}}
        </div>
      </div>
      <div
        v-for="(item, index) in dataSource.enclosureVoList"
        v-if="item.localtion != '自定义'"
        :key="index"
        class="mr"
      >
        <div class="title">{{item.localtion}}:</div>
        <div v-if="item.fileUrl" style="margin-top:10px;margin-bottom:20px">
          <lookImgVideo :defaultUrl="item.fileUrl" :fileType="item.fileType">
          </lookImgVideo>
        </div>
        <div v-else style="margin-top:10px;margin-bottom:20px">
          <img :src="noPic" alt="" height="90" />
        </div>
      </div>
    </div>
    <div v-if="dataSource.reviewVoList && dataSource.reviewVoList.length > 0">
      <div class="common">
        <div class="shadow"></div>
        <div class="title">审核内容</div>
      </div>
      <div class="content">
        <div class="mr">
          <div class="title">审核结果:</div>
          <div class="detail">
            {{dataSource.reviewVoList[0].reviewResult === "1" ? "违规" : (dataSource.reviewVoList[0].reviewResult === "2" ? "未违规" : "")}}
          </div>
        </div>
        <div class="mr">
          <div class="title">审核人:</div>
          <div class="detail">{{dataSource.reviewVoList[0].updaterName}}</div>
        </div>
        <div class="mr">
          <div class="title">违规级别:</div>
          <div class="detail">
            {{getViolationLevelStatusName(
              dataSource.reviewVoList[0].violationLevel
            )}}
          </div>
        </div>
        <div class="mr">
          <div class="title">违规处罚(元):</div>
          <div class="detail">{{dataSource.reviewVoList[0].finedMoney}}</div>
        </div>
        <div class="mr">
          <div class="title">说明:</div>
          <div class="detail">
            {{dataSource.reviewVoList[0].reviewDescribe}}
          </div>
        </div>
        <div class="mr">
          <div class="title">审核时间:</div>
          <div class="detail">{{dataSource.reviewVoList[0].updateTime}}</div>
        </div>
        <div class="mr">
          <div class="title">复核状态:</div>
          <div class="detail">{{reCheckMap[dataSource.reCheckStatus]}}</div>
        </div>
        <div class="mr">
          <div class="title">复核人:</div>
          <div class="detail">{{dataSource.reCheckPersonName}}</div>
        </div>
        <div class="mr">
          <div class="title">复核说明:</div>
          <div class="detail">{{dataSource.reCheckRemark}}</div>
        </div>
        <div class="mr">
          <div class="title">复核时间:</div>
          <div class="detail">{{dataSource.reCheckTime}}</div>
        </div>
      </div>
    </div>
    <div v-else-if="dataSource.reCheckPersonName && dataSource.reCheckTime && dataSource.reCheckStatus">
      <div class="common">
        <div class="shadow"></div>
        <div class="title">审核内容</div>
      </div>
      <div class="content">
        <div class="mr">
          <div class="title">复核状态:</div>
          <div class="detail">{{reCheckMap[dataSource.reCheckStatus]}}</div>
        </div>
        <div class="mr">
          <div class="title">复核人:</div>
          <div class="detail">{{dataSource.reCheckPersonName}}</div>
        </div>
        <div class="mr">
          <div class="title">复核说明:</div>
          <div class="detail">{{dataSource.reCheckRemark}}</div>
        </div>
        <div class="mr">
          <div class="title">复核时间:</div>
          <div class="detail">{{dataSource.reCheckTime}}</div>
        </div>
      </div>
    </div>

    <div v-if="dataSource.appealVoList && dataSource.appealVoList.length > 0">
      <div class="common">
        <div class="shadow"></div>
        <div class="title">申诉内容</div>
      </div>
      <div class="content">
        <div class="mr">
          <div class="title">申诉类型:</div>
          <div class="detail">
            {{dataSource.appealVoList[0].appealType === 1 ? "检核申诉" : ""}}
          </div>
        </div>
        <div class="mr">
          <div class="title">申诉原因:</div>
          <div class="detail">
            {{dataSource.appealVoList[0].appealDescribe}}
          </div>
        </div>
        <div class="mr">
          <div class="title">申诉时间:</div>
          <div class="detail">{{dataSource.appealVoList[0].updateTime}}</div>
        </div>
        <div class="mr">
          <div class="title">申诉结果:</div>
          <div class="detail">
            {{dataSource.appealVoList[0].appealResult === 2
              ? "申诉通过"
              : dataSource.appealVoList[0].appealResult === 3
                ? "申诉驳回"
                : ""}}
          </div>
        </div>
        <div class="mr">
          <div class="title">审核人:</div>
          <div class="detail">{{dataSource.appealVoList[0].updaterName}}</div>
        </div>
        <div class="mr">
          <div class="title">审核时间:</div>
          <div class="detail">{{dataSource.appealVoList[0].updateTime}}</div>
        </div>
        <div class="mr">
          <div class="title">
            {{dataSource.appealVoList[0].appealResult === 2
              ? "通过原因:"
              : dataSource.appealVoList[0].appealResult === 3
                ? "驳回原因:"
                : ""}}
          </div>
          <div class="detail">
            {{dataSource.appealVoList[0].appealRemark}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { driverCheckTaskDetail } from "_o/api/operator-check";
import { getReviewResultStatus, getViolationLevelStatusName, reCheckMap } from "./fields";
import lookImgVideo from "./components/lookImgVideo.vue";
import noPic from "_o/assets/images/operator/noPic.png";
import { TASK_TYPE_ADD_MAP } from "_o/components/operator-center/carrier-management/operator-check/fields";
export default {
  components: {
    lookImgVideo
  },
  data() {
    return {
      TASK_TYPE_ADD_MAP,
      dataSource: {},
      getReviewResultStatus,
      getViolationLevelStatusName,
      noPic,
      reCheckMap
    };
  },
  mounted() {
    driverCheckTaskDetail({ recordUuid: this.$route.query.uuid }).then(res => {
      let data = res.data.data || {};
      this.dataSource = data;
    });
  }
};
</script>

<style lang="less" scoped>
.common {
  display: flex;
  align-items: center;
  .shadow {
    width: 6px;
    height: 18px;
    background: #2d8cf0;
    margin-right: 10px;
  }
  .title {
    font-weight: bold;
    font-size: 20px;
    color: #333333;
  }
}
.content {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  .title {
    color: #666666;
    font-size: 16px;
    font-weight: bold;
  }
  .detail {
    color: #333333;
    margin-bottom: 20px;
    margin-top: 10px;
    font-size: 14px;
  }
}
.mr {
  width: 300px;
}
</style>
