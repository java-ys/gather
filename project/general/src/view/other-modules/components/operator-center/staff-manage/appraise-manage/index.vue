<!-- 
  评价管理
  backEnd: 车厘子-肖云惠 
-->
<template>
  <div>
    <TagTable class="top15" :tagList='allTagList' @on-update='updateHadle'>
    </TagTable>
  </div>
</template>
<script>
import TagTable from  './tagTable';
import { tagList} from '_o/api/driver.js';
import { pageData} from './fields.js';
  export default {
    name: 'appraise-manage',
    components: {
      TagTable
    },
    data() {
      return {
        operatorArr: [],
        ...pageData
      }
    },
    mounted(){
      this.setTag();
    },
    methods: {
      setTag() {
        tagList().then(res=> {
          this.allTagList = res.data.data
        })
      },
      updateHadle() {
        this.setTag();
      }
    }
  }
</script>