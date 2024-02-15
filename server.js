// express 라이브러리 사용하겠다는 뜻
const express = require("express");
const app = express();
// form 써서 PUT DELETE 요청하는 법
const methodOverride = require("method-override");

//bcrypt 세팅- 암호 해싱화
const bcrypt = require("bcrypt");
const MongoStore = require("connect-mongo");
require("dotenv").config();

app.use(methodOverride("_method"));

// 폴더를 server.js에 등록해두면 폴더안의파일들 html에서 사용가능
app.use(express.static(__dirname + "/public"));
//ejs 세팅
app.set("view engine", "ejs");

// 요청.body 쓰려면 이 두줄 필요
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//passport 라이브러리 세팅
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

app.use(passport.initialize());
app.use(
  session({
    secret: "암호화에 쓸 비번",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://admin:dwjtk2718@cluster0.nmfemuv.mongodb.net/?retryWrites=true&w=majority",
      dbName: "forum", // 이 데이터 베이스 안에 세션을 저장할것이기 때문
    }),
  })
);

app.use(passport.session());

// mongodb연결하기 위해 세팅하는 라이브러리
const { MongoClient, ObjectId } = require("mongodb");

// connectDB 가져오기
let connectDB = require("./database.js");

let db;
// const url = process.env.DB_URL;
//'mongodb사이트에 있던 님들의 DB 접속 URL'
// new MongoClient(url)
// .connect()
connectDB.then((client) => {
    console.log("DB연결성공");
    db = client.db("forum");
    // 서버 띄우는 코드
    // port가 뭐냐면? 누가 내 컴퓨터에 접속할 수 있게 하기 위한 것
    // 누군가가 내 IP 주소를 입력 후 port 번호를 입력시 볼 수 있음
    app.listen(process.env.PORT, () => {
      console.log("http://localhost:8080 에서 서버 실행중");
    });
  })
  .catch((err) => {
    console.log(err);
  });

const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { connect } = require("./routes/shop.js");
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

//함수 안의 변수들은 파라미터로 입력해서 쓰는게 좋음
function checkLogin(요청, 응답, next){
  // 미들웨어 함수에서는 요청, 응답 자유롭게 사용 가능
  if(!요청.user){
    응답.send('로그인하세요')
  }
  next() // 미들웨어 코드실행 끝났으니 다음으로 이동해주세요
};

// function showTime(요청, 응답, next){
//   console.log(Date());
//   next();
// };

// function noBlank(요청, 응답, next){
//   if(요청.body.username =='' || 요청.body.password ==''){
//     응답.send('그러지마라 입력 제대로 해라')
//   }else{
//     next()
//   }
// }

// app.use('/list',showTime);
// app.use('/login',noBlank);

// 서버 띄우는 코드
// port가 뭐냐면? 누가 내 컴퓨터에 접속할 수 있게 하기 위한 것
// 누군가가 내 IP 주소를 입력 후 port 번호를 입력시 볼 수 있음
// app.listen(8080, () => {
//   console.log("http://localhost:8080 에서 서버 실행중");
// });

// 이 코드 밑에 있는 모든 API는 checkLogin 미들웨어 적용, 또한 여기에 제한 사항을 집어넣을 수 있기도 함
// app.use(checkLogin)

// 서버의 기능을 작성하고 싶을 때, 누가 메인페이지 접속시 '반갑다'라는 정보를 유저에게 보내주는 것
// 미들웨어 여러개 넣기 가능, API 100개에 미들웨어 전부 적용하고 싶다면? -> app.use
app.get("/", (요청, 응답) => {
  // console.log(__dirname)
  응답.sendFile(__dirname + "/index.html");
});

// 누가 이런 URL 로 접속시
// app.get('/URL', (요청, 응답)=>{
//     // 이거 보내달라는 것
//     응답.send('데이터~~')
// })

app.get("/news", (요청, 응답) => {
  db.collection("post").insertOne({ title: "어쩌구" });
  // 응답.send("오늘 비옴");
});

// => : 은 function과 같은 기능(함수 문법),  콜백함수 - 다른함수 파라미터에 들어가는 함수자
app.get("/shop", (요청, 응답) => {
  응답.send("쇼핑페이지입니다");
});

// 모든 것은 express 라이브러리 사용법이기에 이해할 필요는 없음
// 서버 개발은 그냥 라이브러리 사용법 암기가 끝

// 문장 대신에 html파일을 보내주고 싶을 때는?
app.get("/index", (요청, 응답) => {
  응답.sendFile(__dirname + "/index.html"); //server.js 담긴 경로 + html파일 위치
});

app.get("/about", (요청, 응답) => {
  응답.sendFile(__dirname + "/introduce.html"); //server.js 담긴 경로 + html파일 위치
});

// 유저 게시물보관은 데이터베이스에
// 관계형 -excel처럼 저장해둘수 있음 mysqul같은거 => 그러나 sql문법을 사용해야 하고 데이터를 저장할 때 최대한 중복데이터를 제거해서 저장해야됨(정규화) ->데이터 정확도가 중요할 때 사용
// 비관계형 - 자유로운 형식으로 데이터 저장 가능 ex mongodb => 데이터 중복제거(정규화)같은 걸 안함 -> 빨리 입출력 가능 - 데이터 수정 삭제는 느릴 수 있음 - 빠른 입출력 필요한 서비스에 사용

// mongodb 사용방법 - 컴퓨터에 직접 설치, 클라우드 호스팅받기

// 유저가 데이터를 db에 저장 및 출력하려고 할 때 이 데이터가 제대로 된건지 검사가 필요함
// 따라서 서버가 이런 검사하는 것들을 담당

app.get("/list", async (요청, 응답) => {
  let result = await db.collection("post").find().toArray();
  // console.log(result);
  // 응답은 한개만 가능함
  // 응답.send('DB에 있던 게시');
  // 응답.send(result[0].title);

  // 유저에게 ejs 파일 보내는법
  // 서버 데이터를 ejs파일에 넣으려면 1.ejs 파일로 데이터 전송
  // ejs 파일안에서 <%=데이터이름%>

  응답.render("list.ejs", { 글목록: result });
});

// 처리가 오래걸리는 코드는 처리완료 기다리지 않고 바로 다음줄 실행
// =>  await - 다음줄 실행하지 말고 기다려달라는 문법 - 실행완료될때까지 기다려줌
// 아니면 then을 사용해도 됨
// 컬렉션의 모든 document 출력하는 법 db.collection('post').find().toArray();
// await은 무슨 DB를 써도 사용방법은 다 비슷함
// [] : array ,{} : object

// html 파일에 서버데이터 넣기 - template engine 쓰기 -> ejs 사용 => ejs 파일 만들기 - views 폴더 안에 만

app.get("/time", async (요청, 응답) => {
  let time = new Date();
  // console.log(time);

  응답.render("time.ejs", { 현재시간: time });
});

// 서버란? 요청이 들어오면 그걸 처리해주는 간단한 프로그램일 뿐
// 유저가 서버에게 요청을 대충하면 안되고 정확한 형식으로 요청해야함 -
// 메소드 - (GET-서버에 데이터 달라할때  POST- 서버에게 데이터를 보내고 싶을 때 PUT UPDATE - 서버에 데이터를 수정요청할  DELETE  - 서버에 데이터 삭제를 할 때 등)와 url을 정확히 기입해야 한다.

//어떻게 서버가 데이터를 처리할 수 있는걸까?
// 밑에것에서 이런 URL로 get 요청을 날리면 밑의 코드를 실행해달라는 뜻
// 서버에 이렇게 코드를 짜놨으니 유저도 여기에 맞춰서 요청해야 하는 것
// 이런걸 API(프로그램 사용법)라고 함
// app.get('/list',async(요청,응답)=>{
//   let result= await db.collection('post').find().toArray();
//   console.log(result);
// }
// 이러면 서버로 요청을 어떻게 보내는거지?
// 실은 유저가 서버에게 get요청을 날리고 싶다 -> url 입력 , post요청은 form 태그 사용하면 됨
// 유저가 서버 파일을 볼 수 있는지도 모르는 데 어떤 url, method를 적어야하는지도 모르는데? => 웹페이지에서 장치들을 이미 숨겨놓음 => 몰라도 웹사이트만으로도 서버랑 통신 가능

// REST API? -좋은 API 디자인 하는 원칙 6개
// 1. 일관성 있는 URL이 좋음, 하나의 URL로는 한 종류의 데이터를 보내야
// 2.유저에게 서버역할 맡기지 말기
// 3.요청끼리 독립적으로 처리되기
// 4. 요청은 캐싱이 가능해야 함 - 자주 수신되는 자료들은 요청 날리지 않고 하드에 저장해놓고 쓰기

app.post("/add", upload.single("img1"), async (요청, 응답) => {
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
      await db
        .collection("post")
        .insertOne({
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

// 한글로 기능설명을 어떻게 하는지 모르겠다 - 기능이 어떻게 돌아가는지 모르겠다 -> 다른 페이지 참고
//상세페이지 기능?
// 1. 유저가 /detail/어쩌구에 접속하면
// 2. {_id : 어쩌구}글을 DB에서 찾아
// 3. ejs 파일에 박아서 보내줌

// /detail/글번호 입력시 해당 글번호가진 글의 상세페이지 보여주기
// URL 파라미터 문법 사용하면 비슷한 URL 가진  API 만들필요없음

// /detail뒤에 유저가 이 자리에 아무문자나 입력시 이 안의 코드 실행
app.get("/detail/:id", async (요청, 응답) => {
  try {
    // await db.collection('post').findOne(데이터) -이런 데이터 가진 document 1개 찾아옴
    // await db.collection('post').find().toArray 모든 document 다가져옴
    // 요청.params 안에 유저가 입력한 정보가 잘 들어있음
    let result = await db
      .collection("post")
      .findOne({ _id: new ObjectId(요청.params.id) });
    // 응답.render('detail.ejs') => 같은 페이지 보여주는 거 아닌가?
    if (result == null) {
      응답.status(404).send("이상한 url입력함");
    }
    응답.render("detail.ejs", { result: result }); //이런식으로 전송할 자료를 보낼수 있음 그래서 아이디별 내용들을 ejs 파일 보낼수 있음
  } catch (e) {
    console.log(e);
    // status(5xx) - 서버문제, status(4xx) - 유저문
    응답.status(404).send("이상한 url 입력했다 임마");
  }
});

// 수정기능은 1. 수정버튼 누르면 수정페이지로 2. 수정페이지엔 기존 글이 채워져있음 3. 전송누르면 입력한 내용으로 DB 글 수정
// URL 파라미터 쓰면 비슷한 URL의 여러 API 여러개 필요없
app.get("/edit/:id", async (요청, 응답) => {
  //db에 있는 document 수정하고 싶으면 updateOne()
  //db.collection('post').updateOne({어떤document를 찾아서},{$set:{어떤내용으로 수정할건지}})
  //서버에서 정보를 찾을수 없으면 유저에게 보내라고하거나/ DB에서 꺼내보거
  let result = await db
    .collection("post")
    .findOne({ _id: new ObjectId(요청.params.id) });
  응답.render("edit.ejs", { result: result });
});

app.put("/edit", async (요청, 응답) => {
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
app.delete("/delete", async (요청, 응답) => {
  await db
    .collection("post")
    .deleteOne({ _id: new ObjectId(요청.query.docid) });
  // ajax 요청 사용시 응답.redirect, 응답.render 사용안하는게 나
  응답.send("삭제완료");
});

// app.post('/abc:id',async(요청, 응답)=>{
// // URL 파라미터 이용 서버로 내이름 전송
//   console.log(요청.params)
// })

// app.get("/list/1", async (요청, 응답) => {
//   //1번부터 5번글을 찾아서 result 변수에 저장
//   let result = await db.collection("post").find().limit(5).toArray();

//   응답.render("list.ejs", { 글목록: result });
// });

// app.get("/list/2", async (요청, 응답) => {
//   //6번부터 10번글을 찾아서 result 변수에 저장
//   let result = await db.collection("post").find().skip(5).limit(5).toArray();

//   응답.render("list.ejs", { 글목록: result });
// });

// app.get("/list/2", async (요청, 응답) => {
//   //6번부터 10번글을 찾아서 result 변수에 저장
//   let result = await db.collection("post").find().skip(10).limit(5).toArray();

//   응답.render("list.ejs", { 글목록: result });
// });

//위 내용 URL 파라미터 쓰면 축약가능
app.get("/list/:id", async (요청, 응답) => {
  let result = await db
    .collection("post")
    .find()
    .skip((요청.params.id - 1) * 5)
    .limit(5)
    .toArray();
  //skip은 성능이 별로임 -> 너무 많이 skip 불가능하게 막는게 좋음
  // =>다른 페이지네이션 방법이 좋음
  응답.render("list.ejs", { 글목록: result });
});

app.get("/list/next/:id", async (요청, 응답) => {
  //find 내에 조건식 쓰기 - 방금본 마지막게시물보다 큰 다음 게시물 5개 가져오는 기능 완성
  let result = await db
    .collection("post")
    .find({ _id: { $gt: new ObjectId(요청.params.id) } })
    .limit(5)
    .toArray();
  //단점 다음 버튼으로만 바꿔야함
  //n번째 페이지 자주 보여줘야한다면?

  응답.render("list.ejs", { 글목록: result });
});

// session 방식 1. 가입기능 2.로그인기능 3.로그인 완료시 세션만들기 4.로그인완료시 유저에게 입장권 보내줌 5.로그인여부 확인하고 싶으면 입장권 까봄
// 구현 쉽게 하는 passport 라이브러리 써서 구현해보기

// 로그인시 제출한 아이디/비번 검사하는 코드 작성하는 것 - 실행하고 싶으면 passport.authenticate('local')() 사용
passport.use(
  new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
    let result = await db
      .collection("user")
      .findOne({ username: 입력한아이디 });
    if (!result) {
      //회원인증 실패시엔 false 입력
      return cb(null, false, { message: "아이디 DB에 없음" });
    }
    //DB에 있던 비번 == 유저가 입력한 비번 - 해싱해봐야 비교 가능

    if (await bcrypt.compare(입력한비번, result.password)) {
      //이걸로 자동으로 비교가능
      return cb(null, result);
    } else {
      return cb(null, false, { message: "비번불일치" });
    }
  })
);

// 아이디/비번 외에 다른 것도 제출받아서 검증가능 - passReqToCallback 옵션

//로그인시 세션만들기 - 요청.login() 쓰면 자동실행됨
passport.serializeUser((user, done) => {
  // console.log(user) - 유저라는 파라미터안에 정보가 다 들어있고 이걸 session에 기록해야
  process.nextTick(() => {
    //password는 저장하지 않는게 좋음
    //로그인시 세션 document 발행해주고 이것의 _id를 쿠키에 적어 보내줌
    done(null, { id: user._id, username: user.username });
  });
});

// 유저가 보낸 쿠키 분석은 passport.deserialieUser()
passport.deserializeUser(async (user, done) => {
  let result = await db
    .collection("user")
    .findOne({ _id: new ObjectId(user.id) });
  delete result.password;
  process.nextTick(() => {
    // 쿠키가 이상없으면 현재 로그인된 유저정보 알려줌
    // 아무 api에서 요청.user라고 가져다 쓰면 현재 로그인된 유저정보 알려줌 - 단 이 코드 밑에서만
    done(null, user);
  });
});

app.get("/login", (요청, 응답) => {
  console.log(요청.user);
  응답.render("login.ejs");
});

app.post("/login", (요청, 응답, next) => {
  // 제출한 아이디 비번이 DB에 있는지 확인하고 있으면 세션만들어줌

  // 아이디/비번을 DB와 비교
  passport.authenticate("local", (error, user, info) => {
    if (error) return 응답.status(500).json(error);
    if (!user) return 응답.status(401).json(info.message);
    //session 만들기
    요청.logIn(user, (err) => {
      if (err) return next(err);
      응답.redirect("/");
    });
  })(요청, 응답, next);
});

app.get("/mypage", (요청, 응답) => {
  console.log(요청.user.username);
  응답.render("mypage.ejs", { user: 요청.user });
});

// 비번 암호화를 해보자 - 가입기능부터 필요함
app.get("/register", (요청, 응답) => {
  응답.render("register.ejs");
});

// 누군가가 /register라는 경로로 post 요청 날리면 id나 비번이 전송되어야 함
app.post("/register", async (요청, 응답) => {
  // 중복 아이디 체크
  let existingUser = await db
    .collection("user")
    .findOne({ username: 요청.body.username });
  if (existingUser) {
    return 응답.status(400).send("중복되는 아이디입니다.");
  }

  //하나 해싱에 1초 가까이 걸림
  let 해시 = await bcrypt.hash(요청.body.password, 10); //몇번 꼬을지를 정함 이건 15번
  // console.log(해시)

  await db.collection("user").insertOne({
    username: 요청.body.username,
    // 비번은 hashing(암호화)해서 저장하는게 좋음 => 어떤 문자를 랜덤문자로 변환하는 것 =>라이브러리 사용 => 여기서는 bcrypt
    password: 해시,
  });
  응답.redirect("/");
});

// 세션 데이터를 DB에 저장하려면? -> connect-mongo 설치

// 기능을 만들라고 했을 때 프로그래머들은 1. 기능이 어떤 식으로 동작하는지 한글로 상세히 정리 2. 한글을 코드로 번역
// 글작성 기능? -> 어떤 식으로 동작하는지 한글로 상세히 적기 => 유저가 작성한 글을 DB에 저장해주기 + 중간에 서버가 검사할 수 있도록
// 1. 글작성페이지에서 글 써서 서버로 전송 2. 서버는 글을 검사 3. 이상없으면 DB에 저장
// 로그인 한 사람만 글 작성하게 하고 싶음
app.get("/write", async (요청, 응답) => {
  응답.render("write.ejs");
  // if (요청.user) { // 사용자가 로그인한 경우
  //   응답.render("write.ejs");
  // } else {
  //   응답.redirect("/login"); // 로그인 페이지로 리다이렉션
  // }
});

// server.js로 require해야함
app.use("/shop", require("./routes/shop.js"));
// require 대신에 import 도 가능

// 관련 있는 API들은 URL 비슷하게 만드는게 좋음
// 조회는 /post GET , 발행은 /post POST, 수정은 /post PUT 삭제는 /post DELETE

app.use("/board", require("./routes/board.js"));



app.get('/search',async(요청,응답)=>{
  // console.log(요청.query.val)
//   let 검색조건 = [{$search : {
//     index : 'title_index',
//     text : { query : 요청.query.val , path : 'title' }
//   }},
//   // { $sort : {_id : 1 }},
//   { $limit : 10}
// ]
  // 서버는 그 검색어와 일치하는 document 가져옴 + 정규식사용
  let result = db.collection('post')
  .find({title:{$regex : 요청.query.val}}).toArray()
  // aggregate는 조건 여러개 쓸수 있음
  // .aggregate([{조건1},{조건2}]).toArray()

  console.log(result);
  응답.render('search.ejs',{글목록:result});
})