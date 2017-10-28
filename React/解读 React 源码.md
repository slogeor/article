#### 代码结构

* addons: 包含一系列的工具方法插件，如 PureRenderMixin...
* isomorphic: 包含一系列同构方法
* shared: 包含一些公用或常用的方法
* test: 包含一些测试方法等
* core/tests: 包含一些边界错误的测试用例
* renderers: React 代码的核心部分，又分为 dom 和 shared 目录

**1.dom 包含 client、server 和 shared**

* client: 包含 DOM 操作方法以及事件方法，这里的时间方法是一些非底层的实用性方法
* server: 主要包含服务端渲染的实现方法
* shared: 包含文本组件、标签组件、DOM 属性操作、CSS 属性操作等

**2.shared 包含 event 和 reconcier**

* event: 包含一些更底层的事件方法，如事件插件中心、事件注册、事件传播以及一些事件通用方法
* reconcier: 成为协调器，它是最为核心的部分，包含 React 中自定义组件的实现、组件生命周期机制、setState 机制、DOM diff 算法等重要的特性方法

Virtual DOM 实际上是在浏览器端用 JavaScript 实现的一套 DOM API，它之于 React 就好似一个虚拟空间，包括一整套 Virtual DOM 模型、生命周期的维护和管理、性能高效的 diff 算法和 将 Virtual DOM 展示为原生 DOM 的 Patch 方法等。

#### Virtual DOM 模型

Virtual DOM 模型负责 Virtual DOM 底层框架的构建工作，它拥有一整套的 Virtual DOM 标签，并负责虚拟节点及其属性的构建、更新、删除等工作。

构建一套简易 Virtual DOM 模板并不复杂，只需要具备一个 DOM 标签 所需的基本元素即可。

* 标签名
* 节点属性，包含样式、属性、事件等
* 子节点
* 标识 id

```js
{
  // 标签名
  tagName: div,
  // 属性
  properties: {
    // 样式
    style: {},
  },
  // 子节点
  children: [],
  // 唯一标识
  key: 1
}
```

Virtual DOM 中的节点成为 ReactNode，它分为 3 种类型 ReactElement、ReactFragment 和 ReactText。其中 ReactElement 又分为 ReactComponentElement 和 ReactDOMElement。

ReactNode 中不同类型节点所必须要的基础元素

**1.ReactNode**

```js
ReactNode = ReactElement | ReactFragment | ReactText
```

**2.ReactElement**

```js
ReactElement =  ReactComponentElement | ReactDOMElement
```

**3.ReactDOMElement**

```js
ReactDOMElement = {
  type: string,
  props: {
    children: ReactNodeList,
    className: string,
    etc.
  },
  key: string | bool | number | null,
  ref: string | null
};
```

**4.ReactComponentElement<TProps>**

```js
ReactComponentElement<TProps> = {
  type: ReactClass<TProps>,
  props: TProps,
  key: string | bool | number | null,
  ref: string | null
};
```

**5.ReactFragment**

```js
ReactFragment = Array<ReactNode | ReactEmpty>
```

**6.ReactNodeList**

```js
ReactNodeList = ReactNode | ReactEmpty
```

**7.ReactText**

```js
ReactText = string | number
```

**8.ReactEmpty**

```js
ReactEmpty = null | undefined | boolean
```

#### 1.创建 React 元素

```js
const Nav, Profile;

// 输入 JSX
const app = <Nav color="blue"><Profile>click</Profile></Nav>;

// 输出 JavaScript
const app = React.createElement(
  Nav,
  {color: "blue"},
  React.createElement(Profile, null, 'click')
);
```

通过 JSX 创建的虚拟元素最终会被编译成调用 React.createElement 方法。Virtual DOM 模型是通过 createElement 创建虚拟元素。

#### 2.初始化组件入口

React 创建组件时，首先会调用 `instantiateReactComponet`，这是初始化组件的入口函数，通过判断 node 类型来区分不同组件的入口。

* node 为空是，说明 node 不存在，则初始化空组件 ReactEmptyComponent.create(instantiateReactComponet)
* node 类型为对象时，即是 DOM 标签组件或自定义组件，那么 element 类型为字符串时，则初始化 DOM 标签组件 ReactNativeComponent.createInternalComponent(element)，否则初始化自定义组件 ReactCompositeComponentWrapper()
* 当 node 类型为字符串或数字时，初始化文本组件 CreateNativeComponent.createInstanceForText(node)
* 其他情况，不作处理

#### 3.文本组件

当 node 类型为文本节点时是不算 Virtual DOM 元素的，但 React 为了保持渲染的一致性，将其封装成文本组件 ReactDOMTextComponent。

在执行 `mountComponent` 方法是，`ReactDOMTextComponent` 通过 transaction.useCreateElement 判断该文本是否通过 createElement 方法创建其节点。如果是，则为该节点创建相同的标签和标识 domID。这样每个文本节点也能与其他 React 节点一样拥有自己的唯一标签，同样拥有 Virtual DOM diff 的权利。如果不是通过 createElement 创建的文本，React 将不在为其创建 <span> 和 domID标识，直接返回文本内容。

在执行 receiveComponet 方法时，可以通过 `DOMChildrenOperations.replaceDelim itedText(commentNodes[0], commentNodes[1], nextStringText)` 来更新文本内容。

#### 4.DOM标签组件

Virtual DOM 模型涵盖了几乎所有的原生 DOM 标签，如 `<div>、<p>、<span>` 等。当开发者使用 `<div>` 时，它并不原生的 `<div>` 标签，它是 React 生成的 Virtual DOM 对象，只不过标签名称相同罢了。React 的大部分工作都是在 Virtual DOM 中完成的，对于原生的 DOM 而言，Virtual DOM 就如同一个隔离的沙盒，因此 React 并不直接操作和污染原生的 DOM，这样保持了性能的高效和稳定性，而且降低直接操作原生 DOM 而导致的错误风险。

ReactDOMComponent 针对 Virtual DOM 标签的处理主要分为以下两个部分：

* 属性的更新，包括更新样式、更新属性、处理事件等；
* 子节点的更新，包括更新内容、更新子节点，此部分涉及 diff 算法

**属性更新**

当执行 mountComponent 方法时，ReactDOMComponent 首先会生成标记和标签，通过 `this.createOpenTagMarkupAndPutListeners(transaction)` 来处理 DOM 节点的属性和事件。

* 如果存在事件，则针对当前的节点添加事件代理
* 如果存在样式，首先会对样式进行合并操作，然后在创建样式
* 创建属性
* 创建唯一标识

当执行 receiveComponent 方法时，ReactDOMComponent 会通过 `this.updateComponent(transaction, prevElement, nextElement, content)` 来更新 DOM 节点属性。
* 先是删除不需要的旧属性
* 再是更新新属性

至此，ReactDOMComponent 完成了对 DOM 节点属性的更新操作。

**更新子节点**

当执行 mountComponent 方法是， ReactDOMComponent 会通过 `this._createContentMarkup(transaction, props, content)` 来处理 DOM 节点的内容。

首先，获取节点内容 props.dangerouslySetInnerHTML。如果存在子节点，则通过 `this.mountChildren(childrenToUse, transaction, content)` 对子节点进行初始化渲染。

当执行 receiveComponent 方法时，ReactDOMComponent 会通过 `this._updateDOMChildren(lastProps, nextProps, transaction, content)` 来更新DOM 内容和子节点。

* 先删除不需要的子节点
* 再更新子节点和内容

至此，ReactDOMComponent 完成了对 DOM 子节点和内容的更新操作。

#### 5.自定义组件

ReactCompositeComponent 自定义组件实现一套 React 生命周期和 setState 机制，因此自定义组件是在生命周期的环境中进行更新属性、内容和子节点的操作。这些更新操作和 ReactDOMComponent 的操作类似。

### 生命周期的管理艺术

React 的主要思想是通过构建可复用组件来构建用户界面。所谓组件，其实就是有限状态机，通过状态渲染对应的界面。且每个组件都有自己的生命周期，它规定了组件的状态和方法需要在哪个阶段改变和执行。

#### 1.初探 React 生命周期

查看组件生命周期的执行工具: react-lifecycle mixin。将此 mixin 添加到需要观察的组件中，就能在控制台查看对应组件的生命周期的调用情况。

通过反复试验，组件的生命周期如下：

* 当首次挂载组件时，执行顺序是 getDefaultProps、getInitialState、componentWillMount、render 和 componentDidMount
* 当组件卸载时，执行 componentWillUnmount
* 当组件重新挂载时，此时的执行顺序是 getInitialState、componentWillMount、render 和 componentDidMount，但并不执行 getDefaultProps。
* 当再次渲染组件时，组件接受到更新状态，此时按顺序执行 componentWillReceiveProps、shouldComponentUpdate、componetWillUpdate、render 和 componentDidUpdate

当使用 ES6 classes 构建 React 组件时，`static defaultProps = {}` 其实就是调用内部的 `getDefaultProps` 方法，`construct` 中的 `this.state = {}` 其实就是调用内部的 `getInitialState` 方法。

生命周期的执行顺序。

* `First Render:`getDefaultProps -> getInitialState -> componentWillMount（*this.setState*）-> render -> componentDidMount（*this.setState*）
* `Unmount:` componentWillUnmount -> Second Render ->  getInitialState -> componentWillMount -> render -> componentDidMount
* `Props Change:` componentWillReceiveProps（*this.setState*） -> shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate
* `State Change:` shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate（*this.setState*）

#### 2.详解 React 生命周期

自定义组件(ReactCompositeComponent) 的生命周期主要通过 3 个阶段进行管理：MOUNTING、RECEIVE_PROPS 和 UNMOUNTING。他们负责通知组件当前所处的阶段，应该执行生命周期中的哪个步骤。
这 3 个阶段对应 3 种方法，分别是: mountComponent、updateComponent 和 unmountComponet。每个方法都提供了几种处理方法。其中待 will 前缀的方法在进入状态之前调用，带 did 前缀的方法在进入状态之后调用。

**使用 creatClass 创建自定义组件**

createClass 是创建自定义组件的入口方法，负责管理生命周期中的 getInitialProps。该方法在整个生命周期中只执行一次，这样所有实例初始化的 props 将会被共享。

通过 createClass 创建自定义组件，利用原型继承 ReactClassComponent 父类，按顺序合并 mixin，设置初始化 defaultProps，返回构造函数。

当使用 ES6 classes 编写 React 组件时，class MyComponent extends React.Component 其实就是调用内部方法 createClass 创建组件。

**MOUNTING 阶段**

mountComponent 负责管理生命周期中的 getInitalState、componentWillMount、render 和 componentDidMount。

通过 mountComponent 挂载组件，初始化序号、标记等参数，判断是否为无状态组件，并进行对应的组件初始化工作。利用 getInitialState 获取初始化 state、初始化更新队列和更新状态。

mountComponent 本质上是通过递归渲染内容的，由于递归的特性，父组件的 componentWillMount 在其子组件的 componentWillMount 之前调用的，而父组件的 componentDidMount 在其子组件的 componentDidMount 之后调用。

**RECEIVE_PROPS**

updateComponent 负责管理生命周期中的 componentWillReceiveProps、shouldComponentUpdate、componentWillUpdate、render 和 componentDidUpdate。

updateComponent 本质上是通过递归渲染内容的，由于递归的特性，父组件的 componentWillUpdate在其子组件的 componentWillUpdaet 之前调用的，而父组件的 componentDidUpdate 在其子组件的 componentDidUpdate 之后调用。

*禁止在 shouldComponentUpdate 和 componentWillUpdate 中调用 setState，这会造成循环调用，直到耗光浏览器内存后崩溃*

**UNMOINTING**

unmountComponent 负责管理生命周期中的 componentWillUnmount。

#### 3.无状态组件

无状态组件只有一个 render 方法，并没有组件类的实例化过程，也没有实例返回。无状态组件没有状态、没有生命周期，只简单地接受 props 渲染生成 DOM 结构，是一个纯粹为渲染而生的组件。由于无状态组件又简单、便捷、高效等诸多有点，所以应尽量使用无状态组件。

#### 4.1 setState 异步更新

setState 通过一个队列机制实现 state 更新。当执行 setState 时，会将需要更新的 state 合并后放入状态队列，而不会立即更新 this.state，队列机制可以高效地批量更新 state。如果不通过 setState 而直接修改 this.state 的值，那么该值是不会被放入状态队列中。

#### 4.2 setState 循环调用风险

当调用 setState 时，实际上会执行 enqueueSetState 方法，并对 partialState 以及 _pendingStateQueue 更新队列进行合并操作，最终通过 enqueueUpdate 执行 state 更新。

而 performUpdateIfNecessary 方法会获取 _pendingElement、_pendingStateQueue、_pengingForUpdate，并调用 receiveComponent 和 updateComponent 方法进行组件更新。

如果在 shouldComponentUpdate 或 componentWillUpdate 方法中调用 setState，此时 this._pendingStateQueue != null，则 performUpdateIfNecessary 方法就会调用 updateComponet 方法进行组件更新，但 updateComponent 方法又会调用 shouldComponentUpdate 和 componentWillUpdate 方法，因此造成循环调用，使得浏览器内存占满后奔溃。

#### 4.3 setState 调用栈

this.setState(newState) -> newState 存入 pending 队列  -> 调用enqueueUpdate -> 是否处于批量更新模式 ？？

* YES -> 将组建保存到 dirtyComponents
* NO -> 遍历 dirtyComponents、调用 updateComponent、更新 pending state or props

```js
function enqueueUpdate(component) {
  ensureInjected();

  // 如果不处于批量更新模式
  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdates, component);
    return;
  }

  // 如果处于批量更新模式，则将组件保存在 dirtyComponents 中
  dirtyComponents.push(component);

}
```

如果 isBatchingUpdates 为 true，则对所有队列中的更新执行 batchUpdates 方法，否则只把当前组件放入到 dirtyComponents 数组中。

### diff 算法

diff 作为 Virtual DOM 的加速器，其算法上的改进优化是 React 整个界面渲染的基础和性能保障，同时也是 React 源码中最神秘、最不可思议的部分。

#### 1.传统 diff 算法

计算一棵树形结构转换成另一颗树形结构的最少操作，是一个复杂且值得研究的问题。传统的 diff 算法通过循环递归对节点进行依次比较，效率低下，算法复杂度达到 O(n * n * n)

#### 2. 详解 diff

React 将 Virtual DOM 树转换成 actual DOM 树的最少操作的过程称为调和。diff 算法便是调和的具体实现。

React 通过制定大胆的策略，将 `O(n * n * n)` 复杂度的问题转化成 `O(n)` 复杂度的问题。

React diff 算法。

* 策略一：Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计
* 策略二：拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构
* 策略三：对于同一层级的一组子节点，它们可以通过唯一 id 进行diff

基于以上策略，React 分别对 tree diff、Component diff 以及 element diff 进行算法优化。

##### tree diff

基于策略一，React 对树的算法进行了简洁的优化，即对数进行分层比较，两棵树只会对同一层次的节点进行比较。

既然 DOM 节点跨层级的移动操作少到可以忽略不计，针对这一现象，React 通过 updateDepth 对 Virtual DOM 树进行层级控制，只会对相同层级的 DOM 节点进行比较，即同一个父节点下的所有子节点。当发现节点已经不存在，则该节点及其子节点会被完全删除。这样只需要对树进行一次遍历，便能完成整个 DOM 树的比较。

当出现节点跨层级移动时，并不会出现想象中的移动操作，而是以某个节点为根节点的整个树被重新创建。

##### component diff

React 是基于组件构建应用的，对于组件间的比较所采取的策略是非常简洁、高效的。

* 如果是同一类型的组件，按照原策略继续比较 Virtual DOM 树即可
* 如果不是，则将该组件判断为 dirty component，从而替换整个组件下的所有子节点
* 对于同一类型的组件，有可能其 Virtual DOM 没有任何变化。React 允许用户通过 shouldComponentUpdate() 来判断组件是否需要 diff 算法分析

##### element diff

当节点处于同一层级时，diff 提供了 3 种节点操作，分别是 INSERT_MARKUP(插入)、MOVE_EXISTING(移动)、REMOVE_NODE(删除)。

* INSERT_MARKUP: 新的组件类型不在旧的集合里，即全新的节点，需要对新节点执行插入操作
* MOVE_EXISTING: 旧集合中有新组件类型，且 element 是可变更的类型，可以通过移动操作，复用以前的 DOM 节点
* REMOVE_NODE: 旧组件类型，在新组件也有，但对应的 element 不同则不能直接复用或更新，或者旧组件不在新的集合里，需要执行删除操作

高效的 diff 到底如何运作的？

首先，对新集合中的节点进行循环遍历 `for (name in nextChildrne)`，通过唯一的 key 判断新旧集合中是否存在相同的节点 `if (preChildren === nextChildren)`，如果存在相同的节点，则进行移动操作，但在移动前需要将当前节点在旧集合中的位置(_mountIndex) 与 lastIndex 进行比较 `if (child._mountIndex < lastIndex)`，否则不执行该操作。lastIndex 一直在更新，标签访问过的节点在旧集合中最右边的位置。如果新集合中当期访问的节点比 lastIndex 大，说明当前访问节点在旧集合中比上一个节点位置靠后，则该节点不会影响其他节点的位置，因此不用添加差异队列中，即不执行移动操作。只有当访问的节点比 lastIndex 小时，才进行移动操作。

*在开发过程中，尽量减少类似将最后一个节点移动到列表首部的操作。当节点数量过大或更新操作过于频繁时，这在一定程度上会影响 React 的渲染性能。*

#### React Patch

所谓 Patch，简而言之就是将 tree diff 计算出的 DOM 差异队列更新到真实的 DOM 节点上，最终能让浏览器能够渲染出更新的数据。

Patch 主要通过遍历差异队列实现。遍历差异队列时，通过更新类型进行相应的操作，包括：新节点的插入、已有节点的移动和删除等。

React 并不是计算出一个差异就去执行一次 Patch，而是计算出全部差异并放入差异队列后，再一次性地去执行 Patch 方法完成真实 DOM 的更新。
