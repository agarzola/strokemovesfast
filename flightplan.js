var plan = require('flightplan')

var site = 'strokemovesfast'
var username = 'deploy'

var deployment = `${site}-${new Date().getTime()}`

// configure remote
plan.target('uhs', [
  {
    host: '192.241.242.147',
    username: username,
    agent: process.env.SSH_AUTH_SOCK
  }
])

// local commands
plan.local(local => {
  local.log('Checking git status')
  var commit_status = local.exec('git status -b --porcelain', { silent: true })
  if (commit_status.stdout !== null) {
    // abort if HEAD different from upstream remote
    if (commit_status.stdout.search(/\[/) >= 0) {
      plan.abort('Error: Current HEAD is different from remote repo. Please push any commits you may have locally.')
    }

    // abort if uncommitted changes found
    if (commit_status.stdout.search(/(\sM\s|\s\?\?\s)/) >= 0) {
      plan.abort('Error: Uncommitted file changes found. Please commit your changes and push them to the remote repository.')
    }
  }

  local.log('Copy files to remote host')
  var files_to_copy = local.exec('find www -type f \\( ! -name ".DS_Store" \\)',
    { silent:true })
  local.transfer(files_to_copy, `/tmp/${deployment}`)
})

// remote commands
plan.remote(remote => {
  remote.log('Move everything out of www directory')
  remote.exec(`mv /tmp/${deployment}/www/* /tmp/${deployment}/ && rm -rf /tmp/${deployment}/www`)

  remote.log('Move deployment to home directory')
  remote.sudo(`cp -Rp /tmp/${deployment} ~`, { user: username })
  remote.exec(`rm -rf /tmp/${deployment}`)

  remote.log('Point www to new deployment')
  remote.sudo(`ln -snf ~/${deployment} /var/www/${site}.com/html`, {user: username })
})
