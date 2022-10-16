import {  getNationalCityInAuth } from '_g/api/common.js' 

export const tools = {
  data(){
    return {
      cityList:[]
    }
  },
  methods: {
    async getCityList(){
      let catchCityList = localStorage.getItem('authCityList')
      if(catchCityList){
        this.cityList = JSON.parse(catchCityList)
        return false
      }
      let res = await getNationalCityInAuth({})
      let list = res.data.data || [];
      let result = {}
      list.forEach(item=>{
        result[item.cityID] = item.city
      })
      localStorage.setItem('authCityList',JSON.stringify(result))
      this.cityList = result
    }
  }
};