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
  }
};
