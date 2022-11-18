import { defineFactory as _defineFactory } from './src/factory/define'

declare global {
  const defineFactory: typeof _defineFactory
}

export {}
