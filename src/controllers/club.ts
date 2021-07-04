import { Context } from "koa";
import db from '../db/index'
import { body, request, responses, summary } from 'koa-swagger-decorator';
export default class Club {
  @request('get', '/club/getClubList')
  @summary('获取社团列表')
  @responses({
    200: {
      description: 'success'
    },
    401: {
      description: 'error'
    }
  })
  public static async getClubList (ctx: Context) {
    let sql = 'SELECT club_id, club_name, president, president_id, teacher_name, teacher_id,status FROM club ';
    await db.query(sql, null).then((res: any) => {
      console.log(res);
      ctx.status = 200;
      ctx.body = {
        clubs: res
      }
    }).catch((err: any) => {
      console.log(err);
      ctx.status = 401;
      ctx.body = {
        message: '获取社团列表出错啦'
      }
    })
  }


  @request('put', '/club/auditClub')
  @summary('审核社团')
  @responses({
    200: {
      description: 'success'
    },
    401: {
      description: 'error'
    }
  })
  @body({
    club_id: { type: 'number', required: true },
    status: { type: 'number', required: true }
  })
  public static async auditClub (ctx: Context) {
    const { request: { body: { club_id, status } } } = ctx;
    console.log(club_id, status);

    let sql = `update club set status = ${status} WHERE club_id = ${club_id}`;

    await db.query(sql, null).then((res: any) => {
      console.log(res);
      ctx.status = 200;
      ctx.body = {
        message: '审核成功'
      }
    }).catch((err: any) => {
      console.log(err);
      ctx.status = 401;
      ctx.body = {
        message: '审核失败'
      }
    })
  }



}