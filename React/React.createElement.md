### ReactElement.createElement源码

**ReactElement.createElement源码**

React.createElement 方法返回一个 ReactElement 类型的对象

```js
ReactElement.createElement = function (type, config, children) {
  var propName;
  // 初始化参数
  var props = {};

  // 其他属性
  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  // 从 config 中提取属性
  if (config != null) {
    ref = config.ref === undefined ? null : config.ref;
    key = config.key === undefined ? null : '' + config.key;
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    /**
     * var RESERVED_PROPS = {
     *  key: true,
     *  ref: true,
     *  __self: true,
     *  __source: true
     * };
     */
    // 提取出 config 中的 prop，放入 props 变量对象中
    for (propName in config) {
      if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // 处理 children，挂到 props 的 children 属性下

  // 入参的前两个参数是 type 和 config， 其他都是 children 参数
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    // 只有一个参数，直接挂载到 props 下的 children，非数组形式
    props.children = children;
  } else if (childrenLength > 1) {
    // 多个参数，放到数组里
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    // 数组形式挂载到 props 的 children 下
    props.children = childArray;
  }

  // 取出组件的静态变量 defaultProps，并赋值给 props 的属性
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (typeof props[propName] === 'undefined') {
        props[propName] = defaultProps[propName];
      }
    }
  }

  // 返回一个 ReactElement 对象
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
};
```

**ReactElement源码**

ReactElement 方法返回一个 element 元素

```js
var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

// 返回 element 元素
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // 唯一的标识
    $$typeof: REACT_ELEMENT_TYPE,
    // ReactElement 关键的四个属性
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  };

  if ("development" !== 'production') {
    element._store = {};

    if (canDefineProperty) {
      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      });
      // self and source are DEV only properties.
      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      });
      // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.
      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });
    } else {
      element._store.validated = false;
      element._self = self;
      element._source = source;
    }
    // 冻结对象，不允许修改
    Object.freeze(element.props);
    Object.freeze(element);
  }

  return element;
};
```