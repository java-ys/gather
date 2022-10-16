<template>
  <Modal v-model="visible" :title="title" :mask-closable="false" width="880px">
    <Form ref="addForm" :model="addData" :label-width="120" :rules="formRule">
      <FormItem label="第三方平台" class="ivu-form-item-required" prop="source">
        <Col :span="5" style="float: none">
          <Select v-model="addData.source" :disabled="isDetail">
            <Option value="GD">高德</Option>
          </Select>
        </Col>
      </FormItem>
      <FormItem label="城市" class="ivu-form-item-required" prop="cityCodeList">
        <Col :span="12" style="float: none;">
          <Select v-model="addData.cityCodeList" multiple :disabled="isDetail">
            <Option
              v-for="item in openCityList"
              :key="item.value"
              :value="item.value"
              :disabled="hasAllCity"
            >
              {{ item.label }}
            </Option>
          </Select>
        </Col>
      </FormItem>
      <FormItem
        label="司机类型"
        class="ivu-form-item-required"
        prop="driverTypeList"
      >
        <Col :span="12" style="float: none">
          <Select
            v-model="addData.driverTypeList"
            multiple
            :disabled="isDetail"
          >
            <Option
              v-for="item in driverTypeMap"
              :key="item.driverType"
              :value="item.driverType"
              :label="item.driverTypeDesc"
            >
              {{ item.driverTypeDesc }}
            </Option>
          </Select>
        </Col>
      </FormItem>

      <Card
        v-for="(item, index) in addData.config"
        :key="index"
        style="margin-bottom: 10px"
      >
        <FormItem
          :label="`工单类型${index + 1}`"
          class="ivu-form-item-required"
          :rules="formRule.judgeTypeList"
          :prop="`config.${index}.judgeTypeList`"
        >
          <Row class="vertical-start">
            <Col :span="12">
              <Select
                v-model="item.judgeTypeList"
                multiple
                :disabled="isDetail"
              >
                <Option
                  v-for="item in judgeTypeList"
                  :key="item.judgeType"
                  :value="item.judgeType"
                  >{{ item.judgeTypeDesc }}</Option
                >
              </Select>
            </Col>
            <Col :span="4">
              <Button
                v-if="index == 0 && !isDetail"
                shape="circle"
                icon="md-add"
                size="small"
                type="primary"
                class="circle-btn vertical-center"
                @click="addItem"
              >
              </Button>
              <Button
                v-if="index > 0 && !isDetail"
                shape="circle"
                icon="md-close"
                type="error"
                size="small"
                class="circle-btn vertical-center"
                @click="deleteItem(index)"
              >
              </Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem
          :label="`关联判责标准${index + 1}`"
          :rules="formRule.config.illegal"
          :prop="'config.' + index + '.illegal'"
        >
          <Row>
            <Col :span="8">
              <Cascader
                v-model="item.illegal.idTreeArr"
                :data="standardData"
                :disabled="isDetail"
                :load-data="loadData"
                :change-on-select="changeOnSelect"
                @on-change="(value, data) => changeCascader(value, data, index)"
                @on-visible-change="handleChangeOnSelect"
              ></Cascader>
            </Col>
            <Col :span="8">
              <Row>
                等级:
                <Input
                  :value="item.illegal ? item.illegal.level: ''"
                  style="width: 80%"
                  disabled
                />
              </Row>
            </Col>
            <Col :span="8">
              <Row>
                金额:
                <Input
                  :value="item.illegal ? item.illegal.forfeit : ''"
                  style="width: 80%"
                  disabled
                />
              </Row>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="处罚内容" v-if="item.illegal.idTree">
          <judge-details :list="standardData" :id="item.illegal.idTree"></judge-details>
        </FormItem>
        <FormItem v-if="addData.source === 'GD'" label="是否人工审核" :rules="formRule.config.manual" :prop="'config.'+index+'.manual'">
          <RadioGroup v-model="item.manual">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
      </Card>
    </Form>
    <div slot="footer">
      <Button @click="closeModal">{{ !isDetail ? "取消" : "关闭" }}</Button>
      <Button v-if="!isDetail" v-lazy-click="save" type="primary">确定</Button>
    </div>
  </Modal>
</template>
<script>
import * as webapi from "_o/api/work-order/work-order-config";
import {violationLevelMap} from "../fields.js"
import { getWoTypeList } from "_o/api/work-order/common.js";
import JudgeDetails from "_o/components/operator-center/work-order-manage/work-order-config/condemn/judgeDetails.vue"

export default {
  name: "add",
  components: {JudgeDetails},
  props: {
    openCityList: {
      type: Array,
      default: () => []
    },
    driverTypeMap: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const checkJudgeTypeList = (_rule, value, callback) => {
      // 找到下标
      const index = _rule.field?.split(".")[1];
      if (this.addData.config[index]?.judgeTypeList?.length == 0) {
        callback(new Error("请选择工单类型"));
      } else {
        callback();
      }
    };
    const checkStandardList = (_rule, value, callback) => {
      // 找到下标
      const index = _rule.field?.split(".")[1];
      // 对象为空或msg数组为空
      if (
        this.addData.config[index]?.illegal?.msg1?.length == 0 ||
        Object.keys(this.addData.config[index]?.illegal).length == 0
      ) {
        callback(new Error("请选择判责标准"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      judgeTypeList: [],
      changeOnSelect: false,
      // 是否详情展示
      isDetail: false,
      title: "",
      addData: {
        // 工单类型和判罚标准list
        config: [
          {
            judgeTypeList: [],
            illegal: {
              msg: "",
              // 扩展
              msg1: [],
              level: "",
              forfeit: "",
              id: "",
              idTree: ""
            }
          }
        ],
        cityCodeList: [],
        driverTypeList: [],
        source: "GD"
      },
      standardData: [],
      formRule: {
        // 选择平台
        source: [{ required: true, message: "请选择第三方平台" }],
        // 城市
        cityCodeList: [
          { required: true, type: "array", message: "请选择城市" }
        ],
        // 司机类型
        driverTypeList: [
          { required: true, type: "array", message: "请选择司机类型" }
        ],
        judgeTypeList: [{ required: true, validator: checkJudgeTypeList }],
        config: {
          // 工单类型
          // judgeTypeList: [
          //   { required: true, type: "array", validator: this.checkJudgeTypeList }
          // ],
          // 判责标准
          illegal: [
            { required: true, type: "array", validator: checkStandardList }
          ],
          manual: {required: true, type: "number", trigger: "change", message: '请选择'}
        },
      },
      violationLevelMap
    };
  },
  computed: {
    hasAllCity() {
      return this.addData.cityCodeList?.[0] === "100000";
    },
  },
  watch: {
    "addData.cityCodeList"(v) {
      if (v && v.length > 1 && v.some(code => code === "100000")) {
        this.addData.cityCodeList = ["100000"];
      }
    }
  },
  async mounted() {
    // 获取所有工单类型
    await this.getJudgeTypeList();
    // 获取判罚标准，级联结构
    // this.judgeStandardList();
    await this.queryList();
  },
  methods: {
    async init() {
      // 有id，为编辑或者详情
      this.parentNode = {};
      if (arguments[0]) {
        this.isDetail = arguments[1] == "detail" ? true : false;
        this.title = arguments[1] == "detail" ? "详情" : "编辑";
        // 获取详情，数据回显
        await this.getDetailInfo(arguments[0]);
      } else {
        // 新增
        this.title = "新建第三方规则";
        this.isDetail = false;
        this.$refs.addForm.resetFields();
        this.addData = {
          // 工单类型和判罚标准list
          config: [
            {
              judgeTypeList: [],
              illegal: {
                msg: "",
                // 扩展
                msg1: [],
                level: "",
                forfeit: "",
                id: "",
                idTree: []
              }
            }
          ]
        };
      }

      this.visible = true;
    },
    addItem() {
      this.addData.config.push({
        judgeTypeList: [],
        illegal: {
          msg: "",
          msg1: [],
          level: "",
          forfeit: "",
          id: "",
          idTree: []
        }
      });
    },
    deleteItem(index) {
      this.addData.config = this.addData.config.filter(
        (_item, idx) => idx != index
      );
    },
    async getJudgeTypeList() {
      const res = await getWoTypeList({
        appid: "520315b4d7524001a27a3bde5d052c51",
        level: 3,
        parentUuid: 'GDGD'
      });
      if (res.data.success) {
        const { data } = res.data;
        this.judgeTypeList = data.map(it=>{
        return {
          judgeType:it.uuid,
          judgeTypeDesc:it.name
        }
      });
      } else {
        await this.$Message.error(res.data.msg);
      }
    },
    // async judgeStandardList() {
    //   const res = await webapi.judgeStandardList();
    //   if (res.data.success) {
    //     const { data } = res.data;
    //     // 数据格式化
    //     this.standardData = this.fomatData(data);
    //   } else {
    //     await this.$Message.error(res.data.msg);
    //   }
    // },
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
      } = await webapi.queryAllJudgeType(params);
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
      console.log(item)
      callback();
    },
    async getDetailInfo(id) {
      const res = await webapi.getDetail({ id });
      if (res.data.success) {
        const { data } = res.data;
        // 城市回显
        const cityCodeList =
          Object.entries(data.cityMap).map(([key, _value]) => {
            return key;
          }) || [];
        // 司机类型回显
        const driverTypeList = data.driverTypeInfoList.map(item => {
          return Number(item.driverType);
        });
        // 工单类型和判责标准回显
        this.addData.config = data.config.map((config, index) => {
          config.judgeTypeList = config.judgeInfoList.map(info => {
            return info.judgeType;
          });
          config.illegal.msg1 = config.illegal?.msg?.split("|") || [];
          //   config.illegal.idTree = config.illegal?.id?.split("|").map(it=>Number(it)) || [];
          config.illegal.idTreeArr =
            config.illegal?.idTree?.split("|").map(it => Number(it)) || [];
          return config;
        });
        this.addData = {
          ...data,
          ...this.addData,
          cityCodeList,
          driverTypeList
        };
      } else {
        await this.$Message.error(res.data.msg);
      }
    },
    // 级联选择改变
    changeCascader(value, data, index) {
      // 表示清除
      if (data.length == 0) {
        this.addData.config[index].illegal = {};
      } else {
        // 最后一个节点里面含有惩罚金额和等级的信息
        const target = data[data.length - 1];
        const msg = data.map(v => v.label);
        const ids = data.map(v => v.value);
        this.addData.config[index].illegal = {
          idTreeArr: ids,
          idTree: ids.join("|"),
          id: target.value,
          msg1: msg,
          msg: msg.join("|"),
        //   level: target.violationLevel,
          level:violationLevelMap[Number(target.violationLevel)],
          forfeit: target.forfeit
        };
      }
    },
    fomatData(data) {
      return data.map(item => {
        // 第一层需处理
        if (item.list?.length > 0) {
          item.children = item.list;
        }
        if (item.children?.length > 0) {
          this.fomatData(item.children);
        }
        if (item.woType) {
          item.value = item.woTypeDesc;
        }
        if (item.woTypeDesc) {
          item.label = item.woTypeDesc;
        }
        return item;
      });
    },
    selectType(value, index) {
      this.addData.config[index].judgeTypeList = value || [];
    },
    async save() {
      this.$refs.addForm.validate(async (err, values) => {
        let res;
        if (!err) {
          return false;
        }
        // 拼接cityMap字段，必传项
        let cityMap = {};
        this.addData.cityCodeList = this.addData.cityCodeList.filter(code => this.openCityList.some(item => item.value === code))
        this.addData.cityCodeList.forEach(code => {
          // 过滤出该城市编号对应的城市名称
          const cityName = this.openCityList.filter(
            item => item.value == code
          )[0].label;
          cityMap[code] = cityName;
          });

        // 判断判责标准的类型是否重复,通过拼接再去重
        const allList = this.addData.config.reduce((pre, cur) => {
          pre = pre.concat(cur.judgeTypeList);
          return pre;
        }, []);
        if (allList.length !== [...new Set(allList)].length) {
          this.$Message.error("工单类型重复，请重新选择");
          return false;
        }
        // 判责标准转成字符串，斜线分隔,由于双向绑定的原因，新增编辑的时候需要去除无用的属性
        this.addData.config.forEach(item => {
          delete item.illegal.msg1;
          delete item.judgeInfoList;
        });
        delete this.addData.driverTypeInfoList;
        if (this.addData.id) {
          res = await webapi.edit({ ...this.addData, cityMap });
          if (res.data.success) {
            this.$Message.success("编辑成功");
            this.closeModal();
            setTimeout(() => {
              this.$emit("reset");
            }, 1000);
          } else {
            this.$Message.error(res.data.msg);
          }
        } else {
          res = await webapi.create({ ...this.addData, cityMap });
          const { data } = res.data;
          if (data.success) {
            this.$Message.success("新增成功");
            setTimeout(() => {
              this.$emit("reset");
            }, 1000);
            this.closeModal();
          } else {
            this.$Message.error(data.msg);
          }
        }
      });
    },
    closeModal() {
      this.visible = false;
    },
    /**
     * 动态设置change-on-select的值
     * 当级联选择器弹窗展开时，设置change-on-select为true，即可以点选菜单选项值发生变化
     * 当级联选择器弹窗关闭时，设置change-on-select为false，即能够设置初始值
     */
    handleChangeOnSelect(value) {
      this.changeOnSelect = value;
    }
  }
};
</script>

<style scoped lang="less">
.vertical-center {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
}
.vertical-start {
  display: flex;
  align-items: center;
}
.type-container {
  padding: 16px;
  border: 1px solid red;
}
</style>
