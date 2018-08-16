const config = require('../config')
const {
  projectSlug,
  mkdir,
  cd,
  touch,
  spawn,
  writeToml,
  readToml,
  tomlDate
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
  await cd(_projectSlug)

  await mkdir('src')
  await touch('src/__init__.py')

  // init project
  await spawn('poetry init -n -q')
  await spawn(`poetry add ${dependencies.join(' ')}`)

  // add project metadata
  await writeToml('pyproject.toml', {
    ...await readToml('pyproject.toml'),
    name,
    date: tomlDate(date)
  })

  if (run) {
    const file = `0-${_projectSlug}.ipynb`
    await cp(
      config.templates.notebook,
      file
    )
    await spawn(`poetry run jupyter lab ${file}`)
  }
}
