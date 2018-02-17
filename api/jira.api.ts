import { config } from '../config';
import axios from 'axios';
import { IssueWithSummaryAndComments } from '../models/jira';

export const API_PATH = config.jiraServer + '/rest/api/2';
const auth = {
  username: config.jiraUser,
  password: config.jiraToken
};

export const jiraApi = {
  getItem<T>(selfUrl: string): Promise<T> {
    return axios(selfUrl, {
      auth
    }).then((response) => response.data as T);
  },
  getIssueWithSummaryAndComments(issueKey: string): Promise<IssueWithSummaryAndComments> {
    return axios(`${API_PATH}/issue/${issueKey}`, { auth })
      .then((response) => response.data as IssueWithSummaryAndComments);
  },
  addComment(issueKey: string, comment: string): Promise<Comment> {
    return axios(`${API_PATH}/issue/${issueKey}/comment`, {
      method: 'post',
      data: {
        body: comment
      },
      auth
    }).then((response) => response.data as Comment);
  },
  updateComment(issueKey: string, commentId: string, comment: string): Promise<Comment> {
    return axios(`${API_PATH}/issue/${issueKey}/comment/${commentId}`, {
      method: 'put',
      data: {
        body: comment
      },
      auth
    }).then((response) => response.data as Comment);
  }
};
