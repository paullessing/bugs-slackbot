import { AwsHttp } from './http.aws';
import { GcloudHttp } from './http.gcloud';

export * from './http.interface';
export const aws = new AwsHttp();
export const gcloud = new GcloudHttp();
