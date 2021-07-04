import { Context } from 'koa';

import jwt from 'jsonwebtoken';
import { body, request, responses, summary } from 'koa-swagger-decorator';


import { JWT_SECRET } from '../../src/constants';
import db from '../db/index';



export default class AuthController {
  // 学生登录
  static async studentLogin (ctx: Context) {
    const { request: { body: { account, password, role } } } = ctx;

    let sql = 'SELECT student_id,student_password FROM student WHERE student_id=?', value = [account];
    await db.query(sql, value).then((res: any) => {
      if (res && res.length > 0) {
        if (res[0].student_password === password) {
          ctx.status = 200;
          ctx.body = {
            role: role,
            id: res[0].student_id,
            token: jwt.sign({
              id: res[0].student_id
            }, JWT_SECRET)
          }
        } else {
          ctx.status = 401;
          ctx.body = {
            message: '学生学号或密码错误'
          }
        }
      } else {
        ctx.status = 401;
        ctx.body = { message: '该学生不存在' };
      }
    }).catch((err: any) => {
      console.log(err);
    })
  }

  // 教师登录
  static async teacherLogin (ctx: Context) {
    const { request: { body: { account, password, role } } } = ctx;
    console.log(account, password);

    let sql = 'SELECT teacher_id,teacher_password FROM teacher WHERE teacher_id=?', value = [account];
    await db.query(sql, value).then((res: any) => {
      console.log(res);

      if (res && res.length > 0) {
        if (res[0].teacher_password === password) {
          ctx.status = 200;
          ctx.body = {
            role: role,
            id: res[0].teacher_id,
            token: jwt.sign({
              id: res[0].student_id
            }, JWT_SECRET)
          }
        } else {
          ctx.status = 401;
          ctx.body = {
            message: '教师工号或密码错误'
          }
        }
      } else {
        ctx.status = 401;
        ctx.body = { message: '该教师不存在' };
      }
    }).catch((err: any) => {
      console.log(err);
    })
  }

  // 社团登录 
  static async clubLogin (ctx: Context) {
    const { request: { body: { account, password, role } } } = ctx;

    let sql = 'SELECT club_id, club_password, status FROM club WHERE club_account=?', value = [account];
    await db.query(sql, value).then((res: any) => {
      console.log('club:', res);

      if (res && res.length > 0) {

        if (res[0].club_password === password) {


          ctx.status = 200;
          ctx.body = {
            role: role,
            id: res[0].club_id,
            token: jwt.sign({
              id: res[0].club_id
            }, JWT_SECRET)
          }
          if (res[0].status === 0) {
            ctx.status = 401
            ctx.body = {
              message: '未审核'
            }
            return
          }
          if (res[0].status === 2) {
            ctx.status = 401
            ctx.body = {
              message: '审核不通过'
            }
            return
          }

        } else {
          ctx.status = 401;
          ctx.body = {
            message: '社团账号或密码错误'
          }
        }
      } else {
        ctx.status = 401;
        ctx.body = { message: '该社团不存在' };
      }
    }).catch((err: any) => {
      console.log(err);
    })
  }

  // 社联登录
  static async unionLogin (ctx: Context) {
    const { request: { body: { account, password, role } } } = ctx;
    if (account === 'social_union' && password === 'social_union_pass') {
      ctx.status = 200;
      ctx.body = {
        token: jwt.sign({
          role: role,
          id: 'social_union123'
        }, JWT_SECRET)
      }
    } else {
      ctx.status = 401;
      ctx.body = {
        message: '社联账号或密码错误'
      }
    }
  }

  @request('post', '/login')
  @summary('用户分角色登录')
  @responses({
    200: {
      description: 'success'
    },
    400: {
      description: 'error'
    }
  })
  @body({
    account: { type: 'string', required: true },
    password: { type: 'string', required: true },
    role: { type: 'string', require: true }
  })
  public static async login (ctx: Context) {

    const { request: { body: { role } } } = ctx
    console.log(role);

    switch (role) {
      case ('student'): {
        await AuthController.studentLogin(ctx)
        break;
      }
      case ('teacher'): {
        await AuthController.teacherLogin(ctx)
        break;
      }
      case ('club'): {
        await AuthController.clubLogin(ctx)
        break;
      }
      case ('union'): {
        await AuthController.unionLogin(ctx)
        break;
      }

    }




  }


  @request('post', '/register')
  @summary('社团注册')
  @responses({
    200: {
      description: 'success'
    },
    400: {
      description: 'error'
    }
  })
  @body({
    club_account: {
      type: 'string',
      required: true
    },
    club_password: {
      type: 'string',
      required: true
    },
    club_name: {
      type: 'string',
      required: true
    },
    president: {
      type: 'string',
      required: true
    },
    president_id: {
      type: 'string',
      required: true
    },
    teacher_name: {
      type: 'string',
      required: true
    },
    teacher_id: {
      type: 'string',
      required: true
    },
    status: {
      type: 'number',
      required: true
    }
  })
  public static async register (ctx: Context) {
    console.log(ctx.request.body);
    const { request: { body: { club_account, club_password, club_name, president, president_id, teacher_name, teacher_id, status } } } = ctx;

    let sql = 'INSERT INTO club VALUES(null,?,?,?,?,?,?,?,?)', value = [club_account, club_password, club_name, president, president_id, teacher_name, teacher_id, status]

    await db.query(sql, value).then(res => {
      console.log(res);
      ctx.status = 200;
      ctx.body = {
        message: '注册申请已提交，请耐心等待社联审核'
      }
    }).catch(err => {
      ctx.status = 401;
      ctx.body = {
        message: '注册申请提交失败, 请检查社长学号或教师工号是否有误'
      }
    }
    )



  }
}