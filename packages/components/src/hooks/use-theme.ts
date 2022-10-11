import { type CSSProperties, reactive, ref, computed } from 'vue'

export interface Colors {
  main?: string
  white?: string
  gray?: string
}

export type ThemeVars = Record<string, CSSProperties & Colors>

export const themeVars: ThemeVars = reactive({
  colors: {
    main: '#5469d4',
    white: '#fff',
    gray: '#BFBFBF'
  },
  button: {
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '4px'
  },
  input: {
    padding: '4px 8px',
    borderRadius: '4px'
  }
})

export const useTheme = () => {
  return { colors: computed(() => themeVars.colors), button: computed(() => themeVars.button), input: computed(() => themeVars.input) }
}
