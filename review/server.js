const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
// ejs 세팅 - 템플릿 엔진 쓰기위함 -> html 파일안에 데이터들을 꽂을수 있음
app.set("view engine", "ejs");
// 유저가 보낸 정보를 서버에서 쉽게 출력하기 위한 환경설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 메소드 강제변환
const methodOverride = require('method-override')
app.use(methodOverride('_method')) 

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
  const perPage = 5; // 한 페이지에 보여줄 글의 수
  let result = await db.collection("reviewpost").find().toArray();
  res.render("list.ejs", { 글목록: result, pageNum: 1, perPage: perPage });
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
    res.redirect("/");
  }
});

app.get("/detail/:id", async (req, res) => {
  try {
    let result = await db
      .collection("reviewpost")
      .findOne({ _id: new ObjectId(req.params.id) });
    console.log(result);
    if (result == null) {
      res.status(400).send("그런글 없다");
    } else {
      res.render("detail.ejs", { result: result });
    }
  } catch (e) {
    res.status(400).send("이상한 url 입력");
  }
});

app.get("/edit/:id", async (req, res) => {
  let result = await db
    .collection("reviewpost")
    .findOne({ _id: new ObjectId(req.params.id) });
  // console.log(result);

  res.render("edit.ejs", { result: result });
});


// app.post('/edit', async (요청, 응답)=>{
//   await db.collection('reviewpost').updateOne({ _id : new ObjectId(요청.body.id) },
//     {$set : { title : 요청.body.title, content : 요청.body.content }
//   })
//   응답.redirect('/')
// }) 



app.post("/edit", async (req, res) => {
  try {
    let result = await db
      .collection("reviewpost")
      .updateOne(
        { _id: new ObjectId(req.body.id) },
        // $set 쓰면 기존 값 덮어쓰기 만약 싫다면 $inc 를 통해 더하기
        { $set: { title: req.body.title, content: req.body.content } }
      );

      console.log(result)

      if(req.body.content==''){
        res.send('빈칸이다 채워라')
      }else if(req.body.content.length>=100){
        res.send('너무 길다 지워라')
      }
      else {
         res.redirect("/");
      }
  } catch (e) {
    console.log(e)
    res.status(400).send("수정 실패");
  }
});


// app.get('/delete/:id', async (req, res) => {
//   try {
//     await db.collection('reviewpost').deleteOne({ _id: new ObjectId(req.params.id) });
//     res.redirect('/');
//   } catch (e) {
//     console.log(e);
//     res.status(400).send("삭제 실패");
//   }
// });


app.get("/:pageNum", async (req, res) => {
  const pageNum = parseInt(req.params.pageNum);
  const perPage = 5; // 한 페이지에 보여줄 글의 수
  let result;

  // 데이터베이스 종류에 따라 쿼리를 수정
  // 여기서는 MongoDB를 사용하는 경우를 가정
  try {
    const startIdx = (pageNum - 1) * perPage;
    result = await db.collection("reviewpost")
                   .find({})
                   .skip(startIdx)
                   .limit(perPage)
                   .toArray();
  } catch (err) {
    console.error("Error fetching data:", err);
    result = []; // 에러 발생 시 빈 배열 반환
  }

  res.render("list.ejs", { 글목록: result, pageNum: pageNum, perPage: perPage });
});