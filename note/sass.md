```


4.3. 属性嵌套 (Nested Properties)
有些 CSS 属性遵循相同的命名空间 (namespace)，比如 font-family, font-size, font-weight 都以 font 作为属性的命名空间。为了便于管理这样的属性，同时也为了避免了重复输入，Sass 允许将属性嵌套在命名空间中，例如：

.funky {
  font: {
    family: fantasy;
    size: 30em;
    weight: bold;
  }
}
编译为

.funky {
  font-family: fantasy;
  font-size: 30em;
  font-weight: bold; }
  
  
  命名空间也可以包含自己的属性值，例如：

.funky {
  font: 20px/24px {
    family: fantasy;
    weight: bold;
  }
}
编译为

.funky {
  font: 20px/24px;
    font-family: fantasy;
    font-weight: bold; }
  
  
  @mixin icon {
  transition: background-color ease .2s;
  margin: 0 .5em;
}

.error-icon {
  @include icon;
  /*错误图标指定的样式... */
}

.info-icon {
  @include icon;
  /* 信息图标指定的样式... */
}
编译出来的CSS：

.error-icon {
  transition: background-color ease .2s;
  margin: 0 .5em;
  /*错误图标指定的样式... */
}

.info-icon {
  transition: background-color ease .2s;
  margin: 0 .5em;
  /* 信息图标指定的样式... */
}
仅从维护的角度来说，这是一个很好的扩展的示例，
但编译出来的CSS实在是糟糕，因为编译出来的CSS样式，没有把相同的样式合并在一起。


  使用@extend调用定义好的选择器占位符%placeholder有所限制，他不能在不同的@media中运行。
  
  
  
  6.7. 插值语句 #{} (Interpolation: #{})
通过 #{} 插值语句可以在选择器或属性名中使用变量：

$name: foo;
$attr: border;
p.#{$name} {
  #{$attr}-color: blue;
}
编译为

p.foo {
  border-color: blue; }
  
  
  7.2. @media
Sass 中 @media 指令与 CSS 中用法一样，只是增加了一点额外的功能：允许其在 CSS 规则中嵌套。如果 @media 嵌套在 CSS 规则内，编译时，@media 将被编译到文件的最外层，包含嵌套的父选择器。这个功能让 @media 用起来更方便，不需要重复使用选择器，也不会打乱 CSS 的书写流程。

.sidebar {
  width: 300px;
  @media screen and (orientation: landscape) {
    width: 500px;
  }
}
编译为

.sidebar {
  width: 300px; }
  @media screen and (orientation: landscape) {
    .sidebar {
      width: 500px; } }
      
      @media 的 queries 允许互相嵌套使用，编译时，Sass 自动添加 and

@media screen {
  .sidebar {
    @media (orientation: landscape) {
      width: 500px;
    }
  }
}
编译为

@media screen and (orientation: landscape) {
  .sidebar {
    width: 500px; } }
@media 甚至可以使用 SassScript（比如变量，函数，以及运算符）代替条件的名称或者值：

$media: screen;
$feature: -webkit-min-device-pixel-ratio;
$value: 1.5;

@media #{$media} and ($feature: $value) {
  .sidebar {
    width: 500px;
  }
}
编译为

@media screen and (-webkit-min-device-pixel-ratio: 1.5) {
  .sidebar {
    width: 500px; } }
    
    
    7.4. @at-root
    .parent {
  ...
  @at-root .child { ... }
}
Which would produce:

.parent { ... }
.child { ... }
Or it can be used with a block containing multiple selectors:

.parent {
  ...
  @at-root {
    .child1 { ... }
    .child2 { ... }
  }
  .step-child { ... }
}
Which would output the following:

.parent { ... }
.child1 { ... }
.child2 { ... }
.parent .step-child { ... }
      
      
      
      
      
9.3. 参数 (Arguments)
参数用于给混合指令中的样式设定变量，并且赋值使用。在定义混合指令的时候，按照变量的格式，通过逗号分隔，将参数写进圆括号里。引用指令时，按照参数的顺序，再将所赋的值对应写进括号：

@mixin sexy-border($color, $width) {
  border: {
    color: $color;
    width: $width;
    style: dashed;
  }
}
p { @include sexy-border(blue, 1in); }
编译为

p {
  border-color: blue;
  border-width: 1in;
  border-style: dashed; }
      
  

10. 函数指令 (Function Directives)
Sass 支持自定义函数，并能在任何属性值或 Sass script 中使用：

$grid-width: 40px;
$gutter-width: 10px;

@function grid-width($n) {
  @return $n * $grid-width + ($n - 1) * $gutter-width;
}

#sidebar { width: grid-width(5); }
编译为

#sidebar {
  width: 240px; }
  
  
  

```
