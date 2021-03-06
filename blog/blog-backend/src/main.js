// const Koa = require('koa');
// const Router = require('koa-router');
// const bodyParser = require('koa-bodyparser');
// const mongoose = require('mongoose');
// const api = require('./api');

require('dotenv').config(); // MongoDB 연결 파트.
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import api from './api';
import createFakeData from './createFakeData';
import jwtMiddleware from './lib/jwtMiddleware';
// 비구조화 할당으로 process.env 내부 값의 레퍼런스 생성.
const {PORT, MONGO_URI} = process.env;

// useFindAndModify: false 지원하지 않음.
mongoose.connect(MONGO_URI, {useNewUrlParser: true}).then(() => {
    console.log('Connected to MongoDB');
    // createFakeData(); // 가짜 데이터 생성.
}).catch(e => {
    console.error(e);
})

const app = new Koa();
const router = new Router();

// router 설정.
router.use('/api', api.routes());

// router 적용 전 bodyParser 적용.
app.use(bodyParser());

// token 검증 미들웨어.
app.use(jwtMiddleware);

// app 인스턴스에 라우터를 적용한다.
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
    console.log('Listening to Port %d', port);
})

/*
    Koa의 미들웨어 함수는 두 개의 파라미터를 받는다.
    => ctx: Context의 줄임말로, 웹 요청 및 응답에 관한 정보를 갖는다.
    => next: 현재 처리 중인 미들웨어 다음 미들웨어 함수를 호출하는 함수.
    만약 다음 미들웨어를 처리할 필요가 없을 경우에는 next를 설정하지 않는다.
*/

/*
    next 함수를 호출하면 Promise를 반환하는데, Koa와 Express의 차이점이다.
    Promise는 next()의 미들웨어의 처리가 끝나야 완료된다.
    ex)
        next().then(() => {
            console.log('End');
        });
*/

/*
    async/await: callback과 promise의 콜백 지옥(then() 지옥)을 해소하기 위해 등장했다.
    await는 async 함수 안에서만 작동하며, 에러 핸들링 기능이 없기 때문에, try-catch문을 사용한다.
    ex)
        async(ctx, next) => {
            console.log(ctx.url);
            console.log(1);
            if(ctx.query.authorized !== '1') {
                ctx.status = 401; // 401, Unauthorized.
                return;
            }
            await next();
            console.log('End');
*/

/*
    router.get(라우터경로, 미들웨어함수)
    여기서 get은 라우트에서 사용할 HTTP 메서드를 의미하며 post, put, delete 등이 있다.
    라우트의 파라미터와 쿼리를 읽기 위해서 콜론(:)을 사용할 수 있다.
    ex) /about/:name? : 물음표는 파라미터의 유무를 확신할 수 없을 때 사용한다.
        /posts/?id=10 : ctx.query에서 id의 값을 조회할 수 있다. 
                        별도의 파싱 함수가 필요하지 않으나, 쿼리 문자열의 경우 ctx.qurtystring을 사용한다.
    
    ex) router.get('/about/:name?', ctx => {
            const {name} = ctx.params;
            ctx.body = name ? `${name}의 소개` : '소개';
        });

        router.get('/posts', ctx => {
            const {id} = ctx.query;
            ctx.body = id ? `포스트 #${id}` : '포스트 id 존재하지 않음.';
        });
*/