import { AwsHandlerWrapper } from './aws-handler-wrapper';
import { GcloudHandlerWrapper } from './gcloud-handler-wrapper';

export * from './handler-wrapper.interface';
export const aws = new AwsHandlerWrapper();
export const gcloud = new GcloudHandlerWrapper();
