# babel-plugin-scenes

分场景编译对应后缀文件的babel插件。

## why babel-plugin-scenes

业务中有时候因为多个场景差异小会用同一套代码来实现，然后部署到各自服务器上，一些差异化的需求就在代码中判断不同场景使用不同的代码，因此其实在一个场景下其他场景的代码是多余的(永远不会被运行)，所以这些代码不应该被打包进去，同时当各个场景的代码差异化越来越严重时，仅在代码中进行判断运行代码会越来越复杂难以维护，后续如果要完全拆分成两个项目时也会更加麻烦。

把不同场景有差异的代码放在不同文件维护，如`page.index`和`page.en.js`，然后打包的时候根据场景打包对应的文件。

## Usage
```bash
npm install babel-plugin-scenes --save-dev
```
修改`.babelrc` 或者 babel-loader
```js
{
  "plugins": [["scenes", options]]
}
```
### options
options是一个对象，里面可以包含以下属性：

#### scene [string]

设定应用场景，插件会根据这个属性去打包对应后缀的文件，比如设置为：
```javascript
{
  "scene": "test",
}

//index.js
import {a,b} from './component'
```
就会去打包对应的`component.test.js`，如果不存在这个文件的话，就还是打包原有的`component.js`。

js文件类型后缀可以不带。不只是js文件，其他类型文件的依赖也都可以处理。

#### alias [object] (v1.1.0)

别名设置，功能同webpack的别名。注意此处别名![](http://latex.codecogs.com/gif.latex?\\supseteq)webpack配置的别名。

## 注意

目前插件可以处理的模块引入方式有：<br>
ES6的`import from`的模块引入方式；(v1.0.0)<br>
ES6的`import()`动态加载方法； (v1.2.0)<br>
`require()`模块引入。(v1.2.0)<br>

因为存在打包缓存的缘故，有时候更改文件后缀之后需要重启项目或者修改引用该后缀文件的文件代码才会起效，否则可能会报错找不到该文件依赖。