import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl'
import checkLoggedIn from '../../lib/checkLoggedIn';
// const Router = require('koa-router');
// const postsCtrl = require('./posts.ctrl');
const posts = new Router();

// const printInfo = ctx => {
//     ctx.body = {
//         method: ctx.method,
//         path: ctx.path,
//         params: ctx.params,
//     };
// };

posts.get('/', postsCtrl.list);
posts.post('/', postsCtrl.write);
posts.delete('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.remove);
posts.patch('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.update);

posts.use('/:id', postsCtrl.getPostById, posts.routes());
// posts.get('/:id', postsCtrl.checkObjectId ,postsCtrl.read);
// posts.delete('/:id', postsCtrl.checkObjectId, postsCtrl.remove);
// posts.patch('/:id', postsCtrl.checkObjectId, postsCtrl.update);

// posts.put('/:id', postsCtrl.replace);

export default posts;
// module.exports = posts;