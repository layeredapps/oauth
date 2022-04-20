# Documentation for OAuth module

#### Shortcuts

- [Documentation website](https://layeredapps.github.io)
- [Module documentation](https://layeredapps.github.io/oauth-module)

#### Index

- [Introduction](#introduction)
- [Import this module](#import-this-module)
- [Github repository](https://github.com/layeredapps/oauth)
- [NPM package](https://npmjs.org/layeredapps/oauth)

# Introduction

Dashboard bundles everything a web app needs, all the "boilerplate" like signing in and changing passwords, into a parallel server so you can write a much smaller web app.

[OAuth](https://www.maxmind.com/en/home) provide authentication options for websites using the Oauth standard, so users can "sign in with" GitHub and other compatible services rather than by username/password.

When the user authenticates with an OAuth service they can optionally be required to complete a profile with contact or other information.

Sessions created with OAuth do not expire until the user signs out or the session is expired in the user / administrator options.

Accounts created with OAuth cannot `change username`, `change password`, or use `reset codes`.  If they navigate to these routes the requests are intercepted by a server handler and redirected to a conversion form that can convert an OAuth account to username/password.

## Import this module

Install the module with NPM:

    $ npm install @layeredapps/oauth

Edit your `package.json` to activate the module:

    "dashboard": {
      "modules": [
        "@layeredapps/oauth"
      ]
    }

Edit your `package.json` to include the scripts for provider buttons which injects a `<div id="oauth-buttons" />` into the `signin` and `register` pages:

    "dashboard": {
      "content": [
        "@layeredapps/oauth/src/content/register-buttons.js",
        "@layeredapps/oauth/src/content/signin-buttons.js"
      ]
    }
    
Add provider modules, eg:

    $ npm install @layeredapps/oauth-github

And configure the provider modules:

    "dashboard": {
      "modules": [
        "@layeredapps/oauth",
        "@layeredapps/oauth-github"
      ]
      "server": [
        "@layeredapps/oauth/src/server/redirect-unused.js",
      ],
      "content": [
        "@layeredapps/oauth/src/content/register-buttons.js",
        "@layeredapps/oauth/src/content/signin-buttons.js",
        "@layeredapps/oauth-github/src/content/error-templates.js",
        "@layeredapps/oauth-github/src/content/register-button.js",
        "@layeredapps/oauth-github/src/content/signin-button.js"
      ]
    }

Optionally require the user complete a profile with Dashboard's configuration setting:

    REQUIRE_PROFILE=true
    USER_PROFILE_FIELDS=....
