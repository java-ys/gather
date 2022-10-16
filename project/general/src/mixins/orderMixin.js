import { getBizState } from "_o/api/work-order/common.js";
const orderMixin ={
    data(){
        return{
          runStateLabelList:[],
          runStateLabelMap:{}
        }
    },
    methods:{
        async fetchOptions(params={appId:"520315b4d7524001a27a3bde5d052c51"}) {
            const [
              {
                data:{data: BizStateList }
              }
            ] = await Promise.all([getBizState({appId:params.appId})]);
            const resultList = BizStateList.map(it => {
              let temObj = {
                ...it,
                label:it.desc,
                value:it.code
              }
              return temObj
            })
            let resultMap = {} 
            for(let item of BizStateList){
              resultMap[item.code] = item.desc
            }
            this.runStateLabelMap = resultMap
            this.runStateLabelList = resultList
            // console.log(resultMap)
            return resultList
          },
    }
}

export default orderMixin;