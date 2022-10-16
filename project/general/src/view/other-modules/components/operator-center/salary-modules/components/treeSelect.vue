<template>
  <div class="boxStyle">
    <Dropdown id="tree" trigger="custom" :visible="visible"	@on-visible-change="dropTreeList" @on-clickoutside="visible = !visible">
      <div class="textareastyle" @click="focusInput">
        <ul class="disflex">
          <li>
            <span class="listitem">{{testName}}</span>
          </li>
          <Input
            ref="autofocus"
            v-model="searchText"
            placeholder=""
            class="iptstyles"
            :style="{ 'width': iptWidth + '%' }"
            @on-change="getInput"
            @on-focus="getFocus"
          />
        </ul>
      </div>
      <DropdownMenu slot="list">
        <Tree id="tree" ref="tree" :check-strictly="strictly" :data="listData" :multiple="false" @on-select-change="checkChange"></Tree>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>
<script>
// import Vue from "vue"
// // import { Dropdown, DropdownMenu, DropdownItem, Tree, Input, Icon } from "iview";
// // // import 'iview/dist/styles/iview.css'
// // Vue.component("Dropdown", Dropdown);
// // Vue.component("DropdownMenu", DropdownMenu);
// // Vue.component("DropdownItem", DropdownItem);
// // Vue.component("Tree", Tree);
// // Vue.component("Input", Input);
// // Vue.component("Icon", Icon);
export default {
  props: {
    listData: {
      type: Array,
      default: []
    },
    testName: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      searchText: "",
      visible: false,
      iptWidth: 40,
      strictly: true,
      name: ""
    }
  },
  watch: {
    visible() {
      if (!this.visible) {
        this.searchText = ""
      }
    }
  },
  methods: {
    checkChange(value, item) {
      this.$emit("on-select-change", value, item)
      this.$refs.autofocus.focus();
    },
    dropTreeList(visible) {
      this.$emit("on-visible-change")
    },
    getInput() {
      this.$emit("on-change", this.searchText)
    },
    getFocus() {
      this.visible = true;
    },
    focusInput() {
      this.$refs.autofocus.focus();
    },
  }
}
</script>
<style>
.boxStyle *{
	padding: 0;
	margin: 0
}
.boxStyle label{
	font-weight: normal
}
.boxStyle .el-form-item__content{
	line-height: 34px;
}
.boxStyle .el-form-item__label{
	line-height: 34px;
}
.boxStyle ul{
	list-style: none;
}
.boxStyle .ivu-dropdown{
		width: 100%;
}
.boxStyle .ivu-select-dropdown{
		max-height: 200px !important;
		overflow: auto !important;
}
.boxStyle .ivu-dropdown-menu{
	padding-left: 20px;
}
.boxStyle .textareastyle {
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	color: #515a6e;
	background-color: #fff;
	padding: 3px;
	height: 32px;
	margin-top: 2px;
	transition: all 0.5s ease-in-out;
	cursor: pointer;
}
.boxStyle .textareastyle.changeBoderColor {
		border-color: #57a3f3;
}
.boxStyle .textareastyle:hover {
		border-color: #c0c4cc;
}
.boxStyle .disflex {
		display: flex;
		flex-wrap: wrap;
}

.boxStyle .ivu-input {
		outline: none;
		border: none;
		height: 26px;
		float: left;
		border-color: #fff;

}
.boxStyle .ivu-input:focus {
	border-color: #fff;
	box-shadow: none;
}
.boxStyle .listitem {
		height: 24px;
		line-height: 24px;
		vertical-align: middle;
		margin-right: 2px;
		padding: 0 4px;
		float: left;
		margin-left: 2px;
		color: #000

}
.boxStyle .listitem:hover {
		opacity: 0.85;
}
.boxStyle{
	width: 100%;
}

</style>
