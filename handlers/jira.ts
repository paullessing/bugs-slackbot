import { HandlerRequest, HandlerResponse } from '../util/handler';
import { isIssueEvent, JiraCommentEvent, JiraIssueEvent } from '../models/jira';
import { jiraService } from '../services/jira.service';
import { slackApi } from '../api/slack.api';

export async function handleJiraHook(request: HandlerRequest<JiraCommentEvent | JiraIssueEvent>): Promise<HandlerResponse> {
  const event = request.body;

  if (isIssueEvent(event)) {
    console.log('Is issue event');
    await handleJiraEvent(event);
  }
  // TODO mention users when they get added to an issue

  return {
    statusCode: 204
  };
}

async function handleJiraEvent(event: JiraIssueEvent): Promise<void> {
  const update = jiraService.getIssueUpdate(event);
  if (!update.isRelevant) {
    return;
  }

  const users = await jiraService.getIssueUsers(event.issue.self);
  if (!users || !users.length) {
    // Nobody cares about this issue :(
    return;
  }

  const message = jiraService.getUpdateMessage(event, users);
  await slackApi.post(message);
}
