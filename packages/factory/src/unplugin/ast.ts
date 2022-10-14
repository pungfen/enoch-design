import { babelParse as _babelParse, walkIdentifiers } from '@vue/compiler-sfc'

import type { Node } from '@babel/types'

export function checkInvalidScopeReference(node: Node | undefined, method: string, setupBindings: string[]) {
  if (!node) return
  walkIdentifiers(node, (id) => {
    if (setupBindings.includes(id.name))
      throw new SyntaxError(
        `\`${method}()\` in <script setup> cannot reference locally ` +
          `declared variables (${id.name}) because it will be hoisted outside of the ` +
          `setup() function.`
      )
  })
}
