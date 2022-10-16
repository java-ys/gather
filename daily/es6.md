## next方法模拟

```javascript
let obj = {
	arr: [2,34,1,4,1,2,4],
	[Symbol.iterator]() {
		let _this = this
		let index = 0
		return {
			next: function() {
				if(index< _this.arr.length) {
					return {value: _this.arr[index++], done: false}
				}
				return {value: undefined, done: true}
			}
		}
	}
}



class List {
    constructor() {
        this.index = 0;
        this.data = arguments;
    }

    [Symbol.iterator]() {
        return {
            next: () => {
                if (this.index < this.data.length) {
                    return { value: this.data[this.index++], done: false};
                }
                this.index = 0;
                return {done: true, value: undefined};
            }
        }
    }
}


let list = new List("小玲", "小霞", "小星", "小民");
let iter = list[Symbol.iterator]();
console.log(iter.next());    // { value: '小玲', done: false }
console.log(iter.next());    // { value: '小霞', done: false }
console.log(iter.next());    // { value: '小星', done: false }
console.log(iter.next());    // { value: '小民', done: false }
console.log(iter.next());    // { done: true, value: undefined }


```

## Set
```
ES6 提供了新的数据结构 Set。它类似于数组
Set 加入值时认为NaN等于自身;
两个对象总是不相等;
去重:
[...new Set(array)]
Array.from(new Set(array))

Set 结构的实例有以下属性。

Set.prototype.constructor：构造函数，默认就是Set函数。
Set.prototype.size：返回Set实例的成员总数。
Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。下面先介绍四个操作方法。

Set.prototype.add(value)：添加某个值，返回 Set 结构本身。
Set.prototype.delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
Set.prototype.has(value)：返回一个布尔值，表示该值是否为Set的成员。
Set.prototype.clear()：清除所有成员，没有返回值。



Set 结构的实例有四个遍历方法，可以用于遍历成员。

Set.prototype.keys()：返回键名的遍历器
Set.prototype.values()：返回键值的遍历器
Set.prototype.entries()：返回键值对的遍历器
Set.prototype.forEach()：使用回调函数遍历每个成员



Set 结构的实例与数组一样，也拥有forEach方法，用于对每个成员执行某种操作，没有返回值。

let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ' : ' + value))
// 1 : 1
// 4 : 4
// 9 : 9
上面代码说明，forEach方法的参数就是一个处理函数。该函数的参数与数组的forEach一致，依次为键值、键名、集合本身（上例省略了该参数）。这里需要注意，Set 结构的键名就是键值（两者是同一个值），因此第一个参数与第二个参数的值永远都是一样的。

另外，forEach方法还可以有第二个参数，表示绑定处理函数内部的this对象。


WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。

首先，WeakSet 的成员只能是对象，而不能是其他类型的值,
其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，
也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，
不考虑该对象还存在于 WeakSet 之中。



Map构造函数接受数组作为参数，实际上执行的是下面的算法。

const items = [
  ['name', '张三'],
  ['title', 'Author']
];

const map = new Map();

items.forEach(
  ([key, value]) => map.set(key, value)
);


```
