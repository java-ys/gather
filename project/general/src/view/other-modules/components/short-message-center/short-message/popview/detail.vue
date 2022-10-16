<template>
  <div style="padding: 0 30px;">
    <Form ref="formInline" :label-width="110">
      <FormItem label="任务名称 :">{{addParams.taskName}}</FormItem>
      <FormItem label="发送对象 :">{{sendMap[addParams.sendName]}}</FormItem>
      <FormItem label="发送城市 :">
        <div class="city-box">{{addParams.cityNames}}</div>
      </FormItem>
      <FormItem label="用户选择方式 :">
        {{driverMap[addParams.driver]}}
        <!--导出-->
        <Button
          ghost
          type="success"
          size="small"
          @click="exportFile(addParams.ossFileUrl)"
          v-if="addParams.driver === 5 || addParams.driver === 7"
          style="margin-left: 10px;"
        >数据导出</Button>
      </FormItem>
      <FormItem label="乘客分组类别 :" v-if="addParams.sendName===0 && addParams.driver===10">
        <span v-if="addParams.userGroupType==='1'" class="item_content"> 注册城市 </span>
        <span v-if="addParams.userGroupType==='2'" class="item_content"> 冒泡城市 </span>
        <span v-if="addParams.userGroupType==='3'" class="item_content"> 完单城市 </span>
      </FormItem>
      <FormItem label="用户分群 :" v-if="addParams.driver === 10">{{addParams.userGroupName}}</FormItem>
      <FormItem
        label="业务类型 :"
        v-if="addParams.driver === 4"
      >{{(bizTypeList.find(it =>it.value === Number(addParams.businessTypes))||{}).label }}</FormItem>
      <FormItem label="运营商 :" v-if="addParams.driver === 4">
        <span v-if="addParams.operators.length">{{addParams.operators.join('、')}}</span>
        <span v-else>暂无</span>
      </FormItem>
      <!--指定乘客-->
      <FormItem label="乘客列表 :" v-if="addParams.driver === 2">
        <div v-if="addParams.passengerList.length">
          <span v-for="item in addParams.passengerList">
            <span style="margin-right: 5px;">{{item.phone}}</span>
          </span>
        </div>
        <span v-else>暂无</span>
      </FormItem>
      <!--指定司机-->
      <FormItem label="司机列表 :" v-if="addParams.driver === 3">
        <div v-if="addParams.driverList.length">
          <span v-for="item in addParams.driverList">
            <span style="margin-right: 5px;">{{item.phone}}</span>
          </span>
        </div>
        <span v-else>暂无</span>
      </FormItem>
      <FormItem label="对象数量 :">{{addParams.taskStatus===7?'-':`${addParams.targetNum}人`}}</FormItem>
      <FormItem label="消息内容 :">{{addParams.content}}
        <span class="message_letter">
              {{this.letter}}字符/{{this.letterCount}}条
            </span>
      </FormItem>
      <FormItem label="状态 :">
        {{statusValue}}
        <div>
          <span v-if="importResult" v-html="importResult"></span>
          <span v-if="isUploadFail" class="text-btn" @click="exportFile(addParams.failUrl)">下载导入失败清单</span>
        </div>
        </FormItem>
      <FormItem label="发送时间 :">{{addParams.sendTime}}</FormItem>
      <!-- 发送成功 -->
      <div v-if="addParams.taskStatus===4">
        <FormItem label="发送成功数量[每四小时统计一次] :">{{addParams.successCount}}</FormItem>
        <FormItem label="发送失败数量 :">{{addParams.failCount}}</FormItem>
        <FormItem label="发送成功率 :">{{addParams.successRate}}%</FormItem>
      </div>
      <div v-else>
        <FormItem label="发送成功数量[每四小时统计一次] :"> - </FormItem>
        <FormItem label="发送失败数量 :"> - </FormItem>
        <FormItem label="发送成功率 :"> - </FormItem>
      </div>
    </Form>
    <div class="popView-footer-wrap">
      <Button size="large" type="text" @click="commit" style="margin-right: 8px;">取消</Button>
      <Button size="large" type="primary" @click="commit">确定</Button>
    </div>
  </div>
</template>

<script>
import { messageDetail } from "_o/api/announcement";
import { driverMap, sendMap, taskStatusMap, batchStatusMap} from "../fields";
import oss from "@/mixins/oss";
import { mapState } from "vuex";
export default {
  props: {
    value: {
      type: Boolean
    },
    uuid: {
      type: String
    }
  },
  mixins: [oss],
  data() {
    return {
      sendMap,
      driverMap,
      taskStatusMap,
      addParams: {},
      letter:'',
      letterCount:'',
      statusValue: '',
      importResult: '',
      isUploadFail: false
    };
  },
  computed:{
    ...mapState({
      bizTypeList: state => state.common.bizTypeList,
    }),
  },
  watch: {
    value() {
      if (this.value) {
        this.addParams = {};
        this.getDetail();
      }
    }
  },
  methods: {
    getDetail() {
      messageDetail({ uuid: this.uuid }).then(async (res) => {
        let data = res.data.data||{};
        this.addParams = data;
        // failUrl ossFileUrl 返回的都是文件uuid
        let r = ["failUrl", "ossFileUrl"]
        for(let i =0; i<r.length; i++) {
          let v = this.addParams[r[i]]
          if(v) {
            let [, url] = await this.getOssFile({uuid: v})
            this.addParams[r[i]] = url
          }
        }

        this.letter = data.content.length;
        if (this.letter == 0) {
          this.letterCount = 0;
        } else {
          if (this.letter <= 70) {
            this.letterCount = 1;
          } else {
            if (this.letter < 129) {
              this.letterCount = 2;
            } else {
              if (this.letter < 196) {
                this.letterCount = 3;
              } else {
                this.letterCount = 4;
              }
            }
          }
        }

        if(data.driver===5||data.driver===7){
          this.statusValue = batchStatusMap[data.taskStatus]
          if(data.taskStatus!==7){
            this.importResult = `导入成功<span style="color:red">${data.importTotalCount-data.importFailCount||0}</span>条，导入失败<span style="color:red">${data.importFailCount||0}</span>条`
            if(data.importFailCount>0){
              this.isUploadFail = true
            }else{
              this.isUploadFail = false
            }
          }else{
            this.importResult = ''
            this.isUploadFail = false
          }
        }else{
          this.statusValue = taskStatusMap[data.taskStatus]
          this.importResult = ''
          this.isUploadFail = false
        }
      });
    },
    exportFile(url) {
      window.open(url);
    },
    commit(temp) {
      this.$emit("input", false);
    }
  }
};
</script>
<style lang="less" scoped>
	div{
		.message_letter{
			margin-left: 15px;
			color:#57a3f3;
		}
  }
  // .city-box{
  //   max-height:200px;
  //   overflow: auto;
  // }
  .text-btn{
    color:#57a3f3;
    cursor: pointer;
    display: inline-block;
    margin-left: 30px;
  }
</style>