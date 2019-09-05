const nPath = require('path')

const fileReg = /^[.]/

const getFolder = function (sourceFileName) {
    const nametoArray = sourceFileName.split('/')
    return nametoArray.splice(0,nametoArray.length - 1).join('/')
}
const getSceneSource = function (source, scene, original) {
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
                if(!node || !hub) return
                const scene = process.env.SCENE || opts.scene
                console.log('babel...', scene)
                const source = node.source
                if(scene && fileReg.test(source.value)) {
                    const specifiers = node.specifiers
                    const sourceFolder = getFolder(hub.file.opts.filename)
                    const filename = nPath.resolve(sourceFolder, source.value)
                    const sceneSource = getSceneSource(filename, scene, source.value)
                    if(sceneSource){
                        const declarations = types.ImportDeclaration(specifiers, types.StringLiteral(sceneSource))
                        path.replaceWith(declarations)
                    }
                }
            }
        }
    }
}