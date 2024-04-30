const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
// ejs 세팅 - 템플릿 엔진 쓰기위함 -> html 파일안에 데이터들을 꽂을수 있음
app.set("view engine", "ejs");
// 유저가 보낸 정보를 서버에서 쉽게 출력하기 위한 환경설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// objectId 사용
const { MongoClient, ObjectId } = require("mongodb");

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

app.get("/main", (요청, 응답) => {
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

app.get("/", async (req, res) => {
  let result = await db.collection("reviewpost").find().toArray();
  res.render("list.ejs", { 글목록: result });
});

app.get("/time", async (req, res) => {
  let time = new Date();
  res.render("time.ejs", { 시간: time });
});

app.get("/write", (req, res) => {
  res.render("write.ejs");
});

app.post("/add", async (req, res) => {
  
  if (req.body.title == "") {
    res.send("제목입력요함");
  } else {
    await db
      .collection("reviewpost")
      .insertOne({ title: req.body.title, content: req.body.content });
    res.redirect("/list");
  }
});

app.get('/detail/:id', async (req, res) => {
  try{
    let result= await db.collection('reviewpost').findOne({_id : new ObjectId(req.params.id)})
    console.log(result)
    if (result==null){
      res.status(400).send('그런글 없다')
    }else{
      res.render('detail.ejs',{result:result})
    }
  }catch(e){
    res.status(400).send('이상한 url 입력')
  } 
  
})

app.get('/edit/:id',async(req,res)=>{
  



  let result= await db.collection('reviewpost').findOne({_id : new ObjectId(req.params.id)})
  console.log(result)
  res.render('edit.ejs',{result:result})
})