export interface HandlerRequest<B = any> {
  headers: {
    [name: string]: string;
  };
  body?: B;
  httpMethod: string;
  // TODO path, querystring, etc
}

export type HttpBodyParseType = 'raw' | 'string' | 'json' | 'urlencoded';

export interface HandlerConfig {
  parse?: HttpBodyParseType;
}

export type RequestHandler = (request: HandlerRequest) => HandlerResponse | Promise<HandlerResponse>;

export interface HandlerResponse {
  statusCode: number;
  body?: string;
}

export interface HandlerWrapper {
  wrap(handler: RequestHandler);
}
