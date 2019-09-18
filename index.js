const plugins = require('./plugins')
const { sceneSourceBuild } = require('./utils')

module.exports = function ({types}) {
    return {
        visitor: {
            ImportDeclaration(path, { opts = {} }){
                const { node, hub } = path
                const { scene = process.env.SCENE, alias }  = opts
                if(!node || !hub || !scene) return
                const { source, specifiers} = node
                const {sceneSource, aliasSource, filename} = sceneSourceBuild(source.value, hub.file, alias, scene)
                if(sceneSource || aliasSource){
                    const declarations = types.ImportDeclaration(specifiers, types.StringLiteral(sceneSource || filename))
                    path.replaceWith(declarations)
                }
            },
            CallExpression(path, { opts = {} }){
                const { node } = path;
                const { callee} = node;
                const { scene = process.env.SCENE, alias }  = opts
                if(node.isTrans) return
                node.isTrans = true
                if(types.isImport(callee)){
                    const declarations = plugins[node.arguments[0].type]({node, types, scene, alias, path})
                    declarations && path.replaceWith(declarations)
                }else if (callee.name === 'require'){
                    const declarations = plugins.requireMethod({node, types, scene, alias, path})
                    declarations && path.replaceWith(declarations)
                }
            }
        }
    }
}