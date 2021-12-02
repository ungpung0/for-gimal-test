let postId = 1; // id의 초기값.

// posts 배열 초기 데이터.
const posts = [
    {
        id: 1,
        title: '제목',
        body: '내용',
    },
];

// 포스트 작성 POST /api/posts {title, body}
export const write = ctx => {
    // REST API의 Request Body는 ctx.request.body에서 조회 가능.
    const {title, body} = ctx.request.body;
    postId += 1;
    const post = {id: postId, title, body};
    posts.push(post);
    ctx.body = post;
};

// 포스트 목록 조회 GET /api/posts
export const list = ctx => {
    ctx.body = posts;
};

// 특정 포스트 조회 GET /api/posts/:id
export const read = ctx => {
    const {id} = ctx.params;
    const post = posts.find(p => p.id.toString() === id); // 비교할 p.id를 문자열로 변경한다.
    if(!post) {
        // 오류 체크.
        ctx.status = 404;
        ctx.body = {
            message: '포스트 존재하지 않음.',
        };
        return;
    }
    ctx.body = post;
}

// 특정 포스트 제거 DELETE /api/posts/:id
export const remove = ctx => {
    const {id} = ctx.params;
    const index = posts.findIndex(p => p.id.toString() === id);
    if(index === -1) {
        // 오류 체크.
        ctx.status = 404;
        ctx.body = {
            message: '포스트 존재하지 않음.',
        };
        return;
    }
    posts.splice(index, 1);
    ctx.status = 204; // No Contents.
}

// 포스트 수정(교체) PUT /api/posts/:id {title,body}
export const replace = ctx => {
    const {id} = ctx.params;
    const index = posts.findIndex(p => p.id.toString() === id);
    if(index === -1) {
        // 오류 체크.
        ctx.status = 404;
        ctx.body = {
            message: '포스트 존재하지 않음.',
        };
        return;
    }
    posts[index] = {
        id,
        ...ctx.request.body,
    };
    ctx.body = posts[index];
}

// 포스트 수정(특정 필드 변경) PATCH /api/posts/:id {title,body}
export const update = ctx => {
    const {id} = ctx.params;
    const index = posts.findIndex(p => p.id.toString() === id);
    if(index === -1) {
        ctx.status = 404;
        ctx.body = {
            message: '포스트 존재하지 않음.',
        };
        return;
    }
    posts[index] = {
        ...posts[index],
        ...ctx.request.body,
    };
    ctx.body = posts[index];
}
/*
    ...(전개 연산자): 명시적으로 할당되지 않은 나머지 배열 값들을 사용할 수 있다.
    export로 내보낸 함수들은 다음 형식으로 불러올 수 있다.
    ex)
        const 모듈명 = require('파일명');
        모듈명.이름();
*/

/*
    esm을 적용하여 import/export 문법을 지원한다. 기존의 exports.함수명 을 export const 함수명으로 변경한다. 
*/

