// express 라이브러리 사용하겠다는 뜻
const express = require("express");
const app = express();

// 폴더를 server.js에 등록해두면 폴더안의파일들 html에서 사용가능
app.use(express.static(__dirname + "/public"));
//ejs 세팅
app.set('view engine','ejs')

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


app.get('/list',async(요청,응답)=>{
  let result= await db.collection('post').find().toArray();
  console.log(result);
  // 응답은 한개만 가능함
  // 응답.send('DB에 있던 게시');
  // 응답.send(result[0].title);

  // 유저에게 ejs 파일 보내는법
  // 서버 데이터를 ejs파일에 넣으려면 1.ejs 파일로 데이터 전송
  // ejs 파일안에서 <%=데이터이름%>

  응답.render('list.ejs',{글목록: result})
})

// 처리가 오래걸리는 코드는 처리완료 기다리지 않고 바로 다음줄 실행
// =>  await - 다음줄 실행하지 말고 기다려달라는 문법 - 실행완료될때까지 기다려줌
// 아니면 then을 사용해도 됨
// 컬렉션의 모든 document 출력하는 법 db.collection('post').find().toArray();
// await은 무슨 DB를 써도 사용방법은 다 비슷함
// [] : array ,{} : object

// html 파일에 서버데이터 넣기 - template engine 쓰기 -> ejs 사용 => ejs 파일 만들기 - views 폴더 안에 만


app.get('/time',async(요청,응답)=>{
  let time = new Date();
  console.log(time);

  응답.render('time.ejs',{현재시간: time})
})


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



// 기능을 만들라고 했을 때 프로그래머들은 1. 기능이 어떤 식으로 동작하는지 한글로 상세히 정리 2. 한글을 코드로 번역
// 글작성 기능? -> 어떤 식으로 동작하는지 한글로 상세히 적기 => 유저가 작성한 글을 DB에 저장해주기 + 중간에 서버가 검사할 수 있도록
// 1. 글작성페이지에서 글 써서 서버로 전송 2. 서버는 글을 검사 3. 이상없으면 DB에 저장
app.get('/write',async(요청,응답)=>{
  
  응답.render('write.ejs')
})

