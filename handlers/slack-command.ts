import { HandlerRequest, HandlerResponse } from '../util/handler';
import { getUnique } from '../util/array';
import { jiraService } from '../services/jira.service';
import { SlackCommandBody } from '../models/slack-command-body.model';
import { slackApi } from '../api/slack.api';
import { createUser, isSameUser, parseUser, SlackUser } from '../models/slack-user.model';

export function handleSlackCommand(request: HandlerRequest, done: (response?: HandlerResponse) => void): void {
  console.log('Request:', request);

  const body = request.body as SlackCommandBody;

  if (body.token !== 'DI9lqLn5yKx709kLkOoU3obv') {
    return done({
      statusCode: 403,
      body: 'Invalid auth token'
    });
  }

  const regex = /^((?:cpd-)?\d+)(?:\s+((?:<@[a-z0-9|]+>(?:,?\s+?)?)+))?/i;
  const match = body.text.match(regex);

  if (!match) {
    return done({
      statusCode: 200,
      body: 'Could not match a bug.\nFormat: `/track-bug CPD-1234 @user1 @user2`'
    });
  }
  const issueKey = getIssueKey(match[1]);
  const users = (match[2] || '').split(/,\s+/g).filter((user) => !!user).map(parseUser);
  if (!users.length) {
    users.push(createUser(body.user_id, body.user_name));
  }

  done({
    statusCode: 200
  });

  jiraService.addUsersToIssue(issueKey, getUnique<SlackUser>(users, isSameUser))
    .then((addedUsers) => {
      slackApi.post(
        `Added ${addedUsers} ${addedUsers === 1 ? 'user' : 'users'} to issue ${issueKey}.`,
        body.response_url
      )
    }).catch((err) => {
      console.log('ERROR', err);
      slackApi.post('An error occurred.', body.response_url);
    });
}

function getIssueKey(keyOrNumber: string): string {
  if (keyOrNumber.match(/^cpd-\d+$/i)) {
    return keyOrNumber.toUpperCase();
  } else {
    return 'CPD-' + keyOrNumber;
  }
}
