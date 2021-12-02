import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // 토큰.

const UserSchema = new Schema({
    username: String,
    hashedPassword: String,
});

// 비밀번호 암호화.
UserSchema.methods.setPassword = async function(password) {
    const hash = await bcrypt.hash(password, 10);
    this.hashedPassword = hash;
};

// 비밀번호 검증.
UserSchema.methods.checkPassword = async function(password) {
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result; // true | false.
}

// username을 통한 데이터 검색.
UserSchema.statics.findByUsername = function(username) {
    return this.findOne({username});
}

// hashedPassword 필드 제거.
UserSchema.methods.serialize = function() {
    const data = this.toJSON();
    delete data.hashedPassword;
    return data;
}

// 토큰 발급.
UserSchema.methods.generateToken = function() {
    const token = jwt.sign(
        // 첫 번째 파라미터 안에 넣고 싶은 데이터를 삽입한다.
        {
            _id: this.id,
            username: this.username,
        },
        process.env.JWT_SECRET, // 두 번째 파라미터 안에 JWT 암호를 넣는다.
        {
            expiresIn: '7d', // 일주일 동안 유효하다.
        },
    );
    return token;
}

const User = mongoose.model('User', UserSchema);
export default User;