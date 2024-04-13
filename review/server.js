const express = require('express')
const app = express()
app.use(express.static(__dirname+'/public'));

const { MongoClient } = require('mongodb')


let db
const url = "mongodb+srv://admin:dwjtk2718@cluster0.nmfemuv.mongodb.net/?retryWrites=true&w=majority"
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('reviewdatabase')

  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
  })

}).catch((err)=>{
  console.log(err)
})
app.listen(8080, () => {
  console.log('http://localhost:8080 에서 서버 실행중')
})
app.get('/', (요청, 응답) => {
  응답.sendFile(__dirname+'/main.html')
}) 


// 새로운 페이지 만들고 싶을 때
app.get('/news',(req,res)=>{
    // db.collection('reviewpost').insertOne({title:'시작'})
    req.send('오늘부터 다시 node 시작해서 재밌다.')
})
