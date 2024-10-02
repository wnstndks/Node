import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

// html 리턴 시 타입지정하기
let 박스:JSX.Element =<div></div>

function App() {

  // 실시간으로 랜더링되는 데이터 -state사용 =>useState는 타입지정 자동으로
  let [user, setUser]= useState('kim');
  
  return (
    <div>
      <h1>안녕?</h1>
      <Profile name='철수'></Profile>
    </div>
  );
}

// componet 타입지정 +props 타입지정

function Profile(props:{name:string}):JSX.Element{
  return (
    <div>
      {props.name}입니다
    </div>
  )
}



export default App;
