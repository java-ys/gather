[typescript](https://juejin.im/post/5d53a8895188257fad671cbc)

[ts实战](https://juejin.im/post/5d767bc5f265da03b76b48a6)

[ts类型](https://juejin.im/post/5d461f3bf265da03e05af694)

## 基础语法

```
let isDone: boolean = false;
let decLiteral: number = 6;
let name: string = "bob";
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3]; // 泛型

// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
当访问一个越界的元素，会使用联合类型替代
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型
console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString


enum Color {Red, Green, Blue}
let c: Color = Color.Green;
默认情况下，从0开始为元素编号。

我们将上面的例子改成从 1开始编号：
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;

let notSure: any = 4;


Void
某种程度上来说，void类型像是与any类型相反，它表示没有任何类型。 
当一个函数没有返回值时，你通常会见到其返回值类型是 void：

function warnUser(): void {
    console.log("This is my warning message");
}


let u: undefined = undefined;
let n: null = null;
默认情况下null和undefined是所有类型的子类型。 
就是说你可以把 null和undefined赋值给number类型的变量。⭐️

Object

declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error


类型断言

类型断言有两种形式。 其一是“尖括号”语法：

let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

另一个为as语法：
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;


type C = { a: string, b?: number }
function f({ a, b }: C): void {
    // ...
}


对象展开还有其它一些意想不到的限制。 首先，它仅包含对象 自身的可枚举属性。 
大体上是说当你展开一个对象实例时，你会丢失其方法： 

class C {
  p = 12;
  m() {
  }
}
let c = new C();
let clone = { ...c };
clone.p; // ok
clone.m(); // error!  ⭐️




```

## 接口

TypeScript的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 在TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

```
可选属性:
interface SquareConfig {
  color?: string;
  width?: number;
}

只读属性:
interface Point {
    readonly x: number;
    readonly y: number;
}

TypeScript具有ReadonlyArray<T>类型，它与Array<T>相似，只是把所有可变方法去掉了，
因此可以确保数组创建后再也不能被修改：

let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!

上面代码的最后一行，可以看到就算把整个ReadonlyArray赋值到一个普通数组也是不可以的。 
但是你可以用类型断言重写：

a = ro as number[]; // 绕开检查,可以通过类型断言  ⭐️⭐️⭐️⭐️⭐️

做为变量使用的话用 const，若做为属性则使用readonly。



interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}


定义函数类型
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
}

对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配。 比如，我们使用下面的代码重写上面的例子：

let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
}



interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}

let square = <Square>{};


可索引类型



```

## 类
```


构造函数也可以被标记成 protected。 
这意味着这个类不能在包含它的类外被实例化，但是能被继承。


protected修饰符与 private修饰符的行为很相似，
但有一点不同， protected成员在派生类中仍然可以访问。



readonly修饰符
你可以使用 readonly关键字将属性设置为只读的。 
只读属性必须在声明时或构造函数里被初始化。 ⭐️⭐️⭐️⭐️⭐️

class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}






```



```

我们需要一种方法使返回值的类型与传入参数的类型是相同的。 
这里，我们使用了类型变量，它是一种特殊的变量，只用于表示类型而不是值。

function identity<T>(arg: T): T {
    return arg;
}
我们给identity添加了类型变量T。 T帮助我们捕获用户传入的类型（比如：number），
之后我们就可以使用这个类型。 之后我们再次使用了T当做返回值类型。
现在我们可以知道参数类型与返回值类型是相同的了。
 这允许我们跟踪函数里使用的类型的信息。
 
 
我们定义了泛型函数后，可以用两种方法使用。 第一种是，传入所有的参数，包含类型参数：
let output = identity<string>("myString"); 
 // type of output will be 'string'
这里我们明确的指定了T是string类型，并做为一个参数传给函数，使用了<>括起来而不是()。
第二种方法更普遍。利用了类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定T的类型：
let output = identity("myString");  // type of output will be 'string'

注意我们没必要使用尖括号（<>）来明确地传入类型；编译器可以查看myString的值，
然后把T设置为它的类型。 类型推论帮助我们保持代码精简和高可读性。
如果编译器不能够自动地推断出类型的话，只能像上面那样明确的传入T的类型，
在一些复杂的情况下，这是可能出现的。



泛型函数的类型与非泛型函数的类型没什么不同，只是有一个类型参数在最前面，像函数声明一样：
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <T>(arg: T) => T = identity;
我们也可以使用不同的泛型参数名，只要在数量上和使用方式上能对应上就可以。
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <U>(arg: U) => U = identity;
我们还可以使用带有调用签名的对象字面量来定义泛型函数：
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: {<T>(arg: T): T} = identity;

这引导我们去写第一个泛型接口了。 我们把上面例子里的对象字面量拿出来做为一个接口：
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn = identity;




function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
相比于操作any所有类型，我们想要限制函数去处理任意带有.length属性的所有类型。 只要传入的类型有这个属性，我们就允许，就是说至少包含这一属性。 为此，我们需要列出对于T的约束要求。
为此我们定义一个接口来描述约束条件。 创建一个包含.length属性的接口，使用这个接口和extends关键字来实现约束：

interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}


在泛型约束中使用类型参数
你可以声明一个类型参数，且它被另一个类型参数所约束。 
比如，现在我们想要用属性名从对象里获取这个属性。 
并且我们想要确保这个属性存在于对象obj上，因此我们需要在这两个类型之间使用约束。

function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' |




在TypeScript使用泛型创建工厂函数时，需要引用构造函数的类类型。比如，
function create<T>(c: {new(): T; }): T {
    return new c();
}



```


## Decorators

```

装饰器求值
类中不同声明上的装饰器将按以下规定的顺序应用：
参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个实例成员。
参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个静态成员。
参数装饰器应用到构造函数。
类装饰器应用到类。


1 类装饰器
应用于类构造函数，其参数是类的构造函数。
注意class并不是像Java那种强类型语言中的类，而是JavaScript构造函数的语法糖。

function Path(path: string) {
    return function (target: Function) {
        !target.prototype.$Meta && (target.prototype.$Meta = {})
        target.prototype.$Meta.baseUrl = path;
    };
}

@Path('/hello')
class HelloService {
    constructor() {}
}

console.log(HelloService.prototype.$Meta);// 输出：{ baseUrl: '/hello' }
let hello = new HelloService();
console.log(hello.$Meta) // 输出：{ baseUrl: '/hello' }




2 方法装饰器
它会被应用到方法的 属性描述符上，可以用来监视，修改或者替换方法定义。
方法装饰会在运行时传入下列3个参数：

1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2、成员的名字。
3、成员的属性描述符。
function GET(url: string) {
    return function (target, methodName: string, descriptor: PropertyDescriptor) {
        !target.$Meta && (target.$Meta = {});
        target.$Meta[methodName] = url;
    }
}

class HelloService {
    constructor() { }
    @GET("xx")
    getUser() { }
}

console.log((<any>HelloService).$Meta);



3 方法参数装饰器
参数装饰器表达式会在运行时当作函数被调用，传入下列3个参数：

1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2、参数的名字。
3、参数在函数参数列表中的索引。
function PathParam(paramName: string) {
    return function (target, methodName: string, paramIndex: number) {
        !target.$Meta && (target.$Meta = {});
        target.$Meta[paramIndex] = paramName;
    }
}

class HelloService {
    constructor() { }
    getUser( @PathParam("userId") userId: string) { }
}

console.log((<any>HelloService).prototype.$Meta); // {'0':'userId'}



4 属性装饰器
属性装饰器表达式会在运行时当作函数被调用，传入下列2个参数：

1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2、成员的名字。
function DefaultValue(value: string) {
    return function (target: any, propertyName: string) {
        target[propertyName] = value;
    }
}

class Hello {
    @DefaultValue("world") greeting: string;
}

console.log(new Hello().greeting);// 输出: world


⭐️⭐️⭐️⭐️⭐️

装饰器加载顺序
function ClassDecorator() {
    return function (target) {
        console.log("I am class decorator");
    }
}
function MethodDecorator() {
    return function (target, methodName: string, descriptor: PropertyDescriptor) {
        console.log("I am method decorator");
    }
}
function Param1Decorator() {
    return function (target, methodName: string, paramIndex: number) {
        console.log("I am parameter1 decorator");
    }
}
function Param2Decorator() {
    return function (target, methodName: string, paramIndex: number) {
        console.log("I am parameter2 decorator");
    }
}
function PropertyDecorator() {
    return function (target, propertyName: string) {
        console.log("I am property decorator");
    }
}

@ClassDecorator()
class Hello {
    @PropertyDecorator()
    greeting: string;


    @MethodDecorator()
    greet( @Param1Decorator() p1: string, @Param2Decorator() p2: string) { }
}
输出结果：

I am property decorator
I am parameter2 decorator
I am parameter1 decorator
I am method decorator
I am class decorator
从上述例子得出如下结论：

1、有多个参数装饰器时：从最后一个参数依次向前执行

2、方法和方法参数中参数装饰器先执行。

3、类装饰器总是最后执行。

4、方法和属性装饰器，谁在前面谁先执行。因为参数属于方法一部分，所以参数会一直紧紧挨着方法执行。上述例子中属性和方法调换位置，输出如下结果：

I am parameter2 decorator
I am parameter1 decorator
I am method decorator
I am property decorator
I am class decorator

```


record

```


type Car = 'Audi' | 'BMW' | 'MercedesBenz'

const cars = {
    Audi: { age: 119 },
    BMW: { age: 113 },
    MercedesBenz: { age: 133 },
}
复制代码虽然这个写法没问题，但是有没有考虑过类型安全的问题？
比如：

我们忘记写了一个汽车品牌，他会报错吗？
我们拼写属性名错误了，它会报错吗？
我们添加了一个非上述三个品牌的品牌进去，他会报错吗？
我们更改了其中一个品牌的名字，他会有报错提醒吗？

上述这种写法统统不会，这就需要Record的帮助。
type Car = 'Audi' | 'BMW' | 'MercedesBenz'
type CarList = Record<Car, {age: number}>

const cars: CarList = {
    Audi: { age: 119 },
    BMW: { age: 113 },
    MercedesBenz: { age: 133 },
}


```

