<template>
  <div class="deputy-con">
    <CheckboxGroup v-model="checkAllGroup">
      <div :key="index" v-for="(item, index) in deputyList">
        <Checkbox
          :label="item.value"
          style="font-size: 16px; font-weight: bold"
          >{{ item.label }}</Checkbox
        >
        <div v-if="checkAllGroup.includes(item.value)">
          <!--                    奖励维度-->
          <commission-deputy
            :cData="deputyItemList[index] || undefined"
            :ref="'_commission_deputy_' + item.value"
          ></commission-deputy>
        </div>
        <!--  每个辅策略有自己奖励指标-->
        <div class="award-indicator">
          <Row style="margin-top: 10px">
            <Button @click="selectAwardIndicator(item.value)" type="success"
              >添加奖励指标</Button
            >
          </Row>
          <div
            :key="itm.indexUuid"
            v-for="(itm, ix) in awardMap[item.value] || []"
            class="opt-content"
          >
            <div class="delete">
              <span @click="deleteAwardIndicator(ix, item.value)">删除</span>
            </div>
            <indicator-com
              :ref="'_indicator_award_' + (itm.uuid || itm.indexUuid)"
              :cData="itm || undefined"
            ></indicator-com>
          </div>
        </div>
      </div>
    </CheckboxGroup>
    <!--    考核指标-->
    <indicator
      v-if="indicatorShow"
      :visible="indicatorShow"
      :extra-params="indicatorParams"
      @close="indicatorClose"
    ></indicator>
  </div>
</template>
<script>
import CommissionDeputy from "../../components/commission-deputy";
import IndicatorCom from "../../components/indicator";
import DeputyMixin from "../mixin/deputy";
import Indicator from "./indicator";
import { removeDuplicate } from "_o/components/operator-center/carrier-management/check-management/city/tool";

// 辅策略
export default {
  name: "deputy-component",
  props: {
    list: {
      type: Array,
      default: function () {
        return [];
      },
    },
    listKey: {
      type: String,
      default: "cityAssessAssistReissueVoList",
    },
  },
  components: {
    CommissionDeputy,
    IndicatorCom,
    Indicator,
  },
  mixins: [DeputyMixin],
  async created() {
    await this.getDeputyList();
    this.init();
  },
  data() {
    return {
      checkAllGroup: [], // 辅策略选中的复选框
      deputyItemList: [], // 对应辅策略政策的策略
      awardMap: {}, // 奖励指标map  key : 政策的uuid  value: []
      indicatorParams: {
        // strategyType: "", // 1 辅策略奖励指标入参
      },
      indicatorShow: false,
      currentCommissionUuid: "", // 当前辅策略政策的uuid
    };
  },
  methods: {
    init() {
      this.deputyList.forEach((it, index) => {
        let f = this.list.find((itm) => itm.assistIndexUuid === it.value);
        this.deputyItemList[index] = f || undefined;
        let l =
          f && f[this.listKey] && f[this.listKey].length ? f[this.listKey] : [];
        this.$set(this.awardMap, it.value, l);
      });
      this.checkAllGroup = this.list
        .map((it) => it.assistIndexUuid)
        .filter(Boolean)
        .reduce((previousValue, current) => {
          if (!previousValue.includes(current)) {
            previousValue.push(current);
          }
          return previousValue;
        }, []);
    },
    async valid() {
      let pList = await this.getData();
      if (this.checkAllGroup.length !== pList.length) {
        return [false, []];
      }
      return [true, pList];
    },
    async getData() {
      if (!this.checkAllGroup?.length) return [];
      let r = [];
      let len = this.checkAllGroup.length;
      for (let i = 0; i < len; i++) {
        let it = this.checkAllGroup[i];
        let rf = this.$refs["_commission_deputy_" + it];
        if (rf && rf[0]) {
          const [valid, params] = await rf[0].valid();
          if (valid) {
            params.assistIndexUuid = it; // 辅策略的激励政策uuid
            let f = this.deputyList.find(itm => itm.value === it);
            params.assistIndexName = f?.label || '' // 辅策略政策名称
            if (this.listKey === "cityAssessAssistReissueVoList") {
              // 城市模板
              params.assistReissueDTOList = this.getSubIndicatorList(it);
            } else {
              // 考核流程
              params.assessAssistReissueReqList = this.getSubIndicatorList(it);
            }
            r.push(params);
          }
        }
      }
      return r;
    },
    // checkedUuid: 辅策略的uuid
    getSubIndicatorList(checkedUuid) {
      if (!this.awardMap[checkedUuid]?.length) return [];
      let r = [];
      for (let j = 0; j < this.awardMap[checkedUuid].length; j++) {
        const { uuid, indexUuid } = this.awardMap[checkedUuid][j];
        let uid = uuid || indexUuid
        let rf2 = this.$refs["_indicator_award_" + uid];
        if (rf2 && rf2[0]) {
          let awardData = rf2[0].getData().it;
          awardData.indexName = awardData.name || awardData.indexName;
          if(typeof awardData.indexRuleJson !== 'string') {
            awardData.indexRuleJson = JSON.stringify(awardData.indexRuleJson);
          }
          r.push(awardData);
        }
      }
      return r;
    },
    deleteAwardIndicator(index, uuid) {
      this.awardMap[uuid]?.splice(index, 1);
    },
    indicatorClose(list) {
      this.indicatorShow = false;
      if (!list.length) return;
      let selected = list.map((it) => this.adjustIndicator(it));
      this.setAwardList(selected);
    },
    selectAwardIndicator(uuid) {
      if (!this.checkAllGroup.includes(uuid)) {
        this.$Message.error("请先选择辅策略选项");
        return;
      }
      this.currentCommissionUuid = uuid;
      this.indicatorShow = true;
    },
    setAwardList(selected) {
      if (this.awardMap[this.currentCommissionUuid]?.length) {
        this.awardMap[this.currentCommissionUuid] = removeDuplicate(
          this.awardMap[this.currentCommissionUuid].concat(selected),
          "indexUuid"
        );
      } else {
        this.awardMap[this.currentCommissionUuid] = selected;
      }
    },
    // json字符串转json
    adjustIndicator(it) {
      let isParent = it.parentFlag - 1 === 0; // 是父指标
      let rule = {};
      try {
        rule = JSON.parse(it.standard);
      } catch {
        rule = isParent ? [] : {};
      }
      let r = {
        ...it,
        name: it.name,
        remark: it.remark,
        proportion: "",
        indexUuid: it.uuid || it.indexUuid,
        indexRuleJson: isParent ? [].concat(rule) : { ...rule },
      };

      if (isParent) {
        r.parentFlag = it.parentFlag;
        r._subIndex = 0;
      }
      return r;
    },
  },
};
</script>
<style lang="less" scoped>
.deputy-con {
  margin-left: 60px;
  margin-top: 12px;
}
.award-indicator {
  margin-bottom: 12px;
}

.opt-content {
  background-color: rgba(238, 238, 238, 0.3);
  position: relative;
  //padding: 20px 0;
  margin: 20px 0px;

  .delete {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    z-index: 99;
    color: #2d8cf0;
    padding: 10px;
  }
}
</style>
