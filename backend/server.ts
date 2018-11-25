import * as Koa from 'koa';
import { router } from './routes';

const app = new Koa();

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`listening on ${PORT}`);
