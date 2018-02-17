import * as jira from './jira';
import { aws as http } from './util/http';

export = {
  jira: http.wrap(jira.handleJiraHook)
}
