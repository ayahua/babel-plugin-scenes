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

Currently, the modules that can be processed by plugins can be introduced in the following ways:<br>
The introduction mode of the `import from` module of ES6; (v1.0.0)<br>
ES6's `import()` dynamic loading method; (v1.2.0)<br>
`require()` (v1.2.0)<br>
All of the above methods support the omitting of the word 'index'.

Need to set the babel without opening the cache. Because of the babel cache, sometimes changing the file suffix requires modifying the file code that references the suffix file to take effect.