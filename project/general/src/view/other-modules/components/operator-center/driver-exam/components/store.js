import Vue from "vue";

const data = {
  selectedIds: [], //选中行id
  selectedData: [], // 选中行数据
  // selectedIds: new Set(), //选中行id
  // selectedData: new Set(), // 选中行数据
  selectedSum: 0 //选中行总数
};
// export let store = Vue.observable(data);
export let store = data;

export let mutations = {
  setSelectedIds(v, type) {
    if (type === "add") {
      if (!store.selectedIds.find(it => it === v)) {
        store.selectedIds.push(v);
      }
    } else {
      store.selectedIds = v;
    }
  },
  deleteSelectedIds(v) {
    let idx = store.selectedIds.findIndex(it => it - v === 0);
    if (idx < 0) return;
    store.selectedIds = store.selectedIds.filter(it => it !== v);
  },
  setSelectedData(v, type) {
    if (type === "add") {
      if (!store.selectedData.find(it => it.id === v.id)) {
        store.selectedData.push(v);
      }
    } else {
      store.selectedData = v;
    }
  },
  deleteSelectedData(v) {
    let idx = store.selectedData.findIndex(it => it.id - v.id === 0);
    if (idx < 0) return;
    store.selectedData = store.selectedData.filter(it => it.id !== v.id);
  },
  setSelectedSum(v) {
    store.selectedSum += v;
  },
  async generateStore(data) {
    store = data
  }
};

export class SelectedQuestions {
  constructor(list = []) {
    this.list = list
  }
  
  addItem(item) {
    // this.delItem(item.id) // 有的话先删再增
    if (this.has(item.id)) return
    this.list = [...this.list, { ...item }]
  }
  
  delItem(id) {
    this.list = this.list.filter(item => item.id !== id)
    return id
  }
  
  count() {
    return this.list.length
  }
  
  ids() {
    return this.list.map(item => item.id)
  }
  
  has(id) {
    return !!this.list.find(item => item.id === id)
  }
}
