import { writeFileSync } from 'node:fs'

import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc'
import MagicStringBase from 'magic-string'

import type { SFCParseResult } from '@vue/compiler-sfc'

class MagicString extends MagicStringBase {}

const DEFINE_FACTORY = 'defineFactory'

const record = (filename: string, content: string, format?: boolean) => {
  writeFileSync(`./${filename}`, content, { encoding: 'utf-8' })
}

const transformTemplate = (sfc: SFCParseResult) => {}

const transformScript = (sfc: SFCParseResult) => {}

export const transform = (code: string, id: string) => {
  if (!code.includes(DEFINE_FACTORY)) return

  const sfc = parse(code, { filename: id })
  record('sfc', JSON.stringify(sfc.descriptor.template))
  if (!sfc.descriptor.scriptSetup) return

  transformScript(sfc)

  transformTemplate(sfc)

  const script_compiled = compileScript(sfc.descriptor, { id })
  if (!script_compiled || !script_compiled.scriptSetupAst) return
  const start = script_compiled.loc.start
  const end = script_compiled.loc.end

  record('script_compiled', JSON.stringify(script_compiled))

  const ms = new MagicString(code)

  let cfg: string = ''

  for (const node of script_compiled.scriptSetupAst) {
    switch (node.type) {
      case 'ExpressionStatement':
        const expression = node.expression
        if (expression.type === 'CallExpression' && expression.callee.type === 'Identifier' && expression.callee.name === DEFINE_FACTORY) {
          const [_config, _options] = expression.arguments
          if (_config.type === 'ObjectExpression' && _config.properties) {
            cfg = ms.snip(start.offset + _config.start!, start.offset + _config.end!).toString()
          }
          ms.remove(node.start! + start.offset, node.end! + start.offset)
        }
        break
    }
  }

  if (cfg) {
    ms.prependLeft(
      start.offset,
      `
        \nimport { block, reactive as fr } from '@enochfe/core';
        \nconst origin = block(${cfg});
        \nconst factory = fr(origin);
      `
    )
  }

  record('result', JSON.stringify(ms.toString()))

  return (
    (ms.hasChanged() && {
      code: ms.toString(),
      get map() {
        return ms.generateMap({
          source: id,
          includeContent: true,
          hires: true
        })
      }
    }) ||
    undefined
  )
}
