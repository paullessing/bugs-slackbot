import { HandlerRequest, HandlerResponse } from '../util/handler';
import { getUnique } from '../util/array';
import { jiraService } from '../services/jira.service';
import { SlackCommandBody } from '../models/slack-command-body.model';
import { slackApi } from '../api/slack.api';
import { createUser, isSameUser, parseUser, SlackUser } from '../models/slack-user.model';
import { Lambda } from 'aws-sdk';
import { APIGatewayProxyCallback } from 'aws-lambda';

interface AddUsersToIssueBody {
  issueKey: string;
  users: SlackUser[];
  loggedInUser: SlackUser;
  responseUrl: string;
}

export async function handleSlackCommand(request: HandlerRequest, done: (response?: HandlerResponse) => void): Promise<HandlerResponse> {
  console.log('Request:', request);

  const body = request.body as SlackCommandBody;

  if (body.token !== 'DI9lqLn5yKx709kLkOoU3obv') {
    return {
      statusCode: 403,
      body: 'Invalid auth token'
    };
  }

  const regex = /^((?:cpd-)?\d+)(?:\s+((?:<@[a-z0-9|]+>(?:,?\s+?)?)+))?/i;
  const match = body.text.match(regex);

  if (!match) {
    return {
      statusCode: 200,
      body: 'Could not match a bug.\nFormat: `/track-bug CPD-1234 @user1 @user2`'
    };
  }
  const loggedInUser = createUser(body.user_id, body.user_name);
  const issueKey = getIssueKey(match[1]);
  const users = (match[2] || '').split(/,\s+/g).filter((user) => !!user).map(parseUser);
  if (!users.length) {
    users.push(loggedInUser);
  }

  const data: AddUsersToIssueBody = {
    issueKey,
    loggedInUser,
    users,
    responseUrl: body.response_url
  };

  const lambda = new Lambda();

  const params = {
    FunctionName: 'arn:aws:lambda:eu-west-2:984077873871:function:bugs-slackbot-dev-addUsersToIssue',
    InvocationType: 'Event',
    Payload: JSON.stringify(data)
  };
  console.log('About to invoke');
  await lambda.invoke(params).promise().then((a) => console.log('Invoked!', a));
}

function getIssueKey(keyOrNumber: string): string {
  if (keyOrNumber.match(/^cpd-\d+$/i)) {
    return keyOrNumber.toUpperCase();
  } else {
    return 'CPD-' + keyOrNumber;
  }
}

// Invoked asynchronously from handleSlackCommand
export function addUsersToIssue(data: AddUsersToIssueBody, context, callback: Function): void {
  const {
    issueKey,
    users,
    loggedInUser,
    responseUrl
  } = data;

  jiraService.addUsersToIssue(issueKey, getUnique<SlackUser>(users, isSameUser))
    .then((addedUsers) => {
      if (addedUsers.length === 1 && addedUsers[0].id === loggedInUser.id) {
        slackApi.post(
          `I have added you to watch bug ${issueKey}.`,
          responseUrl
        );
      } else if (addedUsers.length === 0) {
        slackApi.post(
          `No users added, they are all already watching.`,
          responseUrl
        );
      } else if (addedUsers.length === users.length) {
        slackApi.post(
          `${addedUsers.length === 1 ? 'User is' : 'Users are'} now watching bug ${issueKey}.`,
          responseUrl
        );
      } else {
        slackApi.post(
          (
            addedUsers.length === 1 ?
              `User ${addedUsers[0].display} is` :
              `Users ${addedUsers.map((user) => user.name).join(', ')} are`
          ) + ` now watching bug ${issueKey}. Some users were already watching.`,
          responseUrl
        );
      }

      addedUsers.forEach((user) => {
        if (user.id !== loggedInUser.id) {
          slackApi.postToChannel(user.id, `Hi ${user.display},\n${loggedInUser.display} has said you were interested in bug ${issueKey}.\nI will let you know when the bug is closed!`);
        }
      });
    }).catch((err) => {
      console.log('ERROR', err);
      slackApi.post('An error occurred.', responseUrl);
    })
    .then(() =>
      callback(null)
    );
}
