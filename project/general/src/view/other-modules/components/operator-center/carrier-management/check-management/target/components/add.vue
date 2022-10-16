<template>
  <div>
    <Modal
      v-model="visible"
      :title="title"
      width="900"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="_form"
        :model="addForm"
        :label-width="150"
        :rules="validateRules"
      >
        <FormItem label="指标分类：" prop="classify">
          <Select
            v-model="addForm.classify"
            placeholder="请选择"
            style="width: 240px"
            :disabled="isSystem"
          >
            <Option
              :key="idx"
              :value="it.value"
              v-for="(it, idx) in classifyList"
              >{{ it.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="指标类型：" prop="type">
          <Select
            v-model="addForm.type"
            placeholder="请选择"
            style="width: 240px"
            v-if="!isSystem"
          >
            <Option
              :key="idx"
              :value="it.value"
              v-for="(it, idx) in typeList"
              >{{ it.label }}</Option
            >
          </Select>
          <span v-else>系统指标</span>
        </FormItem>
        <FormItem label="指标名称：" prop="name">
          <Input
            v-model="addForm.name"
            style="width: 240px"
            :maxlength="50"
            :disabled="isSystem"
            placeholder="请输入指标名称"
          ></Input>
        </FormItem>
        <FormItem label="指标说明:" prop="remark">
          <Input
            type="textarea"
            v-model="addForm.remark"
            :rows="4"
            :maxlength="500"
            style="width: 300px"
            :disabled="isSystem"
            placeholder="请输入指标说明"
          />
        </FormItem>
        <FormItem label="是否父指标:" prop="parentFlag">
          <RadioGroup v-model="addForm.parentFlag">
            <Radio :label="1" :disabled="isSystem">是</Radio>
            <Radio :label="0" :disabled="isSystem">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否主策略:" prop="strategyType">
          <RadioGroup v-model="addForm.strategyType">
            <Radio :label="0" :disabled="isSystem">是</Radio>
            <Radio :label="1" :disabled="isSystem">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否导入目标:" prop="targetFlag" v-if="detail.type - 1 === 0">
          <RadioGroup v-model="addForm.targetFlag">
            <Radio :label="1" :disabled="isSystem">是</Radio>
            <Radio :label="0" :disabled="isSystem">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="addForm.parentFlag - 1 === 0" label="" prop="">
          <Button @click="selectSubTarget">选择子考核指标</Button>
        </FormItem>
        <FormItem v-else label="考核标准:" prop="standard">
          <Row>
            <Col span="12">阶梯标准:</Col>
            <Col span="12">系数</Col>
          </Row>
          <Row>
            <Col span="24">
              <RadioGroup
                v-model="addForm.standard.way"
                type="button"
                @on-change="radioChange"
              >
                <Radio :label="0">百分比</Radio>
                <Radio :label="1">数值</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <br />
          <Row
            class-name="row-c"
            :key="index"
            v-for="(item, index) in addForm.standard.definition"
          >
            <Col span="12">
              <Input
                v-model="item.min"
                style="width: 60px"
                :maxlength="10"
                placeholder=""
                @on-keyup="toNumber(item.min, 'min', index)"
              ></Input>
              <span v-if="!addForm.standard.way">%</span>
              <Select v-model="item.minSign" style="width: 60px" placeholder="">
                <Option key="1" value=">">></Option>
                <Option key="2" value="<"><</Option>
                <Option key="3" value="=">=</Option>
                <Option key="4" value="<=">≤</Option>
                <Option key="5" value=">=">≥</Option> </Select
              ><span class="sym">X</span>
              <Select v-model="item.maxSign" style="width: 60px" placeholder="">
                <Option key="1" value=">">></Option>
                <Option key="2" value="<"><</Option>
                <Option key="3" value="=">=</Option>
                <Option key="4" value="<=">≤</Option>
                <Option key="5" value=">=">≥</Option>
              </Select>
              <Input
                v-model="item.max"
                style="width: 60px"
                :maxlength="10"
                placeholder=""
                @on-keyup="toNumber(item.max, 'max', index)"
              ></Input>
              <span v-if="!addForm.standard.way">%</span>
            </Col>
            <Col span="12"
              ><Input
                v-model="item.coefficient"
                style="width: 180px"
                :maxlength="9"
                placeholder=""
              ></Input>
              <Icon
                v-if="addForm.standard.definition.length > 1"
                class="remove-icon cp"
                size="24"
                type="ios-remove-circle-outline"
                @click="removeItem(index, item)"
              />
              <Icon
                class="add-icon cp"
                size="24"
                type="ios-add-circle-outline"
                @click="addItem(item)"
              />
            </Col>
          </Row>
        </FormItem>
        <FormItem v-if="addForm.parentFlag - 1 === 0" label="" prop="">
          <div
            v-for="(item, index) in subTargetList"
            :key="item.childIndexId"
            class="flex-r space-between sub-line"
          >
            <span class="flex-3">{{ item.childIndexName }}</span>
            <span class="flex-2">
              <Icon
                class="remove-icon cp"
                size="24"
                type="ios-remove-circle-outline"
                @click="removeSubItem(index, item)"
              />
            </span>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" :loading="submitLoading" @click="confirmAdd">
          <span>确定</span>
        </Button>
        <Button type="primary" ghost @click="cancel">取消</Button>
      </div>
    </Modal>
    <!-- 考核子指标选择 -->
    <sub-target
      v-if="subShow"
      :visible="subShow"
      :subTargetList="subTargetList"
      :extraParams="extraParams"
      @close="subTargetClose"
    ></sub-target>
  </div>
</template>

<script>
import { assessSaveService, assessUpdateService } from "_o/api/check";
import { tool } from "_o/api/baseMixin.js";
import { equator, classifyList, typeList } from "../fields";
import SubTarget from "./subTarget.vue";

const def = {
  min: "",
  minSign: "",
  max: "",
  maxSign: "",
  coefficient: 0,
};
const formKey = [
  "classify",
  "type",
  "name",
  "remark",
  "parentFlag",
  'strategyType',
  'targetFlag',
  "standard",
];
function freeze(o = {}) {
  return Object.freeze(o);
}
export default {
  name: "target-add",
  components: {
    SubTarget,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  mixins: [tool],
  computed: {
    isPercentage({ addForm }) {
      return addForm.standard.way - 1 !== 0;
    },
    isEdit({detail}) {
      return !!detail?.id
    },
    isSystem({detail}) {
      return detail.type - 1 === 0
    }
  },
  watch: {
    'addForm.parentFlag': {
      handler: function(v) {
        if(this.detail.parentFlag - 1 === 0 && v - 0 === 0) {
          this.addForm.standard = {
            way: 0,
            definition: [{...def}]
          }
        }
      },
      deep: true
    }
  },
  data() {
    let title = "新建考核指标库";
    let editData = {};
    let isParent = this.detail.parentFlag - 1 === 0
    if (this.detail.id) {
      formKey.forEach((k) => {
        editData[k] = this.detail[k];
      });
      editData.standard = JSON.parse(editData.standard);
      title = "编辑考核指标库";
      if (!editData.standard || typeof editData.standard.way == "undefined") {
        editData.standard = {
          way: 0,
          definition: [
            {
              min: "",
              minSign: "",
              max: "",
              maxSign: "",
              coefficient: 0,
            },
          ],
        }
      }
    }
    return {
      title,
      submitLoading: false,
      classifyList: freeze(classifyList),
      typeList: freeze(typeList),
      validateRules: freeze({
        classify: [{ required: true, message: "请选择指标分类" }],
        type: [{ required: true, message: "请选择指标类型" }],
        parentFlag: [{ required: true, message: "请选择是否父指标" }],
        strategyType: [{ required: true, message: "请选择是主策略" }],
        name: [{ required: true, message: "请输入指标名称", trigger: "blur" }],
        remark: [
          { required: true, message: "请输入指标说明", trigger: "blur" },
        ],
      }),
      subTargetList: isParent ? editData.standard : [],
      extraParams: {},
      addForm: this.detail.id
        ? editData
        : {
            classify: "", // 指标分类
            type: "", // 指标类型
            name: "", // 指标名称
            remark: "", // 指标说明
            parentFlag: 0,
            targetFlag: '',
            strategyType: 1,
            standard: {
              way: 0,
              definition: [
                {
                  min: "",
                  minSign: "",
                  max: "",
                  maxSign: "",
                  coefficient: 0,
                },
              ],
            }, // 考核标准
          },
      subShow: false, // 子指标选择弹层
    };
  },
  methods: {
    removeItem(index) {
      this.addForm.standard.definition.splice(index, 1);
    },
    addItem() {
      this.addForm.standard.definition.push({ ...def });
    },
    // 去掉空字符串---暂时不上
    handleAddForm() {
      let tmpList = JSON.parse(
        JSON.stringify(this.addForm.standard.definition)
      );
      for (let item of tmpList) {
        Object.keys(item).forEach((key) => {
          item[key] === "" && delete item[key];
        });
      }
      return tmpList;
    },
    confirmAdd() {
      this.$refs._form.validate(async (bool) => {
        if (!bool) return;
        let msg = this.detail.id ? "修改成功" : "新建成功";
        let func = this.detail.id ? assessUpdateService : assessSaveService;
        if (this.detail.id) {
          this.addForm.id = this.detail.id;
        }

        let p = this.addForm;
        if (p.parentFlag - 1 === 0) {
          p.standard = this.subTargetList;
        }
        if (!this.validForm(p)) {
          return;
        }
        if (this.detail.type - 1 !== 0) { // 非系统指标 不入参是否需导入目标
          delete p.targetFlag
        }
        // console.log(this.addForm, 'p');
        // return
        const [err, data] = await this.toResult(func(p));
        if (err) {
          return;
        }
        this.$Message.success(msg);
        this.$emit("confirm");
      });
    },
    validForm(p) {
      if (p.parentFlag - 1 === 0) {
        if (!p?.standard?.length) {
          this.$Message.error("请选择子指标");
          return;
        }
      } else {
        // let ps = p?.standard?.definition;
        // if (ps) {
        //   if (!ps.every((it) => !!it.coefficient)) {
        //     this.$Message.error("考核规则系数不能为空");
        //     return;
        //   }
        // }
      }

      return true;
    },
    cancel() {
      this.$Modal.confirm({
        title: `是否确认取消${this.title}？`,
        onOk: () => {
          this.$refs._form.resetFields();
          this.$emit("close");
        },
      });
    },
    // 数值和百分比都是两位小数, 百分比范围[0, 100]
    toNumber(val, key, index) {
      let v = `${val}`;
      v = `${val}`.replace(/[^\d\.-]/g, "");
      let vArr = v.split(".");
      if (vArr.length > 2) {
        v = vArr.slice(0, 2).join(".");
      }
      if (vArr[1] && vArr[1].length > 6) {
        v = Number(v).toFixed(6);
      }
      // if (this.isPercentage) {
      //   if (v > 100) {
      //   v = 100;
      //   } else if (v < 0) {
      //     v = 0;
      //   }
      // }
      this.addForm.standard.definition[index][key] = v;
    },
    // 标准切换不保留当前值, 详情切换后显示原本的值
    radioChange(v) {
      if (this.detail.id) {
        let originStandard = JSON.parse(this.detail.standard);
        if (v - originStandard.way === 0) {
          this.addForm.standard.definition = originStandard.definition;
        } else {
          this.addForm.standard.definition = [];
          this.addForm.standard.definition.push({ ...def });
        }
      } else {
        this.addForm.standard.definition = [];
        this.addForm.standard.definition.push({ ...def });
      }
    },
    selectSubTarget() {
      this.extraParams.strategyType = this.addForm.strategyType
      this.subShow = true;
    },
    // 选择的子指标
    subTargetClose(rowList) {
      this.subShow = false;
      if (!rowList.length) return;
      console.log(rowList)
      this.subTargetList = rowList.map((it) => {
        let rule = {};
        try{
          rule = JSON.parse(it.standard)
        } catch {
          rule = {}
        }
        let r = {
          childIndexId: it.id,
          childIndexName: it.name,
          indexRule: {
            ...rule,
          },
        };
        return r;
      });
    },
    removeSubItem(index) {
      this.subTargetList.splice(index, 1);
    },
  },
};
</script>


<style scoped>
.sym {
  margin: 0 10px;
}
.row-c {
  margin-bottom: 8px;
}
.flex-r {
  display: flex;
  flex-direction: row;
}
.space-between {
  justify-content: space-between;
}

.flex-3 {
  flex: 3;
}
.flex-2 {
  flex: 2;
}
.cp {
  cursor: pointer;
}
</style>
