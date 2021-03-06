### .gitignore 规则不生效

#### 问题重现：

* 1.想忽略工程目录中的某个后缀的文件（eg: .scss）。一般做法只需要在 .gitignore 里配置上 *.scss，即可。对 scss 的修改是不会被提交的。

* 2.问题是开始构建工程的时候没有考虑到，对 scss 文件 git add 操作过

* 3.这个时候，在 .gitignore 里配置上 *.scss，git 仍然会追踪到对 scss 文件的修改

#### 分析原因

.gitignore只能忽略那些原来没有被track的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。

#### 解决方法：

先把本地缓存删除、提交，然后增加忽略规则。

```js
git rm -r --cached .
git add .
git commit -m "update .gitignore"
```
