const childProcess = require('child_process')
const {promisify} = require('util')

const exec = promisify(childProcess.exec)
const {writeFile, readFile} = require('fs').promises

const tmp = require('tmp')
const toml = require('@iarna/toml')
const deepMerge = require('@betafcc/deep-merge')
const prompt = require('inquirer').createPromptModule()

const touch = (file, options) =>
  writeFile(file, '', options)

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

const tomlFileDeepAssign = (file, obj) =>
  readFile(file)
    .then(toml.parse)
    .then(_ => deepMerge(_, obj))
    .then(toml.stringify)
    // @iarna/toml stringify gives non-optional indented output
    // this takes it off
    .then(_ => _.replace(/(\r?\n)( +)/g, '$1'))
    .then(_ => writeFile(file, _))

const withRepository = async (f, url) => {
  const {path, cleanup} = await tmpdir()

  try {
    await clone(url, path)

    // Using Promise.resolve will guarantee the function
    // will run until the end etiher if it's a promise-returning
    // one or a normal/sync. Therefore, the folder is guaranteed
    // not to be cleaned-up until them
    return await Promise.resolve(f(path))
  } finally {
    cleanup()
  }
}

const withChdir = async (path, f) => {
  const oldPath = process.cwd()
  process.chdir(path)

  try {
    return await Promise.resolve(f())
  } finally {
    process.chdir(oldPath)
  }
}

const spawn = (shellCommand, options) => {
  const process = childProcess
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
  exec,
  withRepository,
  spawn,
  isGithubUrl,
  input,
  choose,
  touch,
  withChdir,
  tomlFileDeepAssign
}
