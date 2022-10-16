# vue

```
<span v-once>这个将不会改变: {{ msg }}</span>


v-bind 缩写
<!-- 完整语法 -->
<a v-bind:href="url">...</a>

<!-- 缩写 -->
<a :href="url">...</a>

v-on 缩写
<!-- 完整语法 -->
<a v-on:click="doSomething">...</a>

<!-- 缩写 -->
<a @click="doSomething">...</a>

computed 有缓存
对于任何复杂逻辑，你都应当使用计算属性
我们可以将同一函数定义为一个方法而不是一个计算属性。两种方式的最终结果确实是完全相同的。
然而，不同的是计算属性是基于它们的响应式依赖进行缓存的。只在相关响应式依赖发生改变时它们才会重新求值。
这就意味着只要 message 还没有发生改变，多次访问 reversedMessage 计算属性会立即返回之前的计算结果，
而不必再次执行函数。

watch
然而，通常更好的做法是使用计算属性而不是命令式的 watch 回调
计算属性默认只有 getter ，不过在需要时你也可以提供一个 setter

虽然计算属性在大多数情况下更合适，但有时也需要一个自定义的侦听器。
这就是为什么 Vue 通过 watch 选项提供了一个更通用的方法，来响应数据的变化。
当需要在数据变化时执行异步或开销较大的操作时，这个方式是最有用的

<div v-bind:class="{ active: isActive }"></div>

注意，v-show 不支持 <template> 元素，也不支持 v-else。

当 v-if 与 v-for 一起使用时，v-for 具有比 v-if 更高的优先级。

在 v-for 块中，我们可以访问所有父作用域的属性。

在遍历对象时，会按 Object.keys() 的结果遍历，但是不能保证它的结果在不同的 JavaScript 引擎下都一致。

不要使用对象或数组之类的非基本类型值作为 v-for 的 key。请用字符串或数值类型的值。

解决非相应
以下两种方式都可以实现和 vm.items[indexOfItem] = newValue 相同的效果，同时也将在响应式系统内触发状态更新：

// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)

2.2.0+ 的版本里，当在组件上使用 v-for 时，key 现在是必须的

Vue.js 为 v-on 提供了事件修饰符。之前提过，修饰符是由点开头的指令后缀来表示的。

.stop
.prevent
.capture
.self
.once
.passive


keyCode 的事件用法已经被废弃了并可能不会被最新的浏览器支持


为了在必要的情况下支持旧浏览器，Vue 提供了绝大多数常用的按键码的别名：

.enter
.tab
.delete (捕获“删除”和“退格”键)
.esc
.space
.up
.down
.left
.right


v-model 在内部为不同的输入元素使用不同的属性并抛出不同的事件：

text 和 textarea 元素使用 value 属性和 input 事件；
checkbox 和 radio 使用 checked 属性和 change 事件；
select 字段将 value 作为 prop 并将 change 作为事件。


因为组件是可复用的 Vue 实例，所以它们与 new Vue 接收相同的选项，
例如 data、computed、watch、methods 以及生命周期钩子等。仅有的例外是像 el 这样根实例特有的选项

new Vue({
  el: '#blog-post-demo',
  data: {
    posts: [
      { id: 1, title: 'My journey with Vue' },
      { id: 2, title: 'Blogging with Vue' },
      { id: 3, title: 'Why Vue is so fun' }
    ]
  }
})

<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:title="post.title"
></blog-post>
如上所示，你会发现我们可以使用 v-bind 来动态传递 prop。


自定义事件也可以用于创建支持 v-model 的自定义输入组件。记住：

<input v-model="searchText">
等价于：

<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>

---------------------------------------------------------------
当用在组件上时，v-model 则会这样：

<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
为了让它正常工作，这个组件内的 <input> 必须：

将其 value 特性绑定到一个名叫 value 的 prop 上
在其 input 事件被触发时，将新的值通过自定义的 input 事件抛出
写成代码之后是这样的：

Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})

---------------------------------------------------------------

tab切换实现
上述内容可以通过 Vue 的 <component> 元素加一个特殊的 is 特性来实现：

<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component v-bind:is="currentTabComponent"></component>
在上述示例中，currentTabComponent 可以包括

已注册组件的名字，或
一个组件的选项对象

将 v-bind.sync 用在一个字面量的对象上，
例如 v-bind.sync=”{ title: doc.title }”，是无法正常工作的，因为在解析一个像这样的复杂表达式的时候，
有很多边缘情况需要考虑。

父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。



选项合并
当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”。

比如，数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。
同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用

值为对象的选项，例如 methods、components 和 directives，将被合并为同一个对象。
两个对象键名冲突时，取组件对象的键值对。
注意：Vue.extend() 也使用同样的策略进行合并。


vuex 是一个专门为vue.js应用程序开发的状态管理模式。
这个状态我们可以理解为在data中的属性，需要共享给其他组件使用的部分。

也就是说，是我们需要共享的data，使用vuex进行统一集中式的管理

vuex中，有默认的五种基本的对象：

state：存储状态（变量）
getters：对数据获取之前的再次编译，可以理解为state的计算属性。我们在组件中使用 $sotre.getters.fun()
mutations：修改状态，并且是同步的。在组件中使用$store.commit('',params)。这个和我们组件中的自定义事件类似。
actions：异步操作。在组件中使用是$store.dispath('')
modules：store的子模块，为了开发大型项目，方便状态管理而使用的。这里我们就不解释了，用起来和上面的一样。


```
