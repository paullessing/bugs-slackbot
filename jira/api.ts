import { config } from '../config';
import axios from 'axios';

export const API_PATH = config.jiraServer + '/rest/api/2';

export const jiraApi = {
  getItem<T>(selfUrl: string): Promise<T> {
    return axios(selfUrl, {
      auth: {
        username: config.jiraUser,
        password: config.jiraToken
      }
    }).then((response) => response.data as T);
  },
  getComments(issueKey: string): Promise<Comment[]> {
    // NOTE this does not fetch paginated comments - we are assuming that no issue has enough comments (>50) for this to be an issue
    return axios(`${API_PATH}/issue/${issueKey}/comment`, {
      method: 'get',
    }).then((response) => response.data.comments as Comment[]);
  },
  addComment(issueKey: string, comment: string): Promise<Comment> {
    return axios(`${API_PATH}/issue/${issueKey}/comment`, {
      method: 'post',
      data: {
        body: comment
      }
    }).then((response) => response.data as Comment);
  },
  updateComment(issueKey: string, commentId: string, comment: string): Promise<Comment> {
    return axios(`${API_PATH}/issue/${issueKey}/comment/${commentId}`, {
      method: 'put',
      data: {
        body: comment
      }
    }).then((response) => response.data as Comment);
  }
};
