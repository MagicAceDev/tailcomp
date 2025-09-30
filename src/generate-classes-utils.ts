import * as acorn from 'acorn'
import tc from './index.js'

export function getTCcalls(fileContents: string): string[] {
  const tcCalls = fileContents.match(/tc\(([^)]+)\)/g)
  return tcCalls || []
}

/**
 * Converts an Acorn AST node to a JavaScript object/value
 * For conditional classes, sets all conditions to true to extract all possible classes
 */
function astToObject(node: any): any {
  if (!node) return null

  switch (node.type) {
    case 'ObjectExpression':
      const obj: any = {}
      for (const prop of node.properties) {
        if (prop.type === 'Property' || prop.type === 'ObjectProperty') {
          let key: string
          if (prop.key.type === 'Identifier') {
            key = prop.key.name
          } else if (prop.key.type === 'Literal') {
            key = String(prop.key.value)
          } else {
            continue
          }

          obj[key] = astToObject(prop.value)
        }
      }
      return obj

    case 'Literal':
      // Return string literals as-is, convert all other literals to true
      return typeof node.value === 'string' ? node.value : true

    case 'Identifier':
    case 'ConditionalExpression':
    case 'LogicalExpression':
    case 'BinaryExpression':
    case 'UnaryExpression':
    case 'MemberExpression':
    case 'CallExpression':
    case 'TemplateLiteral':
    case 'ArrowFunctionExpression':
      // For any dynamic expression, return true to include the class
      return true

    default:
      // For any unknown node type, return true to be safe
      return true
  }
}

export function generateClassString(tcCalls: string[]): string {
  const allClasses = tcCalls
    .map((call) => {
      const argString = call.slice(3, -1)

      try {
        const ast = acorn.parseExpressionAt(argString, 0, {
          ecmaVersion: 2020,
          sourceType: 'module',
        })

        const obj = astToObject(ast)
        return tc(obj)
      } catch (e) {
        console.warn('Failed to parse tc call:', argString.slice(0, 50) + '...')
        console.warn('Error:', e)
        return ''
      }
    })
    .join(' ')
    .split(' ')
    .filter((c) => c)

  const uniqueClasses = [...new Set(allClasses)].join(' ')
  return uniqueClasses
}
