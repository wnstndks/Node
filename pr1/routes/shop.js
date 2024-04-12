// API 다른 파일로 빼고 싶으면 router 폴더 만들고 그 안에 api 담을 파일 만들기
// const router 어쩌구
// app을 전부 router로
// module.exports= router

const router = require("express").Router();

// 다른 파일에서 db 변수 쓰려면 파일들 상호참조보다는 serve.js에서 db변수 만드는 부분
// connectDB 가져오기
let connectDB = require("./../database.js");

let db;
connectDB
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("forum");
  })
  .catch((err) => {
    console.log(err);
  });

// 공통된 URL 시작부분은 축약가능
router.get("/shirts", async(요청, 응답) => {
  await db.collection('post').find().toArray()
  응답.send("셔츠파는 페이지");
});

router.get("/pants", (요청, 응답) => {
  응답.send("바지파는 페이지");
});

// router의 정확한 뜻 : 누군가를 이리저리 안내하는 기능
// server.js로 require 해야함
module.exports = router;
