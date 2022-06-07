import consola from 'consola'
import ora from 'ora'
import { copy } from 'fs-extra'
import { installDependencies, SRC_DIR, ES_DIR, LIB_DIR } from '../shared'

const copySourceCode = async () => {
  return Promise.all([copy(SRC_DIR, ES_DIR), copy(SRC_DIR, LIB_DIR)])
}

const tasks = [
  {
    text: 'Copy Source code',
    task: copySourceCode()
  }
]

const runBuildTasks = async () => {
  for (let i = 0; i < tasks.length; i++) {
    const { task, text } = tasks[i]
    const spinner = ora(text).start()

    try {
      // @ts-ignore
      await task()
      spinner.succeed(text)
    } catch (err) {
      spinner.fail(text)
      consola.log(err)
      throw err
    }
  }
}

export const build = async () => {
  try {
    await installDependencies()
    await runBuildTasks()
  } catch (err) {
    consola.error('Build failed')
    process.exit(1)
  }
}
