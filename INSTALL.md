# Setup
To configure the bot, you will need to set up a slack incoming webhook, a slack slash command, and a JIRA webhook.

Variables that are used in multiple places are annotated like this: [`variable-name`]

## Initial Deploy
If you need to change the region from eu-west-2 (London), edit it in `serverless.yml` now.

Install dependencies and run the first deploy:
```#!bash
yarn install
yarn deploy
```
The functions created won't work yet, but take note of the URLs. There should be two of them:
```
POST https://endpointname.execute-api.eu-west-2.amazonaws.com/dev/message
POST https://endpointname.execute-api.eu-west-2.amazonaws.com/dev/jira
```
Don't try to run anything yet - the config is missing and it will fail.

## Slack: Incoming Webhook
Create a new [Incoming Webhook](https://get.slack.help/hc/en-us/articles/115005265063-Incoming-WebHooks-for-Slack),
with the following configuration:

* **Post to Channel**: The channel in which the bug watcher will notify users of a closed bug. [`channel`]
* **Webhook URL**: Take note of this for [`slackUrl`]
* **Descriptive Label**: Optional.
* **Customize Name**: Set a friendly username for this integration. [`username`]
* **Customize Icon**: Optional. [`icon`]

## Slack: Slash Command
Create a new [Slash Command](https://get.slack.help/hc/en-us/articles/201259356-Slash-commands),
with the following configuration:
* **Command**: Any useful command. The recommended value is `/watch-bug`.
* **URL**: Set this to the `/message` URL from the initial setup.
* **Method**: POST.
* **Token**: Take note of this for [`commandToken`].
* **Customize Name**: Set this to `username`.
* **Customize Icon**: Optional, but if you're setting it make sure it's the same as `icon`.
* **Autocomplete help text**:
    * **Show this command in the autocomplete list**: Optional, recommended yes.
    * **Description**: e.g. _Watch a bug for a user or users_
    * **Usage hint**: e.g. _CPD-1234 [@user1, @user2]_ (`CPD-` is the `bugPrefix` property)
* **Escape channels, users, and links**: On.
* **Descriptive label**: Optional.
* **Translate User IDs**: On.

## Jira: WebHook
Create a new JIRA webhook - the fastest way to get to the right config is by going to `https://your-org.atlassian.net/plugins/servlet/webhooks`.

Set the following settings:
* **URL**: Set this to the `/jira` URL from the initial setup.

You can filter issues any way you like; our (City Pantry's) setup is:
```
issuetype = BUG and project = CPD
```

You want to be listening to the following events:
* **Issue**: created, updated, deleted
* **Comment**: created, updated, deleted

## Jira: Auth Token
We will be accessing the JIRA API via an auth token for a valid user, as this is the easiest way to get REST access.

Log in as the user you want to use for this bot (they must have rights to add and edit comments on issues). Their usename will be [`jiraUser`].

Then go to https://id.atlassian.com/manage/api-tokens and create an API token. Copy the value as [`jiraToken`].

## Config file
Copy the `config/config.sample.ts` to `config/config.ts` and set each property to the one you noted during the setup.
