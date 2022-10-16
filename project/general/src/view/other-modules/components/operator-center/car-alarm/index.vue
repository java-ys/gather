<!--营运管理-车辆告警-wx-->
<template>
  <div class="car-alarm">
    
    <Collapse v-model="panelName">
        <Panel name="1">
          {{panelName[0]=='1'?'点击折叠':'点击查看查询项'}}
          <div slot="content">
            <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
            <div class="flex-between">
              <span class="link_a" @click="infoModal=true">哪些情况下系统会报警？</span>
              <div>
                <span class="text-block">自动刷新页面</span>
                <el-switch v-model="isAutoRef" @change="change"></el-switch>
              </div>
            </div>
          </div>
        </Panel>
    </Collapse>
    <VTable
      :total="pageObj.total"
      :current="pageObj.current"
      :pageSize="pageObj.pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
      class="top15"
    ></VTable>
    <Modal v-model="cancelModal" :width="800" title="解除告警" :mask-closable="false" footer-hide>
      <Form ref="cancelModalData" :model="cancelModalData" :rules="ruleValidate" :label-width="150">
        <FormItem label="故障原因及解除方案：" prop="alarmResolvedDesc">
          <Input 
            v-model="cancelModalData.alarmResolvedDesc" 
            :rows="3" type="textarea" 
            :maxlength="100" 
            placeholder="请输入故障原因及解除方案" 
            style="width:520px;">
          </Input>
          <span class="counter">( {{cancelModalData.alarmResolvedDesc.length}}/100 )</span>
        </FormItem>
        <FormItem label="备注：" prop="comment">
          <Input v-model="cancelModalData.comment" :maxlength="30" placeholder="请输入备注" style="width:520px;"></Input>
          <span class="counter">( {{cancelModalData.comment.length}}/30 )</span>
        </FormItem>
        <Divider class="bottom10"/>
        <div class="right-flex">
          <Button @click="cancelRemove('cancelModalData')">取消</Button>
          <Button type="primary" @click="RemoveAlarm('cancelModalData')" style="margin-left: 8px">确定</Button>
        </div>
      </Form>
    </Modal>
    <Modal v-model="infoModal" :width="820" title="告警定义" :mask-closable="false" cancel-text="" class="info-modal">
      <p>1．实时同步告警：司机上线，且车辆5分钟之内位置未上报；</p>
      <p>2．续航告警：车辆续航里程为0；</p>
      <p>3．里程告警：总里程比上一次总里程小；</p>
      <p>4．TBOX告警：TBOX电源拔掉报警；</p>
      <p>5．GPS告警：GPS天线拔掉报警；</p>
      <p>6．车机告警：车机与TBOX连接线拔掉报警；</p>
      <p>7．报警按钮告警：报警按钮断路报警；</p>
      <p>8．人脸识别失败告警：第一次人脸识别开始，一分钟后还没有识别成功则报警；</p>
      <p>9．车机位置异常告警：车机位置定位为0,0则报警；</p>
      <p>10．Token验签失败告警：Token校验失败时报警；</p>
      <p>11．Token过期告警：Token过期时报警；</p>
      <p>12．点火状态下TBOX心跳异常告警：点火状态下TBOX的心跳一分钟低于15次，则报警；</p>
      <p>13．熄火状态下TBOX心跳异常告警：熄火状态下TBOX的心跳十分钟低于5次，则报警；</p>
      <p>14．TBOX数据完整性告警：TBOX的心跳需要包含数据信息位置、总里程、续航里程、点火和熄火状态、充电状态、车速，缺少的话报警；</p>
      <p>15．AIBOX登陆异常告警：TBOX状态异常后，同时触发AIBOX登陆异常，则报警；</p>
      <p>16．车机屏幕未激活告警：TBOX状态异常后，同时触发车机屏未激活，则报警。</p>
    </Modal>
    <Modal v-model="contrlModal" title="远程控制" :mask-closable = false >
      <Row type="flex" justify="center" align="middle" :style="{marginTop:'25px'}">
          <Col span='12'>
              <div class="mid-sty">
                  <div>AIBOX</div>
                  <div class="round-img" style="marginTop: 10px">
                      <div class="letter">A</div>
                  </div>
                  <div style="marginTop: 15px">
                      <ButtonGroup size="large">
                          <Button @click="operation('5')">唤醒</Button>
                          <Button type="primary" @click="operation('6')">重启</Button>
                          <Button @click="operation('9')">拉取日志</Button>
                      </ButtonGroup>
                  </div>
              </div>
          </Col>
          <Col span='12'>
              <div class="mid-sty">
                  <div>TBOX</div>
                  <div class="round-img" style="marginTop: 10px">
                      <div class="letter">T</div>
                  </div>
                  <div style="marginTop: 15px">
                      <ButtonGroup size="large">
                          <Button type="primary" @click="operation('7')">重启</Button>
                          <Button @click="operation('8')">拉取日志</Button>
                      </ButtonGroup>
                  </div>
              </div>
          </Col>
      </Row>
    </Modal>
    <Modal footer-hide :width="800" :mask-closable="false" v-model="popMap" title="地图查看">
      <CarMap v-model="popMap" :orderCarStatus="orderCarStatus"></CarMap>
    </Modal>
    <Modal
        footer-hide
        :width="1100"
        title="操作记录"
        :mask-closable="false"
        v-model="popHistoryViewStatus">
        <History v-model="popHistoryViewStatus" :carId="carId"></History>
    </Modal>
    <video ref="alarmVideo"  name="media" v-show="false">
      <source src="@/assets/video/4031.wav" type="audio/wav">
    </video>
  </div>
</template>
<script>
import VTable from "_a/v-table/v-table";
import { returnFields, inputList, searchData, pageObj,ruleValidate } from "./fields";
import {
  axiosCarAlarmList,
  axiosCarAlarmRemove
} from "_o/api/operator-carrier";
import {
  controlCar 
} from '_o/api/vehicle.js'
import CarMap from "../../order-moules/order-info/components/detail-popview/car-map.vue";
import History from '../vehicle/operation/history'
export default {
  name:'car-alarm',
  components: {
    VTable,
    CarMap,
    History
  },
  data() {
    return {
      searchData,
      inputList,
      pageObj,
      ruleValidate,
      parColumns: [],
      tableData: [],
      cancelModal: false,
      infoModal: false,
      cancelModalData:{
        uuid:'',
        alarmResolvedDesc:'',
        comment:''
      },
      isAutoRef:false,
      contrlModal:false,
      popMap:false,
      seletedCarVin: '',
      historyDate: [],
      panelName:'',
      timer:null,
      lastTime: 0,
      orderCarStatus: {},
      popHistoryViewStatus: false,
      carId: ''
    };
  },
  created() {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.parColumns.push(value);
    });
  },
  mounted() {
    this.getList(this.searchData);
  },
  activated(){
    this.setLastTime()
    this.change(this.isAutoRef)
  },
  methods: {
    change (status) {
      let that = this
      if(status){
        this.setLastTime()
        this.timer = setInterval(()=>{
          that.getList(that.searchData,false,true)
        },60000)
      }else{
        this.stopRef()
      }
    },
    setLastTime(){
      if(!this.lastTime && this.tableData.length>0){
        this.lastTime = this.tableData[0].alarmTime
      }
    },
    stopRef(){
      clearInterval(this.timer);
      this.timer = null
    },
    operation (type) {
      if (type === '8' || type === '9') { // 拉取日志
          this.historyDate = []
          this.$Modal.confirm({
              title: '拉取日志',
              render: (h) => {
                  return h('div', [
                      h('div', '拉取日志时间范围 :'),
                      h('DatePicker', {
                          props: {
                              options: {
                                  disabledDate (date) {
                                      return date && date.valueOf() > Date.now()
                                  }
                              },
                              value: this.historyDate,
                              type: 'datetimerange',
                              format: 'yyyy-MM-dd HH:mm:ss',
                              placeholder: '请选择拉取日志时间范围'
                          },
                          style: {
                              width: '300px',
                              marginTop: '10px'
                          },
                          on: {
                              'on-change': (val) => {
                                  this.historyDate = val
                              }
                          }
                      })
                  ])
              },
              onOk: () => {
                  if (this.historyDate.length) {
                      let data = {
                          vin: this.seletedCarVin, 
                          controlType: type,
                          logStartTime: this.historyDate[0],
                          logEndTime: this.historyDate[1]
                      }
                      controlCar(data).then(res => {
                          this.$Message.success('拉取成功')
                      })
                  } else {
                      this.$Message.info('未选择拉取日期，拉取失败')
                  }
              }
          })
      } else { // 其他操作
        let data = {
          vin: this.seletedCarVin, 
          controlType: type
        }
        controlCar(data).then(res => {
          this.$Message.success('操作成功')
        })
      }
    },
    RemoveAlarm(name){
      this.$refs[name].validate((valid) => {
        if (valid) {
          axiosCarAlarmRemove(this.cancelModalData).then(res=>{
            this.$Message.success(res.data.msg||'操作成功')
            this.cancelModal = false
            this.getList(this.searchData,true);
          })
        }else{
          this.cancelModal = true
        }
      })
    },
    cancelRemove(name){
      this.$refs[name].resetFields();
      this.cancelModal = false
    },
    // 条件搜索后回调方法
    queryData(data) {
      for (let key in this.searchData) {
        delete this.searchData[key];
      }
      for (let key in data) {
        this.searchData[key] = data[key];
      }
      this.getList(data);
    },
    clearQueryData() {
      // 点击清空
      this.pageObj.current = 1;
      for (let key in this.searchData) {
        delete this.searchData[key];
      }
      this.getList();
    },
    changePage: function(val) {
      this.pageObj.current = val;
      this.getList(this.searchData);
    },
    changePageSize: function(val) {
      this.pageObj.pageSize = val;
      this.getList(this.searchData);
    },
    // 获取列表
    getList: function(obj, notLoading,isAuto) {
      // let that = this;
      let params = {
        pageSize: this.pageObj.pageSize,
        pageNum: this.pageObj.current
      };
      if (obj) {
        for (let key in obj) {
          params[key] = obj[key];
        }
      }
      !notLoading && this.$store.commit("changeLoadingFlag", true);
      axiosCarAlarmList(params).then(res => {
        let resdata = res.data.data;
        let list = resdata ? resdata.list : [];
        list.forEach(item=>{
          item.adress = ''
          if (item.longitude) {
            let geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: "all"
            });
            geocoder.getAddress(
              [item.longitude, item.latitude],
              function(status, result) {
                if (status === "complete" && result.info === "OK") {
                  if (result && result.regeocode) {
                    item.adress = result.regeocode.formattedAddress;
                  }
                }
              }
            );
          }
          if(item.status == 1){
            this.$set(item,'className','alarm-row')
          }
        })
        this.tableData = list
        this.pageObj.total = resdata && resdata.totalCount;
        this.$store.commit("changeLoadingFlag", false);
        if(this.tableData.length>0){
          let nowTime = this.tableData[0].alarmTime
          if(isAuto){
            if(nowTime>this.lastTime){
              this.$refs['alarmVideo'].play()
            }
            this.lastTime = nowTime
          }else{
            this.lastTime = nowTime
          }
        }
      });
    }
  },
  deactivated(){
    this.stopRef()
  },
  destroyed(){
    this.stopRef()
  }
};
</script>
<style lang="less" scoped>
  .counter{
    vertical-align: bottom;
    margin-left: 12px;
  }
  .right-flex{
    display: flex;
    justify-content:flex-end;
  }
  .bottom10{
    margin-bottom:10px;
  }
  .link_a{
    display: inline-block;
    color:#2d8cf0;
    cursor: pointer;
  }
  .info-modal{
    /deep/ .ivu-modal-body{
      padding-bottom:20px;
      line-height:32px;
    }
  }
  .flex-between{
    display: flex;
    justify-content: space-between;
    .text-block{
      display: inline-block;
      margin-right: 10px;
      font-size: 14px;
    }
  }
  .mid-sty{
    text-align: center;
    font-size: 15px;
    .round-img{
      width: 60px;
      height: 60px;
      border-radius: 30px;
      overflow: hidden;
      margin: 0 auto;
      img{
        width: 100%
      }
    }
  }
  .letter{
    width: 60px;
    height: 60px;
    line-height: 60px;
    font-size: 30px;
    color: #4b9cf2;
    border-radius: 30px;
    background: #eaf3fd;
}
.car-alarm{
  /deep/ .ivu-tooltip-rel{
    max-width: 180px;
  }
  /deep/ .ivu-table .ivu-table-row td{
    background: #bce7b3;
    color:#000;
  }
  /deep/ .ivu-table .ivu-table-row.alarm-row td{
    background: #fbb6b6;
    color:#ff1a1a;
  }
}
</style>

