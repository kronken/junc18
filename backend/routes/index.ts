import * as Router from 'koa-router';
import { getCount } from './count/get';

export const router = new Router();

router.get('/count', getCount);