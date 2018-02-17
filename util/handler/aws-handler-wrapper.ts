import { HandlerRequest, HandlerResponse, HandlerWrapper, RequestHandler } from './handler-wrapper.interface';
import { APIGatewayEvent } from 'aws-lambda';
import * as querystring from 'querystring';

export class AwsHandlerWrapper implements HandlerWrapper {
  public wrap(handler: RequestHandler) {
    return (event: APIGatewayEvent, context, callback) => {
      console.log('Handling request', event.headers);

      const request = this.convertRequest(event);

      return Promise.resolve()
        .then(() => {
          return new Promise((resolve, reject) => {
            const done = (response?: HandlerResponse) => {
              resolve(response);
            };
            try {
              const result = handler(request, done);
              if (result) {
                if (result.hasOwnProperty('then')) {
                  (result as Promise<HandlerResponse>).then(resolve, reject);
                } else {
                  resolve(result);
                }
              }
            } catch (e) {
              reject(e);
            }
          });
        })
        .then((result: HandlerResponse) => {
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

  private convertRequest(event: APIGatewayEvent): HandlerRequest {
    const body = this.getBody(event.body, event.headers['Content-Type']); // TODO look at content type instead
    const request: HandlerRequest = {
      headers: { ...event.headers },
      body,
      httpMethod: event.httpMethod
    };
    return request;
  }

  private getBody(bodyString: string | null, contentType: string | null): any {
    if (!contentType) {
      return bodyString;
    }
    if (!bodyString) {
      return null;
    }

    if (contentType.match(/^text\/plain/i)) {
      return '' + bodyString;
    }

    if (contentType.match(/^application\/x-www-form-urlencoded/i)) {
      return querystring.parse(bodyString);
    }

    if (contentType.match(/^application\/json/i)) {
      return JSON.parse(bodyString);
    }

    throw new Error('Unexpected content type ' + contentType);
  }
}
