import { Context } from "koa";
import db from '../db/index'
import { body, request, responses, summary } from 'koa-swagger-decorator';
export default class Member {
  @request('post', '/member/getMemberListByClub')
  @summary('获取社团成员列表')
  @responses({
    200: {
      description: 'success'
    },
    401: {
      description: 'error'
    }
  })
  @body({
    club_id: {
      type: 'number',
      required: true
    },
  })
  public static async getMemberListByClub (ctx: Context) {
    const { request: { body: { club_id } } } = ctx;
    console.log(club_id);
    let sql = 'SELECT * FROM member WHERE club_id = ? ', value = [club_id];
    await db.query(sql, value).then((res: any) => {
      console.log(res);
      ctx.status = 200;
      ctx.body = {
        members: res
      }
    }).catch((err: any) => {
      console.log(err);
      ctx.status = 401;
      ctx.body = {
        message: '获取社团成员列表出错啦'
      }
    })
  }


  @request('post', '/addMember')
  @summary('添加社团会员')
  @responses({
    200: {
      description: 'success'
    },
    400: {
      description: 'error'
    }
  })
  @body({
    club_id: {
      type: 'number',
      required: true
    },
    member_name: {
      type: 'string',
      required: true
    },
    phone: {
      type: 'string',
      required: true
    },
    gender: {
      type: 'number',
      required: true
    },
    position: {
      type: 'string',
      required: true
    },
    student_id: {
      type: 'string',
      required: true
    },
    session: {
      type: 'number',
      required: true
    }
  })
  public static async addMember (ctx: Context) {
    console.log(ctx.request.body);
    const { request: { body: { member_name, club_id, phone, gender, position, student_id, session } } } = ctx;

    let sql = 'INSERT INTO member VALUES(null,?,?,?,?,?,?,?)', value = [member_name, phone, gender, position, student_id, session, club_id]

    await db.query(sql, value).then(res => {
      console.log(res);
      ctx.status = 200;
      ctx.body = {
        message: '添加会员成功'
      }
    }).catch(err => {
      console.log(err);
      ctx.status = 401;
      ctx.body = {
        message: '添加会员失败'
      }
    }
    )

  }


}