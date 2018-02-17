import { HandlerRequest, HandlerResponse } from './util/handler';
import { Changelog, ChangelogEntry, isIssueEvent, Issue, JiraCommentEvent, JiraIssueEvent } from './jira/model';
import { jiraApi } from './jira/api';
import * as slack from './slack';
import * as moment from 'moment';

export function handleJiraHook(request: HandlerRequest<JiraCommentEvent | JiraIssueEvent>): HandlerResponse | Promise<HandlerResponse> {
  const event = request.body;

  if (isIssueEvent(event)) {
    console.log('Is issue event');
    handleIssueEvent(event);
  }

  return {
    statusCode: 204
  };
}

async function handleIssueEvent(event: JiraIssueEvent): Promise<void> {
  const resolution = getEntry(event.changelog, 'resolution');
  const status = getEntry(event.changelog, 'status');

  if (!resolution || !status) {
    console.log('Event does not have both resolution and status, ignoring');
    return;
  }

  const movedToDone = resolution.from === null && resolution.toString === 'Done';
  const movedOutOfDone = resolution.fromString === 'Done' && resolution.to === null;

  const isDone = status.toString === 'Done';
  const isClosed = status.toString === 'Closed';

  if (!movedToDone) {
    // Not handling yet
    return;
  }

  const issue = await jiraApi.getItem<Issue>(event.issue.self);
  const users = getUnique([].concat.apply(
    getUsers(issue.fields.description),
    (issue.fields.comment.comments || [])
      .map((comment) => comment.body)
      .map(getUsers)
  ));

  if (!users) {
    return; // Nobody cares
  }

  console.log('ISSUE ' + event.issue.key + ' moved to ' + (isDone ? 'DONE' : isClosed ? 'CLOSED' : 'Unknown'));
  console.log('Users mentioned: ' + users.join(', '));

  const created = moment(issue.fields.created);
  const isLongAgo = created.diff(moment(), 'days') < -7;

  const message = `Issue ${event.issue.key} (${issue.fields.summary}) has been closed by ${event.user.displayName}.\n` +
    `This issue was first reported ${created.fromNow()}${isLongAgo ? ` (${created.format('DD/MM/YYYY')})` : ''}.\n` +
    `${users.join(', ')} ${users.length > 1 ? 'were' : 'was'} marked as related.`;

  console.log('Posting message:', message);

  await slack.post(message);
}

function getEntry(changelog: Changelog, fieldName: string): ChangelogEntry {
  return changelog.items.find((entry) => entry.field === fieldName);
}

// TODO add and parse users from slack commands
// https://api.slack.com/changelog/2017-09-the-one-about-usernames
function getUsers(content: string): string[] {
  const regex = /(\B@[0-9a-z_.-]+|<@[0-9a-z_. -]+>)/gmi;
  let m;

  const users = [];

  while ((m = regex.exec(content)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    const user = m[1];
    if (user.indexOf('<') < 0) {
      users.push(`<${user}>`);
    } else {
      users.push(user);
    }
  }

  return users;
}

function getUnique(values: string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) === index);
}
