export const tools = {
  methods: {
    chooseTime(date) {
      this.addData.effectTime = date;
    },
    // 产品线切换时触发，全部产品线和其他互斥
    handleProductLine(val, key) {
      console.log(val, key, "*******")
      let length = val.length;
      if (val[length - 1] === 0) {
        Object.keys(this.addData.PLA).forEach(item => {
          this.addData.PLA[item].productLineArray = [0];
        });
      } else {
        val.forEach((v, k) => {
          if (v === 0) val.splice(k, 1);
        });
        const PLA = this.addData.PLA;
        PLA[key].productLineArray = val;
        // 获取没有选中的值
        const notVal = PLA[key].businessListFinal.map(item => {
          if (!val.includes(item.value)) {
            return item.value
          } else {
            return null
          }
        }).filter(Boolean).concat(0)
        Object.keys(PLA).forEach(item => {
          if (item === key) {
            return false
          }
          const arr = PLA[item].productLineArray;
          // 加入选中的值
          val.forEach(v => {
            if (!arr.includes(v)) {
              arr.push(v)
            }
          });
          // 删除不存在的值
          notVal.forEach(v => {
            const index = arr.indexOf(v);
            if (index !== -1) {
              arr.splice(index, 1);
            }
          });
          PLA[item].productLineArray = arr;
        });
        this.addData.PLA = { ...PLA };
      }
      this.$forceUpdate();
    },
    // 城市切换时触发，全国所有城市和其他互斥
    changeCity(val) {
      let length = val.length;
      if (val[length - 1] === "1") {
        this.addData.cityArray = ["1"];
      } else {
        val.forEach((v, k) => {
          if (v === "1") val.splice(k, 1);
        });
        this.addData.cityArray = val;
      }
    },
    // 商品类型切换时触发，全部和其他互斥
    handleGoodType(val) {
      let length = val.length;
      if (val[length - 1] === 0) {
        this.addData.productTypeArray = [0];
        this.addData.productType = 1;
      } else {
        val.forEach((v, k) => {
          if (v === 0) val.splice(k, 1);
        });
        this.addData.productTypeArray = val;
        this.addData.productType = 2;
      }
    }
  }
};
