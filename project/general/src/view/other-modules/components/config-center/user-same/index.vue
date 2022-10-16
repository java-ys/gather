<template>
  <div class="container_box">


    <div slot="footer">
      <div style="float:left; width:300px;">
        <Form :label-width="100" ref="siteForm" style="display: inline;">
          <FormItem label="选择城市:">
            <al-cascader
              level="1"
              ref="alCascader1"
              v-model="CityAndProvince"
              style="width:190px"/>
          </FormItem>
        </Form>
      </div>
      <div style="float:left;">
        <Button size="large" type="primary" @click="getList()"
                style="margin-bottom: 20px; margin-left: 20px; display: inline;">搜索
        </Button>
        <Button size="large" type="primary" @click="clean" style="margin-bottom: 20px; margin-left: 20px;">清空</Button>
      </div>
    </div>

    <div style=" clear:left; display: flex;justify-content: space-between;margin-bottom: 20px;">
      <Button type="primary" v-hasAuth="'add_select_config'" @click='addSite'>新建</Button>

    </div>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="siteColumns"
      :parTableData="siteTableData"
      @changePage="changePage"
      @changePageSize="changePageSize">
    </VTable>
    <Modal v-model="addModal" title="新建策略" @on-cancel="cancel" :mask-closable=false>
      <Form :model="siteForm" :label-width="100" :rules="ruleValidate" ref="siteForm">

        <FormItem label="策略名称：" prop="rule_name">
          <Input v-model="siteForm.rule_name" placeholder="请输入名称" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="选择城市:">
          <al-cascader
            level="1"
            ref="alCascader"
            v-model="selectedCityL"
            style="width:190px"/>
        </FormItem>
        <p class="limit_body">用车页勾选逻辑</p>

        <span>没有历史呼叫记忆时，六边形内积压的订单数≥</span>
        <input  v-model="siteForm.limit"  style="width: 50px"  oninput="value=value.replace(/[^\d]/g,'')"></input>
        <span>,快享和出租车默认全部勾选；反之仅勾选快享</span>

      </Form>
      <div slot="footer">
        <Button size="large" type="text" @click="cancel" style="margin-right: 8px;">取消</Button>
        <Button size="large" type="primary" @click="add_rule(siteForm,selectedCityL)">确定</Button>
      </div>
    </Modal>
    <Modal v-model="editModal" title="编辑策略" :mask-closable=false>
      <Form :model="route_rule_dto" :label-width="100" :rules="ruleValidate2" ref="siteEditForm">

        <span>没有历史呼叫记忆时，六边形内积压的订单数≥</span>
        <input  v-model="route_rule_dto.limit"  style="width: 50px"  oninput="value=value.replace(/[^\d]/g,'')"></input>
        <span>,快享和出租车默认全部勾选；反之仅勾选快享</span>

      </Form>
      <div slot="footer">
        <Button size="large" type="text" @click="cancel" style="margin-right: 8px;">取消</Button>
        <Button size="large" type="primary" @click="editOk(route_rule_dto)">确定</Button>
      </div>
    </Modal>

    <Modal v-model="details" title="详情" :mask-closable=false>
      <Form :model="cancelModelData" :label-width="100" :rules="ruleValidate3" ref="siteEditForm">
        <FormItem label="适用城市：">
          {{ cancelModelData.cityName }}
        </FormItem>
        <FormItem label="省：">
          {{ cancelModelData.provinceName }}
        </FormItem>
        <FormItem label="策略名称：">
          {{ cancelModelData.ruleName }}
        </FormItem>
        <FormItem label="六边形积压数：">
          {{ cancelModelData.limit }}
        </FormItem>
        <FormItem label="状态：">
          {{ cancelModelData.status == 1 ? '已启用' : '未启用' }}
        </FormItem>
        <FormItem label="更新时间">
          {{ cancelModelData.updateTime }}
        </FormItem>

      </Form>

    </Modal>

  </div>
</template>

<script>

import MapPicker from '_a/VmapPicker/v-mapPicker.vue'
import {getAllList, insertRule, updaterule, updatestatus, selectone} from '_o/api/select-config.js'

export default {
  name: "user-same",
  components: {
    MapPicker,
  },
  props: {


    tabName: {
      type: String,
      default: '0'
    },
    lData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    cityList: {
      default: () => []
    }

  },
  data() {
    return {

      cancelModelData: {},
      content: "",
      route_rule_dto: {
        limit: "0",
        rule_name: "",
        province_name: "",
        province_code: "",
        city_code: "",
        city_name: "",
        status: "",
        content: ""
      },
      selectedCityL: [],

      CityAndProvince: [],

      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10,
      addModal: false,
      editModal: false,
      details: false,
      siteForm: {
        rule_name: "",
        limit: "0",
        uuid: "",
      },
      searchParams: {},
      inputList: [
        {
          name: "cascader-input", // 文本输入框名
          bind_key: ["province", "city"], // 返回数据的key名
          placeholder: "请选择省/市",
          value: [], // 绑定返回数据
          cascaderList: [], // 级联列表
          title: "省 / 市：", // 展示的字段名
          changeOnSelect: true
        },

      ],


      editflag: false,
      editMapModal: false,

      siteEditForm: {},
      ruleValidate: {
        // type: [{
        //     required: true,
        //     message: '请选择类型',
        //     trigger: 'blur'
        // }],
        name: [{
          required: true,
          message: '请填写名称',
          trigger: 'blur'
        }],
        address: [{
          required: true,
          message: '请选择地址',
          trigger: 'blur'
        }],
      },
      ruleValidate2: {},
      ruleValidate3: {},
      siteColumns: [
        {
          title: '序号',
          type: 'index',
          width: '80',
          ellipsis: true
        },
        {
          title: '省',
          key: 'provinceName',
          minWidth: 100
        },
        {
          title: '城市',
          key: 'cityName',
          minWidth: 100
        },
        {
          title: '六边形积压数',
          key: 'limit',
          minWidth: 100
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            if (params.row.status == -2) return h('span', '未启用')
            if (params.row.status == 1) return h('span', '已启用')
          },

          minWidth: 100
        },
        {
          title: '更新时间',
          key: 'updateTime',
          tooltip: true,
          minWidth: 100
        },

        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 200,
          render: (h, params) => {
            return h('div'), [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small',
                  ghost: true
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'edit_select_config'
                }],
                on: {
                  click: () => {

                    console.log(params);
                    this.Edit(params.row)
                  }
                }

              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  ghost: true
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'disable_select_config'
                }],
                style: {
                  marginLeft: '15px',
                  display: params.row.status === 1 ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    this.restatus(params.row)
                  }
                }
              }, '禁用'),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  ghost: true
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'enable_select_config'
                }],
                style: {
                  marginLeft: "15px",
                  display: params.row.status === -2 ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    this.restatus(params.row)
                  }
                }
              }, '启用'),
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small',
                  ghost: true
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'info_select_config'
                }],
                style: {
                  marginLeft: "15px",
                },
                on: {
                  click: () => {
                    this.selectonerule(params.row)
                  }
                }
              }, '详情'),
            ]
          }
        }
      ],
      siteTableData: [],
      pageSize: 10,
      current: 1,
      total: 0
    };
  },
  created() {
    this.inputList[0].cascaderList = this.cityList
    this.getList()
  },
  methods: {


//查询详情
    selectonerule(param) {
      this.cancelModelData = param
      this.details = true
      console.log(param)
    },

    restatus(row) {//修改启用状态
      this.route_rule_dto = {}
      this.route_rule_dto.uuid = row.uuid
      console.log(this.route_rule_dto)
      updatestatus(this.route_rule_dto).then(res => {
        console.log(res)
        this.$Message.success("修改成功");
        this.getList()
      }).catch(e => {
      })
    },

    clean() {
      this.CityAndProvince = []
      this.$refs.alCascader1.select = []
      this.current = 1
      this.getList()
    },

    getList() { // 获取分页List
      let params = JSON.parse(JSON.stringify(this.searchParams))
      console.log(this.CityAndProvince)
      if (this.CityAndProvince.length != 0) {
        params.cityCode = this.CityAndProvince[1].code
      }
      params.pageSize = this.pageSize
      params.currPage = this.current
      params.type = this.tabName
      this.$store.commit('changeLoadingFlag', true)
      console.log(params)
      getAllList(params).then(res => {
        console.log("-------------------------")
        console.log(res)
        this.siteTableData = res.data.data.list
        console.log(res.data.data.list)
        this.total = res.data.data.totalCount
        this.$store.commit('changeLoadingFlag', false)
      })
      this.CityAndProvince = []
    },
    changePageSize(val) {
      this.pageSize = val
      this.getList()
    },
    changePage(val) {
      this.current = val
      this.getList()
    },
    addSite() {
      this.$refs.siteForm.resetFields()
      this.addModal = true;
      this.siteForm = {
        rule_name: '',
        limit: ''
      }
    },
    //编辑
    editOk(val) {
      console.log(val)
      updaterule(val).then(res => {
        this.editModal = false
        this.$Message.success('修改成功!');
        this.getList()
        this.editModal = false
      })
    },

    cancel() {
      this.addModal = false
      this.editModal = false
      this.selectedCityL = []
      this.$refs.alCascader.select = []
    },
    //添加
    add_rule(rule, c_list) {
      this.route_rule_dto.limit = rule.limit
      this.route_rule_dto.rule_name = rule.rule_name
      this.route_rule_dto.province_name = c_list[0].name
      this.route_rule_dto.province_code = c_list[0].code
      this.route_rule_dto.city_code = c_list[1].code
      this.route_rule_dto.city_name = c_list[1].name

      insertRule(this.route_rule_dto).then(res => {
        this.route_rule_dto = {}
        this.addModal = false
        this.selectedCityL = []
        this.getList()
        this.$Message.success("添加成功");
      }).catch(e => {
      })
      this.$refs.alCascader.select = []
    },


    closeView: function () {
      this.editMapModal = false

    },

    Edit(data) {
      this.$refs.siteEditForm.resetFields()
      this.editModal = true
      this.siteEditForm = JSON.parse(JSON.stringify(data))
      this.route_rule_dto.limit = data.limit
      this.route_rule_dto.uuid = data.uuid
      this.editflag = true
    }
  },
  watch: {
    cityList: {
      handler() {
        console.log(this.cityList)
        this.inputList[0].cascaderList = this.cityList
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.container_box {
  .mid {
    vertical-align: middle;
  }

  .fl-lt {
    float: left;
  }
}

.fakePointer {
  color: '#1890FF';
  margin-left: '10px'
}

.mapbox {
  width: 820px;
  height: 430px;
}

.limit_body {
  color: '#200cff';
  font-size: 16px;

  padding-bottom: 15px;
}
</style>
