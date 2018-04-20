### JSX 语法糖

从本质上讲， JSX 只是为 `React.createElement(component, props, ...children)`函数提供的语法糖。

**JSX代码**

```js
<MyButton color="blue">Click Me</MyButton>
```

**编译后**

```js
React.createElement(
  MyButton,
  { color: "blue" },
  "Click Me"
);
```

如果 JSX 不存在子节点，`React.createElement`函数的最后一个children 是 null。

### 指定 React 元素类型

一个 JSX 标签的开始部分决定了 React 元素的类型。首字母大写的标签指示 JSX 标签是一个 React 组件。

#### React 必须在作用域中

因为 JSX 被编译为 `React.createElement` 的调用。所以 React 库必须在你 JSX 代码的作用域中。

下面一行代码是必须的，所有的组件都要这样写。

```js
import React from 'react';
```

#### JSX 类型可是有点语法

在 JSX 中，可以使用点语法引用一个 React 组件。

```js
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

#### 用户定义组件必须以大写字母开头

当一个元素类型以小写字母开头，表示引用一个类似 `<div>`或者`<span>`的内置组件。建议给组件以大写字母开头的方式命名。

#### 运行时选择类型

不能使用一个普通的表达式作为 React 元素类型，应该先将其赋值给一个大写的变量，然后在引用。

```js
// 错误用法
function Story(props) {
  // 错误！JSX 类型不能是表达式
  return <components[props.storyType] story={props.story} />;
}

// 正确用法
function Story(props) {
  // 正确！JSX 类型可以是一个以大写字母开头的变量.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

### JSX 中的 props

有几种不同的方法来指定 JSX 中的 props。

#### JavaScript 表达式作为 props

可以用一个 `{}` 包裹的 JavaScript 表达式作为 props。

```js
<MyComponent foo={1 + 2 +3} />
```

在 JavaScript 中， `if` 和 `for` 是循环不是表达式，不能在 JSX 中直接使用。可以在附近的代码块中使用。

#### 字符串字面量

可以传入一个字符串字面量作为 props。

```js
<MyComponent msg="hello react" />

<MyComponent msg={'hello react'} />
```

传递的字符串字面量是为转义的 HMTL。

```js
<MyComponent msg="&lt;3" />

<MyComponent msg={'<3'} />
```

#### props 默认是 true

如果没给 props 传值，默认是 `true`

```js
<MyButton disabled />

<MyButton disabled={true} />
```
#### 属性扩展

当构建一个容器时，属性扩展非常有用，但这会使得你的代码非常混乱。

```js
<MyButton {...props} />
```

### JSX 中的 children

JSX 表达式包括开放标签和闭合标签，标签中的内容会传递一个特殊的 props: `props.children`。

#### 字符串字面量

可以在开放标签和闭合标签中放入一个字符串，那么 `props.children` 就是这字符串。

JSX 会删除每行开头和结尾的空格，也会删除空行。下面的渲染效果是相同的。

```js
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

#### JSX Children










































