// express 라이브러리 사용하겠다는 뜻
const express = require('express')
const app = express()

// 서버 띄우는 코드
// port가 뭐냐면? 누가 내 컴퓨터에 접속할 수 있게 하기 위한 것
// 누군가가 내 IP 주소를 입력 후 port 번호를 입력시 볼 수 있음
app.listen(8080,()=> {
    console.log('http://localhost:8080 에서 서버 실행중')
})

// 서버의 기능을 작성하고 싶을 때, 누가 메인페이지 접속시 '반갑다'라는 정보를 유저에게 보내주는 것
app.get('/', (요청, 응답)=>{
    응답.send('반갑다')
})