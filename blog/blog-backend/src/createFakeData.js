import Post from "./models/post";

export default function createFakeData() {
    // 0, 1, ... 39로 이루어진 배열 생성 후 포스트 데이터로 변환.
    const posts = [...Array(40).keys()].map(i => ({
        title: `포스트#${i}`,
        // www.lipsum.com 복사 텍스트.
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        tags: ['fake', 'data'],
    }));

    Post.insertMany(posts, (err, docs) => {
        console.log(docs);
    });
}