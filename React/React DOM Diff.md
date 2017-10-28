React DOM  Diff 可以将任意两棵树 diff 的复杂度从 O(n^3) 降低到 O(n)，是因为下面三个简单的假设。

* 1. Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计(tree diff)
* 2. 两个相同组件产生相同的 DOM 结构，不同的组件产生不同的 DOM 结构(component diff)
* 3. 对于同一层次的一组子节点，它们可以通过唯一的 id 进行区分(element diff)


基于以上三个假设，React 分别对 tree diff、component diff 及 element diff 进行算法优化。

#### tree diff

基于假设1，React 对树的算法进行了简洁的优化，即对树进行分层比较，两棵树只会对同一层次的节点进行比较。

![img1](../image/React/10/05.png)

React 只会对相同颜色方框内的 DOM 节点进行比较，即同一个父节点下的所有子节点。当发现节点已经不存在，则该节点及其子节点会被完全删除，不用进一步的比较。这样只需要对树进行一次遍历，便能完成整个 DOM 树的比较。

如果出现 DOM 节点跨层级的移动操作，React diff 不会出现想象的移动操作，而是先删除，然后在重新创建。

![img1](../image/React/10/06.png)

React diff 的执行情况: **create A -> create B -> create C -> delete A**

官方也建议不要进行 DOM 节点跨层级的操作，可以通过 CSS 隐藏或显示节点，提升性能。

#### component diff

React 是基于组件构建的应用，对于组件间的比较也是高效的。

* 如果是同一类型的组件，比较 Virtual DOM Tree
* 如果不是同类型的，则该组件被标为 dirty component，从而替换整个组件下的所有子节点
* 对于同一类型的组件，可以通过 shouldComponentUpdate() 来判断组件是否需要进行diff

![img6](../image/React/10/07.png)

对于这样的情况，React 是直接删除 D 及其子节点，然后在重新创建 G 以及子节点。

#### element diff

当节点处于同一层级时，React diff 提供了三种节点操作，分别是：

* INSERT_MARKUP(插入)
* MOVER_EXISTING(移动)
* REMOVE_NODE(删除)

##### INSERT_MARKUP

新的 component 类型不在老集合里，即全新的节点，需要对新节点执行插入操作

##### MOVER_EXISTING

在老集合有新 component 类型，且是可变更的类型，需要做移动操作，复用以前的 DOM 节点

##### REMOVE_NODE

新 component 类型 也存在老集合里，但对应的 element 不同，或者老集合里有而新集合里没有，需要执行删除操作。

**看一个小栗子**

当没有设置唯一标示 key 的情况，element diff 过程是这样的 。

![img8](../image/React/10/08.png)

React 发现这类操作繁杂冗余，因为这些都是相同的节点，但由于位置发生变化，导致需要进行繁杂低效的删除、创建操作，其实只要对这些节点进行位置移动即可。

针对这种情况，React 提出优化策略：允许开发者对同一层级的同组子节点，添加唯一 key 进行区分。

虽然只是小小的改动，性能上却发生了翻天覆地的变化。

![img9](../image/React/10/09.png)

#### component diff 算法

首先对新集合的节点进行循环遍历，for (name in nextChildren)，通过唯一 key 可以判断新老集合中是否存在相同的节点，if (prevChild === nextChild)，如果存在相同节点，则进行移动操作，但在移动前需要将当前节点在老集合中的位置与 lastIndex 进行比较，if (child._mountIndex < lastIndex)，则进行节点移动操作，否则不执行该操作。这是一种顺序优化手段，lastIndex 一直在更新，表示访问过的节点在老集合中最右的位置（即最大的位置），如果新集合中当前访问的节点比 lastIndex 大，说明当前访问节点在老集合中就比上一个节点位置靠后，则该节点不会影响其他节点的位置，因此不用添加到差异队列中，即不执行移动操作，只有当访问的节点比 lastIndex 小时，才需要进行移动操作。

因此在开发过程中，尽量减少类似将最后一个节点移动到列表首部的操作，当节点数量过大或更新操作过于频繁时，在一定程度会影响 React 的渲染性能。

![img10](../image/React/10/10.png)


#### React diff 的生命周期执行过程

来看一个例子，我们需要在 B 和 C 直接插入节点 F。

![img2](../image/React/10/11.png)

如果每个节点没有唯一的标识，React 无法识别每一个节点，更新过程会很低效，见下图。

![img3](../image/React/10/12.png)

如果每个节点都设置了唯一的标识(key)，更新过程如下：

![img4](../image/React/10/13.png)

再来看一个栗子。

![img4](../image/React/10/14.png)


没有设置唯一的标识(key)，更新过程。

```js
B will unmount.
C will unmount.
C is created.
B is created.
C did mount.
B did mount.
A is updated.
R is updated.
```

如果提供了 key，更新过程是这样。

```js
C is updated.
B is updated.
A is updated.
R is updated.
```

#### 总结

* React 通过大胆的 diff 策略，将 O(n^3) 复杂度的问题直接转换成 O(n) 复杂度
* React 通过分层求异的策略，对 tree diff 进行算法优化
* React 通过相同生成相似树形结构，不同类生成不同树形结构的策略，对 component diff 进行算法优化
* React 通过设置唯一 key 的策略，对 element diff 进行算法优化
* 建议在开发组件时，保持稳定的 DOM 结构会有助于性能的提升
* 建议在开发过程中，尽量减少类似将最后一个节点移动到列表首部的操作，当节点数量过大或更新操作过于频繁时，在一定程度上会影响 React 的渲染性能

#### 参考链接

* [http://www.infoq.com/cn/articles/react-dom-diff](http://www.infoq.com/cn/articles/react-dom-diff)
* [https://zhuanlan.zhihu.com/p/20346379](https://zhuanlan.zhihu.com/p/20346379)
* [https://supnate.github.io/react-dom-diff/index.html](https://supnate.github.io/react-dom-diff/index.html)
