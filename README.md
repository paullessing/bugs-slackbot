# Bug Watcher Slackbot
This is a Slackbot which allows users to express interest in issues, and they will be notified when the issue is resolved.

# Installation
See [INSTALL.md](INSTALL.md).

# Behaviour
Users can add themselves as watching a bug by using the slack command:
```
/watch-bug CPD-1234
```

They can also add other users to bugs:
```
/watch-bug CPD-1234 @user, @anotheruser
```

This will add a comment to the bug to mark it as watched.

Alternatively, it is possible to just mention slack usernames in bugs; valid formats are `@username`, `<@id|name>`, `<@idOrUsername>`.
This can happen in the bug description or in any comment.


When a bug that contains Slack-like mentions (in the description, or any comment)
is moved to a DONE resolution, the bot posts a message in a configured Slack channel,
@mentioning every user who was marked as a mention in the bug.
