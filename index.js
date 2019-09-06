const nPath = require('path')

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
const getSceneSource = function (source, scene, original) {
    if(!source) return
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
        return original.replace(/([^/]*)$/, sceneSource)
    }
}
module.exports = function ({types}) {
    return {
        visitor: {
            ImportDeclaration(path, { opts = {} }){
                const { node, hub } = path
                const { scene = process.env.SCENE, alias, matchAll }  = opts
                if(!node || !hub || !scene) return
                const { source, specifiers} = node
                let sceneSource = null
                let filename = null
                let aliasSource = null
                if(fileReg.test(source.value)){
                    const sourceFolder = getFolder(hub.file.opts.filename)
                    filename = nPath.resolve(sourceFolder, source.value)
                }else if(alias) {
                    aliasSource = alias[source.value.match(/([^/]*)/)[0]]
                    filename = getFile(hub.file.opts.filename, source.value, aliasSource)
                }
                sceneSource = getSceneSource(filename, scene, source.value)
                if(sceneSource || aliasSource){
                    const declarations = types.ImportDeclaration(specifiers, types.StringLiteral(sceneSource || filename))
                    path.replaceWith(declarations)
                }
            }
        }
    }
}