// import Router from '@koa/router';
import { SwaggerRouter } from 'koa-swagger-decorator';
import * as path from 'path'


import AuthController from './controllers/auth'
import ClubController from './controllers/club'
import ActivityController from './controllers/activity'
import MemberController from './controllers/member'

const unprotectedRouter = new SwaggerRouter();
const protectedRouter = new SwaggerRouter();

unprotectedRouter.swagger({
  title: '社团管理',
  description: 'API DOC',
  version: '1.0.0',
})
protectedRouter.swagger({
  title: '社团管理_P',
  description: 'API DOC',
  version: '1.0.0',
})

unprotectedRouter.mapDir(path.resolve(__dirname, 'controllers'))

// auth相关路由
unprotectedRouter.post('/auth/login', AuthController.login);
unprotectedRouter.post('/auth/register', AuthController.register);
unprotectedRouter.get('/club/getClubList', ClubController.getClubList)
unprotectedRouter.put('club/auditClub', ClubController.auditClub)


unprotectedRouter.get('/activity/getActivityList', ActivityController.getActivityList)
unprotectedRouter.post('activity/getActivityByClub', ActivityController.getActivityListByClub)
unprotectedRouter.post('/activity/addActivity', ActivityController.addActivity)
unprotectedRouter.post('/activity/attendActivity', ActivityController.attendActivity)
unprotectedRouter.post('/activity/finishActivity', ActivityController.finishActivity)

unprotectedRouter.post('/member/getMemberListByClub', MemberController.getMemberListByClub)
unprotectedRouter.post('/member/addMember', MemberController.addMember)



// user相关路由



export { protectedRouter, unprotectedRouter };
