import type { Component, ExtractPropTypes } from 'vue'

export enum BlockType {
  DIV = 'div',
  SPAN = 'span'
}

interface ChildrenConfig {
  type?: BlockType
}

export interface Children {
  // [index: string]: ChildrenConfig
  type?: BlockType
}

export interface Props {}

export interface Options<P, C, Props = ExtractPropTypes<P>, RawBindings = Props> {
  props?: P
  children?: Children
  components?: Record<string, Component>
  mounted?: (this: RawBindings) => void
  unmounted?: (this: RawBindings) => void
}
