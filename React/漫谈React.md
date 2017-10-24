### 事件系统

React 基于 Virtual DOM 实现了一个 SyntheticEvent(合成事件)层，我们所定义的事件处理器会接收到一个 SyntheticEvent 对象的实例，它完全符合 W3C 标准。所有事件都自动绑定到最外层上。

#### 合成事件

在 React 底层，主要对合成事件做了两件事：事件委托和自动绑定。

- 事件委托

事件代理机制不会把事件处理函数直接绑定到真实的节点，而是把所有事件绑定到结构的最外层，使用统一的事件监听器，这个事件监听器维持了一个映射来保存所有组件内部的事件监听和处理函数。

- 自动绑定

在 React 组件中，每个方法的上下文都会指向该组件的实例，即自动绑定 this 为当前组件。在使用 ES6 classes 或者纯函数时，这种自动绑定就不复存在了。

1.bind 方法

```html
<button onClick={this.handleClick.bind(this)}></button>;
```
2.构造器内部声明

```js
// 在构造器内部完成声明
this.handleClick = this.handleClick.bind(this);
```

3.箭头函数

箭头函数不仅是函数的语法糖，还能自动绑定定义此函数作用域的 this。

```
<button onClick={() => this.handleClick()}></button>;
```

在 React 中也可以使用原生事件，React 提供了完备的生命周期函数，其中componentDidMount 会在组件已经安装并且在浏览器中存在真实的 DOM 后调用。但需要在组件卸载的时手动移除。

reactEvent.nativeEvent.stopPropagation() 来阻止冒泡是不行的，阻止 React 事件冒泡的行为只能用于合成事件系统，且没法阻止原生事件的冒泡，反之，在原生事件中阻止冒泡行为，却可以阻止 React 合成事件的传播。

React 的合成事件系统只是原生 DOM 事件系统的一个子集。它仅仅实现了 DOM Level 3 的事件接口，并统一了浏览器间的兼容问题。

我们应该避免在 React 中混用合成事件和原生 DOM 事件。

#### 对比合成事件和原生事件

1.事件传播与阻止事件传播

React 的合成事件只支持事件冒泡机制。可以使用 `e.preventDefault` 阻止冒泡。

2.事件类型

React 合成事件的事件类型是 JavaScript 原生事件类型的一个子集。

3.事件绑定方式

React 合成事件的绑定方法简单

4.事件对象

在 React 合成事件系统中，不存在这种兼容性问题，在事件处理函数中可以得到一个合成事件对象。

### 表单组件

1.受控组件

每当表单的状态发生变化时，都会被写入到组件的 state 中，这种组件存在 React 中被称为受控组件。在受控组件中，组件渲染出的状态和它的 value 或者 props 相对应。

React 受控组件的更新流程：

- 1.可以通过初试的 state 中设置表单的默认值
- 2.每当表单的值发生变化时，调用 onChange 事件处理器
- 3.事件处理器通过合成事件对象 e 拿到改变后的状态，并更新应用的 state
- 4.setState 触发试图的重新渲染，完成表单组件的更新

2.非受控组件

表单组件没有 value props 时，就可以称为非受控组件。相应的可以使用 defaultValue 和 defaultChecked prop 来表示组件的默认状态。

### 组件间通信

React 是以组合组件的形式组织的，组件彼此是相互独立的。

#### 1.父组件向子组件通信

React 数据流动是单向的，父组件向子组件的通信也是最常见的，父组件通过 props 向子组件传递需要的信息。

#### 2.子组件向父组件通信

通过 props 将回调函数传给子组件，在子组件调用该回调函数。与传统的回调函数实现方法是一样的。

#### 3.跨级组件通信

当需要让子组件跨级访问信息时，可以像上面说的方法那样向更高级别的组件传递 props，但此时的代码不够优雅。在 React 中，可以使用 content 来实现跨级父子组件间的通信。具体参考 [React通信](./React通信.md)

官方不建议大量使用 content，content 就像一个全局变量一样。使用 content 比较好的场景是真正意义上的全局信息且不会更改。

#### 4.没有嵌套关系的组件通信

没有嵌套关系的，只能通过可以影响全局的一些机制去考虑。可以使用常用的发布/订阅模式来实现。

在处理事件过程中需要注意，在 componentDidMount 事件中，如果组件挂载完成，在订阅事件；当组件卸载的时候，在 componentWillUnmount 事件中取消事件的订阅。

### 高阶组件

当 React 组件被包裹时，高阶组件会返回一个增强的 React 组件。高阶组件让我们的代码更具有复用性、逻辑性与抽象特性。它可以对 render 方法作劫持，也可以控制 props 与 state。

实现高阶组件的方法

* 属性代理: 高阶组件通过被包裹的 React 组件来操作 props
* 反向代理: 高阶组件继承于被包裹的 React 组件

1.属性代理

属性代理是常见的高阶组件的实现方法。

```js
import React, { component } from 'React';

const MyContainer = (WrappedComponent) =>
	class extend Component {
		render() {
			return <WrappedComponent {...this.props} />;
		}
	}
```

通过高阶组件来传递 props，这种方法即为属性代理。

当使用属性代理构建高阶组件时，生命周期的过程类似于 `堆栈` 调用。

```js
didmount -> HOC didmount -> (HOCs didmount) -> (HOCs will unmount) -> HOC will unmount -> unmount
```

从功能上，高阶组件可以控制 props、通过 refs 使用引用、抽象 state 和使用其他元素包裹 WrappedComponent。

2.反向继承

```js
const MyContainer = (WrappedComponent) =>
	class extends WrappedComponent {
		render() {
			return super.render();
		}
	}
```
高阶组件返回的组件继承于 WrappedComponent。因为被动地继承了 WrappedComponent，所有的调用都会反向。此方法与属性代理不太一样。它通过继承 WrappedComponent 来实现，方法可以通过 super 来顺序调用。因为依赖于继承的机制，HOC 的调用顺序和 `队列` 是一样的。

```js
didmount -> HOC didmount -> (HOCs didmount) -> will unmount -> HOC will unmount -> (HOCs will unmount)
```

在反向继承方法中，高阶组件可以使用 WrappedComponent 引用，这意味着可以使用 WrappedComponent 的 state、props、生命周期和 render 方法。但它不能保证完整的子组件树被解析。

- 渲染劫持

渲染劫持指的是高阶组件可以控制 WrappedComponent 的渲染过程，并渲染各种各样的结果。可以在这个过程中的任何 React 元素输出的结果中读取、增加、修改、删除 props，或读取或修改 React 元素数。

反向继承不能保证完整的子组件树被解析，这意味着将限制渲染劫持功能。渲染劫持的经验法则是我们可以操控 WrappedComponent 的元素树。但如果元素树种包括了函数类型的 React 组件，就不能操作组件的子组件。

- 控制 state

#### 组合式组件开发实践

用参数来配置组件是我们最常用的封装方式，但随着场景发生变化，组件的形态也发生变化时，必须不断增加 props 去应对变化，此时便会导致 props 的泛滥。

可以利用高阶组件的思考，使用组件组合式开发模式，有效地解决配置式所存在的一些问题。

- 组件再分离

对于颗粒最小的组件，我们希望它是纯粹的、木偶式的组件。

- 逻辑再抽象

组件中的相同的交互逻辑和业务逻辑也应该进行抽象。

在配置式组件内部，组件与组件间以及组件与业务间是紧密关联的，我们需要完成的仅仅是配置工作。

组合式的方式意图打破这种关联，寻求单元化，通过颗粒度更细的基础组件与抽象组件共有交互与业务逻辑的高阶组件，使组件更灵活、更易扩展。

从侵入组件到组件解耦，React 一直推崇的声明式编程都优于命令式编程。

### 组件性能优化

从 React 的渲染过程来看，如何防止不必要的渲染可能是最需要去解决的问题。针对这个问题，React 官方提供了一个便捷的方法去解决，那就是 PureRender。

#### 纯函数

纯函数由三大原则构成：

- 给定相同的输入，它总是返回相同的输出
- 过程没有副作用
- 没有额外的状态依赖

##### PureRender

组件的渲染是被相同的 props 和 state 渲染进而得到相同的结果。

1.PureRender 本质

PureRender 对 object 只作了引用比较，并没有作值比较。对于实现来说，这是一个取舍问题。PureRender 源代码中只对新旧 props 作了浅比较。

```js
function shallowEqual(obj, newObj) {
	if (obj === newObj) {
		return true;
	}

	const objKeys = Object.key(obj);
	const newObjKeys = Object.key(newObj);

	if (objKeys.length !== newObjkeys.lenght) {
		return false;
	}

	// 关键代码，只需关注 props 中每一个是否相等，无需深入判断
	return objKeys.every(key => {
		return newObj[key] === obj[key];
	});
}
```

2.优化 PureRender

在使用 React 写组件的过程中，PureRender 可能是最重要也是做常见的性能优化方法。然而深比较的成本是相当昂贵的。但事实上，浅比较可能覆盖的场景并不是那么多。下面几种类型都会触发 PureRender 为 true。

- 直接为 props 设置对象或数组
- 设置 props 方法并通过事件绑定在元素上
- 设置子组件

对于设置了子组件的 React 组件，在调用 shouldComponentUpdate 时，均返回 true。

### Immutable Data

Immutable Data 是一旦创建，就不能再更改的数据。对 Immutable 对象进行修改、添加或删除操作，都会返回一个新的 Immutable 对象。Immutable 实现的原理是持久化的数据结构。

Immutable 使用了结构共享，即如果对象树中一个节点发生变化，只修改这个节点和受它影响的节点，其他节点则进行共享。

#### 主要优点

- 降低了可变带来的复杂性
- 节省内存
- 撤销/重做，复制/粘贴，甚至时间旅行这些功能做起来都是小菜一碟
- 并发安全
- 拥抱函数式编程

#### 主要缺点

容易与原生对象混淆是使用 Immutable 的过程中遇到的最大的问题。

##### PureRender 与 Immutable

React 做性能优化时最常用的就是 shouldComponentUpdate 方法，但它默认返回 true，即始终会执行 render 方法，然后做 Virtual DOM 比较，并得出是否需要做真实的 DOM 更新。

Immutable.js 提供了简洁、高效的判断数据是否变化的方法，只需 === 和 is 比较就能得知是否需要执行 render，这个操作几乎零成本。

Immutable.is 比较的是两个对象的 hasCode 或 valueOf。

##### 性能检测工具

react-adddons-perf 通过 Perf.start() 和 Perf.stop() 两个 API 设置开设结束的状态来作分析。

#### 自动化测试

React 对测试有完成的支持，目前比较完善的 React 测试框架有 Jest 和 Enzyme。

##### 浅渲染机制

浅渲染就是只渲染组件中的第一层，这样测试执行器就不需要关心 DOM 和执行环境了。

浅渲染也有天生缺点，它只能测试一级节点。如果要测试子级节点，那就只能用全渲染。

##### 全渲染机制

全渲染就是完整渲染出当前组件及其所有的子组件，就像在真实浏览器中渲染哪有。当组件内部直接改变了 DOM 时，就需要使用全渲染来测试。

- JSDOM
- Cheerio
- Karma
