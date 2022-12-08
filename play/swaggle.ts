import { writeFileSync, existsSync, lstatSync, mkdirSync } from 'node:fs'
import { cwd } from 'node:process'
import { resolve, relative } from 'node:path'

import fetch from 'node-fetch'
import MagicStringBase from 'magic-string'
import prettier, { type Options as PrettierOptions } from 'prettier'
import parserTypescript from 'prettier/parser-typescript.js'

interface ResourceOptions {
  name: string
  domain: string
}

interface Options {
  ext?: 'd.ts' | 'ts'
  output?: string
  resources: ResourceOptions[]
  prettier?: Pick<PrettierOptions, 'semi' | 'singleQuote'>
}

type ResolvedOptions = Required<
  Options & {
    prettier: Pick<PrettierOptions, 'parser' | 'plugins'>
  }
>

const userOptions: Options = {
  resources: [
    { name: 'enocloud', domain: 'http://47.97.115.166:18190' },
    { name: 'enospray', domain: 'http://47.97.115.166:18191' },
    { name: 'enoquote', domain: 'http://47.97.115.166:18192' }
  ]
}

const defaultOptions: ResolvedOptions = {
  ext: 'd.ts',
  output: 'definitions',
  resources: [],
  prettier: {
    semi: false,
    singleQuote: true,
    parser: 'typescript',
    plugins: [parserTypescript]
  }
}

const getResolvedOptions = (options: Options): ResolvedOptions => {
  const resolved = Object.assign({}, defaultOptions, options) as ResolvedOptions
  return resolved
}

interface RequestOptions {
  method?: 'get' | 'post'
  url: string
}

interface Definition {
  properties: Record<string, { description?: string; type?: 'string' | 'integer' | 'array' | 'number'; $ref?: string; items?: { $ref: string } }>
  title: string
  type: 'string' | 'object'
  required?: string[]
}

type ContextDocDefinition = Record<string, Definition>

interface Schema {
  $ref?: string
}

interface Parameters {
  name: string
  description?: string
  in: 'query' | 'body' | 'path'
  required: boolean
  type: 'array' | 'string' | 'integer' | 'number' | 'boolean'
  collectionFormat?: 'multi'
  items?: { type: 'string' | 'integer'; format?: string; enum?: string[] }
  enum?: string[]
  schema?: Schema
}

type contextDocPaths = Record<
  'get' | 'post' | 'put' | 'delete',
  {
    description: string
    operationId: string
    parameters: Parameters[]
    responses: Record<string, { description?: string; schema?: Schema }>
    summary: string
    tags: string[]
  }
>

interface Doc {
  definitions?: ContextDocDefinition
  info: { title: string; description: string }
  paths?: Record<string, contextDocPaths>
  tags: { name: string; description: string }[]
  resource: ContextResource<ResourceOptions>
}

interface ContextDoc extends Doc {}

interface ContextResource<OP> {
  name: string
  url: string
  options: OP
}

const request = async <T = unknown>(options: RequestOptions): Promise<T> => {
  try {
    const res: any = await fetch(options.url, { method: options.method || 'get' }).then((res) => res.json())
    return Promise.resolve(res as T)
  } catch (err) {
    return Promise.reject(err)
  }
}

class MagicString extends MagicStringBase {}

const options = getResolvedOptions(userOptions)
const root = cwd()

class Context {
  options: ResolvedOptions

  root = root

  resources: ContextResource<ResourceOptions>[][] = []
  docs: ContextDoc[] = []

  constructor(private rawOptions: ResolvedOptions) {
    this.options = rawOptions
  }

  async _getSwaggleResource(options: ResourceOptions) {
    try {
      const resources = await request<ContextResource<ResourceOptions>[]>({ url: `${options.domain}/swagger-resources` })
      resources.forEach((resource) => (resource.options = options))
      return Promise.resolve(resources)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async getSwaggleResources() {
    const tasks: Array<Promise<ContextResource<ResourceOptions>[]>> = this.options.resources.map(this._getSwaggleResource)

    try {
      this.resources = await Promise.all(tasks)
      return Promise.resolve(this.resources)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async _getSwaggleDoc(resource: ContextResource<ResourceOptions>) {
    try {
      const doc = await request<ContextDoc>({ url: resource.options.domain + resource.url })
      doc.resource = resource
      return Promise.resolve(doc)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async getSwaggleDocs() {
    const tasks = this.resources.reduce((tasks, resources) => {
      tasks.push(...resources.map(this._getSwaggleDoc))
      return tasks
    }, [] as Promise<ContextDoc>[])

    try {
      this.docs = await Promise.all(tasks)
      return Promise.resolve(this.docs)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async run() {
    await this.getSwaggleResources()
    await this.getSwaggleDocs()
  }
}

const upCaseWord = (str: string) => str.toLocaleUpperCase()
const upCaseFirstWord = (str: string) => str.slice(0, 1).toLocaleUpperCase() + str.slice(1)
const camelWord = (str: string) => str.split('-').map(upCaseFirstWord).join('')

const formatDefinitions = (doc: Doc) => {
  const { definitions = {}, resource } = doc
  const ms = new MagicString('')

  const definitionsName = `${camelWord(resource.options.name)}${camelWord(resource.name)}Definitions`

  ms.append(`interface ${definitionsName} {`)

  Object.entries(definitions).forEach(([dtoname, dtoConfig]) => {
    const { properties, type, required = [] } = dtoConfig

    if (type === 'object') {
      ms.append(`'${dtoname}':`).append('{')

      if (properties) {
        Object.entries(properties).forEach(([prop, propConfig]) => {
          const { description, type, $ref, items } = propConfig

          if (description) ms.append(`\n/** ${description} */\n`)

          ms.append(required.includes(prop) ? `'${prop}'` : `'${prop}'?`).append(':')

          if (type) {
            switch (type) {
              case 'array':
                if (items?.$ref) {
                  ms.append(`${definitionsName}['${items.$ref.replace('#/definitions/', '')}'][];`)
                } else {
                  ms.append('unknown[];')
                }
                break
              case 'string':
                ms.append('string;')
                break
              case 'number':
              case 'integer':
                ms.append(prop.toLocaleLowerCase().includes('id') ? 'string | number;' : 'number;')
                break
              default:
                ms.append('unknown;')
                break
            }
          } else if ($ref) {
            ms.append(`${definitionsName}['${$ref.replace('#/definitions/', '')}'];`)
          }
        })
      }

      ms.append('};')
    }
  })

  ms.append('}')

  return prettier.format(ms.toString(), options.prettier)
}

const formatPaths = (doc: Doc) => {
  const { paths = {}, resource } = doc
  const ms = new MagicString('')

  const definitionsName = `${camelWord(resource.options.name)}${camelWord(resource.name)}Definitions`
  const actionName = `${camelWord(resource.options.name)}${camelWord(resource.name)}Actions`

  const formatPatameters = (parameters: Parameters[], ms: MagicString, _in: Parameters['in']) => {
    const params = parameters.filter((param) => param.in === _in)

    if (params.length) {
      let index = 0
      let skip = false

      ms.append(_in).append(':')

      if (_in === 'body') {
        ms.append(`${definitionsName}['${params[0].schema?.$ref?.replace('#/definitions/', '')}'];`)
      } else {
        ms.append('{')

        params.forEach((param, i) => {
          index = i

          let { description, name, type, required, enum: _enum, items = { type: 'string' } } = param

          if (description) ms.append(`\n/** ${description} */\n`)

          if (skip && name.endsWith('.type')) return
          if (skip && name.endsWith('.message')) return
          if (skip && name.endsWith('.description')) return

          type = type === 'integer' ? 'number' : type

          if (name.endsWith('.code')) {
            const istruth = (valid: string) => ++index && params[index].name.endsWith(valid)
            if (istruth('.type') && istruth('.message') && istruth('.description')) {
              skip = true
              name = name.replace('.code', '')
              ms.append(required ? `'${name}':` : `'${name}'?:${type};`)
              return
            }
          }

          skip = false
          ms.append(required ? `'${name}':` : `'${name}'?:`)

          switch (type) {
            case 'string':
            case 'number':
            case 'boolean':
              ms.append(name.toLocaleLowerCase().includes('id') ? `string | ${type};` : `${type};`)
              break
            case 'array':
              if (items.type === 'string') {
                if (items.enum) {
                  ms.append(`Array<${items.enum.map((e) => `"${e}"`).join('|')}>;`)
                } else {
                  ms.append('string[];')
                }
              } else if (items.type === 'integer') {
                ms.append('number[];')
              }
              break
          }
        })
        ms.append('};')
      }
    }
  }

  ms.append(`interface ${actionName} {`)

  Object.entries(paths).forEach(([path, pathConfig]) => {
    if (path.startsWith('/api')) return
    Object.entries(pathConfig).forEach(([key, keyConfig]) => {
      const { description, parameters, responses } = keyConfig
      if (description) ms.append(`\n/** ${description} */\n`)
      ms.append(`'${upCaseWord(key)} ${path.replace('{', ':').replace('}', '')}':`).append('{')

      if (parameters) {
        ms.append('parameters:{')
        formatPatameters(parameters, ms, 'query')
        formatPatameters(parameters, ms, 'body')
        formatPatameters(parameters, ms, 'path')
        ms.append('};')
      }

      if (responses) {
        ms.append('responses:{')

        Object.entries(responses).forEach(([responsesStatus, responsesConfig]) => {
          if (responsesConfig.description) ms.append(`\n/** ${responsesConfig.description} */\n`)
          ms.append(responsesStatus).append(':')
          switch (responsesStatus) {
            case '200':
              if (responsesConfig.schema?.$ref) {
                ms.append('{')
                  .append('schema')
                  .append(':')
                  .append(`${definitionsName}['${responsesConfig.schema?.$ref.replace('#/definitions/', '')}'] };`)
              } else {
                ms.append('unknown;')
              }
              break
            default:
              ms.append('unknown;')
          }
        })

        ms.append('};')
      }

      ms.append('};')
    })
  })

  ms.append('}')

  return prettier.format(ms.toString(), options.prettier)
}

const format = (doc: Doc) => {
  const definitions = formatDefinitions(doc)
  const paths = formatPaths(doc)
  return definitions + paths
}

const run = (doc: Doc) => {
  const timeStart = process.hrtime()
  const dirPath = resolve(root, `${options.output}/${doc.resource.options.name}`)
  const isDir = existsSync(dirPath) && lstatSync(dirPath).isDirectory()
  if (!isDir) mkdirSync(dirPath, { recursive: true })

  const filePath = `${dirPath}/${doc.resource.name}.${options.ext}`

  const code = format(doc)

  writeFileSync(filePath, code, 'utf8')

  const timeEnd = process.hrtime(timeStart)
  const time = timeEnd[0] + Math.round(timeEnd[1] / 1e6)

  console.log('\x1B[36m%s\x1B[0m', '🚀 ' + doc.info.title + ' ' + doc.info.description + ' ' + relative(root, filePath) + ' ' + time + 'ms')
}

const ctx: Context = new Context(options)
await ctx.run()
for (const doc of ctx.docs) run(doc)
