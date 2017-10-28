组件的单一原则(`Single responsibility principle`)非常重要，它可以使得我们的组件更简单、更方便维护，更重要的是使得组件更加具有复用性。

### 设计 React 组件库的几个点

选择或开发一套适合自己团队使用的 UI 组件库应该是每一个前端团队在底层架构达成共识后下一件就要去做的事情，我会从以下几个方面来一起探讨如何构建一套优秀的 UI 组件库。

#### 设计思想：规范 vs 自由

规范的组件库可以从根本上保证产品视觉、交互风格的一致性，也可以很大程度上降低业务开发的复杂度，从而提升团队整体的开发效率。

但在遇到一些看似相似实则不同的业务需求时，规范的组件库往往会走入一个可怕的死循环，那就是 A 需求需要使用 A 组件，但是现有的 A 组件不能完全支持 A 需求。

这时摆在工程师面前的就只有两条路，从零开始把 A 需求开发一遍或者侵入 A 组件代码去支持 A 需求。方法一费时费力，会极大地增加本次项目的开发成本，方法二会导致 A 组件代码膨胀且逻辑复杂，极大地增加组件库后期的维护成本。

选择了拥抱自由之后，组件的使用者终于不用再被组件所定义好的 DOM 结构所束缚，可以自由地组织 DOM 结构。

相较于传统的规范组件，自由的组件需要使用者在业务项目中多写一些代码，但如果我们往深处多看一层，这些额外的代码本来就是属于某个业务所独有的，将其放在业务代码层恰恰是一种更合适的分层方法。

这里所定义的自由，绝不仅仅是多暴露几个渲染函数那么简单，这里的自由，指的是组件 DOM 结构的自由，因为一旦某个组件定死了自己的 DOM 结构，外部除了重写样式去强行覆盖外没有任何其他可行的方式去改变它。

给自由组件添加默认值，可以在组件内部内置许多常用的组成元素，当用户不指定组成元素时，使用默认组成元素来渲染，这样就可以在规范与自由之间达到一个良好的平衡。

#### 数据处理：耦合 vs 解耦

将组件与数据源解耦就是不要在组件代码（不论是视图层还是控制层）中出 `data.xxx`，而是在回调时将整个对象都抛给调用者供其按需使用。这样我们的组件就可以无缝适配于各种各样的后端接口，大大降低使用者或组件在数据处理过程中犯错误的可能。

这样的数据处理方式是和前面所提到的自由的设计思想一脉相承的，正是因为我们赋予了使用者自由定制 DOM 结构的能力，所以我们同时也可以赋予他们在数据处理上的自由。

**栗子**

自由组件 Select 组件规范了选择这个交互方式，处理了什么时候显示或隐藏下拉列表，添加了下拉列表元素的 hover 和 click 事件，并控制了绝对定位的下拉列表的弹出位置。这些通用的交互逻辑，才是 Select 组件的核心，至于多变的渲染和数据处理逻辑，打包开放给用户反而更利于他们在多变的业务场景中更加方便地使用 Select 组件。

#### 回调规范：数组 vs 对象

* 所有的组件内部函数都以 handleXXX（handleClick, handleHover, handleMouseover 等）为命名模板
* 所有对外暴露的回调函数都以 onXXX（onChange、onSelect 等）为命名模板
* 对象的数据结构更能够清晰地表达每个元素的含义并消除顺序的影响

这样在维护一些依赖层级较深的底层组件时，就可以在 render 方法中一眼看出某个回调是在处理内部状态，还是会抛回到更高一层。

### 组件分类

![img04](https://github.com/slogeor/images/blob/master/fe/2017/ReactComponent.png?raw=true)

#### 无状态组件

无状态组件为只接受 props，根据 props 的不同展示出不同的样式，并且会抛出事件来通知外部组件需要的更改。

#### UI 组件

如输入框、tab框、表格、下拉框等等，其中有一些其实可以是我们上述所说的无状态组件，我们常见的UI库如 ant-design(react)、eleme-element(vue)等。

#### 业务组件

按照一个页面的业务逻辑进行划分的单元，如优惠券、商品1x2、商品1x3、倒计时等等，它们中有一些有一定的复用性，但大部分可能只会在特定的业务中使用。它们里面是由一个个UI组件组成。

#### 模板组件

专注于各种 configurations，不处理业务逻辑，只是用来堆页面的结构。

#### 容器组件

一个包裹业务模块的盒子，一般来说一个业务模块的入口。它接收着业务组件所需要的所有数据，然后根据每个业务组件的需要来进行分发数据，使对应的数据进入到对应的业务组件中。


### 实践案例

一个组件会变的臃肿而复杂呢？其一是渲染元素较多且嵌套，另外就是组件内部变化较多，或者存在多种 configurations 的情况。

此时，我们便可以将组件改造为模版：父组件类似一个模版，只专注于各种 configurations。

**模板化组件**

```js
class CommentTemplate extends React.Component {
  static propTypes = {
    // Declare slots as type node
    metadata: PropTypes.node,
    actions: PropTypes.node,
  };

  render() {
    return (
      < div>
        < CommentHeading>
          < Avatar user={...}/>

          // Slot for metadata
          < span>{this.props.metadata}< /span>

        < /CommentHeading>

        < CommentBody/>

        < CommentFooter>
          < Timestamp time={...}/>

          // Slot for actions
          < span>{this.props.actions}< /span>

        < /CommentFooter>
      < /div>
      ...
```

**Comment 组件**

```js
class Comment extends React.Component {
  render() {
    const metadata = this.props.publishTime ?
      < PublishTime time={this.props.publishTime} /> :
      < span>Saving...< /span>;

    const actions = [];
    if (this.props.isSignedIn) {
      actions.push(< LikeAction />);
      actions.push(< ReplyAction />);
    }
    if (this.props.isAuthor) {
      actions.push(< DeleteAction />);
    }

    return < CommentTemplate metadata={metadata} actions={actions} />;
  }
```

不同的频道可以通过模板组件化来实现高度复用。

#### 高阶组件

如要要统计页面中所有链接的点击信息。在链接点击时，发送统计请求，同时包含此页面 document 的 id 值。常见的做法是在 Document 组件的生命周期函数 componentDidMount 和 componentWillUnmount 增加代码逻辑。

```js
class Document extends React.Component {
  componentDidMount() {
    ReactDOM.findDOMNode(this).addEventListener('click', this.onClick);
  }

  componentWillUnmount() {
    ReactDOM.findDOMNode(this).removeEventListener('click', this.onClick);
  }

  onClick = (e) => {
    if (e.target.tagName === 'A') { // Naive check for  elements
      sendAnalytics('link clicked', {
        documentId: this.props.documentId // Specific information to be sent
      });
    }
  };

  render() {
    // ...
```

这样的代码存在的问题

* 相关组件 Document 除了自身的主要逻辑：显示主页面之外，多了其他统计逻辑
* 如果 Document 组件的生命周期函数中，还存在其他逻辑，那么这个组件就会变的更加含糊不合理
* 统计逻辑代码无法复用
* 组件重构、维护都会变的更加困难

```js
function withLinkAnalytics(mapPropsToData, WrappedComponent) {
  class LinkAnalyticsWrapper extends React.Component {
    componentDidMount() {
      ReactDOM.findDOMNode(this).addEventListener('click', this.onClick);
    }

    componentWillUnmount() {
      ReactDOM.findDOMNode(this).removeEventListener('click', this.onClick);
    }

    onClick = (e) => {
      if (e.target.tagName === 'A') { // Naive check for  elements
        const data = mapPropsToData ? mapPropsToData(this.props) : {};
        sendAnalytics('link clicked', data);
      }
    };

    render() {
      // Simply render the WrappedComponent with all props
      return < WrappedComponent {...this.props} />;
    }
  }
```

withLinkAnalytics 函数并不会去改变 WrappedComponent 组件本身，更不会去改变 WrappedComponent 组件的行为。而是返回了一个被包裹的新组件。实际用法为：

```js
class Document extends React.Component {
  render() {
    // ...
  }
}

export default withLinkAnalytics((props) => ({
  documentId: props.documentId
}), Document);
```

这样一来，Document 组件仍然只需关心自己该关心的部分，而 withLinkAnalytics 赋予了复用统计逻辑的能力。

### 参考链接

* [React 组件设计和分解思考](https://juejin.im/post/59522e57f265da6c3b27ab62?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com)
* [重新设计 React 组件库](https://zhuanlan.zhihu.com/p/24207409)
* [基于Decorator的组件扩展实践](https://zhuanlan.zhihu.com/p/22054582)
* [组件库设计实战](https://zhuanlan.zhihu.com/p/24613991)
* [复杂组件设计](https://zhuanlan.zhihu.com/p/29034015)