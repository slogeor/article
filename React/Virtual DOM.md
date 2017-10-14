## Virtual DOM

在 React 中，render 执行的结果得到的并不是真正的 DOM 节点，结果仅仅是轻量级的 JavaScript 对象，被称之为 Virtual DOM。

**Virtual DOM 的设计思想**

* 提供一种方便的工具，使得``开发效率``得到保证
* 保障最小化的 DOM 操作，使得 `执行效率` 得到保证

### Virtual DOM 组成

* JavaScript DOM 模型树(VTree)
* DOM模板树转换节点树方法(VTree -> DOM)
* 两个 DOM 模型树的差异算法(diff(VTree, VTree) -> PatchObject)
* patch操作(patch(DOMNode, PatchObject) -> DOMNode)

### Virtual DOM 算法

操作 DOM 需要非常的小心翼翼，轻微的触碰都可能会导致页面重排，这可是杀死性能的罪魁祸首。

相对于 DOM 对象，原生的 JavaScript 对象处理起来更快，而且更简单。 DOM 树上的结构、属性我们都可以用 JavaScript 很容易的表示出来。

```js
var element = {
  tagName: 'ul', // 节点标签名
  props: {
    id: 'list'
  },
  children: [ //子节点
    {tagName: 'li', props: {class: 'item'}, children["item 1"]},
    {tagName: 'li', props: {class: 'item'}, children["item 2"]},
  ]
}
```
上门对应的 HTML 写法是：

```html
<ul id="list">
  <li class="item">item 1</li>
  <li class="item">item 2</li>
</ul>
```

可以根据这个 JavaScript 对象表示的树结构来构建一棵真正的 DOM 树。

这种状态变更，重新渲染整个视图的方式可以稍微修改一下：用 JavaScript 对象表示 DOM 数据结构，当状态变更的时候，重新渲染这个 JavaScript 的对象结构。用新渲染的对象树去和旧的树进行对比，记录这两棵树的差异。把两棵树的差异应用到真正的 DOM 树上，页面就刷新了。这样做到：视图的结构确实是全新的渲染了，但是最后操作 DOM 的时候确实只变更差异的地方。

这就是所谓的 Virtual DOM 算法，包括几个步骤：

* 1.用 JavaScript 对象结构表示 DOM 树的结构，然后用这个树构建一个真正的 DOM 树，插入到文档中
* 2.当状态变更的时候，重新构建一棵新的对象树。然后用新的树和旧的树进行对比，记录两棵树差异
* 3.把步骤2所记录的差异应用到步骤1所构建的真正DOM树上，视图就更新了

Virtual DOM 本质上就是 JS 和 DOM 之间做了一个缓存。可以类比 CPU 和硬盘，由于硬盘那么慢，我们就在它们之间加个缓存。既然 DOM 这么慢，我们就在 JS 和 DOM 之间加个缓存，JS(CPU) 只操作 Virtual DOM(内存)，最后把差异写到 DOM(硬盘)上。

### 算法实现

* 1.用 JS 对象模拟 DOM 树
* 2.比较两颗虚拟 DOM 树的差异
* 3.把差异应用到真正的 DOM 树上

#### 1.用 JS 对象模拟 DOM 树

用 JavaScript 来表示一个 DOM 节点是很简单的事情，只需要记录节点类型、属性及子节点。

**element.js**

```js
function Element (tagName, props, children) {
  // 标签
  this.tagName = tagName;
  // 属性
  this.props = props;
  // 子节点
  this.children = children;
}

// render 方法
Element.prototype.render = function() {
  // 创建标签
  var el = domcument.createElement(this.tagName);
  var props = this.porps;

  // 设置属性
  for(var propName in props) {
    var propValue = props[propName];
    el.setAttribute(propsName, propValue);
  }

  var children = this.children || [];

  // 遍历子节点
  children.forEach(function (child) {
    // 子节点也是虚拟 DOM，递归构建 DOM 节点
    var childEl = (child instanceof Element)
    ? children.render()
    : document.createTextNode(child)
    el.appendChild(childEl)
  })

  return el;
}

module.exports = function (tagName, props, chilren) {
  return new Element(tagName, props, chilren)
}
```

`Elemen` 方法会根据参数设置节点的类型、属性和子节点，方便的用 JavaScript 来表示 DOM 节点。

`render` 方法会根据 tagName 构建一个真正的 DOM 节点，然后设置这个节点的属性，最后递归的把自己的子节点也构建起来。


#### 2.比较两颗 Virtual DOM 树的差异

比较两颗 DOM 树的差异就是 Virtual DOM 算法最核心的部分，这也就是所谓的 Virtual DOM 的 diff 算法。两棵树的完全 diff 算法是一个复杂度为 O(n^3)。但是在前端应用中，很少会跨越层级地移动 DOM 元素，所以 Virtual DOM 只会对同一层级的元素进行对比，这样的算法复杂度可以达到 O(n)

![diff](https://dn-fed.qbox.me/@/res/20150602000109457939416633)

**深度优先遍历，记录差异**

深度优先遍历新旧树，对树的每一个节点进行对比(同层)，如果有差异的话，就记录到一个对象里。

**差异类型处理**

由于我们对 DOM 树采取的是同级比较，因此节点之间的差异可以归结为4种类型：

* 修改节点属性
* 修改节点文本内容
* 替换原有节点
* 调整子节点，包括移动、删除

**列表对比算法**

有这样的一个场景，如果将`p.ul.div` 顺序改成 `div.p.ul`，我们使用同层级进行顺序对比，它们都会依次被替换，这样 DOM 开销会比较大。

```js
function dfsWalk (oldNode, newNode, index, patches) {
  var currentPatch = []

  // Node is removed.
  if (newNode === null) {
    // Real DOM node will be removed when perform reordering, so has no needs to do anthings in here
  // TextNode content replacing
  } else if (_.isString(oldNode) && _.isString(newNode)) {
    if (newNode !== oldNode) {
      currentPatch.push({ type: patch.TEXT, content: newNode })
    }
  // Nodes are the same, diff old node's props and children
  } else if ( oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
    // Diff props
    var propsPatches = diffProps(oldNode, newNode)
    if (propsPatches) {
      currentPatch.push({ type: patch.PROPS, props: propsPatches })
    }
    // Diff children. If the node has a `ignore` property, do not diff children
    if (!isIgnoreChildren(newNode)) {
      diffChildren(
        oldNode.children,
        newNode.children,
        index,
        patches,
        currentPatch
      )
    }
  // Nodes are not the same, replace the old node with new node
  } else {
    currentPatch.push({ type: patch.REPLACE, node: newNode })
  }

  if (currentPatch.length) {
    patches[index] = currentPatch
  }
}
```

#### 3.把差异应用到真正的 DOM 树上

因为步骤一所构建的 JavaScript 对象树和 render 出来真正的 DOM 树的信息、结构是一样的。所以我们可以对那颗 DOM 树进行深度优先的遍历，遍历的时候从步骤二生成的 patches 对象中找出当前遍历的节点差异，然后进行 DOM 操作。

```js
function applyPatches (node, currentPatches) {
  _.each(currentPatches, function (currentPatch) {
    switch (currentPatch.type) {
      case REPLACE:
        var newNode = (typeof currentPatch.node === 'string')
          ? document.createTextNode(currentPatch.node)
          : currentPatch.node.render()
        node.parentNode.replaceChild(newNode, node)
        break
      case REORDER:
        reorderChildren(node, currentPatch.moves)
        break
      case PROPS:
        setProps(node, currentPatch.props)
        break
      case TEXT:
        if (node.textContent) {
          node.textContent = currentPatch.content
        } else {
          // fuck ie
          node.nodeValue = currentPatch.content
        }
        break
      default:
        throw new Error('Unknown patch type ' + currentPatch.type)
    }
  })
}
```

### 总结

在实际的项目中，一般是这样使用 Virtual DOM 的。

* 1.构建虚拟 DOM(Element)
* 2.通过虚拟 DOM 构建真正的DOM(render)
* 3.生成新的虚拟 DOM(element)
* 4.比较两颗虚拟 DOM 树的不同(diff)
* 5.在真正的 DOM 元素上应用变更(patch)

### Demo

[https://github.com/livoras/simple-virtual-dom](https://github.com/livoras/simple-virtual-dom)

### React 的实现

### 总结

* Virtual DOM 通过高效的 diff 算法，用最小代价来更新 DOM，提高性能
* Vritual DOM 打开了函数式 UI 编程的大门
* Virtual DOM 的思想可以延伸到其他应用，比如 React Native

### 参考文献
* [https://github.com/livoras/blog/issues/13](https://github.com/livoras/blog/issues/13)
* [https://www.zhihu.com/question/31809713](https://www.zhihu.com/question/31809713)
* [https://github.com/y8n/blog/issues/5](https://github.com/y8n/blog/issues/5)
