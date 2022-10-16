const NO_LIMIT_VALUE = -1;
// 获取提交参数
export default {
  methods: {
    async getCommitParams() {
      const { cityUuidList, assessTime, operateType, businessType } =
        this.addForm;
      let p = {
        ...this.addForm,
        operateType: operateType.join(","),
        businessType: businessType.join(","),
        assessTime: assessTime
          .map((it) => this.$moment(it).format("YYYY-MM"))
          .join(","),
        cityAssessIndexDTOList: this.handleCityAssessIndexDTOList(), // 考核指标
      };
      if (!cityUuidList.some((it) => it - NO_LIMIT_VALUE === 0)) {
        // 非不限
        p.cityUuidList = cityUuidList.map((it) => {
          let [, cityUuid] = it.split("-");
          return cityUuid;
        });
      }
      return p;
    },
    // 考核指标
    handleCityAssessIndexDTOList() {
      let tmpList = [];
      let refs = this.getIndicatorRef();
      let refsData = [];
      if (refs?.length) {
        refsData = refs.map((rf, index) => {
          return rf.getData().it;
        });
      }
      this.optionList.forEach((it, index) => {
        let f = refsData.find((item) => item.indexUuid === it.indexUuid);
        if (f) {
          f.sort = index;
          f.groupIndexUuid = it.groupIndexUuid || "";
          tmpList.push(f);
        }
      });
      for (let item of tmpList) {
        Object.keys(item).forEach((key) => {
          item[key] === "" && delete item[key];
        });
      }
      return tmpList;
    },
    // 扣减指标
    getDeductParams() {
      let tmpList = [];
      this.deductionList.forEach(it => {
        let uuid = it.uuid || it.indexUuid
        let rf = '_indicator_deduct_' + uuid;
        let ref = this.$refs[rf]
        if(ref && ref[0]) {
          let data = ref[0].getData();
          // console.log(data, 'ddd')
          let { indexRuleJson, uuid, indexName, indexUuid, name, remark, parentFlag } = data || {};
          tmpList.push({
            indexUuid: uuid || indexUuid,
            name: name || indexName,
            indexName: name || indexName,
            indexRuleJson,
            remark,
            parentFlag
          })
        }
      })

      for (let item of tmpList) {
        Object.keys(item).forEach((key) => {
          item[key] === "" && delete item[key];
        });
      }
      return tmpList;
    },
    getIndicatorRef() {
      return this.$refs._indicator_ || [];
    },
    // 辅策略
    async getAssistParams() {
      const [bool, list] = await this.$refs._deputy_com.valid();
      // console.log(list, 'list-2')
      return [
        bool,
        list.map((item) => {
          let p = {
            ...item,
            standard: item.indexRuleJson,
          };
          delete p.indexRuleJson
          if(p?.assistReissueDTOList?.length) {
            p.assistReissueDTOList = p.assistReissueDTOList.map(item => {
              let {uuid, indexUuid, name, indexName, parentFlag, proportion,indexRuleJson, remark} = item
              return {
                indexUuid: uuid || indexUuid,
                name: name || indexName,
                indexName: name || indexName,
                parentFlag,
                proportion,
                indexRuleJson,
                remark
              }
            })
          }
          return p
        }),
      ];
    },
  },
};
