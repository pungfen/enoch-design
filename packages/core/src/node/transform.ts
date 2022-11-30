import { compileScript, compileTemplate, parse } from 'vue/compiler-sfc'
import MagicStringBase from 'magic-string'

import type { SFCParseResult } from 'vue/compiler-sfc'
import type { Options } from './plugin'

const DEFINE_FACTORY = 'defineFactory'

class MagicCode extends MagicStringBase {}

const transformCustomBlock = (id: string, sfc: SFCParseResult, options: Options, ms: MagicCode) => {
  if (!sfc.descriptor.customBlocks) return
  const customBlocks = sfc.descriptor.customBlocks
  for (const block of customBlocks) {
    if (block.type === 'pung' && block.lang === 'json') {
      // const blocConfig = JSON.parse(block.content)
      // ms.setConfig(blocConfig)
    }
  }
}

const transformTemplate = (id: string, sfc: SFCParseResult, options: Options, ms: MagicCode) => {
  if (!sfc.descriptor.template) return
}

const transformScript = (id: string, sfc: SFCParseResult, options: Options, ms: MagicCode) => {
  if (sfc.descriptor.scriptSetup) {
    const compiled = compileScript(sfc.descriptor, { id })
    const start = compiled.loc.start
    const end = compiled.loc.end
    let cfg: string = ''
    for (const node of compiled.scriptSetupAst!) {
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
        \nimport { block as _DF_block, proxy as _DF_proxy } from '@enochfe/core';
        \nconst _DF_BLOCK = _DF_block(${cfg});
        \nconst _DF_PROXY = _DF_proxy(_DF_BLOCK);
      `
      )
    }
  }
}

export const transform = (code: string, id: string, options: Options) => {
  if (!code.includes(DEFINE_FACTORY)) return

  const sfc = parse(code, { filename: id })
  const ms = new MagicCode(code, { filename: id })

  transformCustomBlock(id, sfc, options, ms)
  transformScript(id, sfc, options, ms)
  transformTemplate(id, sfc, options, ms)

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
