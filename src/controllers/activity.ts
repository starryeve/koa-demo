import { Context } from "koa";
import db from '../db/index'
import { body, request, responses, summary } from 'koa-swagger-decorator';
export default class Activity {
  @request('get', '/activity/getActivityList')
  @summary('获取活动列表')
  @responses({
    200: {
      description: 'success'
    },
    401: {
      description: 'error'
    }
  })
  public static async getActivityList (ctx: Context) {
    let sql = 'SELECT * FROM activity';
    await db.query(sql, null).then((res: any) => {
      console.log(res);
      ctx.status = 200;
      ctx.body = {
        activities: res
      }
    }).catch((err: any) => {
      console.log(err);
      ctx.status = 401;
      ctx.body = {
        message: '获取活动列表出错啦'
      }
    })
  }


  @request('post', '/activity/getActivityListByClub')
  @summary('获取某个社团的活动')
  @responses({
    200: {
      description: 'success'
    },
    401: {
      description: 'error'
    }
  })
  @body({
    club_id: { type: 'number', required: true }
  })
  public static async getActivityListByClub (ctx: Context) {
    const { request: { body: { club_id } } } = ctx;
    console.log(club_id);


    let sql = 'SELECT * FROM activity WHERE club_id=?', value = [club_id];

    await db.query(sql, value).then((res: any) => {
      console.log(res);
      ctx.status = 200;
      ctx.body = {
        activities: res
      }
    }).catch((err: any) => {
      console.log(err);
      ctx.status = 401;
      ctx.body = {
        message: '获取本社团活动列表失败'
      }
    })
  }


  @request('post', '/addActivity')
  @summary('活动申请')
  @responses({
    200: {
      description: 'success'
    },
    400: {
      description: 'error'
    }
  })
  @body({
    activity_name: {
      type: 'string',
      required: true
    },
    place: {
      type: 'string',
      required: true
    },
    time: {
      type: 'string',
      required: true
    },
    budget: {
      type: 'number',
      required: true
    },
    club_id: {
      type: 'number',
      required: true
    },
    title: {
      type: 'string',
      required: true
    },
    number: {
      type: 'number',
      required: true
    },
    head_name: {
      type: 'string',
      required: true
    },
    phone: {
      type: 'string',
      required: true
    },
    status: {
      type: 'number',
      required: true
    },
    comment: {
      type: 'string'
    }
  })
  public static async addActivity (ctx: Context) {
    console.log(ctx.request.body);
    const { request: { body: { activity_name, place, time, budget, club_id, title, number, head_name, phone, status, comment } } } = ctx;

    let sql = 'INSERT INTO activity VALUES(null,?,?,?,?,?,?,?,?,?,?,?)', value = [activity_name, place, time, budget, club_id, title, number, head_name, phone, status, comment]

    await db.query(sql, value).then(res => {
      console.log(res);
      ctx.status = 200;
      ctx.body = {
        message: '活动申请已提交，请耐心等待社联审核'
      }
    }).catch(err => {
      console.log(err);
      ctx.status = 401;
      ctx.body = {
        message: '活动申请提交失败, 请检查负责人学号是否有误'
      }
    }
    )

  }

  @request('post', '/attendActivity')
  @summary('学生报名活动')
  @responses({
    200: {
      description: 'success'
    },
    400: {
      description: 'error'
    }
  })
  @body({
    activity_id: {
      type: 'number',
    },
    student_id: {
      type: 'number'
    }
  })
  public static async attendActivity (ctx: Context) {
    console.log(ctx.request.body);
    const { request: { body: { activity_id, student_id } } } = ctx;

    let sql = 'INSERT INTO activity VALUES(?,?)', value = [activity_id, student_id]

    await db.query(sql, value).then(res => {
      console.log(res);
      ctx.status = 200;
      ctx.body = {
        message: '您已参与活动'
      }
    }).catch(err => {
      console.log(err);
      ctx.status = 401;
      ctx.body = {
        message: '报名失败'
      }
    }
    )

  }

  @request('put', '/activity/finishActivity')
  @summary('结束举办活动')
  @responses({
    200: {
      description: 'success'
    },
    401: {
      description: 'error'
    }
  })
  @body({
    activity_id: { type: 'number', required: true },
  })
  public static async finishActivity (ctx: Context) {
    const { request: { body: { activity_id } } } = ctx;
    console.log(activity_id);

    let sql = `update activity set status = 3 WHERE activity_id = ${activity_id}`;

    await db.query(sql, null).then((res: any) => {
      console.log(res);
      ctx.status = 200;
      ctx.body = {
        message: '结束成功'
      }
    }).catch((err: any) => {
      console.log(err);
      ctx.status = 401;
      ctx.body = {
        message: '结束失败'
      }
    })
  }


  @request('put', '/activity/commentActivity')
  @summary('评价已举办的活动')
  @responses({
    200: {
      description: 'success'
    },
    401: {
      description: 'error'
    }
  })
  @body({
    activity_id: { type: 'number', required: true },
    comment: {
      type: 'string'
    }
  })
  public static async commentActivity (ctx: Context) {
    const { request: { body: { activity_id, comment } } } = ctx;
    console.log(activity_id);

    let sql = `update activity set comment = '${comment}' WHERE activity_id = ${activity_id}`;

    await db.query(sql, null).then((res: any) => {
      console.log(res);
      ctx.status = 200;
      ctx.body = {
        message: '评价成功'
      }
    }).catch((err: any) => {
      console.log(err);
      ctx.status = 401;
      ctx.body = {
        message: '评价失败'
      }
    })
  }


}