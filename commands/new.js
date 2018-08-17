const config = require('../config')
const {
  projectSlug,
  mkdir,
  copyFile,
  touch,
  spawn,
  withChdir,
  tomlFileDeepAssign
} = require('../src/new')

const dependencies = [
  'tornado="<5"',
  'ipython',
  'jupyterlab',
  'numpy',
  'pandas',
  'matplotlib',
  'altair'
]

module.exports = async ({ name, run }) => {
  const _projectSlug = await projectSlug(name)

  // create project directory
  await mkdir(_projectSlug)

  await withChdir(_projectSlug, async () => {
    await mkdir('src')
    await touch('src/__init__.py')

    // init project
    await spawn('poetry init -n -q')
    await spawn(`poetry add ${dependencies.join(' ')}`)

    // add project metadata
    await tomlFileDeepAssign('pyproject.toml', {
      tool: { pandora: {
        name,
        date: new Date()
      }}
    })

    if (run) {
      const file = `0-${_projectSlug}.ipynb`
      await copyFile(
        config.templates.notebook,
        file
      )
      await spawn(`poetry run jupyter lab ${file}`)
    }
  })
}
