<template>
  <div>
    <div class="choose-lie right30" @click="chooseLie"><Icon type="md-apps" />{{btnText}}</div>
    <Modal
      v-model="isShow"
      :width="760"
      :title="title"
      :mask-closable="false"
      @on-cancel="isShow = false">
      <div class="selectorBox" v-if="isShow">
        <Row>
          <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll"
          >
            <span style="padding-left:5px">共{{totalColumnKeysNew.length}}项</span>
          </Checkbox>
          <Divider dashed/>
          <CheckboxGroup v-model="selectedKeys" @on-change="handleSelect">
            <Checkbox :label="item.key" v-for="(item, index) in totalColumnNew" :key="index">
              <span>{{item.title}}</span>
            </Checkbox>
          </CheckboxGroup>
        </Row>
        <Divider dashed/>
        <Row style="min-height:100px;">
          <Col span="4" v-for="(item, index) in selectedItems" :key="index">
            <div class="selectedItems" v-if="item">{{item.title}}</div>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="addSubmit()">确定</Button>
        <Button type="text" @click="isShow = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
// 组件使用，结合 columnSelectMix 混入方法
// 1.父组件引入本组件和mix方法组件
//   import columnSelectBtn from "_a/m2-column-select/index.vue";
//   import columnSelectMix from "_a/m2-column-select/mixin";

// 2.data中定义组件需要的变量
//   localColumnName: '${页面name}Column',   //local存储的本页面column唯一key值
//   parColumns: [],                      //table绑定的parColumns值
//   totalColumn: parColumns(this),
//   或者：totalColumn: parColumns

// 3.html部分组件使用
//   <column-select-btn
//     :localName="localColumnName"
//     :totalColumn="totalColumn"
//     @reload="reloadColumn">
//   </column-select-btn>

// 4.js声明组件columnSelectBtn
//   components: {
//     columnSelectBtn
//   },

// 5.js部分混入mixin
//   mixins: [columnSelectMix],

export default {
  name: "m2-carousel-modal",
  props: {
    title: {
      type: String,
      default: "选择列"
    },
    // 总的列
    totalColumn: {
      type: Array,
      default: []
    },
    // 缓存到local的名字
    localName: {
      type: String,
      default: ""
    },
    btnText: {
      type: String,
      default: "选择列"
    }
  },
  data() {
    return {
      isShow: false,
      selectedItems: [],
      selectedKeys: [],
      checkAll: false,
			indeterminate: true,
			selectHash: {}
    };
  },
  computed: {
    totalColumnNew() {
      let arr = [];
      this.totalColumn.map(i => {
        if (!i.type && i.type !== 'index' && i.type !== 'selection' && i.key !== 'action') {
          arr.push(i);
        }
      });
      return arr;
    },
    totalColumnKeysNew() {
      let arr = [];
      this.totalColumn.map(i => {
        if (!i.type && i.type !== 'index' && i.type !== 'selection' && i.key !== 'action') {
          arr.push(i.key);
        }
			});
      return arr;
    }
  },
  methods: {
    init() {
      this.getLocalColumn()
    },
    //处理已选
    dealSeleted(data) {
      console.log(data);
    },
    //选中
    handleSelect(items) {
			this.selectHash = {}
			items.forEach(item=>{
				this.selectHash[item] = true
			})
			this.selectedItems = []
			this.totalColumnNew.forEach(column=>{
				if(this.selectHash[column.key]===true){
					this.selectedItems.push(column)
				}
			})
      if (items.length == this.totalColumnKeysNew.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (items.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    // 储存到本地
    saveInCache() {
      let columns = this.selectedKeys.join(",");
      let params = {
        type: this.searchType,
        excelHeaderListStr: columns
      };
      saveColumnsInCloud(params).then(res => {
        this.$Message.success("保存成功");
      });
      // localStorage.setItem('savedColumns',columns)
    },
    // 获取本地储存项
    getLocalColumn() {
			let localColumn = localStorage.getItem(this.localName)
			if(localColumn){
				let localColumnHash = JSON.parse(localColumn)
				this.selectedKeys = Object.keys(localColumnHash)
			}else{
				this.selectedKeys = this.totalColumnKeysNew
			}
			this.handleSelect(this.selectedKeys)
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;
      if (this.checkAll) {
        this.selectedKeys = this.totalColumnKeysNew;
        this.handleSelect(this.selectedKeys);
      } else {
        this.selectedKeys = [];
      }
      //
    },
    addSubmit(){
      localStorage.setItem(this.localName,JSON.stringify(this.selectHash))
      this.isShow = false
      this.$emit('reload')
    },
    // 选择列
    chooseLie(){
      this.isShow = true
      this.init();
    }
  }
};
</script>
<style scoped lang='less'>
.selectorBox {
  .selectedItems {
    min-width: 90px;
    line-height: 25px;
    text-align: center;
    background: #dddddd;
    color: #000;
    border-radius: 4px;
    margin: 5px;
  }
}
.choose-lie{
  line-height: 32px;
  cursor: pointer;
}
.choose-lie .ivu-icon{
  font-size: 20px;
  position: relative;
  top:-2px;
  color:#2d8cf0;
}
</style>