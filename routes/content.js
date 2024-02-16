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
  
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
  },
});

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "richpotatoforum1",
      key: function (요청, file, cb) {
        cb(null, Date.now().toString()); //업로드시 파일명 변경가능
      },
    }),
  });

router.post("/add", upload.single("img1"), async (요청, 응답) => {
  // console.log(요청.file);

  // 에러시 다른 코드 실행은 try/catch => 어떤 코드에서 에러가 날수 있는 코드들은 try catch로 감싸주는 게 좋음

  try {
    // 여기 코드 실행해보고
    // - 예외처리하는 방법
    // 제목이 비어있으면 DB저장 X
    // 유저 글 검사하려면 if/else
    if (요청.body.title == "") {
      // 여러가지 예외 상황 처리해주는 게 좋음
      // 내용 빈칸, 제목 길면, 제목에 특수기호 쓰면
      응답.send("빈칸이다 임마, 제목 입력해");
    } else {
      //글을 DB에 저장
      // 자료는 object 형식으로 넣어야 한다.
      await db.collection("post").insertOne({
        title: 요청.body.title,
        content: 요청.body.content,
        img: 요청.file.location,
      });
      // 유저에게 응답 - 서버 기능이 끝나면 => 메시지 또는 특정페이지로 이동시키기
      응답.redirect("/list");
    }
  } catch (e) {
    //에러나면 이 코드 실행
    // 에러메시지 출력
    console.log(e);
    // 에러시 에러코드 전송해주면 좋음 - status 이용
    응답.status(500).send("서버 에러남");
  }
});

// 수정기능은 1. 수정버튼 누르면 수정페이지로 2. 수정페이지엔 기존 글이 채워져있음 3. 전송누르면 입력한 내용으로 DB 글 수정
// URL 파라미터 쓰면 비슷한 URL의 여러 API 여러개 필요없
router.get("content/edit/:id", async (요청, 응답) => {
  //db에 있는 document 수정하고 싶으면 updateOne()
  //db.collection('post').updateOne({어떤document를 찾아서},{$set:{어떤내용으로 수정할건지}})
  //서버에서 정보를 찾을수 없으면 유저에게 보내라고하거나/ DB에서 꺼내보거
  let result = await db
    .collection("post")
    .findOne({ _id: new ObjectId(요청.params.id) });
  응답.render("edit.ejs", { result: result });
});

router.put("/edit", async (요청, 응답) => {
  // set은 덮어쓰기 연산자 ,inc는 기존값에 +/- 연산자 ,mul : 기존값 * 연산자 , unset : 필드값 삭제
  // 동시에 여러개 document 수정은? ->updateMany
  await db.collection("post").updateMany({ _id: 1 }, { $inc: { like: +1 } });

  // 특정 조건식 사용가능 - like 항목이 10이상인 document 전부 수정? gt - greater than 초과인것 , gte - 이상 등등 -> filtering도 가능함
  // await db.collection('post').updateMany({like : {$gt: 10}},{$inc : {like:+1}})

  // try {
  //   if (요청.body.title == "" || 요청.body.content == "" ) {
  //     응답.send("빈칸이다 임마, 다시 입력해");
  //   } else {
  //     //서버에 없는 정보는 유저에게 보내라고 하거나/ DB에서 출력해보거
  //     await db
  //       .collection("post")
  //       .updateOne({ _id: new ObjectId(요청.body.id) },  { $set: { title: 요청.body.title, content: 요청.body.content }});
  //       // updateOne() 추가사용법

  //     응답.redirect("/list");
  //   }
  // } catch (e) {
  //   console.log(e);
  //   응답.status(500).send("서버 에러남");
  // }
});

//글 삭제 기능
// 글 삭제버튼 누르면 서버로 요청, 서버는 확인 후 해당 글 DB에서 삭제
router.delete("/delete", async (요청, 응답) => {
  await db
    .collection("post")
    .deleteOne({ _id: new ObjectId(요청.query.docid) });
  // ajax 요청 사용시 응답.redirect, 응답.render 사용안하는게 나
  응답.send("삭제완료");
});

// 기능을 만들라고 했을 때 프로그래머들은 1. 기능이 어떤 식으로 동작하는지 한글로 상세히 정리 2. 한글을 코드로 번역
// 글작성 기능? -> 어떤 식으로 동작하는지 한글로 상세히 적기 => 유저가 작성한 글을 DB에 저장해주기 + 중간에 서버가 검사할 수 있도록
// 1. 글작성페이지에서 글 써서 서버로 전송 2. 서버는 글을 검사 3. 이상없으면 DB에 저장
// 로그인 한 사람만 글 작성하게 하고 싶음
router.get("/write", async (요청, 응답) => {
  응답.render("write.ejs");
  // if (요청.user) { // 사용자가 로그인한 경우
  //   응답.render("write.ejs");
  // } else {
  //   응답.redirect("/login"); // 로그인 페이지로 리다이렉션
  // }
});

module.exports = router;
