import { HandlerRequest, HandlerResponse } from '../util/handler';
import { isIssueEvent, JiraCommentEvent, JiraIssueEvent } from '../jira/model';
import { jiraService } from '../services/jira.service';

export async function handleJiraHook(request: HandlerRequest<JiraCommentEvent | JiraIssueEvent>): Promise<HandlerResponse> {
  const event = request.body;

  if (isIssueEvent(event)) {
    console.log('Is issue event');
    await jiraService.handleIssueEvent(event);
  }

  return {
    statusCode: 204
  };
}
