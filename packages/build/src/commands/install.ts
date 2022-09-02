import consola from 'consola'

export async function install() {
  consola.info('Install Dependencies\n')

  try {
    await console.log('')
  } catch (err) {
    consola.error('install failed')
    throw err
  }
}
