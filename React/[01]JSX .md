### JSX

```js
const element = <h1>hello, world</h1>;
```
它是 JavaScript 的一种扩展语法，具有 JavaScript 的全部能力。

**1.JSX中嵌入表达式**

可以用花括号把任意的 JavaScript 表达式嵌入到 JSX 中

```js
const element = (
	<h1>
		hello, {formatName(user)}!
	</h1>
);
```

**2. JSX 也是一个表达式**

babel 编译后，JSX 表达式就变成了常规的 JavaScript 对象，我们可以将 JSX 赋给变量。

```js
function getGreeting(user) {
	if (user) {
		return <h1>Hello, {formatName(user)}!</h1>;
	}
	return <h1>Hello, React!</h1>;
}
```

**3.JSX指定属性值**

可以用双引号指定字符串字面量作为属性值，也可以使用花括号嵌入 JavaScript 表达式作为属性值

```js
const element = <img tabIndex="0" src="user.img" user={formatName(user)} />;
```

**4.JSX防止注入攻击**

默认情况下，在渲染之前，React DOM 会格式化(escape)JSX中的所有值，从而保证用户无法注入任何应用之外的代码。

**5.JSX表示对象**

```js
const element = (
	<h1 className="h1">
		Hello, {formatName(user)}!
	</h1>
);
```

babel编译后

```js
"use strict";
var element = React.createElement(
	"h1",
	{ className: "h1" },
	"Hello, ",
	formatName(user),
	"!"
);
```

简化的结构

```js
const element = {
  type: 'h1',
  props: {
    className: 'h1',
    children: `Hello, ${formatName(user)}!`
  }
};
```

#### 注意

JSX 更接近 JavaScript，所以 React DOM 使用驼峰命名约定。
