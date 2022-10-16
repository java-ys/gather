import { getWholeRegion } from "_g/api/common";
import { cpTranslate } from '@/libs/tools'
export default {
  data(){
    return {
      cascaderCityList:[]
    }
  },
  methods: {
    getAllCityList() {
      this.cascaderCityList.splice(0, this.cascaderCityList.length);
      // 优先从local中获取数据
      let cityList = localStorage.getItem("codeProvinceCityList");
      if (cityList) {
        let list = JSON.parse(cityList);
        this.formatCityData(list)
        return false;
      }
      getWholeRegion({}).then(res => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data, "", "", "citys");
          let listCopy = JSON.parse(JSON.stringify(list));
          this.formatCityData(list)
          // 因列表获取数据较多且不会变动，存入本地
          localStorage.setItem(
            "codeProvinceCityList",
            JSON.stringify(listCopy)
          );
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    formatCityData(list){
      list.forEach(item => {
        item.children.unshift({
          label: "全部",
          value: ""
        });
      });
      this.cascaderCityList.push(...list);
    }
  }
};