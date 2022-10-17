import { walkAST } from 'ast-walker-scope'
import type { ExportDefaultDeclaration, Statement } from '@babel/types'

import { DEFINE_FACTORY } from './constants'
import { filterMacro, hasPropsOrEmits } from './utils'
import { parseSFC, addNormalScript } from './vue'
import { MagicString } from './magic-string'
import { checkInvalidScopeReference } from './ast'

export const transform = (code: string, id: string) => {
  if (!code.includes(DEFINE_FACTORY)) return

  const sfc = parseSFC(code, id)

  if (!sfc.scriptSetup) return

  const { script, scriptSetup, scriptCompiled } = sfc

  const setupOffset = scriptSetup.loc.start.offset

  // 判断是否存在factory以及factory的重复性
  const nodes = filterMacro(scriptCompiled.scriptSetupAst as Statement[])
  if (nodes.length === 0) return
  else if (nodes.length > 1) throw new SyntaxError(`duplicate ${DEFINE_FACTORY}() call`)

  if (script) checkDefaultExport(scriptCompiled.scriptAst as any)

  const setupBindings = scriptCompiled.scriptSetupAst ? getIdentifiers(scriptCompiled.scriptSetupAst as any) : []

  const s = new MagicString(code)

  const [node] = nodes
  const [arg] = node.arguments

  if (arg) {
    const normalScript = addNormalScript(sfc, s)
    const scriptOffset = normalScript.start()

    s.appendLeft(scriptOffset, `\nimport { defineComponent as _defineComponent } from 'vue';`)
    s.appendLeft(scriptOffset, `\nexport default /*#__PURE__*/ _defineComponent(\n`)

    // if (arg.type === 'ObjectExpression' && hasPropsOrEmits(arg))
    //   throw new SyntaxError(`${DEFINE_FACTORY}() please use defineProps or defineEmits instead.`)

    // checkInvalidScopeReference(arg, DEFINE_FACTORY, setupBindings)

    console.log(s.toString())
    s.moveNode(arg, scriptOffset, { offset: setupOffset })
    console.log(s.toString())

    // removes defineFactory()
    s.remove(setupOffset + node.start!, setupOffset + arg.start!)
    s.remove(setupOffset + arg.end!, setupOffset + node.end!)

    s.appendRight(scriptOffset, '\n);\n')

    normalScript.end()
  } else {
    console.log('debug', s.original)
    // removes defineFactory()
    s.removeNode(node, { offset: setupOffset })
  }

  return getTransformResult(s, id)
}

const getTransformResult = (s: MagicString | undefined, id: string): { code: string; map: any } | undefined => {
  if (s?.hasChanged()) {
    return {
      code: s.toString(),
      get map() {
        return s.generateMap({
          source: id,
          includeContent: true,
          hires: true
        })
      }
    }
  }
}

const checkDefaultExport = (stmts: Statement[]) => {
  const hasDefaultExport = stmts.some((node): node is ExportDefaultDeclaration => node.type === 'ExportDefaultDeclaration')
  if (hasDefaultExport) throw new SyntaxError(`${DEFINE_FACTORY} cannot be used with default export within <script>.`)
}

const getIdentifiers = (stmts: Statement[]) => {
  let ids: string[] = []
  walkAST(
    {
      type: 'Program',
      body: stmts,
      directives: [],
      sourceType: 'module',
      sourceFile: ''
    },
    {
      enter(node) {
        if (node.type === 'BlockStatement') {
          this.skip()
        }
      },
      leave(node) {
        if (node.type !== 'Program') return
        ids = Object.keys(this.scope)
      }
    }
  )

  return ids
}
