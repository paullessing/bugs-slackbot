import { HandlerRequest, HandlerResponse } from './util/handler';
import { config } from './config';
import { Changelog, ChangelogEntry, isIssueEvent, JiraCommentEvent, JiraIssueEvent } from './jira/model';

export const API_PATH = config.jiraServer + '/rest/api/2';
// /rest/api/2/issue/CPD-2541/comment

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

  console.log('ISSUE ' + event.issue.key + ' moved to ' + (isDone ? 'DONE' : isClosed ? 'CLOSED' : 'Unknown'));
}

function getEntry(changelog: Changelog, fieldName: string): ChangelogEntry {
  return changelog.items.find((entry) => entry.field === fieldName);
}
