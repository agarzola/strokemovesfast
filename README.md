#strokemovesfast.com

This repo tracks the strokemovesfast.com codebase as maintained by NDP, and associated deployment scripting as maintained by Small Batch.

To track changes to the codebase and deploy them, simply clone this repository, `cd` into the `strokemovesfast` directory and follow the instructions below.

## Tracking changes to the codebase

Since we are not maintaining the codebase, all code handed to us is thrown into the `www/` directory and committed in bulk. Be sure to commit all your changes (and/or stash changes you don’t want to deploy just yet) and push your new commits to the remote; otherwise, the deployment script will not deploy your code. This is to ensure that all code deployed to the site is tracked somewhere.

## Deployment

We use [Flightplan](https://github.com/pstadler/flightplan) to handle deployment steps, but you don’t need to install it globally. To install it as a local dependency, just run:

```
npm install
```

After you’ve made changes to the codebase inside the `www/` directory, committed them, and pushed them to the remote repository on github, deployment is easy:

```
npm run deploy
```

You’re done!

### Always track your changes

As a matter of policy, we expect all code deployed to the live server to be tracked somewhere. To this end, Flightplan will abort if you:

1. have changes that haven’t been committed; or
2. have commits that haven’t been pushed.

Flightplan will fail to deploy the site and give you a heads-up if any of the above is true.

### Access to the live server

In order for Flightplan to access the server that hosts the microsite, you’ll need to create an SSH public/private key pair (if you don’t have one already), add it to your `ssh-agent` (if you haven’t already), and ask someone with access to the live server to add your public key to the `deploy` user’s `authorized_keys` file.

We recommend you add the following lines to your `~/.ssh/config` file, especially if you have many keys:

```
Host 192.241.242.147
  HostName 192.241.242.147
  User deploy
  PreferredAuthentications publickey
  IdentityFile [path/to/private/ssh/key]
```

where `[path/to/private/ssh/key]` is the, um, path to your private SSH key.
