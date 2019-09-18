- [中文](https://github.com/ayahua/babel-plugin-scenes/blob/master/README.CN.md)

# babel-plugin-scenes

Babel plugin, compile the corresponding suffix file by scene.

## why babel-plugin-scenes

Put the code with different scenes in different file maintenance, such as `page.index` and `page.en.js`, and then package the corresponding files according to the scene when packaging.

## Usage
```bash
npm install babel-plugin-scenes --save-dev
```
Via `.babelrc` or babel-loader.
```js
{
  "plugins": [["scenes", options]]
}
```
### options
Options is an object that can contain the following properties:

#### scene [string]

Set the application scenario, the plugin will package the file corresponding to the suffix according to this property, for example, set to:
```javascript
{
  "scene": "test",
}

//index.js
import {a,b} from './component'
```
Will be packaged with the corresponding `component.test.js`, if there is no such file, it will still package the original `component.js`.

The js file type suffix can be omitted. Not just js files, the dependencies of other types of files can be handled.

#### alias [object]

Alias settings, functions the same as webpack aliases. Note the alias for the alias ![](http://latex.codecogs.com/gif.latex?\\supseteq) webpack here.

## Note

Currently, the modules that can be processed by plugins can be introduced in the following ways:
The introduction mode of the `import from` module of ES6; (v1.0.0)
ES6's `import()` dynamic loading method; (v1.2.0)
`require()` (v1.2.0)

Because of the package cache, sometimes it is necessary to restart the project after changing the file suffix or modify the file code that references the suffix file, otherwise the file dependency may not be found.