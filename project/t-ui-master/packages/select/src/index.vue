<template>
  <div class="t_select">
    <el-select
      v-model="childSelectedValue"
      :style="{width: width||'100%'}"
      v-bind="attrs"
      v-on="$listeners"
      :multiple="multiple"
    >
      <el-checkbox
        v-if="multiple"
        v-model="selectChecked"
        @change="selectAll"
        class="all_checkbox"
      >全选</el-checkbox>
      <el-option
        v-for="(item,index) in optionSource"
        :key="index+'i'"
        :label="item[labelKey]"
        :value="item[valueKey]"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'TSelect',
  props: {
    value: {
      type: [String, Number, Array]
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 选择框宽度
    width: {
      type: String
    },
    // 传入的option数组中，要作为最终选择项的键值key
    valueKey: {
      type: String,
      default: 'key'
    },
    // 传入的option数组中，要作为显示项的键值名称
    labelKey: {
      type: String,
      default: 'label'
    },
    // 下拉框组件数据源
    optionSource: {
      type: Array
    }
  },
  computed: {
    childSelectedValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    attrs () {
      return {
        // 'popper-append-to-body': false,
        clearable: true,
        filterable: true,
        ...this.$attrs
      }
    },
    selectChecked: {
      get () {
        return this.childSelectedValue?.length === this.optionSource?.length
      },
      set (val) {
        // console.log('set', val)
        this.$emit('input', val)
      }
    }
  },
  watch: {
    childSelectedValue (val) {
      this.childSelectedValue = val
    }
  },
  methods: {
    // 点击全选
    selectAll (val) {
      const options = JSON.parse(JSON.stringify(this.optionSource))
      if (val) {
        this.childSelectedValue = options.map(item => {
          return item[this.valueKey]
        })
      } else {
        this.childSelectedValue = null
      }
    }
  }
}
</script>
<style lang="scss">
.el-select-dropdown {
  .all_checkbox {
    margin-left: 15px;
  }
}
</style>
