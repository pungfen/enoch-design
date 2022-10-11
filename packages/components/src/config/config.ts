import type { CSSProperties } from 'vue'

import type { Colors } from '../hooks/use-theme'

interface ButtonTheme extends CSSProperties {}

export type Theme = {
  colors?: Colors
  button?: ButtonTheme
}
