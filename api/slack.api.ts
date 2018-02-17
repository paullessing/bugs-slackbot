import { config } from '../config/index';
import axios from 'axios';

export class SlackApi {
  async post(text, url?: string): Promise<void> {
    const data = {
      channel: config.channel,
      username: config.username,
      text: text
    };

    await axios(url || `https://hooks.slack.com${config.slackUrl}`, {
      method: 'post',
      data
    });
  }
}

export const slackApi = new SlackApi();
