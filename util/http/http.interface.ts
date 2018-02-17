export interface HttpRequest<B = any> {
  headers: {
    [name: string]: string;
  };
  body?: B;
  httpMethod: string;
  // TODO path, querystring, etc
}

export type HttpBodyParseType = 'raw' | 'string' | 'json' | 'urlencoded';

export interface HttpRequestConfig {
  parse?: HttpBodyParseType;
}

export type RequestHandler = (request: HttpRequest) => HttpResponse | Promise<HttpResponse>;

export interface HttpResponse {
  statusCode: number;
  body?: string;
}

export interface Http {
  wrap(handler: RequestHandler);
}
