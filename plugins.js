const { sceneSourceBuild } = require('./utils')

module.exports = {
  TemplateLiteral({node, scene, types: t, template}){ 
    const buildDeclarations = template('SCEDEC.catch(() => SCEINDEC).catch(() => OLDDEC)')
    let { expressions, quasis } = node.arguments[0]
    const secneQuasis = [...quasis]
    secneQuasis.splice(-1, 1, t.TemplateElement({raw: `.${scene}`, cooked: `.${scene}`}))
    let SCEDEC = t.CallExpression(
      t.Import(),
      [t.TemplateLiteral(
        secneQuasis,
        expressions
       )
      ]
    )
    SCEDEC.isTrans = true;
    const secneIndexQuasis = [...quasis]
    secneIndexQuasis.splice(-1, 1, t.TemplateElement({raw: `/index.${scene}`, cooked: `/index.${scene}`}))
    let SCEINDEC = t.CallExpression(
      t.Import(),
      [t.TemplateLiteral(
        secneIndexQuasis,
        expressions
       )
      ]
    )
    SCEINDEC.isTrans = true
    let declarations = buildDeclarations({
      SCEDEC,
      SCEINDEC,
      OLDDEC: node
    })
    declarations.isTrans = true
    return declarations
  },
  StringLiteral({node, scene, types: t, path, alias}) {
    const { hub: {file} } = path
    const pathArg = node.arguments[0].value
    const {sceneSource, aliasSource, filename} = sceneSourceBuild(pathArg, file, alias, scene)
    let declarations
    const sceneArg = { ...node.arguments[0], value: sceneSource || filename }
    if(sceneSource || aliasSource){
        declarations = t.CallExpression(t.Import(), [sceneArg])
        declarations.isTrans = true
    }
    return declarations
  },
  requireMethod({node, scene, types: t, path, alias}){
    const { hub: {file} } = path
    const pathArg = node.arguments[0].value
    if(!pathArg) return
    const {sceneSource, aliasSource, filename} = sceneSourceBuild(pathArg, file, alias, scene)
    let declarations
    if(sceneSource || aliasSource){
        declarations = t.CallExpression(t.Identifier('require'), [t.StringLiteral(sceneSource || filename)])
    }
    return declarations
  }
}