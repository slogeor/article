#### 判断数组的方法

```js
// 方法1
Array.isArray([]);

// 方法2
Object.prototype.toString.call([]) === "[object Array]"
```

#### 类数组转换数据的方法

```js
Array.prototype.slice.call(arg);
```

#### slice

```js
arrayObject.slice(start, end)

返回一个新的数组，包含从 start 到 end （不包括该元素）的 arrayObject 中的元素。

该方法并不会修改数组，而是返回一个子数组。
```

#### splice

```js
arrayObject.splice(index,howmany,item1,.....,itemX)

index: 规定添加/删除项目的位置，使用负数可从数组结尾处规定位置

howmany: 要删除的项目数量, 如果设置为 0，则不会删除项目

item1, ..., itemX: 向数组添加的新项目

返回是数据发生变化的数据

该方法会改变原始数组
```


#### 想数组固定位置添加数据

```js
/**
 * @desc 判断数组类型
 */
function isArray(param) {
  return Object.prototype.toString.call(param) === '[object Array]';
}

/**
 * @desc  在数组的指定位置插入数据
 * @param   a1        原始数组
 * @param   a2        需要插入的数据
 * @param   index     插入的具体位置
 * @return  res       数组
 */
function insertArr(a1, a2, index) {
  if (!isArray(a1)) return -1;

  var insert = a2;

  if (!isArray(a1)) {
    inser = [a2];
  }

  var len = a1.length;

  // 结束位置插入
  if (len <= index) {
    return a1.concat(a2);
  }

  // 起始位置插入
  if (index === 1) {
    return a2.concat(a1);
  }

  // 中间位置插入
  a1.splice(index - 1, 0, ...a2);
  return a1;
}
```
