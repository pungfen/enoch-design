# `@enochfe/tsconfig`

> Enoch [typescriptlang](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) TSConfigs.

## Usage

**Install**:

```sh
$ pnpm add @enochfe/tsconfig -D
```

Add one of the available configurations to your `tsconfig.json`:

The base configuration (runtime-agnostic):

```json
{
  "extends": "@enochfe/tsconfig/base.json"
  // ...
}
```

Configuration for Browser environment:

```json
{
  "extends": "@enochfe/tsconfig/vue.json"
  // ...
}
```

Configuration for Node environment:

```json
{
  "extends": "@enochfe/tsconfig/tsconfig.node.json"
  // ...
}
```
