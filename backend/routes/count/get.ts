import { Middleware } from "koa";

export const getCount: Middleware = async (ctx, next) => {
  try {
    ctx.body = { result: Math.floor(Math.random() * 10000) };
  } catch(e) {
    ctx.status = 500;
    ctx.body = { error: e.message };
  }
};
