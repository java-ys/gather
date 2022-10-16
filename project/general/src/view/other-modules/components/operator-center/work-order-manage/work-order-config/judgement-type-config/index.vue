<template>
  <div>
    <searchList
      :inputList="inputList"
      @on-search="handleSearch"
      @on-reset="handleReset"
      ref="searchList"
    >
    </searchList>
    <div class="action">
      <Button type="primary" @click="onCreate">新建</Button>
    </div>
    <VTable
      :total="table.total"
      :current="table.pageNum"
      :pageSize="table.pageSize"
      :parColumns="tableColumn"
      :parTableData="tableData"
      @changePage="handleChangePage"
      @changePageSize="handleChangePageSize"
    >
      <div slot="judgeName" slot-scope="params" class="treecol">
        <div :style="{width:`${10*params.data.row.judgeLevel}px`}"></div>
        <Icon
          v-if="params.data.row.opened"
          type="md-remove"
          class="tree-icon"
          :class="{'space':params.data.row.judgeLevel === 5}"
          size="16"
          @click.native="onQueryChild(params.data.row)"
        />
        <Icon
          v-else
          type="md-add"
          size="16"
          class="tree-icon"
          :class="{'space':params.data.row.judgeLevel === 5}"
          @click.native="onQueryChild(params.data.row)"
        />
        <span>{{ params.data.row.judgeName }}</span>
      </div>
    </VTable>
    <Modal
      ref="modal"
      v-model="showModal"
      :title="type === 0 || type === 2 ? '新建判责分类' : '编辑判责分类'"
      :width="800"
      :mask-closable="false"
      @on-ok="onOk"
    >
      <Form ref="form" :model="form" :rules="formRule" :label-width="120">
        <FormItem v-if="type === 2" label="上级分类：" prop="woType">
          <p>{{ parentName }}</p>
        </FormItem>
        <FormItem label="所属工单分类：" prop="woType">
          <Select
            v-model="form.woType"
            clearable
            class="item-width"
            :disabled="type !== 0"
          >
            <Option
              v-for="(item, index) in categoryMap"
              :value="item.value"
              :key="index"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="判责分类名称：" prop="judgeName">
          <Input
            v-model="form.judgeName"
            clearable
            placeholder="请输入"
            class="item-width"
            :maxlength="32"
          ></Input>
        </FormItem>
        <FormItem label="违规等级：" prop="violationLevel">
          <Select v-model="form.violationLevel" clearable filterable class="item-width">
            <Option
              v-for="(item, index) in violationLevelList"
              :value="item.value"
              :key="index"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="处罚类型：" prop="punishTypes">
          <Select v-model="form.punishTypes" clearable filterable multiple class="item-width">
            <Option
              v-for="(item, index) in punishTypeList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem
                  label="服务分："
                  prop="serviceScore"
                  v-show="form.punishTypes.includes(2)">
          <Select v-model="form.serviceScore"
                  clearable
                  filterable
                  label-in-value
                  class="item-width"
                  >
            <Option
              v-for="(item, index) in serviceScoreList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="课程学习："
                  prop=""
                  v-show="form.punishTypes.includes(3)">
          <Select v-model="form.courseType"
                  clearable
                  style="width: 80px;"
                  @on-change="courseTypeChange">
            <Option
              v-for="(item, index) in courseTypeList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</Option
            >
          </Select>
          <Select v-model="form.course"
                  clearable
                  filterable
                  label-in-value
                  style="width: 176px;"
                  >
            <Option
              v-for="(item, index) in (form.courseType - 1 === 0 ? courseList : examList)"
              :value="item.value"
              :key="index"
            >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="处罚金额：" prop="forfeit" v-show="form.punishTypes.includes(1)">
          <InputNumber
            v-model="form.forfeit"
            class="item-width"
            placeholder="请输入"
            :max="99999.99"
          ></InputNumber>
        </FormItem>
        <FormItem label="扣除订单流水：" prop="deductOrderFlow">
          <RadioGroup v-model="form.deductOrderFlow">
            <Radio :label="1">
              是
            </Radio>
            <Radio :label="0">
              否
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="阶梯处罚：" prop="openLadderPunish">
          <Checkbox v-model="form.openLadderPunish">启用</Checkbox>
          <Tooltip
            content="启用阶梯处罚后，优先按阶梯处罚标准"
            placement="top"
          >
            <Icon type="md-help-circle" size="16" />
          </Tooltip>
        </FormItem>
        <ladder-punishment
          v-show="form.openLadderPunish"
          :refresh="showModal"
          :cData="deepCopy({}, form.ladderPunish)"
          ref="_ladderPunishment"
        ></ladder-punishment>
      </Form>
    </Modal>
  </div>
</template>

<script>
import {
  inputList,
  tableColumn,
  formRule,
  categoryMap,
  violationLevelList,
} from "./fields";
import {
  queryPageJudgeTypeList,
  deleteJudgeType,
  updateJudgeType,
  insertJudgeType,
  queryDriverType,
  queryByParentId,
} from "_o/api/work-order/work-order-config";
import LadderPunishment from "./components/ladder-punishment.vue";
import { freeze, deepCopy } from "@/mixins/base";
import ladderMixin, {value_sep} from "./ladder";

export default {
  name: "judgement-type-config",
  components: {
    LadderPunishment
  },
  mixins: [ladderMixin],
  data() {
    return {
      type: 0, // 0 新建 1 编辑 2 添加子类
      inputList: inputList(this),
      tableColumn: tableColumn(this),
      search: {},
      table: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      showModal: false,
      form: {
        driverType: "",
        woType: "",
        judgeName: "",
        violationLevel: null,
        punishTypeList: [],
        forfeit: null,
        deductOrderFlow: null,
        openLadderPunish: false,
        punishTypes: []
      },
      formRule: formRule(this),
      categoryMap,
      violationLevelList: freeze(violationLevelList),
      parentName: ""
    };
  },
  created() {
    this.init();
  },
  watch: {
    showModal(val) {
      if (!val) {
        this.$nextTick(() => {
          this.clearBasicPunish().clearLadderPunish();
        });
      }
    }
  },
  methods: {
    init() {
      this.queryList();
    },
    async queryList() {
      this.$store.commit("changeLoadingFlag", true);
      const {
        search,
        table: { pageNum, pageSize }
      } = this;
      const params = {
        currPage: pageNum,
        pageSize,
        ...search
      };
      try {
        const {
          data: {
            success,
            data: { list, totalCount }
          }
        } = await queryPageJudgeTypeList(params);
        if (success) {
          this.tableData = list.map(it => {
            return {
              ...it,
              opened: false
            };
          });
          this.table.total = totalCount;
        }
      } catch (error) {
        console.log(error);
        this.tableData = error.data.list;
      }
      this.$store.commit("changeLoadingFlag", false);
    },
    handleSearch(val) {
      this.search = val;
      this.table.pageNum = 1;
      this.queryList();
    },

    handleReset() {
      this.search = {};
      this.table.pageNum = 1;
      this.queryList();
    },

    handleChangePage(val) {
      this.table.pageNum = val;
      this.queryList();
    },

    handleChangePageSize(val) {
      this.table.pageSize = val;
      this.queryList();
    },

    changeShowModal() {
      this.showModal = !this.showModal;
    },

    onCreate() {
      this.type = 0;
      this.changeShowModal();
    },

    updateData(row) {
      const {
        id,
        driverType,
        woType,
        judgeName,
        // forfeit,
        deductOrderFlow,
        judgeLevel,
        parentId,
        basicPunish,
        ladderPunish,
        openLadderPunish
      } = row;
      this.type = 1;
      let { punishTypes=[], forfeit, serviceScore, course, violationLevel } = basicPunish || {}
      this.form = {
        id,
        driverType: JSON.parse(driverType),
        woType,
        judgeName,
        violationLevel,
        forfeit,
        deductOrderFlow:deductOrderFlow? 1:0,
        punishTypes,
        judgeLevel,
        ladderPunish,
        openLadderPunish,
        _course:course,
        _serviceScore: serviceScore
      };
      if(course) {
        let { id, type, name} = course
        this.form.courseType = type
        this.form.course = id + value_sep + name
        if(id) {
          this.courseTypeChange(type)
        }
      }

      if(serviceScore) {
        let { uuid, value, name } = serviceScore
        this.form.serviceScore = uuid + value_sep + value + value_sep + name;
        if(uuid) this.getScoreList()
      }

      if(judgeLevel>1){
          this.form.parentId = parentId
      }
      this.changeShowModal();
    },

    delData(row) {
      this.$Modal.confirm({
        title: "确定删除数据吗，删除后将无法恢复？",
        onOk: async () => {
          try {
            const { id,woType } = row;
            const params = { id,woType };
            const {
              data: { success }
            } = await deleteJudgeType(params);
            if (success) {
              this.$Message.success("成功");
              this.queryList();
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    },

    addSubData(row) {
      const { id, judgeLevel, judgeName, woType } = row;
      if(judgeLevel === 5){
          this.$Message.error('最多只支持五级分类！')
          return
      }
      this.type = 2;
      this.form.id = id;
      this.form.judgeLevel = judgeLevel;
      this.form.woType = woType;
      this.parentName = judgeName;
      this.changeShowModal();
    },

    async onOk() {
      this.showModal = true;
      this.$refs.modal.visible = true;
      try {
        const bool = await this.$refs["form"].validate();
        if(!bool) return
        const {
          type,
          form: {
            id,
            judgeLevel,
            parentId,
          }
        } = this;
        let [p, func] = [{}, insertJudgeType]
        if(type - 0 === 0) {
          p = {
            judgeLevel: 1,
          }
        } else if (type - 2 === 0) {
          p = {
            parentId: id,
            judgeLevel: judgeLevel + 1,
          }
        } else if (type - 1 === 0) {
          p = {
            id,
            judgeLevel,
            parentId,
          }
          func = updateJudgeType
        }
        p = {
          ...p,
          ...this.getBasicParams(),
          ...this.getBasePunishParams(),
          ...this.getLadderPunishParams()
        }
//         console.log(JSON.stringify(p), null ,2)
// return
        const {
          data: { success }
        } = await func(p);
        let msg = p.id ? "编辑成功" : "新建成功"
        if (success) {
          this.$Message.success(msg);
          this.showModal = false;
          this.queryList();
        }
      } catch (error) {
        console.log(error);
      }
    },

    onQueryChild(row) {
      const { id, _index, opened } = row;
      // 展开则查询子类
      if (!opened) {
        queryByParentId({
          parentId: id
        }).then(res => {
          const {
            data: { success, data }
          } = res;

          let tempArr = [];
          if (success) {
            tempArr = data.map(it => {
              return {
                ...it,
                opened: false
              };
            });
            this.tableData.splice(_index+1, 0, ...tempArr);
            this.$nextTick(() => {
              this.tableData.find(it => it.id === id).opened = true;
            });
          }
        });
      } else {
        //   收起 去掉子类
        const tempArr = this.tableData.filter(it => it.parentId !== id);
        this.$set(this, "tableData", tempArr);
        this.$nextTick(() => {
          this.tableData.find(it => it.id === id).opened = false;
          // this.table.total = this.tableData.length
        });
      }
    },
    clearLadderPunish() {
      this.$refs._ladderPunishment?.clear()
      return this
    },
    clearBasicPunish() {
      this.$refs["form"]?.resetFields();
      this.form.openLadderPunish = false
      return this
    },
    deepCopy
  }
};
</script>

<style lang="less" scoped>
.action {
  margin: 0 0 15px;
}
.treecol {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  button {
    display: block;
  }
  /deep/ .ivu-icon {
    display: block;
    width: 12px;
  }
  .tree-icon {
    display: block;
    margin: 0 12px 0 0;
    border: 1px solid;
    width: 18px;
    border-radius: 3px;
    cursor: pointer;
  }
  .space{
      opacity: 0;
  }
}
.item-width {
  width: 260px;
}
</style>
