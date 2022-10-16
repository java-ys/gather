<template>
  <div>
    <template v-if="!isLZOrder">
      <!-- 工单概览 -->
      <OverView :basicInfo="sourceData.basicInfo" />
      <br />
    </template>
    <!-- 工单描述 -->
    <Describe :basicInfo="sourceData.basicInfo" :isLoading="isLoadingSubList" :subListInfo="subListInfo"
              :audioListInfo="audioListInfo"
              :audioSiChengListInfo="audioSiChengListInfo"
              :driverReports="driverReports"
              :isLZOrder="isLZOrder"
              @changesubpage="changePage" @changesubpagesize="changePageSize"
              @changeAudioPage="changeAudioPage" @changeAudioPageSize="changeAudioPageSize"
    />
    <template v-if="!isLZOrder">
      <br />
      <Card v-if="cancelPiece" title="取消信息">
        <p class="cancel-field">取消方：{{cancelPiece.cancelUserType}}</p>
        <p class="cancel-field">取消原因：{{cancelPiece.cancelReasonDesc}}</p>
        <template v-if="cancelPiece.cancelReasonType === 1">
          <p class="cancel-field">行程规划距离：{{cancelPiece.pickPlanDistance}}公里（{{cancelPiece.overCitySetDistance ? '已' : '未'}}超出城市派单距离）</p>
          <p class="cancel-field">行程规划时间：{{cancelPiece.pickPlanDurationMin}}分钟{{cancelPiece.pickPlanDuration}}秒（{{cancelPiece.overCitySetDuration ? '已' : '未'}}超出城市派单时长）</p>
        </template>
        <template v-else-if="cancelPiece.cancelReasonType === 2 || cancelPiece.cancelReasonType === 3">
          <p v-if="cancelPiece.changeReasonFiles && cancelPiece.changeReasonFiles.length" class="cancel-field">
            上传照片：<img v-for="v of cancelPiece.files" :key="v" class="cancel-img" :src="v" alt="图片" @click="(previewImg = v, visible = true)">
          </p>
          <p class="cancel-field">文字描述：{{cancelPiece.changeDesc}}</p>
        </template>
        <p v-else-if="cancelPiece.cancelReasonType === 5" class="cancel-field">是否满足当前城市设置的取消条件：{{cancelPiece.compliantRule ? '是' : '否'}}</p>
      </Card>
      <br />
      <!-- 历史操作记录 -->
      <Record :recordInfo="sourceData.recordInfo"></Record>
      <br />
      <!-- 最终判责 -->
      <Result
        v-if="sourceData.basicInfo && sourceData.basicInfo.runState === 'FINISH' && currentComponent === 'AgainAppeal'"
        :tailInfo="sourceData.tailInfo"
      ></Result>
      <br />
      <!-- 当前操作节点 -->
      <component
        v-bind:is="currentComponent"
        v-if="currentComponent"
        :basicInfo="sourceData.basicInfo"
        :recordInfo="sourceData.recordInfo"
      ></component>
      <br />
      <!-- 最终判责 -->
      <Result
        v-if="sourceData.basicInfo && sourceData.basicInfo.runState === 'FINISH' && currentComponent !== 'AgainAppeal'"
        :tailInfo="sourceData.tailInfo"
      ></Result>
    </template>
    <template v-else>
      <Card v-if="sourceData.recordInfo && sourceData.recordInfo.length" title="处理记录" style="margin-top: 20px">
        <VTable
          isLoading
          :isShowPage="false"
          :parColumns="recordColumns"
          :parTableData="sourceData.recordInfo"
        />
      </Card>
      <template v-if="sourceData.reviewInfo && sourceData.reviewInfo.canReview">
        <br>
        <Card title="处理表述">
          <Form>
            <FormItem label="处理表述：">
              <Input v-model="judgeDesc" type="textarea" :maxlength="500" placeholder="请输入" />
            </FormItem>
            <div style="display:flex;justify-content: flex-end;">
              <template v-if="sourceData.reviewInfo.canReassignment">
                <Button style="margin-right: 10px;" @click="showUserModal(1)">委派</Button>
                <Button style="margin: 0 20px;" @click="showUserModal(4)">转派</Button>
              </template>
              <Button v-for="(v,i) of sourceData.reviewInfo.reviewItems" :key="i" style="margin: 0 10px" @click="onOperation(v)">{{v.desc}}</Button>
            </div>
          </Form>
        </Card>
        <ModalWrap
          v-model="showModal"
          :title="modalType === 1 || modalType === 4 ? '请选择' + (modalType === 1 ? '委' : '转') + '派人' : modalType === 2 ? '修改处理部门' : '对当前工单是否满意'"
          @on-ok="onSubmit"
        >
          <Select v-if="modalType === 1 || modalType === 4" v-model="selectId">
            <Option v-for="v of partUsers" :key="v.userId" :value="v.userId">{{v.designation}}</Option>
          </Select>
          <Select v-else-if="modalType === 2" v-model="selectId">
            <Option v-for="v of partList" :key="v.id" :value="v.id">{{v.designation}}</Option>
          </Select>
          <RadioGroup v-else v-model="fraction">
            <Radio :label="0">不满意</Radio>
            <Radio :label="1">满意</Radio>
          </RadioGroup>
        </ModalWrap>
      </template>
    </template>
    <Modal v-model="visible" title="图片预览">
      <img v-if="visible" :src="previewImg" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
// 工单明细  (总部审核/详情)
import allComponents from  "./detail/index.js";
import { fetchAudioList, fetchSiChengAudioList,fetchOrderDetail, fetchOrderDetailSubList, queryOrder } from "_o/api/work-order/wo-detail";
import { fetchFilesUrl, fileToken } from "_o/api/work-order/common";
import { checkHasBtn } from "@/libs/util.js";
import { patchOrder, queryPartUserList, postOrderUser, putOrderUser, queryAllDepartmentList, confirmOrder,postEvaluation } from "_o/api/work-order/work-order-config";
import ModalWrap from '../work-order-config/circulation/ModalWrap.vue';

/* eslint-disable no-return-assign */
const component_map = {
  'CS': 'StartBlame', // 初审
  'ZS': 'EndBlame', // 终审
  'SJ_CS_SS': 'StartAppeal', // 初审申诉
  'SJ_ZS_SS': 'EndAppeal', // 终审申诉
  'SJ_HEAD': 'T3Appeal' // 总部组审核
}
export default {
  components: {
    ...allComponents,
    ModalWrap,
  },
  data() {
    return {
      recordColumns: [
        {
          title: "时间",
          key: "createTime",
          minWidth: 120,
          render: (h, { row }) => h("span", new Date(row.createTime).toLocaleString("zh-CN").replace(/\//g, "-"))
        },
        {
          title: "操作人",
          key: "handlerName",
          minWidth: 120,
        },
        {
          title: "操作项",
          key: "valDesc",
          minWidth: 120,
        },
        {
          title: "处理表述",
          key: "content",
          minWidth: 120,
        },
      ],
      fraction: 1,
      judgeDesc: "",
      rejectPart: 1,
      star: 0,
      isLZOrder: false,
      showModal: false,
      modalType: 1,
      visible: false,
      previewImg: "",
      sourceData: {},
      // baseInfo: {},
      paramsObj: {},
      currentComponent: "",
      subListInfo: {
        total: 0,
        current: 1,
        pageSize: 10,
        tableData: [],
      },
      audioListInfo: {
        total: 0,
        current: 1,
        pageSize: 10,
        tableData: []
      },
      audioSiChengListInfo: {
        total: 0,
        current: 1,
        pageSize: 20,
        tableData: []
      },
      isLoadingSubList: false,
      driverReports: [],
      cancelPiece: null,
      partUsers: [],
      partList: [],
      selectId: "",
    };
  },
  watch: {
    $route(to) {
      if (to.name === "work-order-detail") {
        this.init();
        this.isLZOrder = Boolean(to.query.isLZ);
        this.judgeDesc = "";
      }
    },
    showModal() {
      this.selectId = "";
    }
  },
  created() {
    this.isLZOrder = Boolean(this.$route.query.isLZ);
    this.init();
  },
  methods: {
    back() {
      this.modalType = 0;
      this.showModal = false;
      setTimeout(() => {
        this.$router.back();
      }, 2000)
    },
    showUserModal(type) {
      queryPartUserList({woCode: this.$route.query.woCode, type: type === 1 ? 2 : 1}).then(res => this.partUsers = res, () => this.partUsers = []).then(() => {
        this.selectId = "";
        this.modalType = type;
        this.showModal = true;
      })
    },
    onSubmit() {
      switch (this.modalType) {
        case 2: // 转发
          this.onSubmitOrder(22);
          break;
        case 1: // 委派
        case 4: // 转派
          (this.modalType === 1 ? postOrderUser : putOrderUser)({
            woCode: this.$route.query.woCode,
            assignee: this.selectId,
            taskId: this.sourceData.reviewInfo.taskId,
          }).then(() => {
            this.$Message.success("已提交");
            this.back();
          }).catch(err => this.$Message.error(err.msg));
          break;
        case 3: // 评价
          postEvaluation({woCode: this.$route.query.woCode, fraction: this.fraction}).then(() => {
            this.$Message.success("已提交");
            this.back();
          }).catch(err => this.$Message.error(err.msg));
          break;
      }
    },
    onSubmitOrder(result) {
      patchOrder({
        woCode: this.$route.query.woCode,
        result,
        taskId: this.sourceData.reviewInfo.taskId,
        judgeDesc: this.judgeDesc,
        partId: this.selectId,
      }).then(() => {
        this.$Message.success("已提交");
        if (result === 0) {
          this.modalType = 3;
          this.showModal = true;
          this.sourceData.reviewInfo.canReassignment = false;
          this.sourceData.reviewInfo.reviewItems = [];
        } else {
          this.back();
        }
      }).catch(err => this.$Message.error(err.msg));
    },
    onOperation(item) {
      switch (item.result) {
        case 22: // 转发
          queryAllDepartmentList({partType: 0}).then(res => this.partList = res || [], () => this.partList = []).then(() => {
            this.showModal = true;
            this.modalType = 2;
          })
          break;
        case 25: // 转派确认
          confirmOrder({woCode: this.$route.query.woCode,taskId: this.sourceData.reviewInfo.taskId}).then(() => {
            this.$Message.success("已提交");
            this.back();
          }).catch(err => this.$Message.error(err.msg));
          break;
        default:
          this.onSubmitOrder(item.result);
          break;
      }
    },
    async init() {
      const { woCode } = this.$route.query;
      const req = this.$route.query.isLZ ? queryOrder : fetchOrderDetail;
      const {
        data: { success, data }
      } = await req({ woCode });
      if (success) {
        const { basicInfo = {}, recordInfo, cancelPiece } = data;
        let fileIds = [];
        if(!this.isLZOrder) {
          if (data.basicInfo) { // 是否展示风控订单明细
            data.basicInfo.newDataFlag = data.basicInfo.newDataFlag ? 1 : 0
          }
          this.cancelPiece = cancelPiece || null;
          if (cancelPiece?.changeReasonFiles?.length) {
            this.getFileLink(cancelPiece.changeReasonFiles, { doType: 2 }).then(res => {
              if (!res || !res.length) return;
              this.$set(this.cancelPiece, "files", res.map(v => v.value));
            })
          }
          this.setDriverReports(data).setComponent(basicInfo);
        }
        const info = recordInfo.map(item => {
          const obj = JSON.parse(item.valJson)
          const auditResult = item.auditResult;
          const judgeResult = item.judgeResult;
          const { handlerCostTime } = obj;
          const handlerCostTimeText = `${parseInt(handlerCostTime / 60)}小时${handlerCostTime % 60}分钟`;
          const { picFiles = [], vioFiles = [] } = obj;
          fileIds.push(...picFiles, ...vioFiles);
          return {
            ...item,
            ...obj,
            handlerCostTimeText,
            auditResult:auditResult > 0 ? auditResult:obj.auditResult,
            judgeResult:judgeResult > 0 ? judgeResult:obj.judgeResult
          }
        })
        this.$set(data, "recordInfo", info)
        const { picFileId, vioFileId, woNo, woType } = basicInfo;
        const basicPictures = picFileId
          .split(",")
          .filter(item => Boolean(item));
        const basicVideos = vioFileId.split(",").filter(item => Boolean(item));
        const ids = [...basicPictures, ...basicVideos, ...fileIds];
        if (ids.length) {
          const arr = await this.getFileLink(ids, { doType: 2 });
          if (arr.length) {
            if (basicPictures.length) {
              const pictures = [];
              arr.forEach(x => {
                if (basicPictures.indexOf(x.key) > -1) {
                  pictures.push(x);
                }
              });
              data.basicInfo.pictures = pictures;
            }
            if (basicVideos.length) {
              const videos = [];
              arr.forEach(x => {
                if (basicVideos.indexOf(x.key) > -1) {
                  videos.push(x);
                }
              });
              data.basicInfo.videos = videos;
            }
            if (fileIds.length) {
              data.recordInfo.forEach(item => {
                const { picFiles = [], vioFiles = [] } = item;
                item.pictures = [];
                item.videos = [];
                arr.forEach(x => {
                  if (picFiles.indexOf(x.key) > -1) {
                    item.pictures.push(x);
                  }
                  if (vioFiles.indexOf(x.key) > -1) {
                    item.videos.push(x);
                  }
                });
              });
            }
          }
        }
        // console.log("@data", data);
        this.sourceData = data;
        if(!this.isLZOrder) {
          // add  报警明细
          if (woType === "DP") {
            this.getSubList({ woNo, currPage: 1, pageSize: 10 })
          }
  
          // 有关联订单得，查询音频列表
          if (this.sourceData?.basicInfo?.routePlanNo) {
            this.getAudios({ currPage: this.audioListInfo.current, pageSize: this.audioListInfo.pageSize });
            this.getSiChengAudios({ currPage: this.audioSiChengListInfo.current, pageSize: this.audioSiChengListInfo.pageSize });
          }
        }
      }
    },

    setDriverReports(data) {
      const { driverReports=[] } = data;
      if(driverReports.length && driverReports.some(v => v.enclosures && v.enclosures.length)) {
        this.getFileToken({doType: 2}).then(token => fetchFilesUrl({uuids: driverReports.reduce((res,v) => res.concat((v.enclosures||[]).map(o => o.fileId)), [])}, token).then(res => {
          if(!res.data.success) return;
          driverReports.forEach(v => {
            v.enclosures && v.enclosures.forEach(o => o.fileUrl = res.data.data[o.fileId]);
          })
          this.driverReports = driverReports;
        }))
      } else {
        this.driverReports = driverReports;
      }
      return this
    },

    setComponent(basicInfo) {
      const { taskId, appealAgain } = this.$route.query;
      const { bizState } = basicInfo;
      const hasAuthAgainAppeal =
        appealAgain && checkHasBtn("work-order-again-appeal");
      if (hasAuthAgainAppeal || taskId) {
        if (hasAuthAgainAppeal) {
          this.currentComponent = "AgainAppeal";
        } else {
          basicInfo.taskId = taskId;
          this.currentComponent = component_map[bizState];
        }
        this.busEvents.$emit("clearFiles", true);
      } else {
        this.currentComponent = "";
      }
      return this
    },

    async getAudios(params) {
      const {
        data: {
          success, data: { list, totalCount, currPage }
        },
        msg
      } = await fetchAudioList({ ...params, ...{ orderNo: this.sourceData.basicInfo.routePlanNo }});
      if (success) {
        this.audioListInfo.tableData = list;
        this.audioListInfo.total = totalCount;
        this.audioListInfo.current = currPage;
      } else {
        this.$Message.error(msg);
      }
    },

    async getSiChengAudios(params) {
      const {
        data: {
          success, data: { list, totalCount, currPage }
        },
        msg
      } = await fetchSiChengAudioList({ ...params, ...{ routePlanId: this.sourceData.basicInfo.routePlanId }});
      if (success) {
        this.audioSiChengListInfo.tableData = list;
        this.audioSiChengListInfo.total = totalCount;
        this.audioSiChengListInfo.current = currPage;
      } else {
        this.$Message.error(msg);
      }
    },

    async getSubList(params) {
      try {
        this.isLoadingSubList = true
        const {
          data: { success, data: { list, totalCount }}
        } = await fetchOrderDetailSubList(params)
        if (success) {
          let originData =  list
          this.subListInfo.total = totalCount;
          for (let item of originData) {
            const { picFiles = "", vioFiles = "" } = item
            let picFilesArr =
              picFiles.split(",")
                .filter(it => Boolean(it));
            let vioFilesArr =
              vioFiles.split(",")
                .filter(it => Boolean(it));
            if (picFilesArr.length) {
              const arr = await this.getFileLink(picFilesArr, { doType: 2 });
              if (arr.length) {
                const pictures = [];
                arr.forEach(x => {
                  if (picFilesArr.indexOf(x.key) > -1) {
                    pictures.push(x);
                  }
                });
                item.pictures = pictures;
              }
            }
            if (vioFilesArr.length) {
              const arr = await this.getFileLink(vioFilesArr, { doType: 2 });
              if (arr.length) {
                const videos = [];
                arr.forEach(x => {
                  if (vioFilesArr.indexOf(x.key) > -1) {
                    videos.push(x);
                  }
                });
                item.videos = videos;
              }
            }
          }
          this.subListInfo.tableData = originData;
        }
        this.isLoadingSubList = false
      } catch (err) {
        console.log(err)
        this.isLoadingSubList = false
      }

    },
    async getFileToken(params) {
      const {
        data: { data, success }
      } = await fileToken(params);
      if (success) {
        return data;
      }
      return null;
    },

    async getFileLink(ids, params) {
      let arr = [];
      try {
        const token = await this.getFileToken(params);
        if (token) {
          const params = { uuids: ids };
          const {
            data: { data, success }
          } = await fetchFilesUrl(params, token);
          if (success && data) {
            for (let key in data) {
              const value = data[key];
              if (value) {
                arr.push({
                  key,
                  value
                });
              }
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
      return arr;
    },
    changePage(val) {
      this.subListInfo.current = val;
      const { woNo } = this.sourceData.basicInfo;
      this.getSubList({ woNo, currPage: this.subListInfo.current, pageSize: this.subListInfo.pageSize })
    },
    changePageSize(val) {
      this.subListInfo.pageSize = val;
      const { woNo } = this.sourceData.basicInfo;
      this.getSubList({ woNo, currPage: this.subListInfo.current, pageSize: this.subListInfo.pageSize })
    },
    // 音频列表分页相关
    changeAudioPage(val) {
      this.audioListInfo.current = val;
      this.getAudios({ currPage: this.audioListInfo.current, pageSize: this.audioListInfo.pageSize });
    },
    changeAudioPageSize(val) {
      this.audioListInfo.pageSize = val;
      this.getAudios({ currPage: this.audioListInfo.current, pageSize: this.audioListInfo.pageSize });
    },
    // changeSiChengAudioPage(val) {
    //   this.audioSiChengListInfo.current = val;
    //   this.getSiChengAudios({ currPage: this.audioSiChengListInfo.current, pageSize: this.audioSiChengListInfo.pageSize });
    // },
    // changeSiChengAudioPageSize(val) {
    //   this.audioSiChengListInfo.pageSize = val;
    //   this.getSiChengAudios({ currPage: this.audioSiChengListInfo.current, pageSize: this.audioSiChengListInfo.pageSize });
    // }
  }
};
</script>
<style scoped>
.cancel-field {
  margin-bottom: 1em !important;
}
.cancel-img {
  margin-right: 10px;
  width: 100px;
  height: 100px;
  object-fit: cover;
  vertical-align: middle;
}
</style>