import { Http, HttpRequestConfig, HttpRequest, RequestHandler, HttpBodyParseType } from './http.interface';
import { APIGatewayEvent } from 'aws-lambda';
import * as querystring from 'querystring';

export class AwsHttp implements Http {
  public wrap(handler: RequestHandler, config?: HttpRequestConfig) {
    return (event, context, callback) => {
      // console.log('Handling request');

      const request = this.convertRequest(event, config);

      return Promise.resolve()
        .then(() => handler(request))
        .then((result) => {
          console.log('Success', result);
          if (result && result.statusCode) {
            callback(null, result);
          } else if (result) {
            callback(null, { statusCode: 200, body: JSON.stringify(result) });
          } else {
            callback(null, { statusCode: 204 });
          }
        }).catch((e) => {
          console.log('Failure', e);
          if (e.statusCode) {
            callback(null, e);
          } else {
            console.log('Unhandled exeption:', e);
            callback(null, { statusCode: 500, body: JSON.stringify(e) });
          }
        });
    }
  }

  private convertRequest(event: APIGatewayEvent, config?: HttpRequestConfig): HttpRequest {
    const body = this.getBody(event.body, config ? config.parse : null); // TODO look at content type instead
    const request: HttpRequest = {
      headers: { ...event.headers },
      body,
      httpMethod: event.httpMethod
    };
    return request;
  }

  private getBody(bodyString: string | null, parse?: HttpBodyParseType | null): any {
    if (!parse || parse === 'raw') {
      return bodyString;
    }
    if (!bodyString) {
      return null;
    }

    if (parse === 'string') {
      return '' + bodyString;
    }

    if (parse === 'urlencoded') {
      return querystring.parse(bodyString);
    }

    if (parse === 'json') {
      return JSON.parse(bodyString);
    }

    throw new Error('Unexpected parse type ' + parse);
  }
}
