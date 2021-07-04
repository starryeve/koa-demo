import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';

import { createConnection } from 'typeorm';
import jwt from 'koa-jwt';
import 'reflect-metadata';

import { unprotectedRouter, protectedRouter } from './routers';
import { logger } from './logger'
import { JWT_SECRET } from './constants';



const app = new Koa();

// 注册中间件
app.use(logger());
app.use(cors());
app.use(bodyParser());

app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

app.use(jwt({ secret: JWT_SECRET }).unless({ method: 'GET' }));

app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());


// 运行服务器
app.listen(3000);





