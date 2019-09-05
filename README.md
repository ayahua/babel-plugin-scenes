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

#### scene

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

## 注意

目前插件只能处理 `import xxx from xxx`的依赖写法。
目前插件只能处理`./`或`../`开头的相对路径。