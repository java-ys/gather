<!--
 * @description: 运营数据-运营地图
 * @author: wuxuan
 * @date: 2019-07-26 09:58:28
!-->
<template>
  <div>
    <div class="pagetitle">
      <p>车辆分布图</p>
      <p v-if="showCarList===true" class="closearrow">
        <span @click="onExport">导出</span>
        <span @click="showCarList = false">关闭</span>
      </p>
      <p
        v-else-if="choosecar"
        class="closearrow"
        style="width:320px;text-align:right;"
      >
        <span v-if="showCarList == 2" style="float:left;color:#333;" @click="(showCarList = true,choosecar = false)"><Icon type="ios-arrow-back" size="16" />返回</span>
        <span @click="arrowtoright(true)">关闭详情信息</span>
      </p>
    </div>
    <div class="maprea" ref="area">
      <!-- 地图 -->
      <div class="amap-page-container">
        <div
          id="container"
          ref="map"
        ></div>
      </div>
      <div v-if="showCarList===true" class="animation carsmsg" style="width: 500px;overflow: hidden;" @click.stop>
        <VTable
          class="op-map_fixed-right-tb"
          :border="false"
          :parColumns="carColumns"
          :parTableData="carList"
          :isShowPage="false"
          :height="tbHeight"
          @rowClickHandle="onCarTableRowClick"
        />
      </div>
      <!-- 右侧车辆信息 -->
      <div
        :class="[choosecar? 'animation' : '', 'carsmsg']"
        @click.stop
      >
        <div
          v-if="!sitePoints"
          class="floatmodal"
        >
          <div class="conttitle">
            <div class="title_header">
              实时信息
            </div>
          </div>
          <div class="contents">
            <div class="timecontmsg">
              <div class="ennergy">
                <p>剩余能耗</p>
                <p>{{ realTimeData.soc || 0 }}%</p>
              </div>
              <div class="ennergy">
                <p>续航里程</p>
                <p>{{ realTimeData.enduranceMileage || 0 }}Km</p>
              </div>
              <div class="ennergy">
                <p>当前车速</p>
                <p>{{ realTimeData.speed || 0 }}Km/h</p>
              </div>
            </div>
            <div class="adressplace">
              <Icon
                type="md-pin"
                size="18"
                color="#aaa"
              />
              <p>{{ realTimeData.address || '暂无' }}</p>
            </div>
          </div>
          <div class="conttitle">
            <div class="title_header">
              司机信息
            </div>
            <div
              class="morethan"
              @click="toSightDriver(currentCarMsg.driverUuid)"
            >
              更多
            </div>
          </div>
          <div class="contents">
            <div class="drivermsg">
              <div class="driver-item bottom15">
                <p>司机姓名</p>
                <p class="hascolor">
                  {{ driverMsgData.name || '暂无' }}
                </p>
              </div>
              <div class="driver-item bottom15">
                <p>司机电话</p>
                <div>
                  <span class="hascolor">{{ driverMsgData.mobile || '暂无' }}</span>
                  <Icon
                    type="ios-mail"
                    size="26"
                    class="blue-color"
                    @click="sendMassage(driverMsgData.mobile)"
                  />
                </div>
              </div>
              <div
                v-if="driverMsgData.status===1"
                class="driver-item"
              >
                <p>运营管理</p>
                <p
                  class="blue-color"
                  @click="offlineModal=true;switchTitle='强制下线'"
                >
                  强制下线
                </p>
              </div>
              <div
                v-if="driverMsgData.status===8"
                class="driver-item"
              >
                <p>运营管理</p>
                <p
                  class="blue-color"
                  @click="offlineModal=true;switchTitle='允许上线'"
                >
                  允许上线
                </p>
              </div>
            </div>
          </div>
          <div class="conttitle">
            <div class="title_header">
              车辆信息
            </div>
            <div
              class="morethan"
              @click="carOrderlistsight"
            >
              当日订单
            </div>
            <div
              class="morethan"
              @click="carDetail"
            >
              更多
            </div>
          </div>
          <div class="contents">
            <div class="drivermsg">
              <div class="driver-item bottom15">
                <p>车牌号码</p>
                <p class="hascolor">
                  {{ carBasicMsg.plateNumber || '暂无' }}
                </p>
              </div>
              <div class="driver-item bottom15">
                <p>业务类型</p>
                <p class="hascolor">
                  {{ carBasicMsgBType || '暂无' }}
                </p>
              </div>
              <div class="driver-item bottom15">
                <p>运营商</p>
                <p class="hascolor">
                  {{ carBasicMsg.operator || '暂无' }}
                </p>
              </div>
              <div class="driver-item bottom15">
                <p>品牌</p>
                <p class="hascolor">
                  {{ carBasicMsg.brandName || '暂无' }}
                </p>
              </div>
              <div class="driver-item bottom15">
                <p>车型名称</p>
                <p class="hascolor">
                  {{ carBasicMsg.modelName || '暂无' }}
                </p>
              </div>
              <div class="driver-item bottom15">
                <p>颜色</p>
                <p class="hascolor">
                  {{ carBasicMsg.colour || '暂无' }}
                </p>
              </div>
              <div class="driver-item bottom15">
                <p>充电状态</p>
                <p class="hascolor">
                  {{ realTimeData.chargingStatus?realTimeData.chargingStatus==1?'充电中':'未充电':'暂无' }}
                </p>
              </div>
              <div class="driver-item">
                <p>最后更新时间</p>
                <p class="hascolor">
                  {{ realTimeData.timestamp || '暂无' }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- 周边场地信息 -->
        <div
          v-else
          class="sitedetail"
        >
          <div class="msgcontent">
            <p class="msgtitles">
              周边设施站点信息
            </p>
            <p class="msgfont">
              <span>设施站点名称：</span>
              <span>{{ siteMsgData.name || '暂无' }}</span>
            </p>
            <p class="msgfont">
              <span>设施站点省：</span>
              <span>{{ siteMsgData.province || '暂无' }}</span>
            </p>
            <p class="msgfont">
              <span>设施站点市：</span>
              <span>{{ siteMsgData.city || '暂无' }}</span>
            </p>
            <p class="msgfont">
              <span>设施站点所在地址：</span>
              <span>{{ siteMsgData.address || '暂无' }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="autocomplete-view" :style="'bottom:'+(focus?0:'auto')">
        <div style="position:relative;" @click.stop="onSearchFocus">
          <Input
            v-model="auto"
            placeholder="请输入地址"
            :maxlength="50"
            clearable
            search
          />
          <template v-if="focus">
            <div v-if="!auto" class="op-map_history">搜索记录<Icon type="ios-trash-outline" size="24" @click="onClearHistory" /></div>
            <ul class="op-map_search-list" @click="onSelectComplete">
              <li v-if="auto&&!autoData.length" class="op-map_search-list-item op-map_search-list-item-empty">暂无匹配内容</li>
              <template v-else>
                <li
                  v-for="(v,i) of (auto ? autoData : cacheList)"
                  :key="v.id||v.adcode"
                  class="op-map_search-list-item"
                  :data-district="v.district"
                  :data-index="i"
                >{{v.name}}</li>
              </template>
            </ul>
          </template>
        </div>
      </div>
      <!-- 左侧条件查询 -->
      <div class="leftshadow">
        <!-- 城市 -->
        <div class="locationquery borderbottom" style="margin-top: 50px">
          <div class="selectline disflexstyle">
            <div class="selecttitles">
              城市
            </div>
            <Cascader
              v-model="cityvalue"
              :data="citysdata"
              trigger="hover"
              :clearable="false"
              transfer
              placeholder="请选择城市"
              style="width:190px"
              @on-change="chooseCity"
            ></Cascader>
          </div>
        </div>
        <!-- 车辆 -->
        <div class="locationquery">
          <div class="selectfont">
            定位查询
          </div>
          <div class="selectline">
            <div class="selectmargin disflexstyle">
              <div class="selecttitles">
                运营商
              </div>
              <Select
                v-model="currentChangeData.agentUUID"
                clearable
                multiple
                style="width:190px"
                placeholder="请选择运营商"
                @on-change="getAgentByoperation"
              >
                <Option
                  v-for="(item, index) in agentList"
                  :key="item.value + index"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </div>
            <div class="selectmargin disflexstyle">
              <div class="selecttitles">
                司管
              </div>
              <Select
                v-model="currentChangeData.driverManagerId"
                clearable
                multiple
                style="width:190px"
                placeholder="请选择司管"
              >
                <Option
                  v-for="item in driverManagerList"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </div>
            <div class="selectmargin disflexstyle">
              <div class="selecttitles">
                产品线
              </div>
              <Select
                v-model="currentChangeData.carType"
                style="width:190px"
                multiple
                placeholder="请选择产品线"
                clearable
              >
                <Option
                  v-for="item in businessTypeList"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </div>
            <div class="selectmargin disflexstyle">
              <div class="selecttitles">
                运营状态
              </div>
              <Select
                v-model="currentChangeData.operationStatus"
                clearable
                multiple
                style="width:190px"
                placeholder="请选择车辆运营状态"
              >
                <Option
                  v-for="item in carStatusList"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </div>
            <div class="selectmargin disflexstyle">
              <div class="selecttitles">
                车牌号/手机号
              </div>
              <Input
                v-model="currentChangeData.carNoOrMobile"
                clearable
                placeholder="请输入车牌号或手机号"
                style="width: 190px"
              />
            </div>
            <div class="selectmargin disflexstyle">
              <div class="selecttitles">
                半径
              </div>
              <InputNumber
                v-model="radius"
                :min="1"
                :max="9999"
                :precision="0"
                clearable
                placeholder="请输入半径"
                style="width: 190px"
              />
            </div>
          </div>
          <div class="searchbtn">
            <LoadingButton
              class="right15"
              :width="110"
              btntitle="清空"
              loadingtitle="清空中..."
              :loading="isClearloading"
              @on-click="onSearchBtn(chooseCityMsg,true)"
            ></LoadingButton>
            <LoadingButton
              type="primary"
              :loading="isloading"
              @on-click="onSearchBtn(chooseCityMsg)"
            ></LoadingButton>
          </div>
        </div>
        <!-- 场地 -->
        <div class="locationquery borderbottom">
          <div class="selectline">
            <div class="selectidx">
              <CheckboxGroup
                v-model="othermarkSelect.checkAllGroup"
                @on-change="checkAllGroupChange"
              >
                <div class="sortvcolum">
                  <div class="gropustyle">
                    <Checkbox label="1">
                      <div class="checkboxstyle">
                        <p
                          class="imgstyle"
                          :style="{'border-color': comCheckStatus[1]? '#2d8cf0':''}"
                        >
                          <Icon
                            type="md-battery-charging"
                            size="30"
                            :style="{'color':comCheckStatus[1]?'#2d8cf0': ''}"
                          />
                        </p>
                        <p>充电站</p>
                      </div>
                    </Checkbox>
                  </div>
                  <div class="gropustyle">
                    <Checkbox label="0">
                      <div class="checkboxstyle">
                        <p
                          class="imgstyle"
                          :style="{'border-color': comCheckStatus[0]? '#2d8cf0':''}"
                        >
                          <Icon
                            type="ios-beer"
                            size="30"
                            :style="{'color':comCheckStatus[0]?'#2d8cf0': ''}"
                          />
                        </p>
                        <p>加油站</p>
                      </div>
                    </Checkbox>
                  </div>
                  <div class="gropustyle">
                    <Checkbox label="2">
                      <div class="checkboxstyle">
                        <p
                          class="imgstyle"
                          :style="{'border-color': comCheckStatus[2]? '#2d8cf0':''}"
                        >
                          <Icon
                            type="ios-flame"
                            size="30"
                            :style="{'color':comCheckStatus[2]?'#2d8cf0': ''}"
                          />
                        </p>
                        <p>充气站</p>
                      </div>
                    </Checkbox>
                  </div>
                  <div class="gropustyle">
                    <Checkbox label="4">
                      <div class="checkboxstyle">
                        <p
                          class="imgstyle"
                          :style="{'border-color': comCheckStatus[4]? '#2d8cf0':''}"
                        >
                          <Icon
                            type="md-contacts"
                            size="30"
                            :style="{'color':comCheckStatus[4]?'#2d8cf0': ''}"
                          />
                        </p>
                        <p>司机之家</p>
                      </div>
                    </Checkbox>
                  </div>
                  <div class="gropustyle">
                    <Checkbox label="3">
                      <div class="checkboxstyle">
                        <p
                          class="imgstyle"
                          :style="{'border-color': comCheckStatus[3]? '#2d8cf0':''}"
                        >
                          <Icon
                            type="ios-construct"
                            size="30"
                            :style="{'color':comCheckStatus[3]?'#2d8cf0': ''}"
                          />
                        </p>
                        <p>维修站</p>
                      </div>
                    </Checkbox>
                  </div>
                </div>
              </CheckboxGroup>
            </div>
          </div>
        </div>
        <!-- 电子围栏 -->
        <div class="locationquery">
          <div class="selectfont">
            电子围栏
          </div>
          <div class="selectline">
            <div class="selectmargin disflexstyle">
              <div class="selecttitles">
                围栏类型
              </div>
              <Select
                v-model="enclosureTypeData.enclosuretype"
                :clearable="true"
                style="width:190px"
                placeholder="请选择围栏类型"
                @on-change="getElefenceList"
              >
                <Option
                  v-for="item in railTypeList"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </div>
            <div class="selectmargin disflexstyle">
              <div class="selecttitles">
                选择围栏
              </div>
              <Select
                v-model="enclosureTypeData.enclosureitem"
                :clearable="true"
                multiple
                style="width:190px"
                placeholder="请选择围栏"
              >
                <Option
                  v-for="item in elefenlist"
                  :key="item.uuid"
                  :value="item.uuid"
                >
                  {{ item.name }}
                </Option>
              </Select>
            </div>
          </div>
          <div class="searchbtn">
            <Button
              class="right15"
              style="width:110px"
              @click="cllearElefence"
            >
              清空
            </Button>
            <Button
              type="primary"
              style="width:190px"
              @click="renderElefence(enclosureTypeData.enclosureitem)"
            >
              查询
            </Button>
          </div>
        </div>
      </div>
      <!-- 地图左上-刷新热力图路况 -->
      <div class="lefttopshadow">
        <div
          class="btnstyle-shadow animatestyle"
          @click="refreshMap(true)"
        >
          <Icon
            type="md-sync"
            size="26"
            :class="['animated', isrefresh ?'rotateIn': '']"
            :style="{'color': isrefresh? '#2d8cf0' : ''}"
          />
          <p :style="{'color': isrefresh? '#2d8cf0' : ''}">
            刷新
          </p>
        </div>
        <div
          class="btnstyle-shadow"
          @click="getTrafficTileLayer"
        >
          <Icon
            type="ios-paper-plane-outline"
            size="26"
            :style="{'color': isVisibleToggle? '#2d8cf0' : ''}"
          />
          <p :style="{'color': isVisibleToggle? '#2d8cf0' : ''}">
            实时路况
          </p>
        </div>
      </div>
      <!-- 地图下方，标识解读 -->
      <div class="leftbottomshadow">
        <div class="detailexplain margin_rights">
          <p class="extile">
            业务线：
          </p>
          <div class="small-shadow detailexplain">
            <div
              class="smallbtnstyle backbg_s"
              @click="carTypeChoice(2)"
            >
              专享
            </div>
            <div
              class="smallbtnstyle backbg_h"
              @click="carTypeChoice(4)"
            >
              快享
            </div>
            <div
              class="smallbtnstyle backbg_t"
              @click="carTypeChoice(1)"
            >
              出租车
            </div>
          </div>
        </div>
        <div class="detailexplain">
          <p class="extile">
            运营状态：
          </p>
          <div class="small-shadow detailexplain">
            <div
              v-for="item in statusNumList"
              :key="item.className"
              class="survey"
              :class="item.className"
            >
              <span class="dots"></span>
              <span class="status-name">{{ item.statusName }}</span>
              <span class="status-num">{{ item.statusNum }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 强制下线 -->
    <Modal
      v-model="offlineModal"
      :title="switchTitle"
      :width="700"
      class-name="vertical-center-modal"
    >
      <Row>
        <Col span="12">
        <div class="disstyle">
          <p class="sendobj sendtitle">
            司机ID：
          </p>
          <div class="sentchoice">
            {{ driverMsgData.driverNo || '暂无' }}
          </div>
        </div>
        </Col>
        <Col span="12">
        <div class="disstyle">
          <p class="sendobj sendtitle">
            司机电话：
          </p>
          <div class="sentchoice">
            {{ driverMsgData.mobile || '暂无' }}
          </div>
        </div>
        </Col>
      </Row>
      <Row class="bottom15">
        <Col span="12">
        <div class="disstyle">
          <p class="sendobj sendtitle">
            司机姓名：
          </p>
          <div class="sentchoice">
            {{ driverMsgData.name || '暂无' }}
          </div>
        </div>
        </Col>
        <Col span="12">
        <div class="disstyle">
          <p class="sendobj sendtitle">
            身份证号：
          </p>
          <div class="sentchoice">
            {{ driverMsgData.idCard || '暂无' }}
          </div>
        </div>
        </Col>
      </Row>

      <div class="messagedistance">
        <p class="sendobj sendtitle">
          <span class="must-tag">*</span>备注：
        </p>
        <div class="addmessage">
          <Input
            v-model="offlineRemark"
            type="textarea"
            style="width: 560px;"
            :maxlength="remarklength"
            :rows="4"
            placeholder="请输入备注"
            @on-change="iptevent"
          />
          <span class="iptfontnums">{{ offlineRemark.length }}/200</span>
        </div>
      </div>
      <div slot="footer">
        <Button
          type="text"
          @click="offlineModal=false;offlineRemark=''"
        >
          取消
        </Button>
        <Button
          type="primary"
          @click="axiosOffline"
        >
          确认
        </Button>
      </div>
    </Modal>
    <!-- 发送短信弹窗 -->
    <Modal
      v-model="messagesent"
      title="发送短信"
      class-name="vertical-center-modal"
    >
      <div class="disstyle">
        <p class="sendobj sendtitle">
          司机电话：
        </p>
        <div class="sentchoice">
          {{ driverMsgData.mobile }}
        </div>
      </div>
      <div class="messagedistance">
        <p class="sendobj sendtitle">
          短信内容：
        </p>
        <div class="addmessage">
          <Input
            v-model="addmsg"
            type="textarea"
            style="width: 300px;"
            :maxlength="remarklength"
            :rows="6"
            placeholder="请输入短信内容"
            @on-change="iptevent"
          />
          <span class="iptfontnums">{{ iptfontnums }}/200</span>
        </div>
      </div>
      <div slot="footer">
        <Button
          type="text"
          @click="cancelMessage"
        >
          取消
        </Button>
        <Button
          type="primary"
          @click="confirmSave"
        >
          确认
        </Button>
      </div>
    </Modal>
    <!-- 当日订单列表弹窗 -->
    <Modal
      v-model="carslists"
      title="当日订单列表"
      :width="1330"
      class-name="vertical-center-modal"
    >
      <div class="listcontent">
        <div class="listtabel">
          <VTable
            :total="carlistdata.total"
            :current="carlistdata.current"
            :pageSize="carlistdata.pageSize"
            :parColumns="carlistdata.parColumns"
            :parTableData="carlistdata.parTableData"
            :pageSizeOpts="carlistdata.pageSizeOpts"
            :height="carlistdata.height"
            :width="carlistdata.width"
            :isShowPage="false"
            class="top15"
            @changePage="changePage"
            @changePageSize="changePageSize"
          ></VTable>
        </div>
        <div class="pagegranption"></div>
      </div>
    </Modal>
  </div>
</template>
<script>
import VTable from "_a/v-table/v-table";
import LoadingButton from "_a/loading-button/index";
import { returnFields, pointStyle, nameList } from "./fields";
import {
  getSiteList,
  queryCarListByRemote,
  findOneByVin,
  getElefenServiceSelect,
  getOpmanerByOrgan,
  sendSms,
  getRmoteEdit,
  getCarByVin,
  getDriverDetail,
  getDriverOrderPage,
  axiosForcedOffline,
  axiosAllowOnline
} from "_o/api/configData.js";
import { getAppointedProvinceCityInAuth,getAgentByCityAuth } from "_g/api/common.js";
import { timeFormat } from "@/libs/util";
import siteImg from "_o/assets/images/mapsicon/icons.svg";
import { railList } from "_g/config/status-map"
import { mapState } from "vuex";
import XLSX from 'xlsx';

export default {
  name: "operative-map",
  components: {
    VTable,
    LoadingButton
  },
  data() {
    let self = this;
    return {
      tbHeight: 795,
      focus: false,
      auto: '',
      autoData: [],
      cacheList: JSON.parse(localStorage.getItem('__complete__')) || [],
      radius: '',
      showCarList: false,
      carColumns: [
        {
          title: '车牌号',
          key: 'carNo',
          minwidth: 120,
          render: (h, params) => h('span', {style: 'color: #57a3f3;cursor:pointer;', on: {click: () => this.selectCarInMap(params.row)}} , params.row.carNo)
        },
        {
          title: '司机姓名',
          key: 'driverName',
          minwidth: 120,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: '司机电话',
          key: 'mobile',
          minwidth: 120,
        },
        {
          title: '司机ID',
          key: 'driverUuid',
          minwidth: 120,
          ellipsis: true,
          tooltip: true,
          render: (h, params) => h('span', {style: 'color: #57a3f3;cursor:pointer;', on: {click: () => this.onCarTableRowClick(params.row)}} , params.row.driverUuid)
        },
      ],
      carList: [],
      pointStyle,
      switchTitle: "强制下线",
      offlineModal: false, // 强制下线弹窗
      offlineRemark: "", // 强制下线备注
      MarkTime: 0, // 点击图标的时间，用于禁止冒泡
      cityvalue: [], // 选中省市
      cluster: null, // 点聚合
      mmkCarData: [], // 车辆点标记集
      othermarkSelect: { // 场地标记
        indeterminate: false,
        checkAll: false,
        checkAllGroup: []
      },
      addmsg: "", // 发送短信内容
      messagesent: false, // 发送短信弹窗状态
      choosecar: false, // 是否点击选中了某个标记，弹出右侧信息框
      sitePoints: false, // 是否点击选中了某个站点
      carslists: false, // 当日订单列表弹窗
      carlistdata: { // 当日订单列表数据
        total: 0,
        current: 1,
        pageSize: 10000,
        height: 350,
        width: 1300,
        parColumns: [],
        parTableData: [],
        pageSizeOpts: [5, 10, 20, 30, 40]
      },
      citysdata: [], // 省市下拉列表
      siteData: { // 场地信息
        onedata: [],
        twodata: [],
        threedata: [],
        fourdata: [],
        fivedata: []
      },
      oldcheckdata: [], // 存储站点站码
      mmkSiteData: [],
      currentChangeData: {
        agentUUID: "", // 运营商id
        driverManagerId: "", // 司管id
        carType: "", // 1：出租车、2：专享、3：跨城拼车、4：快享、5：货的、6：骑手、7：搬家、8：展会
        operationStatus: "", // 0:待运营，1:待绑定，2:运营中，3:维护中，4：退出运营，5：冻结
        carNoOrMobile: "" // 	车牌或电话
      },
      enclosureTypeData: {
        enclosuretype: null,
        enclosureitem: []
      },
      realTimeData: {}, // 车辆实时信息
      carBasicMsg: {}, // 车辆基础信息
      driverMsgData: {}, // 司机信息
      chooseCityMsg: {}, // 选择的城市信息
      remarklength: 200, // 短信发送最大限度长度
      siteMsgData: {}, // 站点信息存贮
      currentRenderSite: [], // 渲染站点点集合
      railTypeList: railList,
      carStatusList: [
        {
          value: "3",
          label: "服务中"
        },
        {
          value: "2",
          label: "接乘中"
        },
        {
          value: "1",
          label: "巡游中"
        },
        {
          value: "0",
          label: "下线"
        }
      ],
    //   businessTypeList: [
    //     {
    //       value: "2",
    //       label: "专享"
    //     },
    //     {
    //       value: "4",
    //       label: "快享"
    //     },
    //     {
    //       value: "1",
    //       label: "出租车"
    //     }
    //   ],
      ishowThermogram: false,
      isrefresh: false,
      district: null,
      currentCarMsg: {}, // 存储当前车辆的信息
      agentList: [], // 运营商列表
      driverManagerList: [], // 司管列表
      elefenlist: [], // 电子围栏列表
      overlays: [], // 电子围栏对象列表
      isVisibleToggle: false,
      trafficLayer: null, // 路况对象
      heatmap: null, // 热力图对象,
      polygonVal: "", // 电子围栏uuid存储
      railType: "", // 司管id存储
      isloading: false, // 按钮请求态
      isClearloading: false, // 清空按钮请求态
      mass: null,
      map: null,
      cMarkers: [],
      statusNumList: [// 状态解读
        {
          status: 3, // 绿色
          className: "dots_s",
          statusName: "服务中",
          statusNum: "",
        },
        {
          status: 2, // 蓝色
          className: "dots_g",
          statusName: "接乘中",
          statusNum: "",
        },
        {
          status: 1, // 红色
          className: "dots_f",
          statusName: "巡游中",
          statusNum: "",
        },
        {
          status: 0, // 灰色
          className: "dots_o",
          statusName: "下线",
          statusNum: "",
        },
        {
          status: 4, // 灰色
          className: "dots_a",
          statusName: "总数",
          statusNum: "",
        }
      ]
    };
  },
  created() {
    AMap.plugin('AMap.Autocomplete', () => {
      this._autocomplete = new AMap.Autocomplete({city: '全国'});
    })
    this.getCityList();
    document.addEventListener('click', this.onSearchBlur)
  },
  destroyed() {
    document.removeEventListener('click', this.onSearchBlur);
  },
  computed: {
    ...mapState({
      businessTypeList: state => state.common.bizTypeList,
    }),
    // 短信信息长度
    iptfontnums() {
      return this.addmsg.toString().length > 200
        ? 200
        : this.addmsg.toString().length;
    },
    // 车辆业务类型
    carBasicMsgBType() {
      let carBasicMsg = this.carBasicMsg;
      switch (carBasicMsg.businessType) {
        case 1:
          return "出租车";
        case 2:
          return "专享";
        case 3:
          return "跨城";
        case 4:
          return "快享";
      }
    },
    // 不同类型电子围栏颜色
    elefenceClolr() {
      let type = this.enclosureTypeData.enclosuretype
      switch (type) {
        case 1:
          return "#2196f3"
        case 2:
          return "#ff0000"
        default:
          return "#ff0000"
      }
    },
    // 各场地选中状态
    comCheckStatus() {
      let checkGroup = JSON.parse(JSON.stringify(this.othermarkSelect.checkAllGroup));
      let current = {};
      checkGroup.forEach(item => {
        current[item] = true;
      });
      return current;
    }
  },
  watch: {
    messagesent: function() {
      if (!this.messagesent) {
        this.addmsg = "";
      }
    },
    carslists: function() {
      if (!this.carslists) {
        this.total = 0;
        this.current = 1;
        this.pageSize = 5;
      }
    },
    auto(v) {
      if(v) {
        this._autocomplete.search(v, (status, result) => {
          if(status === 'complete') this.autoData = result.tips;
        })
      } else {
        this._select = null;
        this.autoData = [];
        this._centerMarker && this.map.remove(this._centerMarker)
        this._circle && this.map.remove(this._circle)
        this.getCurentLocation();
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.tbHeight = window.innerHeight - this.$refs.area.offsetTop - 20;
      // dom点击，关闭右侧详情弹窗
      document.addEventListener("click", () => {
        this.arrowtoright()
      })
      // 点击弹窗，禁止冒泡
      let Modals = document.getElementsByClassName("vertical-center-modal")
      for (let val of Modals) {
        val.addEventListener("click", (e) => {
          e.stopPropagation();
        })
      }
      this.map = new AMap.Map("container", {
        resizeEnable: true,
        zoom: 8,
        mapStyle: "amap://styles/macaron"
      });
    })
  },
  methods: {
    onExport() {
      const {carColumns, carList} = this;
      const keys = carColumns.map(v => v.key);
      const data = [carColumns.map(v => v.title)].concat(carList.map(v => keys.map(k => v[k])));
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet(data)
      ws['!cols'] = [ {wch: 15}, {wch: 15}, {wch: 15}, {wch: 35} ];
      XLSX.utils.book_append_sheet(wb, ws, '车辆列表')
      XLSX.writeFile(wb, '车辆列表.xlsx')
    },
    onCarTableRowClick(row) {
      this.$router.push('/driver-operation-admin/driver/staff-detail/'+row.driverUuid)
    },
    selectCarInMap(row) {
      this.map.setZoomAndCenter(20, row.lnglat)
    },
    onSearchFocus() {
      this.focus = true;
    },
    onSearchBlur() {
      this.focus = false;
    },
    onClearHistory() {
      this.$Modal.confirm({
        title: '您确定要清空所有历史记录吗？',
        onOk: () => {
          localStorage.removeItem('__complete__');
          this.cacheList = [];
        }
      })
    },
    onSelectComplete({target:{dataset:{index}}}) {
      if(!index) return;
      let list = [];
      let item = null;
      if(this.auto) {
        item = this.autoData[index];
        list = [item].concat(this.cacheList.filter(v => item.id ? v.id != item.id : item.adcode != v.adcode).slice(0, 9));
      } else {
        list = this.cacheList.slice(0, 10);
        item = list.splice(index,1)[0];
        list.unshift(item);
      }
      localStorage.setItem('__complete__', JSON.stringify(list));
      this.cacheList = list;
      this.auto = item.name;
      this._select = item;
      this._centerMarker && this.map.remove(this._centerMarker)
      this._circle && this.map.remove(this._circle)
      this.chooseCity([item.adcode.slice(0, -2) + '00']);
    },
    // 强制下线/允许上线
    axiosOffline() {
      if (!this.offlineRemark) {
        this.$Message.warning("请填写备注内容");
        return false;
      }
      let that = this
      let params = {
        driverUuid: this.driverMsgData.uuid,
        operateRemark: this.offlineRemark
      };
      // 判断是强制下线还是允许上限
      let axiosFun = this.driverMsgData.status === 1 ? axiosForcedOffline : axiosAllowOnline
      axiosFun(params).then(res => {
        if (res.data.success) {
          this.offlineModal = false;
          this.offlineRemark = ""
          this.$Message.success(res.data.msg || "操作成功");
          this.getDriverDetailMsg({ driverUuid: that.driverMsgData.uuid })
          this.refreshMap()
        } else {
          this.$Message.success(res.data.msg || "操作失败");
        }

      })
    },
    // 获取当前省份定位-默认南京
    getCurentLocation() {
      let that = this;
      let defaultCityCode = "320100"
      let citysearch = new AMap.CitySearch();
      citysearch.getLocalCity(function(status, result) {
        if (status === "complete" && result.info === "OK") {
          if (result && result.city && result.bounds) {
            let cityinfo = result.city;
            let citybounds = result.bounds;
            // 地图显示当前城市
            let cityArray = JSON.parse(JSON.stringify(that.citysdata));
            let city_province = [];
            cityArray.forEach(parent => {
              parent.children.forEach(item => {
                if (item.cityID == defaultCityCode) {
                  city_province.push(item.province);
                  city_province = [item.provinceID, item.cityID];
                }
              })
            });
            if (city_province.length > 0) {
              that.cityvalue = city_province;
              that.chooseCity(city_province);
            } else {
              that.cityvalue = []
            }
          }
        }
      });
    },
    // 根据城市获取运权限内营商
    getOptationByCitycode(cityCode) {
      // 根据城市获取运营商
      this.agentList = []; // 切换城市时清空运营商列表，避免无返回依存
      getAgentByCityAuth({ cityCode })
        .then(res => {
          let agentList = res.data.data;
          agentList.forEach(item => {
            item.label = item.name;
            item.value = item.uuid;
          });
          this.agentList = agentList;
        })
        .catch(err => {});
    },
    // 根据运营商获取司管
    getAgentByoperation(agentUuiddata) {
      // 根据运营商获取司管
      if (!agentUuiddata.length) {
        return;
      }
      this.driverManagerList = []; // 切换城市时清空司管列表，避免无返回依存
      getOpmanerByOrgan({ agentUuids: agentUuiddata })
        .then(res => {
          let driverManagerList = res.data.data;
          driverManagerList.forEach(item => {
            item.label = item.realName;
            item.value = item.uuid;
          });
          this.driverManagerList = driverManagerList;
        })
        .catch(err => {});
    },
    // 根据围栏类型获取围栏
    // params:type === 1,刷新，type===2,默认选中所有围栏（运营围栏），!type,选择围栏类型
    getElefenceList(val, type) {
      type !== 1 && (this.enclosureTypeData.enclosureitem = [])
      if (!val) {
        return;
      }
      if(!this.chooseCityMsg.cityID) {
        return false
      }
      let cityCodeData = this.chooseCityMsg;
      this.railType = val;
      getElefenServiceSelect({
        cityCode: cityCodeData.cityID,
        railType: val,
        status: 1// 生效中状态的电子围栏
      })
        .then(res => {
          let map = this.map
          let polygons = map.getAllOverlays("polygon"); // 获取地图上所有得图形区域
          this.elefenlist = res.data.data;
          if (type === 2) {
            this.enclosureTypeData.enclosureitem = this.elefenlist.map(item => {
              return item.uuid
            })
            this.renderElefence(this.enclosureTypeData.enclosureitem)
          }
        })
        .catch(err => {});
    },
    // 清除所有电子围栏
    cllearElefence() {
      this.elefenlist = []// 清除选择围栏列表
      this.polygonVal = []; // 清除存储的当前选中的围栏图形
      // 清除电子围栏筛选条件
      this.$set(this.enclosureTypeData, "enclosuretype", null)
      this.$set(this.enclosureTypeData, "enclosureitem", [])
      // 清除地图电子围栏
      let map = this.map
      let polygons = map.getAllOverlays("polygon"); // 获取地图上所有得图形区域
      map.remove(polygons);
      this.polygons && this.polygons.length && map.add(this.polygons); // 添加行政边界图
    },
    // 添加电子围栏
    renderElefence(val) {
      // 渲染电子围栏
      let eleList = JSON.parse(JSON.stringify(this.elefenlist));
      let map = this.map
      let polygons = map.getAllOverlays("polygon"); // 获取地图上所有得图形区域
      this.polygonVal = val; // 存储当前选中的围栏图形
      polygons.length && map.remove(polygons); // 清楚地图上的所有图形区域
      this.polygons && this.polygons.length && map.add(this.polygons); // 添加行政边界图
      // 保持当前比例尺
      // this.polygons && this.polygons.length && map.setFitView(this.polygons); //视口自适应
      if (val.length === 0) {
        return false
      }
      this.overlays = [];
      eleList.forEach(item => {
        if (val.indexOf(item.uuid) > -1) {
          let scopes = item.scope;
          let plioylist = scopes.split("&");
          let polyitem = [];
          let ployitemLngLat = [];
          plioylist.forEach(ele => {
            if(ele){
              let lonlat = ele.split(";");
              polyitem.push(lonlat);
            }
          });
          polyitem.forEach(item => {
            let currentArray = [];
            item.forEach(i => {
              currentArray.push(i.split(","));
            });
            this.overlays.push(new AMap.Polygon({
              path: currentArray,
              fillColor: this.elefenceClolr,
              strokeColor: this.elefenceClolr,
              strokeWeight: 2,
              strokeOpacity: 0.3,
              fillOpacity: 0.2,
              zIndex: 1
            }));
          });
          this.overlays.forEach(item => {
            item.setMap(map);
          });
        }
      });
    },
    // 获取司机详情
    getDriverDetailMsg(data) {
      // 获取司机详情信息
      let that = this;
      getDriverDetail({ driverUuid: data.driverUuid })
        .then(res => {
          that.driverMsgData = (res.data && res.data.data) || {};
        })
        .catch(err => {
          that.driverMsgData = {};
        });
    },
    // 获取车辆基本信息
    getCarByVinMsg(data) {
      // 获取车辆基本信息
      getCarByVin({ otherIndex: data.vin })
        .then(res => {
          let data = res.data.data || {}
          this.carBasicMsg = data
        })
        .catch(err => {
          this.carBasicMsg = {};
        });
    },
    // 获取车辆实时信息
    getfindOneByVinMsg(data) {
      // 获取车辆实时信息
      findOneByVin({ otherIndex: data.vin })
        .then(res => {
          let that = this;
          let realTimeData = res.data.data;
          realTimeData.timestamp && (realTimeData.timestamp = this.$moment(realTimeData.timestamp).format("YYYY-MM-DD HH:mm:ss"))
          if (realTimeData.longitude) {
            let geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: "all"
            });
            geocoder.getAddress(
              [realTimeData.longitude, realTimeData.latitude],
              function(status, result) {
                if (status === "complete" && result.info === "OK") {
                  if (result && result.regeocode) {
                    realTimeData["address"] = result.regeocode.formattedAddress;
                    that.realTimeData = realTimeData;
                  }
                }
              }
            );
          } else {
            this.realTimeData = realTimeData;
          }
        })
        .catch(err => {
          this.realTimeData = {};
        });
    },
    // 获取城市列表（已开通）
    getCityList() {
      let data = {};
      const ergodic = arrays => {
        for (let i = 0; i < arrays.length; i++) {
          arrays[i]["label"] = arrays[i].province;
          arrays[i]["value"] = arrays[i].provinceID;
          if (arrays[i].nodes && arrays[i].nodes.length) {
            let currentarray = arrays[i].nodes;
            for (let j = 0; j < currentarray.length; j++) {
              currentarray[j]["label"] = currentarray[j].city;
              currentarray[j]["value"] = currentarray[j].cityID;
            }
            arrays[i]["children"] = arrays[i].nodes;
            delete arrays[i].nodes;
          }
        }
        return arrays;
      };
      let params = {
        areaType: 2,//已开启城市
        businessLineList: [1,2,4,6,7]//快车、专车、出租车、惠享、自动驾驶
      }
      getAppointedProvinceCityInAuth(params).then(res => {
        let resData = res.data.data||[]
        this.citysdata = ergodic(resData);
        this.getCurentLocation();
      })
    },
    // 标记汽车
    renderMarkers(fakeAarry, valcitycode) {
      let that = this;
      let map = this.map
      if (this.cluster) {
        this.cluster.clearMarkers();
      }
      const item = that._select;
      if(item && item.location && that.radius) {
        that._circle && map.remove(that._circle)
        map.add(that._circle = new AMap.Circle({
          center: new AMap.LngLat(item.location.lng, item.location.lat),
          radius: that.radius,
          fillColor: 'red',
          fillOpacity: 0.3
        }))
        // 延迟计算渲染，避免卡顿
        that.$nextTick(() => {
          const Han = {
            '长': '常',
            '重': '虫'
          }
          const rename = (str='') => str[0] in Han ? Han[str[0]] + str.slice(1) : str;
          that.carList = fakeAarry.filter(v => that._circle.contains(new AMap.LngLat(v.currentLng, v.currentLat))).map(v => ({
            carNo: v.carNo,
            mobile: v.mobile,
            driverUuid: v.driverUuid,
            driverName: v.driverName,
            vin: v.vin,
            lnglat: [v.currentLng, v.currentLat]
          })).sort((a,b) => rename(a.carNo).localeCompare(rename(b.carNo), 'zh-CN'))
          that.showCarList = true;
        })
      }
      this.cluster = null
      this.cMarkers = []
      let list = [0, 0, 0, 0]
      fakeAarry.forEach(item => {
        item.lnglat = [item.currentLng, item.currentLat]
        let name = item.bussinessId + String(item.driverStatus)
        let index = nameList.indexOf(name)
        item.style = index * 360 + parseInt(item.direction)
        that.cMarkers.push(new AMap.Marker({
          position: item.lnglat,
          content: "<div></div>",
          offset: new AMap.Pixel(-15, -15)
        }))
        // 各个车辆运营状态数量统计
        list[item.driverStatus]++
      })
      let totalNum = 0
      for (let i = 0; i < 4; i++) {
        this.statusNumList[i].statusNum = list[3 - i]
        totalNum = totalNum + list[3 - i]
      }
      this.statusNumList[this.statusNumList.length - 1].statusNum = totalNum
      // 添加海量点
      if (this.mass) {
        this.mass.clear()
      }
      this.mass = new AMap.MassMarks(fakeAarry, {
        opacity: 1,
        zIndex: 111,
        cursor: "pointer",
        style: that.pointStyle
      });
      let marker = new AMap.Marker({ content: " ", map: map });
      this.mass.on("click", function (e) {
        marker.setPosition(e.data.lnglat);
        marker.setLabel({ content: e.data.name })
        let newData = e.data
        that.getCarNodemsg(newData);
        that.sitePoints = false;
        that.choosecar = true;
        that.showCarList = false;
        that.MarkTime = new Date().getTime()
      });
      this.mass.setMap(map);
      this.mass.setStyle(that.pointStyle);
      // 添加点聚合
      addCluster();
      function addCluster() {
        if (that.cluster) {
          that.cluster.clearMarkers();
        }
        that.cluster = new AMap.MarkerClusterer(map, that.cMarkers, { gridSize: 80, minClusterSize: 1 });
      }
      that.judgeMassCluster()
      // 监听比例尺变化，判断显示车辆还是聚合
      map.on("zoomend", function(e) {
        that.judgeMassCluster()
      })
    },
    judgeMassCluster() {
      // 根据当前比例尺判断显示车辆还是聚合
      let nowZoom = this.map.getZoom()
      if (nowZoom > 11) {
        this.cluster.clearMarkers();
        this.mass.show()
      } else {
        this.mass.hide()
        this.cluster.clearMarkers();
        this.cluster = new AMap.MarkerClusterer(this.map, this.cMarkers, { gridSize: 80, minClusterSize: 1 });
      }
    },
    // 生成下拉列表点聚合标记(加油站，充电桩等)
    compositeArray(tragetAarry) {
      let that = this;
      let markers = [];
      let currentData = [];
      let siteData = that.siteData;
      let siteArry = Object.keys(siteData);
      let map = this.map
      const mapixel = type => {
        switch (type) {
          case 0:
            return new AMap.Pixel(-158, -5); // 加油站
          case 1:
            return new AMap.Pixel(-5, -5); // 充电站
          case 2:
            return new AMap.Pixel(-238, -5); // 充气站
          case 3:
            return new AMap.Pixel(-80, -5); // 维修站
          case 4:
            return new AMap.Pixel(-318, -5); // 司机之家
        }
      };
      const zIndexMap = [19, 20, 18, 16, 17]
      if (this.currentRenderSite.length > 0) {
        // clear markers
        map.remove(this.currentRenderSite);
        this.currentRenderSite = [];
      }
      tragetAarry.forEach(item => {
        let { longitude, latitude, type } = item;
        markers = new AMap.Marker({
          position: [longitude, latitude],
          offset: new AMap.Pixel(-20, -25),
          icon: new AMap.Icon({
            size: new AMap.Size(40, 50), // 图标的大小
            image: siteImg,
            imageOffset: mapixel(type)
          }),
          zIndex: zIndexMap[type],
          clickable: true,
          extData: item
        });
        markers.on("click", function(e) {
          that.siteMsgData = this.getExtData();
          // that.mmkSiteData.forEach(item => {
          //   item.setAnimation("AMAP_ANIMATION_NONE");
          // });
          // this.setAnimation("AMAP_ANIMATION_DROP");
          that.sitePoints = true;
          that.choosecar = true;
          that.MarkTime = new Date().getTime()
        });
        currentData.push(markers);
      });
      that.mmkSiteData = that.mmkSiteData.concat(currentData); // 存储Markers点
      that.currentRenderSite = currentData;
      map.add(currentData)
    },
    // 下拉列表每一个checkbox点击事件。以及获取站点信息事件调用
    checkAllGroupChange(data) {
      if(!this.chooseCityMsg.cityID) {
        this.$Message.warning("请先选择城市")
        this.othermarkSelect.checkAllGroup.splice(0,5)
        return false
      }
      let that = this;
      let len = data.length;
      let type = data[data.length - 1];
      const getArrDifference = (arr1, arr2) => {
        return arr1.concat(arr2).filter(function(v, i, arr) {
          return arr.indexOf(v) === arr.lastIndexOf(v);
        });
      };
      if (len === 5) {
        this.othermarkSelect.indeterminate = false;
        this.othermarkSelect.checkAll = true;
      } else if (len > 0) {
        this.othermarkSelect.indeterminate = true;
        this.othermarkSelect.checkAll = false;
      } else {
        this.othermarkSelect.indeterminate = false;
        this.othermarkSelect.checkAll = false;
      }
      that.oldcheckdata = data; // 存储选择得站点码
      if (data.length) {
        this.getServiceSitePageList(data);
      } else {
        if (this.currentRenderSite.length > 0) {
          // clear markers
          // this.cluster.removeMarkers(this.currentRenderSite);
          let map = this.map
          map.remove(this.currentRenderSite);
          this.currentRenderSite = [];
        }
      }
    },
    // 获取充电桩，加油站等选项站点信息以及点标记
    getServiceSitePageList(typeList) {
      let that = this;
      getSiteList({ typeList, cityCode: this.chooseCityMsg.cityID })
        .then(res => {
          let resdata = res.data.data;
          that.compositeArray(resdata);
        })
        .catch(err => {});
    },
    // 地图上点标记信息集合,获取司机车辆信息集合
    getCarNodemsg(data) {
      let that = this;
      that.currentCarMsg = data;
      that.getfindOneByVinMsg(data); // 获取实时信息
      that.getDriverDetailMsg(data); // 获取司机信息
      that.getCarByVinMsg(data); // 获取车辆信息
    },
    iptevent(e) {},
    // 关闭车辆详情弹窗
    arrowtoright(isClose) {
      if (!this.choosecar) {
        return false
      }
      // 因为Marker点击事件中，没有阻止冒泡的功能，方出此下策。
      let Time = new Date().getTime()
      let isBlankClose = Time - this.MarkTime > 500 ? true : false
      if (isClose || isBlankClose) {
        // 隐藏车辆信息弹窗
        this.choosecar = false;
        this.mmkSiteData.length &&
          this.mmkSiteData.forEach(item => {
            item.setAnimation("AMAP_ANIMATION_NONE");
          });
        this.mmkCarData.length &&
          this.mmkCarData.forEach(item => {
            item.setAnimation("AMAP_ANIMATION_NONE");
          });
      }

    },
    // 获取实时路况
    getTrafficTileLayer() {
      let map = this.map
      if (this.isVisibleToggle) {
        this.trafficLayer && this.trafficLayer.hide();
        this.isVisibleToggle = false;
      } else {
        this.trafficLayer = new AMap.TileLayer.Traffic({
          zIndex: 66
        });
        this.trafficLayer && this.trafficLayer.setMap(map);
        this.trafficLayer && this.trafficLayer.show();
        this.isVisibleToggle = true;
      }
    },
    changePage(val) {
      this.carlistdata.current = val;
      this.carOrderlistsight();
    },
    changePageSize(val) {
      this.carlistdata.pageSize = val;
      this.carOrderlistsight();
    },
    // 获取每日订单列表
    carOrderlistsight() {
      if (!this.carlistdata.parColumns.length) {
        Object.entries(returnFields(this)).forEach(([key, value]) => {
          this.carlistdata.parColumns.push(value);
        });
      }
      let currentTime = new Date();
      let year = currentTime.getFullYear();
      let month =
        (currentTime.getMonth() + 1).toString().length == 1
          ? "0" + (currentTime.getMonth() + 1).toString()
          : currentTime.getMonth() + 1;
      let date = currentTime.getDate();
      let currents = year + "-" + month + "-" + date + " " + "00:00:00";
      let startTime = Date.parse(new Date(currents.replace(/-/g, "/")));
      let data = {
        pageSize: this.carlistdata.pageSize,
        currentPage: this.carlistdata.current,
        vin: this.currentCarMsg.vin,
        startTime,
        endTime: Date.parse(new Date())
      };
      this.$store.commit("changeLoadingFlag", true);
      getDriverOrderPage(data)
        .then(res => {
          this.carlistdata.parTableData = res.data.data.list;
          this.carlistdata.total = res.data.data.totalCount;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch(err => {});
      this.carslists = true;
    },
    toSightDriver(driverUuid) {
      // console.log("点击司机详情，跳转到司机详情页面。");
      if (!driverUuid) {
        this.$Message.warning("暂无司机信息");
        return;
      }
      this.$router.push({ name: "staff-detail", params: { id: driverUuid }});
    },
    sendMassage(mobile) {
      // console.log("点击短信发送，可向该司机发送手机短信。");
      if (!mobile) {
        this.$Message.warning("暂无司机信息");
        return;
      }
      this.messagesent = true;
    },
    carDetail() {
      let { vin } = this.currentCarMsg;
      this.$router.push({ name: "vehicle-detail", params: { id: vin }});
      // console.log("点击车辆详情，跳转到车辆详情页面。");
    },
    chooseCity(value) {
      // 选择城市时该城市车辆数获取
      let that = this;
      let map = this.map
      let valcitycode = value.length > 1 ? value[1] : value[0];
      let polygons = map.getAllOverlays("polygon"); // 切换城市时 假如地图上存在围栏则清空
      polygons.length && map.remove(polygons);
      this.polygonVal = [];
      this.enclosureTypeData = {
        // 重置已选择的围栏select
        enclosuretype: value?1:null,
        enclosureitem: []
      };
      // 绘制区域图
      if (!this.district) {
        // 实例化DistrictSearch
        let opts = {
          subdistrict: 0, // 获取边界不需要返回下级行政区
          extensions: "all", // 返回行政区边界坐标组等具体信息
          level: "district" // 查询行政级别为 市
        };
        this.district = new AMap.DistrictSearch(opts);
      }
      this.district && this.district.setLevel("district");
      this.district &&
        this.district.search(valcitycode, function(status, result) {
          that.polygons && that.polygons.length && map.remove(that.polygons); // 清除上次结果
          that.polygons = [];
          let bounds = result.districtList[0].boundaries;
          if (bounds) {
            for (let i = 0, l = bounds.length; i < l; i++) {
              // 生成行政区划polygon
              let polygon = new AMap.Polygon({
                strokeWeight: 2,
                strokeStyle: "dashed",
                path: bounds[i],
                fillOpacity: 0.1,
                fillColor: "#fff",
                strokeColor: "#551A8B"
              });
              that.polygons.push(polygon);
            }
          }
          that.polygons && that.polygons.length && map.add(that.polygons);
          const item = that._select;
          if(item && item.location) {
            map.setZoomAndCenter(20, [item.location.lng, item.location.lat])
            that._centerMarker && map.remove(that._centerMarker)
            map.add(that._centerMarker = new AMap.Marker({
              position: new AMap.LngLat(item.location.lng, item.location.lat),
            }));
          } else {
            that.polygons &&
              that.polygons.length &&
              map.setFitView(that.polygons); // 视口自适应
          }
          that.spinShowMap = false;
        });
      this.chooseCityMsg = { cityID: valcitycode };
      this.currentChangeData = {
        agentUUID: "", // 运营商id
        driverManagerId: "", // 司管id
        carType: "", // 1：出租车、2：专享、3：跨城拼车、4：快享、5：货的、6：骑手、7：搬家、8：展会
        operationStatus: "", // 0:待运营，1:待绑定，2:运营中，3:维护中，4：退出运营，5：冻结
        carNoOrMobile: "" // 	车牌或电话
      };
      this.onSearchApi({ cityID: valcitycode });
      this.getOptationByCitycode(valcitycode);
      if (this.oldcheckdata.length) {
        this.getServiceSitePageList(this.oldcheckdata);
      }
      AMapUI.loadUI(["control/BasicControl"], function(BasicControl) {
        map.addControl(new BasicControl.Zoom({
          position: "rb", // left top，左上角
          showZoomNum: false // 显示zoom值
        }));
      })
      map.addControl(new AMap.Scale());
      // 电子围栏默认选择运营围栏，并展示运营围栏的所有围栏
      this.getElefenceList("1", 2)
    },
    onSearchBtn(chooseCityMsg, isClear) {
      if (!isClear) {
        this.isloading = true;
      } else {
        this.isClearloading = true;
        this.driverManagerList.splice(0, this.driverManagerList.length)
        this.currentChangeData = {
          agentUUID: "", // 运营商id
          driverManagerId: "", // 司管id
          carType: "", // 1：出租车、2：专享、3：跨城拼车、4：快享、5：货的、6：骑手、7：搬家、8：展会
          operationStatus: "", // 0:待运营，1:待绑定，2:运营中，3:维护中，4：退出运营，5：冻结
          carNoOrMobile: "" // 	车牌或电话
        };
      }
      this.onSearchApi(chooseCityMsg);
    },
    // 城市车辆点标记以及左侧数据列表请求方法
    onSearchApi(addData) {
      if(!this.chooseCityMsg.cityID) {
        this.$Message.warning("请先选择城市")
        this.isloading = false;
        return false
      }
      // 城市车辆点标记以及左侧数据列表请求方法
      let that = this;
      let selectDataCopy = { ...this.currentChangeData }
      if (selectDataCopy.agentUUID) {
        if (selectDataCopy.agentUUID.constructor === Array) {
          selectDataCopy.agentUUID = selectDataCopy.agentUUID.join(",")
        }
      }
      if (selectDataCopy.driverManagerId) {
        if (selectDataCopy.driverManagerId.constructor === Array) {
          selectDataCopy.driverManagerId = selectDataCopy.driverManagerId.join(",")
        }
      }
      let data = {

        ...selectDataCopy,
        ...addData || { cityID: this.chooseCityMsg.cityID }
      };
      queryCarListByRemote(data)
        .then(res => {
          let markersData = res.data.data || [];
          if (!markersData.length) {
            that.$Message.warning("没有查询到相关车辆")
          }
          that.citychoicest = true;
          this.isloading = false;
          this.isClearloading = false;
          that.renderMarkers(markersData);
        })
        .catch(err => {});
    },
    carTypeChoice(val) {
      return false
      // this.currentChangeData.carType = val;
      // this.onSearchApi();
    },
    // 提交短信发送
    confirmSave() {
      if (!this.addmsg) {
        this.$Message.warning("请填写发送内容");
        return false;
      }
      let data = {
        sendName: 1,
        driver: 2,
        phone: this.driverMsgData.mobile,
        sendContent: this.addmsg
      };
      sendSms(data)
        .then(res => {
          this.messagesent = false;
          this.$Message.success(res.data.msg);
        })
        .catch(err => {});
    },
    cancelMessage() {
      this.messagesent = false;
      this.addmsg = "";
    },
    // 热力图
    sightThermogram() {
      let map = this.map
      if (!this.ishowThermogram) {
        this.heatmap = new AMap.Heatmap(map, {
          radius: 25, // 给定半径
          opacity: [0, 0.4],
          zIndex: 77
        });
        // 设置数据集：该数据为北京部分“公园”数据
        this.heatmap.setDataSet({
          data: heatmapData,
          max: 100
        });
        this.heatmap && this.heatmap.show();
        this.ishowThermogram = true;
      } else {
        this.heatmap && this.heatmap.hide();
        this.ishowThermogram = false;
      }
    },
    // 刷新地图
    refreshMap(isClick) {
      if (isClick) {
        this.isrefresh = true;
        this.choosecar = false;
      }
      if (this.oldcheckdata.length) {
        this.getServiceSitePageList(this.oldcheckdata);
      }
      if (this.chooseCityMsg && this.chooseCityMsg.cityID) {
        this.onSearchApi(this.chooseCityMsg);
        this.getOptationByCitycode(this.chooseCityMsg.cityID);
      }
      if (this.railType) {
        this.getElefenceList(this.railType, 1);
        this.renderElefence(this.enclosureTypeData.enclosureitem)
      }
      if (this.polygonVal) {
        this.renderElefence(this.polygonVal);
      }
      isClick && setTimeout(() => {
        this.isrefresh = false;
      }, 1000);
    }
  }
};
</script>
<style lang="less" src="./index.less">
</style>
