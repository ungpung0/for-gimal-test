import Joi from 'joi';
import User from '../../models/user';

/*
    회원가입.
    POST /api/auth/register
    {
        username: 'username',
        password: 'password'
    }
*/
export const register = async ctx => {
    // Request Body 검증.
    const schema = Joi.object().keys({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),
        password: Joi.string().required(),
    });
    const result = schema.validate(ctx.request.body);
    if(result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }
    
    // 데이터 추가.
    const {username, password} = ctx.request.body;
    try {
        // username 존재 여부 확인.
        const exists = await User.findByUsername(username);
        if(exists) {
            ctx.status = 409; // 충돌 에러.
            return;
        }
        // user 추가.
        const user = new User({
            username,
        });
        // password 추가.
        await user.setPassword(password);
        await user.save();
        // 응답 데이터에서 hashedPassword 필드 제거.
        ctx.body = user.serialize();
        // const data = user.toJSON();
        // delete data.hashedPassword;
        // ctx.body = data;

        // 토큰 관련.
        const token = user.generateToken();
        ctx.cookies.set('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7일.
            httpOnly: true, // http 보안. (js를 통한 조회 금지.)
        });
    }catch(e) {
        ctx.throw(500, e);
    }
};

// 로그인.
export const login = async ctx => {
    const {username, password} = ctx.request.body;

    // username, password가 없으면 에러 출력.
    if(!username || !password) {
        ctx.status = 401; // Unauthorized
        return;
    }

    try {
        const user = await User.findByUsername(username);
        // 계정 x.
        if(!user) {
            ctx.status = 401;
            return;
        }
        const valid = await user.checkPassword(password);
        // 비밀번호 x.
        if(!valid) {
            ctx.status = 401;
            return;
        }
        ctx.body = user.serialize();

        // 토큰 관련.
        const token = user.generateToken();
        ctx.cookies.set('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7일.
            httpOnly: true, // http 보안. (js를 통한 조회 금지.)
        });
    }catch(e) {
        ctx.throw(500, e);
    }
};

// 로그인 상태 확인.
export const check = async ctx => {
    const {user} = ctx.state;
    if(!user) {
        // 로그인 중 아닐 때.
        ctx.status = 401; // Unauthorized.
        return;
    }
    ctx.body = user;
};

// 로그아웃.
export const logout = async ctx => {
    ctx.cookies.set('access_token');
    ctx.status = 204; // No Content.
};