import { HandlerRequest, HandlerResponse } from '../util/handler';
import { getUnique } from '../util/array';
import { jiraService } from '../services/jira.service';
import { SlackCommandBody } from '../models/slack-command-body.model';
import { slackApi } from '../api/slack.api';
import { createUser, isSameUser, parseUser, SlackUser } from '../models/slack-user.model';
import { Lambda } from 'aws-sdk';
import { config } from '../config';

interface AddUsersToIssueBody {
  issueKey: string;
  users: SlackUser[];
  loggedInUser: SlackUser;
  responseUrl: string;
}

export async function handleSlackCommand(request: HandlerRequest, done: (response?: HandlerResponse) => void): Promise<HandlerResponse> {
  console.log('Request:', request);

  const body = request.body as SlackCommandBody;

  if (body.token !== config.commandToken) {
    return {
      statusCode: 403,
      body: 'Invalid auth token'
    };
  }

  const regex = new RegExp(`^((?:${config.bugPrefix})?\\d+)(?:\\s+((?:<@[a-z0-9|_.-]+>(?:,?\\s+?)?)+))?`, 'i'); // TODO don't parse here, just grab the entire thing and send it to the parser
  const match = body.text.match(regex);

  if (!match) {
    return {
      statusCode: 200,
      body: `Could not match a bug.\nFormat: \`/track-bug ${config.bugPrefix}1234 @user1 @user2\``
    };
  }
  const loggedInUser = createUser(body.user_id, body.user_name);
  const issueKey = getIssueKey(match[1]);
  const users = (match[2] || '').split(/,?\s+/g).filter((user) => !!user).map(parseUser);
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
    FunctionName: 'bugs-slackbot-dev-addUsersToIssue',
    InvocationType: 'Event',
    Payload: JSON.stringify(data)
  };
  console.log('About to invoke');
  await lambda.invoke(params).promise().then((a) => console.log('Invoked!', a));
}

function getIssueKey(keyOrNumber: string): string {
  if (keyOrNumber.match(new RegExp(`^${config.bugPrefix}\\d+$`, 'i'))) {
    return keyOrNumber.toUpperCase();
  } else {
    return config.bugPrefix + keyOrNumber;
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
    .then(({ affectedUsers, summary }) => {
      let message: string;
      const bugLink = `<${config.jiraServer}/browse/${issueKey}|${issueKey}>`;
      if (affectedUsers.length === 1 && affectedUsers[0].id === loggedInUser.id) {
        message = `I have added you to watch bug ${bugLink}:\n*${summary}*`;
      } else if (users.length === 1 && users[0].id === loggedInUser.id && affectedUsers.length === 0) {
        message = `You're already watching ${bugLink}!`;
      } else if (affectedUsers.length === 0) {
        message = `No users added, they are all already watching ${bugLink}!`;
      } else if (affectedUsers.length === users.length) {
        message = `${affectedUsers.length === 1 ? 'User is' : 'Users are'} now watching bug ${bugLink}.`;
      } else {
        message = (affectedUsers.length === 1 ?
          `User ${affectedUsers[0].display} is` :
          `Users ${affectedUsers.map((user) => user.name).join(', ')} are`
        ) + ` now watching bug ${bugLink}. Some users were already watching.`;
      }
      slackApi.post(message, responseUrl);

      affectedUsers.forEach((user) => {
        if (user.id !== loggedInUser.id) {
          slackApi.postToChannel(user.id,
`Hi ${user.display},
${loggedInUser.display} has said you were interested in bug ${bugLink}:
*${summary}*
I will let you know when the bug is closed!`);
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
