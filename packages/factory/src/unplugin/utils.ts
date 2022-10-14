import type { CallExpression, Node, ObjectExpression, Statement } from '@babel/types'
import { DEFINE_FACTORY } from './constants'

export function isCallOf(node: Node | null | undefined, test: string | ((id: string) => boolean)): node is CallExpression {
  return !!(
    node &&
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    (typeof test === 'string' ? node.callee.name === test : test(node.callee.name))
  )
}

export const filterMacro = (stmts: Statement[]) => {
  return stmts
    .map((raw: Node) => {
      let node = raw
      if (raw.type === 'ExpressionStatement') node = raw.expression
      return isCallOf(node, DEFINE_FACTORY) ? node : undefined
    })
    .filter((node): node is CallExpression => !!node)
}

export const hasPropsOrEmits = (node: ObjectExpression) =>
  node.properties.some(
    (prop) =>
      (prop.type === 'ObjectProperty' || prop.type === 'ObjectMethod') &&
      prop.key.type === 'Identifier' &&
      (prop.key.name === 'props' || prop.key.name === 'emits')
  )
