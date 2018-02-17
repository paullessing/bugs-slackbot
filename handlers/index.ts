import { HandlerWrapper } from '../util/handler/index';
import * as jira from './jira';
import * as slack from './slack-command';

export function getHandlers(wrapper: HandlerWrapper) {
  return {
    jira: wrapper.wrap(jira.handleJiraHook),
    slackMessage: wrapper.wrap(slack.handleSlackMessage)
  }
}
