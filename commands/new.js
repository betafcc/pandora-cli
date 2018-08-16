const slugify = require('@sindresorhus/slufigy')


module.exports = async ({ name, run }) => {
  const _projectSlug = await projectSlug(name)

  # create project directory
  await mkdir(_projectSlug)
  await cd(_projectSlug)

  await mkdir('src')
  await touch('src/__init__.py')

  # init project
  await spawn('poetry init -n -q')
  await spawn(`poetry add ${dependencies.join(' ')}`)

  # add project metadata
  await writeToml('pyproject.toml', {
    ...await readToml('pyproject.toml'),
    name,
    date: tomlDate(date),
  })

  if (!!run) {
    const file = `0-${_projectSlug}.ipynb`
    await cp(
      config.templates.notebook,
      file,
    )
    await shell(`poetry run jupyter lab ${file}`)
  }
}


const projectSlug = (name) =>
  `${isoDate()}-${slugify(await gitInitials())}-${slugify(name)}`


const dependencies = [
  'tornado="<5"',
  'ipython',
  'jupyterlab',
  'numpy',
  'pandas',
  'matplotlib',
  'altair',
]


const gitInitials = async () =>
  (await shell('git config user.name'))
    .split(/\s+/)
    .map(s => s[0])
    .join('')
