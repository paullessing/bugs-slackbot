import { HttpRequest, HttpResponse } from './util/http';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('./config/config.json').toString());

export const API_PATH = config.jiraServer + '/rest/api/2';
// /rest/api/2/issue/CPD-2541/comment

export function handleJiraHook(request: HttpRequest): HttpResponse | Promise<HttpResponse> {
  console.log(request.body);

  return {
    statusCode: 204
  };
}
