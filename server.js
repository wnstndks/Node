// express 라이브러리 사용하겠다는 뜻
const express = require("express");
const app = express();

// 폴더를 server.js에 등록해두면 폴더안의파일들 html에서 사용가능
app.use(express.static(__dirname + "/public"));

// mongodb연결하기 위해 세팅하는 라이브러
const { MongoClient } = require("mongodb");

let db;
const url =
  "mongodb+srv://admin:dwjtk2718@cluster0.nmfemuv.mongodb.net/?retryWrites=true&w=majority";
//'mongodb사이트에 있던 님들의 DB 접속 URL'
new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("forum");
    // 서버 띄우는 코드
    // port가 뭐냐면? 누가 내 컴퓨터에 접속할 수 있게 하기 위한 것
    // 누군가가 내 IP 주소를 입력 후 port 번호를 입력시 볼 수 있음
    app.listen(8080, () => {
      console.log("http://localhost:8080 에서 서버 실행중");
    });
  })
  .catch((err) => {
    console.log(err);
  });

// 서버 띄우는 코드
// port가 뭐냐면? 누가 내 컴퓨터에 접속할 수 있게 하기 위한 것
// 누군가가 내 IP 주소를 입력 후 port 번호를 입력시 볼 수 있음
// app.listen(8080, () => {
//   console.log("http://localhost:8080 에서 서버 실행중");
// });

// 서버의 기능을 작성하고 싶을 때, 누가 메인페이지 접속시 '반갑다'라는 정보를 유저에게 보내주는 것
app.get("/", (요청, 응답) => {
  응답.send("반갑다");
});

// 누가 이런 URL 로 접속시
// app.get('/URL', (요청, 응답)=>{
//     // 이거 보내달라는 것
//     응답.send('데이터~~')
// })

app.get("/news", (요청, 응답) => {
    db.collection('post').insertOne({title:'어쩌구'})
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
