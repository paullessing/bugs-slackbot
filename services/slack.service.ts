import * as https from 'https';
import { config } from '../config/index';

export class SlackService {
  async post(text): Promise<void> {
    const data = JSON.stringify({
      channel: config.channel,
      username: config.username,
      text: text
    });

    const options = {
      host: 'hooks.slack.com',
      port: 443,
      path: config.slackUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    console.log('Making request', options);

    await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let response = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          response += chunk.toString();
        });
        res.on('end', function () {
          console.log('Response');
          console.log(response);
          resolve();
        });
      });

      req.on('error', (error) => {
        console.error(error);
        reject(error);
      });

      req.write(data);

      req.end();
    });
  }
}

export const slackService = new SlackService();
