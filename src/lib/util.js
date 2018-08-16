const child_process = require('child_process')
const {promisify} = require('util')

const readFile = promisify(require('fs').readFile)

const tmp = require('tmp')
const prompt = require('inquirer').createPromptModule()

const clone = (url, dest, quiet = true) =>
  spawn(`git clone ${url} ${dest || ''}`, {
    stdio: quiet ? 'ignore' : 'inherit'
  }).then(_ => dest)

const tmpdir = () =>
  new Promise((resolve, reject) =>
    tmp.dir({ unsafeCleanup: true }, (err, path, cleanup) =>
      (err) ? reject(err) : resolve({ path, cleanup })
    )
  )

const withRepository = async (f, url) => {
  const {path, cleanup} = await tmpdir()
  await clone(url, path)

  // Using Promise.resolve will guarantee the function
  // will run until the end etiher if it's a promise-returning
  // one or a normal/sync. Therefore, the folder is guaranteed
  // not to be cleaned-up until them
  const result = await Promise.resolve(f(path))

  cleanup()

  return result
}

const spawn = (shellCommand, options) => {
  const process = child_process
    .spawn(
      shellCommand,
      Object.assign({stdio: 'inherit', shell: true}, options)
    )

  return new Promise((resolve, reject) => {
    process.on('close', code =>
      (code === 0)
        ? resolve(code)
        : reject(code)
    )

    process.on('error', reject)
  })
}

const isGithubUrl = str =>
  !!str.match(/github/)

const input = message =>
  prompt({message, name: 'answer', type: 'input'})
    .then(r => r.answer)

const choose = (message, choices) =>
  prompt({message, choices, name: 'answer', type: 'list'})
    .then(r => r.answer)

module.exports = {
  clone,
  tmpdir,
  readFile,
  withRepository,
  spawn,
  isGithubUrl,
  input,
  choose
}
