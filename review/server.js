const express = require('express')
const app = express()
app.use(express.static(__dirname+'/public'));





app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
})

app.get('/', (요청, 응답) => {
  응답.sendFile(__dirname+'/main.html')
}) 

// 새로운 페이지 만들고 싶을 때
app.get('/new',(req,res)=>{
    req.send('오늘부터 다시 node 시작해서 재밌다.')
})