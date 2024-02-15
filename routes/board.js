const router = require("express").Router();

//함수 안의 변수들은 파라미터로 입력해서 쓰는게 좋음
function checkLogin(요청, 응답, next){
    // 미들웨어 함수에서는 요청, 응답 자유롭게 사용 가능
    if(!요청.user){
      응답.send('로그인하세요')
    }
    next() // 미들웨어 코드실행 끝났으니 다음으로 이동해주세요
};
  
router.get("/sub/sports", checkLogin, (요청, 응답) => {
  응답.send("스포츠 게시판");
});
router.get("/sub/game", checkLogin, (요청, 응답) => {
  응답.send("게임 게시판");
});

module.exports = router;

