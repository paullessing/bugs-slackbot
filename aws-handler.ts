import { aws } from './util/handler';
import { getHandlers } from './handlers';

export = {
  ...getHandlers(aws)
};
