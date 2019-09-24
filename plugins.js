const { sceneSourceBuild } = require('./utils')

module.exports = {
  TemplateLiteral({node, scene, types: t}){   
    let { expressions, quasis } = node.arguments[0]
    const secneIndexQuasis = [...quasis]
    secneIndexQuasis.splice(-1, 1, t.TemplateElement({raw: `/index.${scene}`, cooked: `/index.${scene}`}))
    let sceneIndexDeclarations = t.CallExpression(
      t.Import(),
      [t.TemplateLiteral(
        secneIndexQuasis,
        expressions
       )
      ]
    )
    sceneIndexDeclarations.isTrans = true
    const indexArrowFunction = t.ArrowFunctionExpression(
      [],
      sceneIndexDeclarations
    )
    const secneQuasis = [...quasis]
    secneQuasis.splice(-1, 1, t.TemplateElement({raw: `.${scene}`, cooked: `.${scene}`}))
    let sceneDeclarations = t.CallExpression(
      t.Import(),
      [t.TemplateLiteral(
        secneQuasis,
        expressions
       )
      ]
    )
    sceneDeclarations.isTrans = true;
    let indexDeclarations = t.CallExpression(
      t.MemberExpression(
        sceneDeclarations,
        t.Identifier('catch')
      ),
      [indexArrowFunction]
    )
    indexDeclarations.isTrans = true  
    const arrowFunction =  t.ArrowFunctionExpression(
      [],
      node
    )
    let declarations = t.CallExpression(
    	t.MemberExpression(
          indexDeclarations,
          t.Identifier('catch')
        ),
      [arrowFunction]
    )
    declarations.isTrans = true
    return declarations
  },
  Identifier({node, scene, types: t}) {
    const pathArg = node.arguments[0]
    let sceneDeclarations = t.CallExpression(
      t.Import(),
    	[t.TemplateLiteral(
          [
            t.TemplateElement({raw: ''}),
          	t.TemplateElement({raw: `.${scene}`})
          ],
          [pathArg]
        )
      ]
    )
    sceneDeclarations.isTrans = true
    const arrowFunction =  t.ArrowFunctionExpression(
      [],
      node
    )
    let declarations = t.CallExpression(
      t.MemberExpression(
        sceneDeclarations,
        t.Identifier('catch')
      ),
      [arrowFunction]
    )
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
        declarations.isTrans = true
    }
    return declarations
  }
}