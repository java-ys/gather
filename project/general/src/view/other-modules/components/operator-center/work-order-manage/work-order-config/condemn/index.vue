<template>
  <div>
    <Tabs v-model="tab" :value="tab" class="tabs" @on-click="onClickTabs">
      <Tab-pane
        v-for="(tab, _) in tabs"
        :key="tab.value"
        :label="tab.label"
        :name="tab.value"
      >
        <Form
          class="forms"
          :ref="`forms-${tab.value}`"
          :model="forms[tab.value]"
          :label-width="100"
          :rules="formsRules"
        >

          <FormItem
            label="城市"
            :label-width="120"
            prop="citys"
          >
            <Select v-model="forms[tab.value].citys" multiple :disabled="isKS" style="width:260px" @on-change="onCityChange($event, tab.value)">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem
            label="自动判责启用"
            :label-width="120"
            prop="state"
          >
            <Radio-group v-model="forms[tab.value].state">
              <Radio label="1" :disabled="isKS">是</Radio>
              <Radio label="0" :disabled="isKS">否</Radio>
            </Radio-group>
          </FormItem>

          <FormItem
            label="司机类型"
            :label-width="120"
            prop="driverType"
          >
            <Select v-model="forms[tab.value].driverType" multiple :disabled="isKS" style="width:260px" @on-change="onDriverTypeChange($event, tab.value)">
              <Option :value="ALL">全选</Option>
              <Option v-for="item in driverTypes" :value="String(item.value)" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem
            label="自动判责节点"
            :label-width="120"
            prop="bizNodes"
          >
            <Checkbox-group v-model="forms[tab.value].bizNodes" @on-change="onBizNodesChange($event, tab.value)">
              <Checkbox label="CS" :disabled="isKS">初审</Checkbox>
              <Checkbox label="ZS" :disabled="isKS">终审</Checkbox>
              <Checkbox label="SJ_ZS_SS" :disabled="isKS">终审申诉</Checkbox>
            </Checkbox-group>
          </FormItem>

          <Card
            v-for="(judge, index) in forms[tab.value].judge"
            :key="index"
            style="margin-bottom: 6px;"
          >

            <Row>
              <Col span="12">
                <FormItem
                  :label="`自动判责工单类型${index+1}`"
                  :label-width="150"
                  :prop="'judge.' + index + '.target.type'"
                  :rules="JSON.parse(JSON.stringify(formsRules.judge.target.type))"
                >
                  <Select v-model="judge.target.type" style="width:260px" :disabled="isKS" @on-change="onTypeChange($event, tab.value, index)">
                    <Option v-for="item in condemnTypeListMap[tab.value]" :value="String(item.value)" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6" v-if="tab.value === 'FK'">
                <FormItem
                  :label="`规则`"
                  :label-width="120"
                  v-if="judge.target.type !== '4'"
                  :prop="'judge.' + index + '.target.rules'"
                  :rules="JSON.parse(JSON.stringify(formsRules.judge.target.rules))"
                >
                  <Select v-model="judge.target.rules" multiple :disabled="isKS" style="width:120px" @on-change="onRulesChange($event, tab.value, index)">
                    <Option :value="ALL">全选</Option>
                    <Option v-for="item in indexNoList" :value="String(item.value)" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="3" offset="3">
                <Button v-if="index === 0" @click="addForm(tab.value)">添加</Button>
                <Button v-if="index > 0" @click="removeForm(tab.value, index)">删除</Button>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem
                  :label="`关联判责标准${index+1}`"
                  :label-width="150"
                  :prop="'judge.' + index + '.illegal'"
                  :rules="JSON.parse(JSON.stringify(formsRules.judge.illegal))"
                >
                  <!-- <Cascader v-model="judge.illegal" :data="judgeListMap[tab.value]" style="width: 260px;" @on-change="onJudgeChange($event, tab.value, index)" -->
                   <Cascader v-model="judge.illegal" :data="judgeListMap[tab.value]" :disabled="isKS" style="width: 260px;"  @on-change="(value, data) => changeCascader(tab.value, data, index)"
                  :load-data="loadData"
                  :change-on-select="changeOnSelect"
                  @on-visible-change="handleChangeOnSelect"></Cascader>

                </FormItem>
              </Col>
              <Col span="6">
                <FormItem
                  :label="`等级`"
                  :label-width="120"
                >
                  <Input :disabled="true" v-model="judge.levelShow" />
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem
                  :label="`金额`"
                  :label-width="120"
                >
                  <Input :disabled="true" v-model="judge.forfeit" />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <FormItem
                label="自动判责节点"
                :label-width="150"
              >
                <Checkbox-group v-model="judge.bizNodes">
                  <Checkbox label="CS" :disabled="isKS">初审</Checkbox>
                  <Checkbox label="ZS" :disabled="isKS">终审</Checkbox>
                  <Checkbox label="SJ_ZS_SS" :disabled="isKS">终审申诉</Checkbox>
                </Checkbox-group>
              </FormItem>
            </Row>
            <Row v-if="judge.idTree">
              <FormItem
                label="处罚内容"
                :label-width="120"
                >
                <judge-details :list="judgeListMap[tab.value]" :id="judge.idTree"></judge-details>
              </FormItem>
            </Row>
          </Card>


          <Row type="flex" justify="end" class="action">
            <Col>
              <Button type="default" @click="onCancel(tab.value)" class="btn"
                >取消</Button
              >
            </Col>
            <Col>
              <Button
                type="primary"
                @click="onSubmit(tab.value)"
                >{{ "提交" }}</Button
              >
            </Col>
          </Row>
        </Form>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script>
import { formsRules,violationLevelMap } from "./fields";
import { addJudgeConfig, editJudgeConfig, queryAllJudgeConfig,queryAllJudgeType } from "_o/api/work-order/work-order-config";
import { getProvinceCityList } from '_g/api/common.js';
import { deepCopy, cpTranslate } from "@/libs/tools";
import { fetchCityList } from "_o/api/work-order/work-order-config";
import { freeze, tool } from "@/mixins/base";
import { getWoTypeList } from "_o/api/work-order/common.js";
import JudgeDetail from "./judgeDetails.vue";
import JudgeDetails from "_o/components/operator-center/work-order-manage/work-order-config/condemn/judgeDetails";
const KS = 'KS'
const FK = 'FK'
const DP = 'DP'
const ALL = 'ALL'
const woTypeMap = {
  [KS]:'KSGD',
  [FK]:'FKGD',
  [DP]: 'WGGD',
}
const defaultForm = {
  [FK]: {
    citys: [],
    state: '',
    driverType: [],
    bizNodes: [],
    judge: [
      {
        target: {
          type: '',
          rules: [],
        },
        level: '',
        forfeit: '',
        illegal: [],
        idTree:""
      }
    ]
  },
  [KS]: {
    citys: [],
    state: '',
    driverType: [],
    bizNodes: [],
  },
  [DP]: {
    citys: [],
    state: '',
    driverType: [],
    bizNodes: [],
    judge: [
      {
        target: {
          type: '',
          rules: [],
        },
        level: '',
        forfeit: '',
        illegal: [],
        idTree:""
      }
    ]
  },
}

export default {
  name: "condemn",
  mixins: [tool],
  components: {
    JudgeDetails,
    JudgeDetail},
  data() {
    return {
      KS, FK, DP, ALL,
      tab: "",
      changeOnSelect: false,
      tabs: freeze([
        {
          value: FK,
          label: '风控'
        },
        {
          value: KS,
          label: '客诉'
        },
        {
          value: DP,
          label: '司机服务违规'
        },
      ]),
      forms: {
        [FK]: defaultForm.FK,
        [KS]: defaultForm.KS,
        [DP]: defaultForm.DP,
      },
      judgeListMap: {
        [FK]: [],
        [KS]: [],
        [DP]: [],
      },
      judgeFlatListMap: {
        [FK]: [],
        [KS]: [],
        [DP]: [],
      },
      condemnTypeListMap: {
        [FK]: [
          {
            label: '刷单',
            value: '1'
          },
          {
            label: '挂时长',
            value: '2'
          },
          // {
          //   label: '有乘客无订单',
          //   value: '4'
          // },
        ],
        [KS]: [],
        [DP]: [
          {
            label: '打电话',
            value: 'H0010'
          },
          {
            label: '抽烟',
            value: 'H0012'
          },
          {
            label: '玩手机',
            type: 'H0022'
          },
          {
            label: '遮挡DVR摄像头',
            value: 'H0025'
          },
          {
            label: '遮挡DMS摄像头',
            value: 'H0026'
          },
          {
            label: '未戴口罩',
            value: 'H0028'
          },
          {
            label: '有乘客无订单（盯盯拍）',
            value: 'H0008'
          },
// 工装检核-检核未达标         J0011
// 工装检核-司机未提交         J0012
// 工装检核-运营商未审核       J0013

// 工装检核-司机未上线    J0014

// 车辆整洁检核-检核未达标     J0021
// 车辆整洁检核-司机未提交     J0022
// 车辆整洁检核-运营商未审核   J0023
// 车辆整洁检核-司机未上线  J0024
          {
            label: '工装检核-检核未达标',
            value: 'J0011'
          },
          {
            label: '工装检核-司机未提交',
            value: 'J0012'
          },
          {
            label: '工装检核-运营商未审核',
            value: 'J0013'
          },
          {
            label: '工装检核-司机未上线',
            value: 'J0014'
          },
          {
            label: '车辆整洁检核-检核未达标',
            value: 'J0021'
          },
          {
            label: '车辆整洁检核-司机未提交',
            value: 'J0022'
          },
          {
            label: '车辆整洁检核-运营商未审核',
            value: 'J0023'
          },
          {
            label: '车辆整洁检核-司机未上线',
            value: 'J0024'
          },
          {
            label: '判责改派',
            value: 'J00002'
          },
        ],
      },
      indexNoList: Array.from({ length: 50 }, (_, index) => (
        {
          label: `No.${String(index + 1).padStart(3, '0')}`,
          value: `No.${String(index + 1).padStart(3, '0')}`,
        }
      )),
      driverTypes: freeze([
        {
          label: '自营司机',
          value: 10
        },
        {
          label: '自营-主司机',
          value: 20
        },
        {
          label: '自营-副司机',
          value: 30
        },
        {
          label: '自营-顶班司机',
          value: 40
        },
        {
          label: 'UP司机',
          value: 50
        },
        {
          label: 'UP-主司机',
          value: 60
        },
        {
          label: 'UP-副司机',
          value: 70
        },
        {
          label: 'UP-顶班司机',
          value: 80
        },
        {
          label: 'UP带车加盟司机',
          value: 90
        }
      ]),
      cityList: [],
      formsRules: freeze(formsRules(this)),
      // violationLevelList
    };
  },
  computed: {
    isKS() {
      return this.tab === this.KS;
    }
  },
  watch: {},

  created() {
    this.init();
  },

  methods: {
    async init() {
      await this.queryList();
      await this.getCityList()
      await this.getViolationTpyes()
      await this.queryConfig()
      await this.queryWotypes(FK)
      await this.queryWotypes(DP)
      await this.queryWotypes(KS)
    },
    async queryWotypes(type) {
      const res = await getWoTypeList({
        appid: "520315b4d7524001a27a3bde5d052c51",
        level: 2,
        parentUuid: woTypeMap[type]
      })
      if (!res.data.success) return this.$Message.error(res.data.msg)
      const data = res.data.data.map(it=>{
        return {
          value:it.uuid,
          label:it.name
        }
      })
      this.condemnTypeListMap[type] = data
    },
    async queryConfig() {
      const res = await queryAllJudgeConfig()
      if (!res.data.success) return this.$Message.error(res.data.msg)
      const data = res.data.data
      const { judgeJson: fkJudgeJson = null, cityJson: fkCityJson = null, ...fkData } = data.find(item => item.woType === FK) || {}
      const { cityJson: ksCityJson = null, ...ksData } = data.find(item => item.woType === KS) || {}
      const { judgeJson: dpJudgeJson = null, cityJson: dpCityJson = null, ...dpData } = data.find(item => item.woType === DP) || {}
      // console.log(fkJudgeJson, fkCityJson, fkData);


      // console.log(JSON.stringify(fkJudgeJson, null, 2));
      this.forms = {
        ...this.forms,
        FK: fkJudgeJson ? {
          ...fkData,
          citys: Object.keys(fkCityJson),
          state: String(fkData.state),
          judge: fkJudgeJson.map(item => {
            const illegallArr = item.illegal.split('/')
            const { type, rules } = item.target
            return {
              target: {
                type,
                rules,
              },
              levelShow: illegallArr[illegallArr.length - 2],
            //   level:violationLevelList.find(it=>it.value ==illegallArr[illegallArr.length - 2]).value,
              level:illegallArr[illegallArr.length - 2],
              illegalShow:illegallArr.splice(0,illegallArr.length - 2),
              forfeit: illegallArr[illegallArr.length - 1],
              illegal: item.idTree.split('|').map(it=>Number(it)),
              idTree:item.idTree,
              bizNodes: item.bizNodes ? item.bizNodes.split(',') : [],
            }
          })
        } : defaultForm.FK,
        KS: ksCityJson ? {
          ...ksData,
          citys: Object.keys(ksCityJson),
          state: String(ksData.state),
        } : defaultForm.KS,
        DP: dpJudgeJson ? {
          ...dpData,
          citys: Object.keys(dpCityJson),
          state: String(dpData.state),
          judge: dpJudgeJson.map(item => {
            const illegallArr = item.illegal.split('/')
            const { type, rules } = item.target
            return {
              target: {
                type,
                rules,
              },
              levelShow: illegallArr[illegallArr.length - 2],
            //   level:violationLevelList.find(it=>it.value == illegallArr[illegallArr.length - 2]).value,
              level:illegallArr[illegallArr.length - 2],
              illegalShow:illegallArr.splice(0,illegallArr.length - 2),
              forfeit: illegallArr[illegallArr.length - 1],
              illegal: item.idTree.split('|').map(it=>Number(it)),
              idTree:item.idTree,
              bizNodes: item.bizNodes ? item.bizNodes.split(',') : [],
            }
          })
        } : defaultForm.DP,
      }
    },

    // 获取城市列表
    async getCityList() {
      // getProvinceCityList({}).then(res => {
      //   const all = {
      //     city: '全国',
      //     cityID: '100000',
      //     label: '全国',
      //     value: '100000'
      //   }
      //   if (res.data.success) {

      //     this.cityList = [ all, ...cpTranslate(res.data.data).map(province => province.children).flat() ];
      //   } else {
      //     this.$Message.error(res.data.msg);
      //   }
      // });
      let param = {
        bizTypes:[1, 2, 4, 6, 7],
        showAllCity:1
      }
      const [err, data] = await this.toResult(fetchCityList(param));
      if (err) {
        return;
      }
      let fAllIndex = data.findIndex(it => it.cityName === "全国")
      let list = data;
      if(fAllIndex > -1) {
        list = [...data.splice(fAllIndex, 1), ...data]; // 全国选项放在第一个
      }
      this.cityList = list.map(it => {
          return {
            label:it.cityName,
            value:it.cityCode,
            cityID:it.cityCode,
            city:it.cityName,
          }
        });
    },
    async getViolationTpyes() {
      const types = this.tabs.map(tab => tab.value)
      const [ { data: { data: {list:FK } }}, { data: { data: {list:KS } } }, { data: { data: {list:DP } } } ] = await Promise.all(types.map(type => queryAllJudgeType({ woType: type, currPage: 1,pageSize: 50, })))
      this.judgeListMap = {
        FK: this.handleTreeData(FK),
        KS: this.handleTreeData(KS),
        DP: this.handleTreeData(DP),
      }
    //   this.judgeFlatListMap = {
    //     FK: this.flatten(FK),
    //     KS: this.flatten(KS),
    //     DP: this.flatten(DP),
    //   }
      this.judgeFlatListMap = {
        FK: this.handleTreeData(FK),
        KS: this.handleTreeData(KS),
        DP: this.handleTreeData(DP),
      }
    },

    flatten(tree) {
      let array = tree.reduce((arr, cur) => {
        const { children, ...i } = cur
        return arr.concat(i, children && children.length ? this.flatten(children) : [])
      }, [])
      return array
    },

    onClickTabs(val) {
      console.log(val);
    },

    addForm(val) {
      this.forms[val].judge.push({
        target: {
          type: '',
          rules: [],
        },
        illegal: [],
      })
    },

    removeForm(val, idx) {
      this.forms[val].judge.splice(idx, 1)
    },

    async onSubmit(value) {
      const $form = this.$refs[`forms-${value}`]
      $form[0].validate(async (valid) => {
        console.log(valid);
        if (!valid) return
        const { id, citys, state, driverType, bizNodes, judge } = this.forms[value]

        const params = {
          id,
          state,
          bizNodes,
          driverType,
          woType: value,
          cityJson: this.cityList.filter(({ cityID }) => citys.indexOf(cityID) > -1).reduce((pre, cur) => ({ ...pre, [cur.cityID]: cur.city }), {}),
          judgeJson: value === KS ? undefined : judge.map(item => ({
            target: item.target,
            illegal: [...item.illegalShow, item.levelShow, item.forfeit].join('/'),
            idTree:item.idTree,
            id:item.idTree.split('|').pop(),
            bizNodes: item.bizNodes.join(','),
          }))
        }

        console.log(JSON.stringify(params, null, 2));
        const res = params.id ? await editJudgeConfig(params) : await addJudgeConfig(params)
        if (!res.data.success) return this.$Message.error(res.data.msg)
        if (res.data.success) return this.$Message.success('提交成功')
      })

    },

    onTypeChange(type, val, index) {
      if (type === '4') this.forms[val].judge[index].target.rules = []
    },

    onCityChange(e, val) {
      const idx = e.indexOf('100000')
      if (idx === -1) return
      if (e[e.length - 1] === '100000') {
        this.forms[val].citys = ['100000']
      } else {
        let arr = e.slice()
        arr.splice(idx, 1)
        this.forms[val].citys = arr
      }
    },

    onDriverTypeChange(e, val) {
      const len = e.length
      if (e.indexOf(ALL) > -1) {
        if (len - 1 === this.driverTypes.length) {
          this.forms[val].driverType = []
        } else {
          this.forms[val].driverType = this.driverTypes.map(d => String(d.value))
        }
      }
    },

    onRulesChange(e, val, idx) {
      const len = e.length
      if (e.indexOf(ALL) > -1) {
        if (len - 1 === this.indexNoList.length) {
          this.forms[val].judge[idx].target.rules= []
        } else {
          this.forms[val].judge[idx].target.rules = this.indexNoList.map(n => n.value)
        }
      }
    },

    onBizNodesChange(type, val) {
      const set = new Set(this.forms[val].bizNodes)
      if (type.indexOf('CS') > -1) {
        set.add('ZS')
      }
      this.forms[val].bizNodes = [...set]
    },

    onJudgeChange(list, val, index) {
      if (list.length === 0) {
        this.forms[val].judge[index].target.level = ''
        this.forms[val].judge[index].target.forfeit = ''
        return
      }
      const last = list[list.length - 1]
      const judge = this.judgeFlatMap[val].find(item => (item.value === last))
      this.forms[val].judge[index].level = judge.level

      this.forms[val].judge[index].forfeit = judge.forfeit

    },
    // 级联选择改变
    changeCascader(value, data, index) {
      // 表示清除
      if (data.length == 0) {
        this.forms[value].judge[index].target.level = ''
        this.forms[value].judge[index].target.forfeit = ''
        // this.forms[value].judge[index].idTree = ''
        this.addData.config[index].illegal = {};
      } else {
        // 最后一个节点里面含有惩罚金额和等级的信息
        const target = data[data.length - 1];
        const ids = data.map(v => v.value);
        // this.addData.config[index].illegal = {
        //   idTree: ids,
        //   id: target.value,
        //   msg1: msg,
        //   msg: msg.join("|"),
        //   level: target.level,
        //   forfeit: target.forfeit
        // };
        this.forms[value].judge[index].level = target.level
        this.forms[value].judge[index].illegalShow =data.map(it=>it.label)
        this.forms[value].judge[index].levelShow = violationLevelMap[target.violationLevel]
        this.forms[value].judge[index].forfeit = target.forfeit
        this.forms[value].judge[index].idTree = ids.join("|")
      }
    },
    onCancel() {
      this.$Modal.confirm({
        title: "确定取消吗？",
        onOk: () => {
          this.queryConfig()
        }
      });
    },
    /**
     * 动态设置change-on-select的值
     * 当级联选择器弹窗展开时，设置change-on-select为true，即可以点选菜单选项值发生变化
     * 当级联选择器弹窗关闭时，设置change-on-select为false，即能够设置初始值
     */
    handleChangeOnSelect(value) {
      this.changeOnSelect = value;
    },
    async queryList() {
      const params = {
        currPage: 1,
        pageSize: 50,
        woType: "SFGD"
      };
      const {
        data: {
          success,
          data: { list }
        }
      } = await queryAllJudgeType(params);
      if (success) {
        this.standardData = this.handleTreeData(list);
      }
    },
    handleTreeData(list) {
      let arr = [];
      if (list && list.length !== 0) {
        list.map(item => {
          let obj = {
            ...item,
            value: item.id,
            label: item.judgeName,
            level: item.judgeLevel,
            levelShow: violationLevelMap[item.violationLevel],
            forfeit: item.forfeit,
          };
          if (item.children.length && item.judgeLevel < 5) {
            //根据后台字段返回数值判断是否有子节点
            obj.children = this.handleTreeData(item.children)
            obj.loading = false;
          }
          arr.push(obj);
        });
      }
      return arr;
    },
    async loadData(item, callback) {
      callback();
    },
  }
};
</script>

<style lang="less" scoped>
.tabs {
  width: 800px;
  padding: 30px 0 120px 50px;
  .forms {
    margin: 30px 0 0;
  }
}

.action {
  padding: 50px 0;
  .btn {
    margin: 0 20px;
  }
}
</style>
