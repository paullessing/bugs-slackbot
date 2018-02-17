import { HandlerWrapper } from './util/handler';
import * as jira from './jira';

export function getHandlers(wrapper: HandlerWrapper) {
  return {
    jira: wrapper.wrap(jira.handleJiraHook)
  }
}
