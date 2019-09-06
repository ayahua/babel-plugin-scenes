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

#### scene

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

## Note

Currently the plugin can only handle the dependency of `import xxx from xxx`.

Currently the plugin can only handle relative paths starting with `./` or `../`.