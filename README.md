Serverless Alexa Skills Plugin
=======

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![Build Status](https://travis-ci.org/marcy-terui/serverless-alexa-skills.svg?branch=master)](https://travis-ci.org/marcy-terui/serverless-alexa-skills)

# Description

Manage your Alexa Skills with Serverless Framework.

# Requirements

- [Serverless Framework](https://github.com/serverless/serverless) 1.0 or higher

# Installation

```sh
serverless plugin install --name serverless-alexa-skills
```

or

```sh
npm install serverless-alexa-skills
```

# Setup

#### First, you need to create a ["Security Profile"](https://developer.amazon.com/docs/login-with-amazon/security-profile.html) and configure ["Login with Amazon"](https://developer.amazon.com/ja/docs/login-with-amazon/web-docs.html).

#### Next, Check your Client ID, Client Secret and [Vendor ID](https://developer.amazon.com/mycid.html) at [Amazon developer console](https://developer.amazon.com/home.html).

See: [the step-by-step guide](https://github.com/marcy-terui/serverless-alexa-skills/wiki/How-to-get-your-%22Login-with-Amazon%22-credentials)

# Configuration

### serverless.yml

```yaml
provider:
  name: aws
  runtime: nodejs6.10

plugins:
  - serverless-alexa-skills

custom:
  alexa:
    vendorId: ${env:YOUR_AMAZON_VENDOR_ID}
    clientId: ${env:YOUR_AMAZON_CLIENT_ID}
    clientSecret: ${env:YOUR_AMAZON_CLIENT_SECRET}
    skills:
      - id: ${env:YOUR_ALEXA_SKILL_ID}
        skillManifest:
          publishingInformation:
            locales:
              en-US:
                name: test2
          apis:
            custom: {}
          manifestVersion: '1.0'
        models:
          en-US:
            interactionModel:
              languageModel:
                invocationName: hello
                intents:
                  - name: AMAZON.CancelIntent
                    samples: []
                  - name: AMAZON.HelpIntent
                    samples: []
                  - name: AMAZON.StopIntent
                    samples: []
                  - name: HelloWorldIntent
                    samples:
                    - hello
                    - say hello
                    - hello world

```

# Commands

## alexa auth
Authenticate with Amazon OAuth2.

### Caution
- **The security token expires in `1 hour`. If an authentication error occurs, please execute this command again.**
- This command creates a local web server to receive OAuth2 authentication redirects. The default port is `3000`. If you want to change the port, please change `custom.alexa.localServerPort` setting.

```shell
$ serverless alexa auth -h
Plugin: AlexaSkills
alexa auth .................... Authenticate with Amazon OAuth2
```

## alexa create
Create an Alexa Skill.

```shell
$ serverless alexa create -h
Plugin: AlexaSkills
alexa create .................. Create an Alexa Skill
    --name / -n (required) ............. Name of the skill
    --locale / -l (required) ........... First locale of the skill (e.g. "ja-JP", "en-US")
    --type / -t (required) ............. Type of the skill (e.g. "custom", "smartHome", "video")
```

## alexa delete
Delete an Alexa Skill.

```shell
$ serverless alexa delete -h
Plugin: AlexaSkills
alexa delete .................. Delete an Alexa Skill
    --id / -i (required) ............... Skill ID
```

## alexa manifests
List your Alexa Skill Manifests.

```shell
$ serverless alexa manifests -h
Plugin: AlexaSkills
alexa manifests ............... List your Alexa Skill Manifests
```

## alexa update
Update your Alexa Skill Manifests.

```shell
$ serverless alexa update -h
Plugin: AlexaSkills
alexa update .................. Update your Alexa Skill Manifests
    --dryRun / -d ...................... Dry run (Only output the diff)
```

## alexa models
List your Alexa Interaction Models.

```shell
$ serverless alexa models -h
Plugin: AlexaSkills
alexa models .................. List your Alexa Interaction Models
```

## alexa build
Update and buid your Alexa Interaction Models.

```shell
$ serverless alexa build -h
Plugin: AlexaSkills
alexa build ................... Update and buid your Alexa Interaction Models
    --dryRun / -d ...................... Dry run (Only output the diff)
```

# How to use
See: [the post of Serverless Blog](https://serverless.com/blog/how-to-manage-your-alexa-skills-with-serverless/)


Development
-----------

-   Source hosted at [GitHub](https://github.com/marcy-terui/serverless-alexa-skills)
-   Report issues/questions/feature requests on [GitHub
    Issues](https://github.com/marcy-terui/serverless-alexa-skills/issues)

Pull requests are very welcome! Make sure your patches are well tested.
Ideally create a topic branch for every separate change you make. For
example:

1.  Fork the repo
2.  Create your feature branch (`git checkout -b my-new-feature`)
3.  Commit your changes (`git commit -am 'Added some feature'`)
4.  Push to the branch (`git push origin my-new-feature`)
5.  Create new Pull Request

Authors
-------

Created and maintained by [Masashi Terui](https://github.com/marcy-terui) (<marcy9114@gmail.com>)

License
-------

MIT License (see [LICENSE](https://github.com/marcy-terui/serverless-alexa-skills/blob/master/LICENSE.txt))
