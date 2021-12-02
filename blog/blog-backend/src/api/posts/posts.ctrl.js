import Post from "../../models/post";
import mongoose from 'mongoose';
import Joi from 'joi';

const {ObjectId} = mongoose.Types;

// 포스트 수정 및 삭제 시 권한 확인.
export const getPostById = async (ctx, next) => {
    const {id} = ctx.params;
    if(!ObjectId.isValid(id)) {
        ctx.status = 400; // Bad Request.
        return;
    }
    try {
        const post = await Post.findById(id);
        // 포스트가 없을 때
        if(!post) {
            ctx.status = 404;
            return;
        }
        ctx.state.post = post;
        return next();
    }catch(e) {
        ctx.throw(500, e);
    }
};

export const checkOwnPost = (ctx, next) => {
    const {user, post} = ctx.state;
    if(post.user._id.toString() !== user._id) {
        ctx.status = 403;
        return;
    }
    return next();
};

// export const checkObjectId = (ctx, next) => {
//     const {id} = ctx.params;
//     if(!ObjectId.isValid(id)) {
//         ctx.status = 400; // Bad Request.
//         return;
//     }
//     return next();
// }

/*
    포스트 작성 POST
    {
        title: '제목',
        body: '내용',
        tags: ['태그1', '태그2']
    }
*/
export const write = async ctx => {
    const schema = Joi.object().keys({
        // 객체가 다음 필드를 갖고 있는가?
        title: Joi.string().required(), // required()가 있으면 필수 항목.
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required(), // 문자열로 이루어진 배열.
    });
    // 검증 후에 에러 처리.
    const result = schema.validate(ctx.request.body);
    if(result.error) {
        ctx.status = 400; // Bad Request.
        ctx.body = result.error;
        return;
    }
    // 기존 데이터 처리.
    const {title, body, tags} = ctx.request.body;
    const post = new Post({
        title,
        body,
        tags,
        user: ctx.state.user,
    });
    try {
        await post.save();
        ctx.body = post;
    } catch(e) {
        ctx.throw(500, e);
    }
};

// export const write = async ctx => {
//     const {title, body, tags} = ctx.request.body;
//     const post = new Post({
//         title,
//         body,
//         tags,
//     });
//     try {
//         await post.save();
//         ctx.body = post;
//     } catch(e) {
//         ctx.throw(500, e);
//     }
// };

// 포스트 목록 조회 GET /api/posts
export const list = async ctx => {
    // query는 문자열이기 때문에 숫자로 변환한다.
    const page = parseInt(ctx.query.page || '1', 10);
    if(page < 1) {
        ctx.status = 400;
        return;
    }
    // username, tag로 포스트 필터링 구현.
    const {tag, username} = ctx.query;
    // tag, username 값이 유효하면 객체 안에 넣고, 아니면 넣지 않음.
    const query = {
        ...(username ? {'user.username': username} : {}),
        ...(tag ? {tags: tag} : {}),
    }

    try {
        const posts = await Post.find(query)
            .sort({_id: -1}) // 역순으로 정렬 기능.
            .limit(10) // 보이는 개수 제한.
            .skip((page -1) * 10) // (현재 페이지 -1) * 10 부터 불러온다.
            .exec();
        
        // 마지막 페이지 알려주기.
        const postCount = await Post.countDocuments(query).exec();
        ctx.set('Last-Page', Math.ceil(postCount / 10)); // Math.ceil()은 주어진 숫자보다 큰 숫자중 가장 작은 숫자를 반환.

        // 내용 제한하여 보여주기.
        ctx.body = posts.map(post => post.toJSON()).map(post => ({ // .lean()을 사용하면 post.toJSON()의 생략이 가능하다.
            ...post,
            body: post.body.length < 200 ? post.body: `${post.body.slice(0,200)}...`
        }));
    } catch(e) {
        ctx.throw(500, e);
    }
};

// 특정 포스트 조회 GET /api/posts/:id
export const read = async ctx => {
    ctx.body = ctx.state.post;
    // const {id} = ctx.params;
    // try {
    //     const post = await Post.findById(id).exec();
    //     if(!post) {
    //         ctx.status = 404; // 찾을 수 없음.
    //         return;
    //     }
    //     ctx.body = post;
    // } catch(e) {
    //     ctx.throw(500, e);
    // }
};

/*
    특정 포스트 제거 DELETE /api/posts/:id
    - remove(): 특정 조건의 데이터 전부 삭제.
    - findByIdAndRemove(): id 검색후 삭제.
    - findOneAndRemove(): 조건을 만족하는 데이터 하나 삭제.
*/
export const remove = async ctx => {
    const {id} = ctx.params;
    try {
        await Post.findByIdAndDelete(id).exec();
        ctx.status = 204; // 성공 후 응답 데이터 없음.
    } catch(e) {
        ctx.throw(500, e);
    }
};

/*
    포스트 수정(특정 필드 변경) PATCH /api/posts/:id {title,body}
    {
        title: '수정',
        body: '수정내용',
        tags: ['수정', '태그']
    }
*/
export const update = async ctx => {
    const {id} = ctx.params;
    // required() 필요 없음.
    const schema = Joi.object().keys({
        // 객체가 다음 필드를 갖고 있는가?
        title: Joi.string(),
        body: Joi.string(),
        tags: Joi.array().items(Joi.string()), // 문자열로 이루어진 배열.
    });
    // 검증 후에 에러 처리.
    const result = schema.validate(ctx.request.body);
    if(result.error) {
        ctx.status = 400; // Bad Request.
        ctx.body = result.error;
        return;
    }
    // 기존 데이터 처리.
    try {
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true, // 업데이트한 데이터를 반환한다. false는 업데이트전 데이터를 반환한다.
        }).exec();
        if(!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch(e) {
        ctx.throw(500, e);
    }
};