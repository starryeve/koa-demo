import { Context } from 'koa';
import { getManager } from 'typeorm';

import jwt from 'jsonwebtoken';

import { User } from '../entity/user';

export default class AuthController {
  public static async login (ctx: Context) {
    ctx.body = 'Login controller'
  }

  public static async register (ctx: Context) {
    console.log(ctx.request.body);

    const userRepository = getManager().getRepository(User);

    const newUser = new User();

    const { request: { body: { name, email, password } } } = ctx;
    newUser.name = name;
    newUser.email = email;
    newUser.password = password;

    const user = await userRepository.save(newUser);

    ctx.status = 201;
    ctx.body = user;
  }
}