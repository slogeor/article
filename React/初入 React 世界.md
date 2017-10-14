### Virtual DOM

React 把真实的 DOM 树转换成 JavaScript 对象树，这个对象树被称为 Virtual DOM。

每次数据更新后，重新计算 Virtual DOM，并和上一次生成的 Virtual DOM 做对比，对发生变化的部分做批量更新。

React 提供了直观的 `shouldComponentUpdate` 生命周期回调，来减少数据变化后不必要的 Virtual DOM diff 过程。

Virtual DOM 最大的好处在于方便和其他平台集成。

### 函数式编程

函数式编程对应的是声明式编程，它是人类模仿自己逻辑思考方式发明出来的。React 把过去不断重复构建 UI 的过程抽象成组件，且在给定参数的情况下约定渲染对应的 UI 界面。React 能充分利用很多函数式方法减少冗余代码。函数式编程才是 React 的精髓。

### JSX

在 React 中创建的虚拟元素可以分为两类，DOM 元素(DOM element)与组件元素(component element)，分别对应着原生 DOM 元素和自定义元素。

JSX 将 HMTL 语法直接加入到 JavaScript 代码中，再通过翻译器转换到纯 JavaScript 后由浏览器执行。

#### JSX基本语法

1.定义标签时，只允许被一个标签包裹，因为一个标签会被转译成对应的 React.createElement 调用方法，最外层没有被包裹，显然无法转译成方法调用。

2.JSX里首字母是小写的是DOM元素，而首字母是大写的是组件元素。

3.注释需要用 `{/*注释*/}`。

4.省略 Boolean 属性值会导致 JSX 认为 bool 设置为 true。

5.属性值要是使用表达式，只要使用 {} 替换即可。

```js
// 输入 (JSX)
const person = <Person name={window.isLogin ? window.name : ''}>;

// 输出 (JavaScript)
const person = React.createElement(
  Person,
  {name: window.isLogin ? window.name : ''}
);
```
6.HTML 转义，React 会将所有要展示到 DOM 的字符串转义，防止 XSS。但React 提供了 dangerouslySetInnerHTML 属性，他的作用就是避免 React 转义字符。

```html
<div dangerouslySetInnerHTML={{_html: 'cc &copy; 2017'}} />
```

### React 组件

Web Components 由四个部分组成，HTML Templates、Custom Elements、Shadow DOM、HTML Imports。

- HTML Templates 定义了之前模板的概念
- Custom Elements 定义了组件的展现形式
- Shadow DOM 定义了组件的作用域范围，可以囊括样式
- HTML Imports 提出了新的引入方式

React 组件基本上由三个部分组成：属性(props)、状态(state)以及生命周期方法。

#### React 组件的构建方法

1.React.createClass

React.createClass 是 React 最传统、也是兼容性最好的方法，在 0.14 版本发布之前，官方唯一推荐使用的。

```js
const Button = React.createClass({
  getDefaultProps() {
    retrun {
      color: 'blue',
      text: 'Confirm',
    }
  },

  render() {
    const {color, text} = this.props;
    return(
      <button className={`btn btn-${color}`}>
        <em>{text}<em>
      </button>
    );
  }
});
```

当另一个组件需要调用 Button 组件时，只要写成 `<Button />`，就可以被解析成 React.createElement(Button) 方法创建 Button 示例。每次调用 Button，就会创建一个 Button 实例。

2.ES6 classes

```js
import React, {Component} from 'react';

class Button extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    color: 'blue',
    text: 'Confrim',
  }

  render() {
    return(
      <button className={`btn btn-${color}`}>
        <em>{text}<em>
      </button>
    );
  }
}
```

此方法与 createClass 的结果是相同的，调用类实现的组件会创建实例对象。

3.无状态函数

```js
function Button({ color = 'blue', 'text' = 'Confrim'}) {
  return(
    <button className={`btn btn-${color}`}>
      <em>{text}<em>
    </button>
  );
}
```

无状态函数就是无状态组件。无状态组件只传入 props 和 content 两个参数，不存在 state 和生命周期。无状态组件创建时始终保持一个实例，避免了不必要的检查和内存分配。

### state 和 props

state 的通信集中在组件内部，props 的通信是父组件向子组件的传播。

props 的传递过程，对于 React 组件来说是非常直观的。React 的单向数据流，主要的流动管道就是 props，props 本身是不可变的。

React 为 props 提供了默认配置，通过 defaultProps 静态变量的方式来定义。

React.Children 是 React 官方提供的一系列操作 children 的方法。

#### propTypes

propTypes 用于规范 props 的类型与必需的状态。如果组件定义了 propTypes，那么在开发环境下，就会对组件的 props 值的类型做检查。在生产环境下，这是不会去检查的。

### 生命周期

1.组件的挂载

- componentWillMount: 会在 render 方法之前执行，此方法只是执行一次，设置 setState 是没有意义的，初始化 state 可以放在 constructor。
- componentDidMount: 会在 render 方法之后执行，如果在此方法执行了 setState，组件当然会再次更新，在初始化过程中就渲染了两次组件。

 2.组件的卸载

- componentWillUnmont: 组件卸载前的状态

3.数据更新过程

更新过程指的是父组件向下传递 props 或组件自身执行了 setState 方法时发生的一系列更新动作。

如果组件自身的 state 更新了，那么会依次执行 shouldComponentUpdate、componentWillUpdate、componentDidUpdate。

- shouldComponentUpdate: 它接收需要更新的 props 和 state。当方法返回 false 的时候，组件不再向下执行生命周期方法。该方法默认返回是 true。
- componentWillUpdate: 该方法提供了更新的 props 和 state，该方法内不能执行 setState。
- componentDidUpdate: 该方法提供了更新前的 props 和 state

如果组件是由父组件更新 props 而更新的，那么在 shouldComponentUpdate 之前会先执行 componentWillReceiveProps 方法。此方法可以作为 React 在 props 传入后，渲染之前 setState 的机会。在此方法中调用 setState 是不会二次渲染的。

### React 与 DOM

ReactDOM 提供了三个API，用于操作 DOM

- findDOMNode: DOM 真正被添加到 HTML 中的生命周期方法是 componentDidMount 和 componentDidUpdate 方法

- unmountComponentAtNode: 卸载操作

- render: 把 React 渲染的 Virtual DOM 渲染到浏览器的 DOM 中

### refs

在组件内，JSX 是不会返回一个组件的实例。它只是一个 ReactElement，只是告诉 React 被挂载的组件应该长什么样。

refs 就是为此而生，它是 React 组件中非常特殊的 props，可以附加到任何一个组件上。组件被调用时会新建一个该组件的实例，refs 就是指向这个实例。

```html
<input type="text" ref={(ref) => this.myTextInput = ref} />
```
