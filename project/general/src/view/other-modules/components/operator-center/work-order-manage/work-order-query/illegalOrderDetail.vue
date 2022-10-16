<template>
  <div>
    <!-- 工单描述 -->
    <Describe :basicInfo="sourceData.basicInfo" :isLoading="isLoadingSubList" :subListInfo="subListInfo"
              :audioListInfo="audioListInfo"
              :audioSiChengListInfo="audioSiChengListInfo"
              @changesubpage="changePage" @changesubpagesize="changePageSize"
              @changeAudioPage="changeAudioPage" @changeAudioPageSize="changeAudioPageSize"
    />
    <br />
    <div v-if="isRisk">
      <risk-list :basicInfo="sourceData"></risk-list>
    </div>
    <Card v-show="isShowRoutePlan == 'true'">
      <Button type="primary"  @click="viewOrder">订单轨迹</Button>
    </Card>
    <br />
<!--    判责描述-->
    <Record :detailSnaps="detailSnaps"
    :illegalLists="illegalLists"
    :picIdLists="picIdLists"
    :videoIdLists="videoIdLists"
    :tailInfo="tailInfo"
    ></Record>
    <template v-if="!isIllegal">
      <br />
      <city-record :recordInfo="sourceData.recordInfo"></city-record>
      <br>
      <component
        v-if="currentComponent"
        v-bind:is="currentComponent"
        :basicInfo="sourceData.basicInfo"
        :recordInfo="sourceData.recordInfo"
      ></component>
    </template>
  </div>
</template>

<script>
// 违规工单明细 (城市审核和明细)
import Describe from "./detail/illegalOrderDescribe";
import Record from "./detail/illegalOrderRecord";
import StartBlame from "./detail/start-blame";
import EndBlame from "./detail/end-blame";
import StartAppeal from "./detail/start-appeal";
import EndAppeal from "./detail/end-appeal";
import AgainAppeal from "./detail/again-appeal";
import Result from "./detail/result";
import CityAppeal from "./detail/city-appeal";
import CityRecord from "./detail/city-record"
import { fetchOrderDetail } from "_o/api/work-order/wo-detail";
import { fetchFilesUrl, fileToken } from "_o/api/work-order/common";
import riskList from "./detail/order/index.vue";


export default {
  components: {
    Describe,
    StartBlame,
    EndBlame,
    StartAppeal,
    EndAppeal,
    AgainAppeal,
    Result,
    Record,
    riskList,
    CityAppeal,
    CityRecord
  },
  data() {
    return {
      code:0,
      sourceData: {},
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
      isShowRoutePlan:"",
      detailSnaps:{},
      illegalLists:[],
      picIdLists:[],
      videoIdLists:[],
      isIllegal: false,
      tailInfo: []
    };
  },
  computed: {
    isRisk({sourceData}) {
      return !!sourceData?.basicInfo?.newDataFlag
    },
  },
  watch: {
    $route(to) {
      this.init();
      if (to.name === "illegal-order-detail") {
        this.isIllegal = true;
      } else {
        this.isIllegal = false;
      }
    }
  },
  created() {
    this.init();
    this.isIllegal = this.$route.name === "illegal-order-detail";
  },
  methods: {
    async init() {
      const { woCode, taskId } = this.$route.query;
      const {
        data: { success, data ,code,attachment}
      } = await fetchOrderDetail({ woCode });
        this.isShowRoutePlan = attachment.isShowRoutePlan
      if (success) {
        this.code = code
        const { basicInfo = {}, recordInfo,detailSnap = {}, tailInfo } = data;
        if(data.basicInfo) { // 是否展示风控订单明细
          data.basicInfo.newDataFlag = data.basicInfo.newDataFlag ? 1 : 0
        }
        const { bizState } = basicInfo;
        this.tailInfo = tailInfo || [];
        this.detailSnaps = detailSnap.recordInfo
        this.illegalLists = detailSnap.illegalList
        this.picIdLists = detailSnap.picIdList
        this.videoIdLists = detailSnap.videoIdList;
        // 城市审核
        if(taskId) {
          basicInfo.taskId = taskId;
          if(bizState === "SJ_CITY") {
            this.currentComponent = "CityAppeal"
          }
        }
        const fileIds = [];
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
        // add  报警明细
        // if (woType === "DP") {
        //   this.getSubList({ woNo, currPage: 1, pageSize: 10 })
        // }
      }
      // 有关联订单得，查询音频列表
      if (this.sourceData?.basicInfo?.routePlanNo) {
        // 获取音频信息
        // this.getAudios({ currPage: this.audioListInfo.current, pageSize: this.audioListInfo.pageSize });
        // this.getSiChengAudios({ currPage: this.audioSiChengListInfo.current, pageSize: this.audioSiChengListInfo.pageSize });
      }
    },

    // async getAudios(params) {
    //   const {
    //     data: {
    //       success, data: { list, totalCount, currPage }
    //     },
    //     msg
    //   } = await fetchAudioList({ ...params, ...{ orderNo: this.sourceData.basicInfo.routePlanNo }});
    //   if (success) {
    //     this.audioListInfo.tableData = list;
    //     this.audioListInfo.total = totalCount;
    //     this.audioListInfo.current = currPage;
    //   } else {
    //     this.$Message.error(msg);
    //   }
    // },

    // async getSiChengAudios(params) {
    //   const {
    //     data: {
    //       success, data: { list, totalCount, currPage }
    //     },
    //     msg
    //   } = await fetchSiChengAudioList({ ...params, ...{ routePlanId: this.sourceData.basicInfo.routePlanId }});
    //   if (success) {
    //     this.audioSiChengListInfo.tableData = list;
    //     this.audioSiChengListInfo.total = totalCount;
    //     this.audioSiChengListInfo.current = currPage;
    //   } else {
    //     this.$Message.error(msg);
    //   }
    // },

    // async getSubList(params) {
    //   try {
    //     this.isLoadingSubList = true
    //     const {
    //       data: { success, data: { list, totalCount }}
    //     } = await fetchOrderDetailSubList(params)
    //     if (success) {
    //       let originData =  list
    //       this.subListInfo.total = totalCount;
    //       for (let item of originData) {
    //         const { picFiles = "", vioFiles = "" } = item
    //         let picFilesArr =
    //           picFiles.split(",")
    //             .filter(it => Boolean(it));
    //         let vioFilesArr =
    //           vioFiles.split(",")
    //             .filter(it => Boolean(it));
    //         if (picFilesArr.length) {
    //           const arr = await this.getFileLink(picFilesArr, { doType: 2 });
    //           if (arr.length) {
    //             const pictures = [];
    //             arr.forEach(x => {
    //               if (picFilesArr.indexOf(x.key) > -1) {
    //                 pictures.push(x);
    //               }
    //             });
    //             item.pictures = pictures;
    //           }
    //         }
    //         if (vioFilesArr.length) {
    //           const arr = await this.getFileLink(vioFilesArr, { doType: 2 });
    //           if (arr.length) {
    //             const videos = [];
    //             arr.forEach(x => {
    //               if (vioFilesArr.indexOf(x.key) > -1) {
    //                 videos.push(x);
    //               }
    //             });
    //             item.videos = videos;
    //           }
    //         }
    //       }
    //       this.subListInfo.tableData = originData;
    //     }
    //     this.isLoadingSubList = false
    //   } catch (err) {
    //     console.log(err)
    //     this.isLoadingSubList = false
    //   }

    // },
    async getFileToken(params) {
      // debugger
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
      // this.getSubList({ woNo, currPage: this.subListInfo.current, pageSize: this.subListInfo.pageSize })
    },
    changePageSize(val) {
      this.subListInfo.pageSize = val;
      const { woNo } = this.sourceData.basicInfo;
      // this.getSubList({ woNo, currPage: this.subListInfo.current, pageSize: this.subListInfo.pageSize })
    },
    // 音频列表分页相关
    changeAudioPage(val) {
      this.audioListInfo.current = val;
      // this.getAudios({ currPage: this.audioListInfo.current, pageSize: this.audioListInfo.pageSize });
    },
    changeAudioPageSize(val) {
      this.audioListInfo.pageSize = val;
      // this.getAudios({ currPage: this.audioListInfo.current, pageSize: this.audioListInfo.pageSize });
    },
    // changeSiChengAudioPage(val) {
    //   this.audioSiChengListInfo.current = val;
    //   // this.getSiChengAudios({ currPage: this.audioSiChengListInfo.current, pageSize: this.audioSiChengListInfo.pageSize });
    // },
    // changeSiChengAudioPageSize(val) {
    //   this.audioSiChengListInfo.pageSize = val;
    //   // this.getSiChengAudios({ currPage: this.audioSiChengListInfo.current, pageSize: this.audioSiChengListInfo.pageSize });
    // },
    // 轨迹
    viewOrder() {
      const { routePlanId } = this.sourceData.basicInfo;
      if(routePlanId == ""){
        this.$Message.error("当前无订单")
        return
      }
      let name = "order-detail-illeage"
      this.$router.push({
        name: name,
        params: { id: routePlanId }
      });
    },
  }
};
</script>
