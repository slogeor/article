### brew cask install error

#### 问题描述:

```js
➜  ~ brew cask search qq
==> Exact match
qq
==> Partial matches
qqbrowser  qqinput    qqmacmgr     qqmusic
➜  ~
brew cask install qq
 Error: Cask 'qq' definition is invalid: Bad header line: parse failed
 ```

#### 解决方案：

```js
brew update; brew cleanup; brew cask cleanup
brew uninstall –force brew-cask; brew update
```
