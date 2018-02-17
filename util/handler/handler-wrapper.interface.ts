export interface HandlerRequest<B = any> {
  headers: {
    [name: string]: string;
  };
  body?: B;
  httpMethod: string;
  // TODO path, querystring, etc
}

export type RequestHandler = (request: HandlerRequest) => HandlerResponse | Promise<HandlerResponse>;

export interface HandlerResponse {
  statusCode: number;
  body?: string;
}

export interface HandlerWrapper {
  wrap(handler: RequestHandler);
}
