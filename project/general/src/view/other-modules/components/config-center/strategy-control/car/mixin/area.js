import { _getAreaInfoByCityCode } from "_g/api/general";
import { mapGetters, mapState } from "vuex";
import {excludeLine} from "../fields";

export default {
  data() {
    return {
      areaList: [], // 区县列表
      expandBizLineList: [], // 业务线
    };
  },
  computed: {
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList,
      bookingBusinessGradeList: (state) =>
        state.common.businessGradeList.filter(
          (it) => it.value !== 8 && it.value !== 9
        ),
      bizTypeList: (state) => state.common.bizTypeList,
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName",
    }),
  },
  mounted() {
    this.$nextTick(() => {
      this.expandBizLineList = this.businessGradeList.filter(it => excludeLine(it.value));
    });
  },
  methods: {
    async getArea(cityCode) {
      let res = await _getAreaInfoByCityCode(cityCode);
      this.areaList = res.list;
      return res;
    },
  },
};
