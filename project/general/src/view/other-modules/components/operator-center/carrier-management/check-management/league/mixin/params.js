export default {
  methods: {
    async getCommitParams() {
      const { assessTime, operateType, businessType } = this.formData;
      let p = {
        ...this.formData,
        operateType: operateType.join(","),
        businessType: businessType.join(","),
        assessTime: assessTime
          .map((it) => this.$moment(it).format("YYYY-MM"))
          .join(","),
        submitAgentAssessIndexReqList: this.handleAddForm(),
      };
      // 主策略
      if (this.$refs._commission_main) {
        let { basicCommissionDTO } = this.$refs._commission_main?.getParams() || { params: {} };
        p.agentAssessBasicCommissionReq = {
          ...basicCommissionDTO,
          basicDeductionReqList: this.getDeductParams()
        };
      }

      // 辅策略
      const [, assistList] = await this.getAssistParams();
      p.agentAssessAssistCommissionReqList = assistList;

      return p;
    },
    // 扣减指标
    getDeductParams() {
      let tmpList = [];
      this.deductionList.forEach(it => {
        let uuid = it.uuid || it.indexUuid
        let rf = '_indicator_deduct_' + uuid;
        let ref = this.$refs[rf]
        if(ref && ref[0]) {
          let data = ref[0].getData()
          tmpList.push(data)
        }
      })

      for (let item of tmpList) {
        Object.keys(item).forEach((key) => {
          item[key] === "" && delete item[key];
        });
      }
      return tmpList;
    },
    // 辅策略
    async getAssistParams() {
      const [bool, list] = await this.$refs._deputy_com.valid();
      // console.log(list, 'list-1')
      return [
        bool,
        list.map((item) => {
          let p = {
            ...item,
            standard: item.indexRuleJson,
          };
          delete p.indexRuleJson
          // 奖励指标
          if(p?.assessAssistReissueReqList?.length) {
            p.assessAssistReissueReqList = p.assessAssistReissueReqList.map(item => {
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
  }
}
