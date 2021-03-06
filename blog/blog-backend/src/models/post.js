import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema({
    title: String,
    body: String,
    tags: [String], // 문자열의 배열.
    publishedDate: {
        type: Date,
        default: Date.now, // 현재 날짜 기본값.
    },
    user: {
        _id: mongoose.Types.ObjectId,
        username: String,
    },
});

const Post = mongoose.model('Post', PostSchema); 
/* 
    (스키마명,스키마객체). 실제 DB에는 스키마명s로 들어간다.
    이를 원치 않으면 ...model('Post', PostSchema, 'myPost') 이런식으로 세 번째 파라미터를 삽입한다.
*/
export default Post;

/*
    Schema의 기본 지원 타입.
    - String: 문자열.
    - Number: 숫자.
    - Date: 날짜.
    - Buffer: 파일의 버퍼.
    - Boolean: true | false.
    - Mixed(Schema.Types.Mixed): 아무 객체 가능.
    - ObjectId(Schema.Types.ObjectId): 객체 아이디. (참조할 때 삽입.)
    - Array: 배열 형태의 값, []로 감싸서 사용.
*/