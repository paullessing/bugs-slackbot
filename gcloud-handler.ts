import { gcloud } from './util/handler';
import { getHandlers } from './handlers';

export = {
  ...getHandlers(gcloud)
};
