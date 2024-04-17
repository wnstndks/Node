const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
// ejs 세팅 - 템플릿 엔진 쓰기위함 -> html 파일안에 데이터들을 꽂을수 있음
app.set("view engine", "ejs");
// 유저가 보낸 정보를 서버에서 쉽게 출력하기 위한 환경설정
app.use(express.json())
app.use(express.urlencoded({extended:true})) 


const { MongoClient } = require("mongodb");

let db;
const url =
  "mongodb+srv://admin:dwjtk2718@cluster0.nmfemuv.mongodb.net/?retryWrites=true&w=majority";
new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("reviewdatabase");

    app.listen(8080, () => {
      console.log("http://localhost:8080 에서 서버 실행중");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (요청, 응답) => {
  응답.sendFile(__dirname + "/main.html");
});

// 새로운 페이지 만들고 싶을 때
app.get("/news", (req, res) => {
  db.collection("reviewpost").insertOne({
    title: "시작",
    content: "이게node다",
  });
  // req.send('오늘부터 다시 node 시작해서 재밌다.')
});

app.get("/post", async (req, res) => {
  let result = await db.collection("reviewpost").find().toArray();
  res.send(result[1].content);
});

app.get("/list", async(req, res) => {
  let result= await db.collection('reviewpost').find().toArray()
  res.render("list.ejs",{글목록: result});
});

app.get('/time',async(req,res)=>{
  let time= new Date()
  res.render('time.ejs',{시간:time})
})

app.get('/write', (요청, 응답)=>{
  응답.render('write.ejs')
}) 

app.post('/add',(요청,응답)=>{
  console.log(요청.body)
})

