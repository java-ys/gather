import { deputyCommissionService } from "_o/api/city-check";
import { tool } from "_o/api/baseMixin.js";
import { removeDuplicate } from "../tool";
import baseMixin from "./base";
export default {
  mixins: [tool, baseMixin],
  data() {
    return {
      deputyList: [], // 辅策略列表
      awardOptionList: [] // 辅策略奖励指标
    };
  },
  methods: {
    async getDeputyList() {
      // if(this.deputyList.length) return
      const [err, data] = await this.toResult(deputyCommissionService({}));
      if (err) {
        return;
      }
      this.deputyList = data?.map((it) => ({
        label: it.indexName,
        value: it.uuid,
      }));
    },
    selectAwardIndicator() {
      this.indicatorParams = {
        strategyType: 1
      };
      this.indicatorShow = true;
    },
    deleteAwardIndicator(key) {
      this.awardOptionList.splice(key, 1);
    },
    setAwardList(selected) {
      if (this.awardOptionList.length) {
        this.awardOptionList = removeDuplicate(
          this.awardOptionList.concat(selected),
          "indexUuid"
        );
      } else {
        this.awardOptionList = selected;
      }
    }
  },
};
