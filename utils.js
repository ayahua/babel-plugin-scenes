const nPath = require('path')
const fs = require('fs')

const fileReg = /^[.]/
const getFolder = function (sourceFileName) {
    const nametoArray = sourceFileName.split('/')
    return nametoArray.splice(0,nametoArray.length - 1).join('/')
}
const getFile = function (sourceFileName, original, aliasSource) {
    const nametoArray = sourceFileName.split('/')
    nametoArray.splice(nametoArray.length - 1, 1)
    if(aliasSource){
        return original.replace(/([^/]*)/, nPath.resolve(__dirname, '../../', aliasSource))
    }
}
const getSceneSource = function (source, scene) {
    if(!source) return
    if(fs.existsSync(source) && fs.lstatSync(source).isDirectory()){
        source += '/index'
    }
    const sceneSourceArray = source.match(/([^/]*)$/)[0].split('.')
    sceneSourceArray.splice(1,0,scene)
    const sceneSource = sceneSourceArray.join('.')
    const sceneSourceComplete = source.replace(/([^/]*)$/, sceneSource)
    let hasRequire = null
    try {
        const sceneSourceReuqire =  require.resolve(sceneSourceComplete)
        hasRequire = !!sceneSourceReuqire
    } catch(err){
        hasRequire = false
    }
    if(hasRequire){
        // return original.replace(/([^/]*)$/, sceneSource)
        return sceneSourceComplete
    }
}
const sceneSourceBuild = function(pathArg, file, alias, scene){
    if(!file) return
    let sceneSource = null
    let filename = null
    let aliasSource = null
    if(fileReg.test(pathArg)){
        const sourceFolder = getFolder(file.opts.filename)
        filename = nPath.resolve(sourceFolder, pathArg)
    }else if(alias) {
      aliasSource = alias[pathArg.match(/([^/]*)/)[0]]
      if(aliasSource){
        filename = getFile(file.opts.filename, pathArg, aliasSource)
      }else if(/^[/]/.test(pathArg)){
        filename = pathArg
      }
    }
      sceneSource = getSceneSource(filename, scene, pathArg)
      return {sceneSource, aliasSource, filename}
}
module.exports = {
    sceneSourceBuild
}